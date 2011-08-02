from bottle import *
import os.path
import glob
import pdb
import shutil
import time
import markdown
import socket
import threading
import signal

import os.path
import sys
import re
import json
import glob
import random

from m5compiler import *
from m5app import M5App

# A special purpose web server for serving M5 apps locally. Basically it's just serving
# files. But with these special features:
#
# - Dynamically expands your app.html file to expand @require statements and configure the app manifest.
# - Dynamically generates the cache.manifgest file for offline support.

M5_DIR = None
M5_LIB_DIR = None
JQTOUCH_DIR = None
M5_ENV = "development"
INCLUDE_SIM = False
DOC_HEADER = open(os.path.join(os.path.dirname(__file__), "../docs/tutorial/_head.html")).read()
DOC_FOOTER = open(os.path.join(os.path.dirname(__file__), "../docs/tutorial/_footer.html")).read()

def signal_handler(signal, frame):
        print 'Exiting...'
        wake_conditions()
        sys.exit(0)
        
signal.signal(signal.SIGINT, signal_handler)
        
        
def start_m5server(m5_root, environment="development", include_sim=False):
    global M5_DIR, M5_LIB_DIR, JQTOUCH_DIR, M5_ENV, INCLUDE_SIM
    INCLUDE_SIM = include_sim
    M5_ENV = environment
    M5_DIR = m5_root
    M5_LIB_DIR = os.path.join(M5_DIR, "lib")
    JQTOUCH_DIR = os.path.join(M5_DIR, "jqtouch")
    debug(False)
    port = 8000
    print "Access the app from your phone using: http://" + socket.gethostname() + ":" + str(port)
    
    run(server='cherrypy', host='0.0.0.0', port=port,reloader=False,quiet=True)

def start_tutorial(m5_root):
    global M5_DIR
    M5_DIR = m5_root
    os.chdir(M5_DIR)
    debug(True)
    run(host='localhost', port=7777,reloader=False,quiet=False)
    
def load_app():
    return M5App("foo", ".")
    
def markitdown(fname):
    return "<html><head>" + DOC_HEADER + "</head><body>" + \
        markdown.markdown(open(fname).read()) + DOC_FOOTER + \
        "</body></html>"
    
@error(500)
def error500(error):
    print error.exception
    print error.traceback
    return "Error: " + str(error.exception) + "<br />" + re.sub("\n", "<br />", str(error.traceback))
    
@route("/")
def index():
    global INCLUDE_SIM,M5_ENV,M5_DIR
    app = load_app()
    if os.path.exists(app.index_name):
        return M5Compiler().compile(app.index_path(), include_sim=INCLUDE_SIM, environment=M5_ENV)
    elif os.path.exists("index.html"):
        return static_file("index.html", root=M5_DIR)    
    elif os.path.exists("index.md"):
        return markitdown("index.md")  
    else:
        return dir_listing()

@route("/tutorial__/:path#.+#")
def tutorial__(path):
    file_path = os.path.join(M5_DIR, "docs", "tutorial", path)
    if re.search("\.md$", file_path):
           return markitdown(file_path)
    else:
        return static_file(os.path.basename(file_path), root = os.path.dirname(file_path))

@route("/sim__")
def sim__():
    global M5_LIB_DIR
    return open(os.path.join(M5_LIB_DIR, "simpanel.html")).read()

@route("/dir__")
def dir__():
    return json.dumps(glob.glob("*"))

@route("/file__/:name")
def file__(name):
    return open(name).read()
    
@post("/save__/:path#.+#")
def save__(path):
    versions_dir = os.path.join(".versions", os.path.dirname(path))
    if not os.path.exists(versions_dir):
        os.makedirs(versions_dir)
    if os.path.exists(path):
        # backup old file
        shutil.move(path, os.path.join(versions_dir, os.path.basename(path) + "." + str(time.time())))
    body = request.forms.get('body')
    if body and body != '':
        f = open(path, 'w')
        f.write(body)
        f.close()
    return "OK"


def compile_app(self, file_name):
    global M5_ENV, INCLUDE_SIM
    return M5Compiler().compile(file_name, environment=M5_ENV, include_sim=INCLUDE_SIM)
    
#######################################################################################################
# Remote Command Console 
#
# Hacky, but effective. Clients connect as either as a sender or receiver. When they connect they are
# assigned a random key and the key returned.
#
# Clients poll 'get_command__' to listen for commands. This call waits, forcing the client to wait
# until a command is ready. It periodically times out and returns null to the client, which immediately
# calls back again.

# Senders call "send_command__" to issue a command. send_command__ Condition.notifies the waiting
# receiver, then Condition.waits for the response. The waiting 'get_command__' wakes up, returns
# the command to the client, which executes the command, and returns the result. Now the 'get_command__'
# Condition.notifies the still waiting 'send_command__' that the response is ready, and now that
# call returns the result to the sender.
#
# Keeping track of clients is a little finicky. If a receiver connects, then disconnects
####################################################################

command_queues = {}
response_queues = {}
conditions = {}
active_clients = {}

@post("/remote_connect__/:name")
def remote_connect__(name):
    global command_queues
    global response_queues
    global conditions
    
    # See if this app has registered before. If so then send to previous instance
    # a disconnect.
    for k in command_queues.keys():
        if re.match(name + "\.", k):
            print "Client already connected as " + k + ", closing"
            #command_queues[k].append("#remote#close")
            del command_queues[k]
    
    # generate a unique key to identify connections
    key = name + "." + str(random.randint(0, 99999))
    command_queues[key] = []
    response_queues[key] = []
    conditions[key] = threading.Condition()
    print "Client connected: "+ key
    return {'key': key}

@post("/send_command__/:key")
def send_command__(key):
    global conditions
    global command_queues
    global active_clients
    print "Received command to dispatch in thread " + threading.current_thread().name
    command = request.forms.get('command')
    # Send a command to all other listeners
    res = None
    condition = conditions[key]
    for k, queue in command_queues.iteritems():
        if k != key and k in active_clients:
            queue.append(command)
            conditions[k].acquire()
            conditions[k].notifyAll()
            conditions[k].release()
            res = check_response(key)
            print "Starting to wait (" + key + ") for response"
            if not res:
                condition.acquire()
                condition.wait(0.5)
                condition.release()
                res=check_response(key)
    if len(active_clients) == 0:
        print "No clients waiting"
    print "Returning response to commander: " + str(res)
    return (res and res or '')

def check_response(key):
    global response_queues
    
    if key in response_queues and len(response_queues[key]) > 0:
        return response_queues[key].pop()
    else:
        return None

def wake_conditions():
    global conditions
    
    for c in conditions.values():
        try:
            c.acquire()
            c.notifyAll()
            c.release()
        except RuntimeError:
            pass
            
# Use a long poll, where we don't actually return the request until we get notified
# that we have a command ready. We return after 20 secs, even if no command was received.
# After return we mark the client inactive. This way once a client stops polling, we 
# can know to stop sending it commands.
@route("/get_command__/:key")
def get_command__(key):
    global conditions
    global command_queues
    global active_clients
    
    print "[" + key + "] get_command..."
    # Return any queued commands to a client (the mobile app itself)
    if key in command_queues:
        loopTime = 0
        active_clients[key] = True
        print "Client " + key + " waiting for commands..., set to active"
        while loopTime < 20:
            if len(command_queues[key]) > 0:
                cmd = command_queues[key].pop()
                print "Dispatching command " + cmd + " in thread " + threading.current_thread().name
                return cmd
            else:
                try:
                    conditions[key].acquire()
                    conditions[key].wait(2.0)
                    loopTime += 2
                    conditions[key].release()
                except RuntimeError:
                    time.sleep(0.1)
        print "Marking " + key + "as inactive"            
        del active_clients[key]
        return ""
    else:
        error("Unknown client")
                
        
@post("/send_response__/:key")
def send_response__(key):
    global response_queues
    global conditions
    response = request.forms.get('response')
    # Send a response to all other listeners
    print "Received response (" + key + "): " + str(response) + " in thread: " + threading.current_thread().name
    for k, queue in response_queues.iteritems():
        if k != key:
            print "Notifying " + k + " of response"
            queue.append(response)
            conditions[k].acquire()
            conditions[k].notifyAll()
            conditions[k].release()
    return "OK"
    

##################################################################################
# Generic resource serving
#
# Needs to come after all other handlers
##################################################################################

def dump_headers(request):
    print request.environ
    
@route("/:path#.+#")
def any_path(path):
    global M5_LIB_DIR
    global JQTOUCH_DIR
    path_parts = path.split("/")
    lib_path = ""
    if len(path_parts) > 0 and path_parts[0] == 'lib':
        lib_path = "/".join(path_parts[2:-1])

    last_parts = "/".join(path.split("/")[1:])
    last_path, fname = os.path.split(last_parts)

    if re.search("\.md$", path):
        return markitdown(path)
    elif re.match("^lib/m5/", path):
        return static_file(fname, root=os.path.join(M5_LIB_DIR, lib_path))
    elif re.match("^lib/jqtouch/", path):
        return static_file(fname, root=os.path.join(JQTOUCH_DIR, lib_path))
    elif re.match("^License\.txt",path):
        return static_file(os.path.basename(path), root=os.path.join(os.path.dirname(__file__), ".."))
    else:
        return static_file(os.path.basename(path), root=os.path.dirname(path))

    
            
if __name__ == "__main__":
    start_m5server()
