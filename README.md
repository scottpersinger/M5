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

Quick Start
===========
###Prequesities

* Python
* Google Chrome web browser

###Install M5 from git

    git clone ...
    cd m5
    sudo python install.py
  
###Create your first M5 app
    m5 create /path/to/new/application
    cd /path/to/new/application
    m5 server -launchsim
  
  
  



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


  