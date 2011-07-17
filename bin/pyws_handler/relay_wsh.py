#!/usr/bin/python

from mod_pywebsocket import msgutil

import thread
import getopt
import os
import os.path
import sys
import time

_GOODBYE_MESSAGE = 'Goodbye'
_HEARTBEAT_ = 'Heartbeat'
_CONNECTING_ = 0
_OPEN_ = 1
_CLOSING_ = 2
_CLOSE_ = 3


_status_ = _CONNECTING_

clients = []

def web_socket_do_extra_handshake(request):
    print "Client connected"
    pass  # Always accept.


def web_socket_transfer_data(request):
    global _status_
    global clients
    _status_ = _OPEN_
    
    clients.append(request)
    while True:
        try:
            line = msgutil.receive_message(request).encode('utf-8')
            print line
            for client in clients:
                if client != request:
                    print "Sending " + line + " to client"
                    msgutil.send_message(client, line.decode('utf-8'))          
        except Exception:
            print "Some client error"
            _status_ = _CLOSING_
            # wait until _status_ change.
            i = 0
            while _status_ == _CLOSING_:
                time.sleep(0.5)
                i += 1
                if i > 10:
                    break
            return

