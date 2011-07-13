import cherrypy

class M5WebServer:
    def index(self):
        return "Hello world!"
    index.exposed = True

cherrypy.quickstart(HelloWorld())