import re
import os
import pdb

#pdb.set_trace()

def test():
    c = M5Compiler()
    return c.compile("../templates/app.html")
    
class M5Compiler:
    path_lookups = {
        'jquery' : "jqtouch/jquery-1.5.1.min.js",
        'iscroll' : "jqtouch/extensions/jqt.bars/iscroll-min.js",
        'jqt.bars' : ['jqtouch/extensions/jqt.bars/jqt.bars.js', 'jqtouch/extensions/jqt.bars/jqt.bars.css'],
        'jqt.offline' : 'jqtouch/extensions/jqt.offline.js',
        'm5.simulator': ['m5/m5.simulator.js', 'm5/m5.simulator.css']
    }

    def compile(self, file_or_io):
        result = []
        f = open(file_or_io)
        inside_comment = False
        buffered = []
        for line in f:
            if re.search("<!--",line):
                inside_comment = True
            m = re.search("@require (.*)",line)
            if m:
                for mod in re.split(",", m.group(1)):
                    lines = self.script_tags(self.expand_require(mod.strip()))
                    if inside_comment:
                        buffered.append(lines)
                    else:
                        result.append(lines)
            else:
                result.append(line)
            if inside_comment and re.search("-->",line):
                inside_comment = False
                result += buffered
                buffered = []
                
        return "\n".join(result)

    def script_tags(self, files):
        if type(files) != str:
            result = ""
            for f in files:
                result += (self.script_tags(f) + "\n")
            return result
        else:
            if re.search("\.css", files):
                return "<link rel=\"stylesheet\" href=\"" + files + "\" type=\"text/css\" />"
            else:
                return "<script type=\"text/javascript\" src=\"" + files + "\"></script>"
                
    def expand_require(self, modname):
        if modname in self.path_lookups:
            return self.path_lookups[modname]
        elif re.match("m5\.",modname):
            return "m5/" + modname + ".js"
        elif re.match("jqtouch", modname):
            m = re.match("jqtouch\(theme:(\w+)\)?",modname)
            theme = m.group(1) or "default"
            print theme
            return ["jqtouch/jqtouch.js","jqtouch/jqtouch.css", ("jqtouch/themes/" + theme + "/theme.css")] 
        else:
            return (modname + ".js")
            