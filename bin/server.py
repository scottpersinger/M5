import cherrypy
import os.path
import sys
import re
import json
import glob
from compiler import *

# A special purpose web server for serving M5 apps locally. Basically it's just serving
# files. But with these special features:
#
# - Dynamically expands your app.html file to expand @require statements and configure the app manifest.
# - Dynamically generates the cache.manifgest file for offline support.

class M5Server:
    DEFAULT_APP_NAME = "app.html"
    
    M5_DIR = os.path.join(os.path.dirname(sys.argv[0]), "..")
    M5_LIB_DIR = os.path.join(M5_DIR, "lib")
    JQTOUCH_DIR = os.path.join(M5_DIR, "jqtouch")
    
    @cherrypy.expose
    def index(self):
        if os.path.exists(self.DEFAULT_APP_NAME):
            return self.compile_app(self.DEFAULT_APP_NAME)
        elif os.path.exists("index.html"):
            self.content_type("text/html; charset=utf-8")
            return open("index.html").read()
        else:
            return self.dir_listing()

    @cherrypy.expose
    def sim__(self):
        return open(os.path.join(self.M5_LIB_DIR, "simpanel.html")).read()

    @cherrypy.expose
    def dir__(self):
        return json.dumps(glob.glob("*"))

    @cherrypy.expose
    def file__(self, name):
        self.content_type("text/plain")
        return open(name).read()
        
    @cherrypy.expose
    @cherrypy.popargs('path1', 'path2', 'path3', 'file')
    def default(self, path1 = None, path2 = None, path3 = None, path4 = None, path5 = None, fpart = None):
        #pdb.set_trace()
        
        path, fpart = self.collect(path1, path2, path3, path4, path5, fpart)
        last_parts = "/".join(path.split("/")[1:])
        self.content_type(fpart)
        
        if re.match("m5",path):
            return open(os.path.join(self.M5_LIB_DIR, last_parts, fpart)).read()
        elif re.match("jqtouch", path):
            return open(os.path.join(self.JQTOUCH_DIR, last_parts, fpart)).read()
        elif os.path.exists(os.path.join(path, fpart)):
            return open(os.path.join(path, fpart)).read()
                
        #return "Request for path '" + path1 + "' and file: " + (file or "nil")
        
    def content_type(self, fname):
        if re.search("\.css",fname):
            cherrypy.response.headers["Content-Type"] = "text/css"
        elif re.search("\.png", fname):
            cherrypy.response.headers["Content-Type"] = "image/png"
        elif re.search("\.jpeg",fname) or re.search("\.jpg",fname):
            cherrypy.response.headers["Content-Type"] = "image/jpeg"
        else:
            cherrypy.response.headers["Content-Type"] = "text/javascript"
        
    def compile_app(self, file_name):
        return M5Compiler().compile(file_name)
        
    def collect(self, path1, path2, path3, path4, path5, fpart):
        if fpart:
            return ["/".join([path1, path2, path3, path4, path5]), fpart]
        elif path5:
            return ["/".join([path1, path2, path3, path4]), path5]
        elif path4:
            return ["/".join([path1, path2, path3]), path4]
        elif path3:
            return ["/".join([path1, path2]), path3]
        elif path2:
            return [path1, path2]
        else:
            return ['.', path1]
            
cherrypy.quickstart(M5Server())