from HTMLParser import HTMLParser
from StringIO import StringIO
import re
import os
import pdb
from slimit import minify

from m5app import M5App

#pdb.set_trace()

def test():
    c = M5Compiler()
    return c.compile("../templates/app.html")
    
class M5Compiler(HTMLParser):
    opt_sim = True
    env = "production"
    
    path_lookups = {
        'jquery' : "lib/jquery-1.6.1.min.js",
        'zepto' : "lib/zepto.js",
        'zepto-min' : "lib/zepto.min.js",
        'jquery-mobile' : ['lib/jquery-mobile/jquery.mobile-1.0b2.css', 'lib/jquery-mobile/jquery.mobile-1.0b2.js'],
        'jquery-mobile-min' : ['lib/jquery-mobile/jquery.mobile-1.0b2.min.css', 'lib/jquery-mobile/jquery.mobile-1.0b2.min.js'],
        'iscroll' : "lib/m5/iscroll-lite.js",
        'jqt.bars' : ['lib/jqtouch/extensions/jqt.bars/jqt.bars.js', 'lib/jqtouch/extensions/jqt.bars/jqt.bars.css'],
        'jqt.offline' : 'lib/jqtouch/extensions/jqt.offline.js',
        'm5.simulator': ['lib/m5/m5.simulator.js']
    }

    def compile(self, app_file, include_sim=True, environment="production", src_dir=".", m5_app=None):
        self.opt_sim = include_sim
        self.src_dir = src_dir
        self.env = environment
        self.tag_stack = [] #current tags being parsed
        self.js_buffer = StringIO()
        self.includes = []
        
        self.buffer = StringIO()
        self.app = m5_app
        
        self.feed(open(app_file).read())
        return self.buffer.getvalue()
    
    def error(self, msg):
        print msg
        lines = self.buffer.getvalue().splitlines()
        print ("(%d) " % (len(lines)-1)) + "\n".join(lines[-2:-1])
        print
        
    def handle_decl(self, decl):
        self.buffer.write("<!%s>" % decl)
        
    def handle_starttag(self, tag, attrs):
        args = dict(attrs)
        self.tag_stack.append(tag)
        if self.inside("head"):
            if tag == "script" and ((not 'type' in args) or args['type'] == "text/javascript") and self.app.inline_js(self.env):
                if 'src' in args:
                    self.includes.append("<script src=\"%s\" />" % args['src'])
                    return
            elif tag == "link" and args['rel'] == "stylesheet" and self.app.inline_css(self.env):
                if 'href' in args:
                    self.includes.append("<link rel=\"stylesheet\" href=\"%s\" />" % args['href'])
                    return
        if tag == "html" and self.app.run_offline(self.env):
            attrs.append(("manifest","cache.manifest"))
        spacer = (len(attrs) > 0 and " ") or ""
        self.buffer.write("<" + tag + spacer + " ".join(map(lambda tuple:"%s=\"%s\"" % (tuple[0], tuple[1]), attrs)) + ">")
        if tag == "head" and self.env == "development":
            self.buffer.write(self.kill_cache_block())

    def handle_endtag(self, tag):
        last = self.tag_stack.pop()
        if (last != tag):
            self.error("Hmm..unmatched tag, started %s but ended %s" % (last, tag))
            
        if tag == "head" and len(self.includes) > 0:
            # Add inline style tag for gathered styles
            styles = StringIO()
            for script in self.includes:
                if re.match("<script|<link", script):
                    for src in re.findall("<link .*?href=\"(.*?)\".*?>", script):
                        css_src = os.path.join(self.src_dir, src)
                        if os.path.exists(css_src):
                            styles.write(("/* css %s */" % src) + "\n")
                            content = open(css_src).read()
                            # Gotta fixup url(..) paths since relative paths will be wrong
                            path = os.path.dirname(src)
                            content = re.sub("url\((.*?)\)", "url(%s/\\1)" % path, content)
                            styles.write(content)
            styles = styles.getvalue()
            if len(styles) > 0:
                self.buffer.write("<style type=\"text/css\">\n")
                self.buffer.write(styles)
                self.buffer.write("\n</style>\n")
            
            # Add inline script tag for gathered scripts and includes
            self.buffer.write("<script type=\"text/javascript\">\n")
            for script in self.includes:
                m = re.match("<script|<link", script)
                if m:
                    for src in re.findall("<script.*?src=\"(.*?)\".*?>", script):
                        js_src = os.path.join(self.src_dir, src)
                        if os.path.exists(js_src):
                            self.buffer.write(("// js %s" % src) + "\n")
                            content = open(js_src).read()
                            if not re.search("min\.js", src) and self.app.minify_js(self.env):
                                content = minify(content, mangle=True)
                            self.buffer.write(content)
                    self.buffer.write("\n")
                else:
                    self.buffer.write(script + "\n")
            self.buffer.write("</script>\n")
                    
        if self.inside("head") and tag == "script" and self.app.inline_js(self.env):
            return            
        
        self.buffer.write("</%s>" % tag)

    def handle_data(self, data):
        if self.inside("head") and self.inside("script") and self.app.inline_js(self.env):
            self.includes.append(data)
        else:
            self.buffer.write(data)

    def handle_comment(self, data):
        if self.inside("head"):
            data = self.rewrite_includes(data)
        self.buffer.write("<!--" + data + "-->")
        if not self.app.inline_js(self.env):
            self.buffer.write("\n".join(self.includes))
            self.includes = []

    # Return true if we are currently inside the named tag in our parsing
    def inside(self, tag):
        return tag in self.tag_stack
        
    def rewrite_includes(self, text):
        result = []
        for line in text.splitlines():
            m = re.search("@require (.*)",line)
            if m:
                includes = ""
                for mod in re.split(",", m.group(1)):
                    lines = self.script_tags(self.expand_require(mod.strip()))
                    includes += lines.replace("\n"," ") + " "
                self.includes.append(includes)
            else:
                result.append(line)
        return "\n".join(result)
        

    def kill_cache_block(self):
        return "<!-- prevent cache -->\n<meta http-equiv=\"cache-control\" content=\"no-cache\">\n<meta http-equiv=\"pragma\" content=\"no-cache\">\n";
        
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
                if self.env == "production" and (modname + "-min") in self.path_lookups:
                    return self.path_lookups[modname + "-min"]
                else:
                    return self.path_lookups[modname]
            else:
                return None
        elif re.match("m5\.env",modname):
            return "m5.env." + self.env + ".js"
        elif re.match("m5\.",modname):
            if (not re.search('\.simulator',modname) or self.opt_sim):
                if not re.search('\.remote_console',modname) or self.env == "development":
                    return "lib/m5/" + modname + ".js"
            return None
        elif re.match("jqtouch", modname):
            m = re.match("jqtouch\(theme:(\S+)\)",modname)
            theme = m.group(1) or "default"
            return ["lib/jqtouch/jqtouch.js","lib/jqtouch/jqtouch.css", ("lib/jqtouch/themes/" + theme + "/theme.css")] 
        else:
            return (modname + ".js")
 
if __name__ == "__main__":
    print M5Compiler().compile("app.m5.html")