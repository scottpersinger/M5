from bottle import *
import os.path
import glob
import pdb
import shutil
import time
import markdown
import socket

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
command_queues = {}
response_queues = {}
M5_ENV = "development"
INCLUDE_SIM = False
DOC_HEADER = open(os.path.join(os.path.dirname(__file__), "../docs/tutorial/_head.html")).read()
DOC_FOOTER = open(os.path.join(os.path.dirname(__file__), "../docs/tutorial/_footer.html")).read()

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
    
    run(host='0.0.0.0', port=port,reloader=False,quiet=True)

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

@post("/remote_connect__/:name")
def remote_connect__(name):
    global command_queues
    global response_queues
    # See if this app has registered before. If so then send to previous instance
    # a disconnect.
    for k in command_queues.keys():
        if re.match(name + "\.", k):
            print "Client already connected as " + k + ", closing"
            command_queues[k].append("#remote#close")
    
    # generate a unique key to identify connections
    key = name + "." + str(random.randint(0, 99999))
    command_queues[key] = []
    response_queues[key] = []
    return {'key': key}

@post("/send_command__/:key")
def send_command__(key):
    global command_queues
    command = request.forms.get('command')
    # Send a command to all other listeners
    for k, queue in command_queues.iteritems():
        if k != key:
            queue.append(command)
    return "OK"
    
@route("/get_command__/:key")
def get_command__(key):
    global command_queues
    
    # Return any queued commands to a client (the mobile app itself)
    if len(command_queues[key]) > 0:
        cmd = command_queues[key].pop()
        print "*********** SENDING COMMAND: " + cmd
        return cmd
    else:
        return ""
        
@post("/send_response__/:key")
def send_response__(key):
    global response_queues
    response = request.forms.get('response')
    # Send a response to all other listeners
    print "*********** RECEIVED RESPONSE: " + response
    for k, queue in response_queues.iteritems():
        if k != key:
            queue.append(response)
    return "OK"
    
@route("/get_response__/:key")
def get_response__(key):
    global response_queues
    
    if len(response_queues[key]) > 0:
        res = response_queues[key].pop()
        print "*********** RECEIVED RESPONSE: " + res
        return res
    else:
        return ""
    
@route("/:path#.+#")
def any_path(path):
    global M5_LIB_DIR
    global JQTOUCH_DIR
    last_parts = "/".join(path.split("/")[1:])
    last_path, fname = os.path.split(last_parts)
    
    if re.search("\.md$", path):
        return markitdown(path)
    elif re.match("^m5/", path):
        return static_file(fname, root=os.path.join(M5_LIB_DIR, last_path))
    elif re.match("^jqtouch/", path):
        return static_file(fname, root=os.path.join(JQTOUCH_DIR, last_path))
    elif re.match("^License\.txt",path):
        return static_file(os.path.basename(path), root=os.path.join(os.path.dirname(__file__), ".."))
    else:
        return static_file(os.path.basename(path), root=os.path.dirname(path))
    
    
def compile_app(self, file_name):
    global M5_ENV, INCLUDE_SIM
    return M5Compiler().compile(file_name, environment=M5_ENV, include_sim=INCLUDE_SIM)
    
            
if __name__ == "__main__":
    start_m5server()
