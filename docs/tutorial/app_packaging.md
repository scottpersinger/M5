App Packaging
=============
When you create your M5 app, you can specify the Javascript that your app needs in a logical way. This avoids your
having to specify exact file locations for Javascript files. The _m5 build_ command can then expand these logical 
statements into physical paths.

The basic way to import Javascript files is to use the _@require_ statement inside an html comment:

        <!-- @require m5.simplestorage -->
    
The idea is that _@require_ works like the 'require' or 'import' statements in ruby and python. It says
to include the named module (which might be composed of multiple files). You don't have to specify where
the module lives - it's actual location will be resolved at build time.

Now when you execute ''m5 build'', the require statement will be replaced with a real script tag:

        <script type="text/javascript" src="lib/m5/m5.simplesimstorage.js"></script>
        
Check out the [module list](modules.md) for a list of standard modules you can use in your app. More
modules can be installed with the [m5 install](install_modules.md) command. Note that you can also
include your own Javascript in your project. You can include that Javascript either by using
the _@require_ command with the file name, or by adding your own _&lt;script&gt;_ tag.

Suppose you have a file called "img_helper.js" inside a directory called "js" in your project.
You can include this file either with:

        <!-- @require img_helper.js -->
        
Or with:

        <script type="text/javascript" src="js/img_helper.js"></script>

Note that the _M5 build_ command has some special logic where it strips out _development_ environment-specific
files from the production build. Notably, the Javascript for the [M5 simulator](sim_console.md) is omitted.

 