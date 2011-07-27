import re
import os
import pdb

#pdb.set_trace()

def test():
    c = M5Compiler()
    return c.compile("../templates/app.html")
    
class M5Compiler:
    opt_sim = True
    env = "production"
    
    path_lookups = {
        'jquery' : "lib/jqtouch/jquery-1.5.1.min.js",
        'iscroll' : "lib/jqtouch/extensions/jqt.bars/iscroll-min.js",
        'jqt.bars' : ['lib/jqtouch/extensions/jqt.bars/jqt.bars.js', 'lib/jqtouch/extensions/jqt.bars/jqt.bars.css'],
        'jqt.offline' : 'lib/jqtouch/extensions/jqt.offline.js',
        'm5.simulator': ['lib/m5/m5.simulator.js', 'lib/m5/m5.simulator.css']
    }

    def compile(self, file_or_io, include_sim=True, environment="production"):
        self.opt_sim = include_sim
        self.env = environment
        
        result = []
        f = open(file_or_io)
        inside_comment = False
        buffered = []
        for line in f:
            if re.search("<html",line):
                result.append(re.sub("<html.*?>", "<html manifest=\"cache.manifest\">", line))
                continue
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
        if files == None:
            return ""
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
            if not re.search('m5\.simulator',modname) or self.opt_sim:
                return self.path_lookups[modname]
            else:
                return None
        elif re.match("m5\.env",modname):
            return "m5.env." + self.env + ".js"
        elif re.match("m5\.",modname):
            if (not re.search('\.simulator',modname) or self.opt_sim) and (not re.search('\.remote_console',modname)):
                return "lib/m5/" + modname + ".js"
            else:
                return None
        elif re.match("jqtouch", modname):
            m = re.match("jqtouch\(theme:(\w+)\)?",modname)
            theme = m.group(1) or "default"
            return ["lib/jqtouch/jqtouch.js","lib/jqtouch/jqtouch.css", ("lib/jqtouch/themes/" + theme + "/theme.css")] 
        else:
            return (modname + ".js")
            