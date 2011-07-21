import cherrypy

#global DIR
DIR = "foobar"

def testme():
    global DIR
    print "Dir is: " + DIR
    
testme()
