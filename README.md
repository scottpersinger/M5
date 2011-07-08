M5
==

M5 is a toolkit for building HTML5 mobile applications. It bundles a set of Javascript
and CSS modules which make it very easy to create HTML5 mobile apps with the following
features:
  * Support for most WebKit based mobile browsers
  * Support for offline applications with local storage
  * iPhone-inspire UI framework with animated page transitions and common controls

M5 takes inspiration from the Ruby on Rails project as an exemplar of an "opinionated framework"
with "batteries included". Thus M5 includes everything you need to create elegant and powerful
mobile applications, at the cost of promoting "the right way" to do many things. Like Ruby on Rails,
things are easy in M5 when you work with the framework. It's possible to do things differently, but
it's not necessarily easy.

Getting Started
===============
1. Prequesities

* Python
* Google Chrome web browser

2. Install M5 from git

    git clone ...
    or download a tarbar...
    cd m5
    sudo python install.py
  
3. Create your first M5 app
    m5 create /path/to/new/<application name>
    cd /path/to/new/<application name>
    m5 server -launchsim
  
4. Have a look around

Look at the app.html file generated in your new directory. It contains a working template
for a new application. This application has a nav bar, a settings page, and shows a simple
list of items. You can tap each item to see some detail. The various pieces of the app
are documented in the app.html file. If you want to get more ideas, look in the `examples`
directory where you cloned M5.

You can see all the examples in action by running
    m5 server -examples -launchsim

Use `m5 help` to get help on the m5 control script.

5. Deploy your creation

First, gather all your info and assets and fill out your TPS forms...Haha! Just kidding.
Try this instead:

    cd /path/to/your/app
    m5 deploy -sratchpad
        ...deploying...
        App deployed at: <app name>.scratchpad.h5apps.org

Now cruise over to `<app name>.scratchpad.h5apps.org` on your phone to try out your app.
Bookmark it to your homescreen so you can run it full screen.

Congrats! Your mobile app is live!   



The M5 stack
============

When your mobile app is running, the technology stack looks like:

  WebKit browser (local storage)
  M5 package manager
  jQuery
  jQTouch
   jQTouch extensions
  M5 modules
  ** your application code
  
M5 also provides a local development environment:

  M5 web server (python)
  Chrome browser
    -> Mobile simulator
    -> your app


  