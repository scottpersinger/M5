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

class tail():

	last_mtime = None

	def __init__(self, filename, delay, sock):
		self.filename = filename
		self.delay = delay
		self.sock = sock

	def run(self):
		global _status_
		self.sendConnInfo()
		while True:
			if _status_ != _OPEN_:
				_status_ = _CLOSE_
				break
			time.sleep(self.delay)
			stat = os.stat(self.filename)
			
			if stat.st_mtime != self.last_mtime:
				self.last_mtime = stat.st_mtime
				self.read()

	def read(self):
		try:
			length = 0
			f = open(self.filename, 'r')
			for line in f:
				length += 1

			f.seek(0)
			cnt = 0

			for line in f:
				cnt += 1
				if cnt == length:
					#######################################################
					# Note::
					# mesgutil.send_message()'s second parameter require
					# 'unicode'. so you shoule use decode('utf-8')
					#######################################################
					msgutil.send_message(self.sock, line[:-1].decode('utf-8'))
			f.close
		except Exception:
			if(f):
				f.close

	def sendConnInfo(self):
		params = "ws_location : "+str(self.sock.ws_location) + "<br />"
		params += "ws_origin : "+str(self.sock.ws_origin) + "<br />"
		params += "ws_protocol : " + str(self.sock.ws_protocol)+"<br />"
		params += "ws_resource : " + str(self.sock.ws_resource)+"<br />"
		msgutil.send_message(self.sock, params)

file = os.path.abspath("./ws_messages")

def web_socket_do_extra_handshake(request):
	pass  # Always accept.


def web_socket_transfer_data(request):
	global _status_
	_status_ = _OPEN_
	arr = ()
	thread.start_new_thread(tail(file, 0.5, request).run, arr)
	while True:
		try:
			#######################################################
			# Note::
			# mesgutil.receive_message() returns 'unicode', so
			# if you want to treated as 'string', use encode('utf-8')
			#######################################################
			line = msgutil.receive_message(request).encode('utf-8')
			
			if line == _HEARTBEAT_:
				continue
		
			f = open(file, 'a')
			f.write(line+"\n")
			os.fsync(f.fileno())
			f.flush()
			f.close
			
		except Exception:
			_status_ = _CLOSING_
			# wait until _status_ change.
			i = 0
			while _status_ == _CLOSING_:
				time.sleep(0.5)
				i += 1
				if i > 10:
					break
			return

