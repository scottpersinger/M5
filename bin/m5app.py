import os
from os import path
import json
import pdb
from StringIO import StringIO
import re

class M5App:
    def __init__(self,name,root_dir,container=None):
        self.name = name;
        self.index_name = 'app.html'
        self.compiled_name = 'app.m5.html'
        self.root_dir = root_dir
        self.container = container
        self.version = '*'
        self.manifest_name = "cache.manifest"
        self.files = []
        self.cache_counter = 1
        man_path = self.file_path("manifest.json")
        self.manifest = {}
        if path.exists(man_path):
            self.load_app_manifest(man_path)
        self.load_cache_manifest()
        
    def root_path(self, *paths):
        return path.join(self.root_dir, *paths)
        
    def file_path(self, path):
        if self.container:
            return self.root_path(self.container, self.name, path)
        else:
            return self.root_path(path)

    def index_path(self):
        return self.file_path(self.index_name)
        
    def mkdir(self):
        if self.container:
            if not path.exists(self.root_path(self.container, self.name)):
                os.mkdir(self.root_path(self.container, self.name))
        
    def load_app_manifest(self,path):
        f = open(path, 'r')
        self.manifest = json.load(open(path))
        f.close()
        if self.manifest['name']:
            self.name = self.manifest['name']
            if 'version' in self.manifest:
                self.version = self.manifest['version']
    
    def add_file(self, path):
        self.files.append(path)

    def load_cache_manifest(self):
        existingf = self.file_path(self.manifest_name)
        if path.exists(existingf):
            old = open(existingf).read()
            m = re.search("Version: .*\.(\d+)", old, re.M)
            if m:
                try:
                    self.cache_counter = int(m.groups(1)[0])
                except:
                    pass    
        
    def generate_cache_manifest(self):
        buf = StringIO()
        
        buf.write("CACHE MANIFEST\n\n")
        buf.write("# Version: " + self.version + "." + str(self.cache_counter) + "\n\n")
        
        for f in self.files:
            buf.write(f + "\n")
        buf.write("\n")
        buf.write("NETWORK:\n*\n")
        
        return buf.getvalue()
        
        
        
        