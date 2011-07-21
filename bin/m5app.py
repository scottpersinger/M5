import os.path

class M5App:
    def __init__(self,name,root_dir,container=None):
        self.name = name;
        self.index_name = 'app.html'
        self.compiled_name = 'app.m5.html'
        self.root_dir = root_dir
        self.container = container
        
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
        
