from bottle import *
import os.path
import glob
import pdb

sys.path.append("../")
from m5compiler import M5Compiler
from m5app import M5App
        
def root_path(*paths):
    return os.path.join(os.path.dirname(__file__), *paths)

def m5_dir():
    if os.path.exists(root_path("m5")):
        return os.path.abspath("m5")
    else:
        return os.path.abspath("../../")

def m5_lib_dir():
    return os.path.join(m5_dir(), "lib")    

def jqtouch_dir():
    return os.path.join(m5_dir(), "jqtouch")


    
def load_app(name):
    return M5App(name, os.path.dirname(__file__))
    
@route('/')
def index():
    dir = root_path("apps/*")
    apps = map(lambda path:re.sub("apps", "app", path), glob.glob(dir))
    
    return template("index", apps = apps, basename = os.path.basename, host_name = request.headers['Host'])

@route ("/favicon.ico")
def favicon():
    return HTTPResponse(None, 204)
    
@route('/static/:path#.+#')
def server_static(path):
    return static_file(path, root=root_path('static'))

@error(500)
def error500(error):
    print error.exception
    print error.traceback
    return "Error: " + str(error.exception) + "\n" + str(error.traceback)
    
@route ("/app/:name")
def app_root(name):
    # Load app manifest
    app = load_app(name)
    return template("app_index", app_name = name)

@route ("/app/:app_name/app.html")
def app_run(app_name):
    # Load app manifest
    app = load_app(app_name)
    index_name = app.index_name
    compiled_name = app.compiled_name
    
    if not os.path.exists(app.file_path(compiled_name)) or \
        (os.path.getmtime(app.file_path(index_name)) > os.path.getmtime(app.file_path(compiled_name))):
        # Need to recompile the app
        print "Recompiling " + index_name
        f = open(app.file_path(compiled_name), 'w')
        f.write(M5Compiler().compile(app.file_path(index_name), include_sim=False))
        f.close()
        
    return static_file("app.m5.html", root=root_path("apps/" + app_name))

@route ("/app/:app_name/favicon.ico")
def app_favicon(app_name):
    abort(204, None)

@post ("/app/:app_name/upload")
def app_upload(app_name):
    app = load_app(app_name)
    app.mkdir()
    print "Receiving upload for app: " + app_name
    for f in request.files.keys():
        upfile = request.files.get(f).file
        print " --> " + f
        updir = os.path.dirname(f)
        if updir != '':
            os.makedirs(app.file_path(updir))
        outf = open(app.file_path(f), "w")
        outf.write(upfile.read())
        outf.close()
        
    return "Upload received"
        
    
@route ("/app/:app_name/:path#.+#")
def app_asset(app_name, path):
    last_parts = "/".join(path.split("/")[1:])
    last_path, fname = os.path.split(last_parts)

    if re.match("^m5/", path):
        return static_file(fname, root=os.path.join(m5_lib_dir(), last_path))
    elif re.match("^jqtouch/", path):
        return static_file(fname, root=os.path.join(jqtouch_dir(), last_path))
    else:
        return static_file(fname, root=root_path("apps/" + app_name + "/" + path))
        



debug(True)
run(host='localhost', port=8000,reloader=False)
