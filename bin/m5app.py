import os.path
import json
import pdb

class M5App:
    def __init__(self,name,root_dir,container=None):
        self.name = name;
        self.index_name = 'app.html'
        self.compiled_name = 'app.m5.html'
        self.root_dir = root_dir
        self.container = container
        man_path = self.file_path("manifest.json")
        self.manifest = {}
        if os.path.exists(man_path):
            self.load_manifest(man_path)
        
    def root_path(self, *paths):
        return os.path.join(self.root_dir, *paths)
        
    def file_path(self, path):
        if self.container:
            return self.root_path(self.container, self.name, path)
        else:
            return self.root_path(path)

    def index_path(self):
        return self.file_path(self.index_name)
        
    def mkdir(self):
        if self.container:
            if not os.path.exists(self.root_path(self.container, self.name)):
                os.mkdir(self.root_path(container, self.name))
        
    def load_manifest(self,path):
        f = open(path, 'r')
        self.manifest = json.load(open(path))
        f.close()
        if self.manifest['name']:
            self.name = self.manifest['name']
        
