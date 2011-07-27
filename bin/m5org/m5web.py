from bottle import *
import os
import os.path
import glob
import pdb
import tarfile
import shutil

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
    return M5App(name, os.path.dirname(__file__), container="apps")
    
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
    index_name = app.file_path(app.index_name)
    compiled_name = app.file_path(app.compiled_name)
    
    if not os.path.exists(compiled_name) or \
        (os.path.exists(index_name) and os.path.getmtime(index_name) > os.path.getmtime(compiled_name)):
        # Need to recompile the app
        print "Recompiling " + index_name
        f = open(compiled_name, 'w')
        f.write(M5Compiler().compile(index_name, include_sim=False))
        f.close()
        
    return static_file(app.compiled_name, root=root_path("apps/" + app_name))

@route ("/app/:app_name/favicon.ico")
def app_favicon(app_name):
    abort(204, None)

@put ("/app/:app_name/upload")
def app_upload(app_name):
    app = load_app(app_name)
    if os.path.exists(root_path("apps", app_name)):
        shutil.rmtree(root_path("apps", app_name))
    
    app.mkdir()
    content_len = request.headers['Content-Length']
    
    print "Receiving upload for app: " + app_name + ", length: " + str(content_len)
    
    tarfname = root_path("apps", app_name + ".tar")
    outf = open(tarfname, "wb")
    putfile = request.body
    chunk = putfile.read(1024)
    read_len = 0
    while read_len < content_len:
        outf.write(chunk)
        read_len + len(chunk)
        print "Writing chunk..., saw " + str(read_len) + " bytes"
        chunk = putfile.read(1024)
        if not chunk:
            break
    outf.flush()
    outf.close()

    tar = tarfile.open(tarfname, "r")
    for tf in tar:
        outfname = app.file_path(tf.name)
        if re.match("\..+$",os.path.basename(outfname)):
            continue
        print " --> " + outfname
        app.add_file(tf.name)
        if not os.path.exists(os.path.dirname(outfname)):
            os.makedirs(os.path.dirname(outfname))
        outf = open(outfname, "w")
        outf.write(tar.extractfile(tf.name).read());
        outf.close()
    tar.close()
    os.remove(tarfname)
    
    outf = open(app.file_path(app.manifest_name), "w")
    app.cache_counter += 1
    outf.write(app.generate_cache_manifest())
    outf.close()
    
    return "Upload received"
        
    
@route ("/app/:app_name/:path#.+#")
def app_asset(app_name, path):
    if re.search("cache.manifest", path):
        response.content_type = "text/cache-manifest"
    return static_file(os.path.basename(path), root=root_path("apps/" + app_name + "/" + os.path.dirname(path)))
        



debug(True)
run(host='localhost', port=8000,reloader=False)
