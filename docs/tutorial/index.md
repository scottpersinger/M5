M5 Mobile Toolkit
=========

M5 is designed to be a "batteries included" toolkit for building HTML5 mobile apps. There exist
many frameworks for creating mobile apps in HTML, so M5 attempts to help out with all the other
steps required to build an app:

* Getting started. M5 comes with a number of examples apps and documentation to help get you started.
* Development. The bundled web server is great for local development and testing.
* Debugging. The M5 "simulator" makes it easy to see how your app will look on a real device,
while letting you use your desktop browser's Javascript tools for debugging. 
* Deployment. M5 can "build" your project to automatically remove debugging code and generate
files ready for hosting. You can even deploy your app for free to the m5apps.org web site.

You can read about the [M5 background](background.md) for some more backstory.
    
Creating your app
-------------------
Pick a directory where you want to locate your app, and run this:

        m5 create testapp
    
This creates a skeleton for your new app called 'testapp'. Now cd into 'testapp', and run:

        m5 server --simulator

This starts the local web server, serving your new app, and opens a browser window to your app.
You will see your app running in the "simulator". This is really just an image of a phone with your
app frame centered inside. (See more info on [the m5 command](m5_command.md) or [the simulator](sim_console.md).)

However, you also see on the right side the simulator console. We'll get to this in a minute.
The skeleton app has a few components:

1. A nav bar with a title
1. A home screen showing a tappable list of cities
1. A 'Settings' button that will open the Settings page
1. A detail screen for each city - just click the city name

It's a good idea to walk through the code of the skeleton app to see how things work. You
can do that right here. Just click on the 'Editor' tab in the simulator console. This
will show you a list of files that make up the app. Click the file *app.m5.html*. 
(See [the simulator](sim_console.md) for more on the simulator).

Now you can see the source code for the app. The HTML for all screens of the app is contained 
entirely in this one file. The basic HTML structure for the app looks like this:
        <div id="page1" data-role="page">
            <div data-role="header"><h1>Home</h1></div>
            ...content
        </div>
        <div id="page2" data-role="page">
        </div>
        ... more pages ...
        
M5 apps are known as "single page apps". In practice this means that the HTML markup for the app's
pages are contained in the home page, and updates to the app are sent as data over Ajax, then displayed
using Javascript. This is in contrast to typical desktop-browser web apps that generate their pages dynamically 
on the server. Each page is indicated by a div with the special attribute _data-role="page"_. This markup
is specified by the jQuery Mobile framework. At any given time, only one _page_ div is visible, and it
takes up the entire browser viewport. jQuery Mobile includes support for transitioning between pages
trigged by either the user pressing on a link, or via Javascript calls.

(For more info, see [A note on the M5 app philosophy](philosophy.md))

-------------------------------
Let's look at the rest of our template app. The first page div looks like this:

        <div id="home" data-role="page" data-theme="b">
            <div data-role="header">
                <h1>Cities of the World</h1>
                <a class="button ui-btn-right" href="#settings" data-transition="slideup">Settings</a>
            </div>
            <div id="container">
            <ul id="cities" data-role="listview" data-inset="true" data-theme="d">
              <li><a href="#details">
                <img src="http://t0.gstatic.com/images?q=tbn:ANd9GcQdWPgFQycWBCgH9ENTu18Dig5NtU5CwkM1ZoJmf1PCtMzdLll8" />
                New York</a></li>
                ...
            </ul>
        </div>
                    
This defines a page in our app identified by the name "home". We can make any link or button activate
this page by using the href "#home". Inside the div, we have defined a 
navigation bar via the _data-role="header_ attribute, and inside we've put a label on the nav bar, and
defined a link with the text "Settings". The "button" class will give our link the appearance
of a button, and the "#settings" href tells jQM to activate the div with the id "settings"
when the link is pressed. One of the cool features of jQM is that it includes a number of
animated page transitions that use CSS animations. We have used the class "slideup" on the 
link, which tells jQM to use the "slideup" animation when showing the settings page. Try
clicking "Settings" in the app to see it in action.

## Page transition events

If you look inside the "home" div, you can see the < ul > < li > structure that draws the list
of cities. You'll notice that each list item contains a single link:

        < li >< a href="#details" >< img ... >< /a >< /li >
    
Each link points to the same page, the 'details' div. But when you click the city, the details
page shows a description specific to each city.

Scroll down to the Javascript block at the bottom of app.m5.html and you will see a _mousedown_
event handler added to _li_ elements in the cities list.

This stuff works by virtue of a "page event".  which looks like this:

        $('#details').bind('pageAnimationStart', function() {
          var tappedElt = $(this).data('referrer');
          var cityName = $(tappedElt).text().trim();
          $.get('data/city_details.json?' + Math.random(999), function(detail_set) {
            var details = detail_set[cityName];
            $('#city-details').html(details);
          }, 'json');
        });

jQTouch fires the _pageAnimationStart_ and _pageAnimationEnd_ events on both the starting and
ending page whenever it fires a page transition. Here we are attaching to the start event on
the _details_ page. So when the page starts its transition, our function is called. Inside,
we are getting a reference to the link which started the transition (added by jQTouch as
the data element 'referrer' on the target page), and then we are using simple jQuery to 
retrieve the text inside the link which is the city name. Now, to make things interesting, we
are firing an Ajax call to retrieve some JSON data which contains descriptions for each of our
cities. Then we lookup the description and set it as the content of our details page.

Now in practice, for a static list like this, we would only issue a single Ajax call to retrieve
all the descriptions. However, most times you are probably not going to start with a static list,
but rather a dynamic one. In this case you might very well issue an Ajax request for detail info
each time you showed your detail page.

One other thing to note here is that is that you don't know how long the Ajax call will take.
Thus, it would be a good idea to have a "loading spinner" image on the details page to show
until the detail data was loaded. Also, mobile browsers aren't too good at multitasking, so it
might be a good idea to let the page transition finish and THEN kick off the Ajax request. Otherwise
you can get some flicker from your page transition.

## What's happening under the hood?

You may have noticed that the app.html file does not contain any traditional &lt;script&gt;
tags in the _head_. Instead it uses these _@require_ statements inside a comment. Please
review [app packaging](app_packaging.md) for information on how files get included in your app.

## Test the app on your phone

Now that you've tested the app in your computer browser, you can try it out on your phone. 
Open your phone's browser and navigate to http://<your machine name>:8000. Now you
can see exactly what the app looks and feels like on a real device.

## Offline application cache

By default the local web server runs your app in _development_ mode. This mode does not use
the HTML5 application cache, because it makes it harder to change your app and reload.

However, M5 includes good support for creating offline-ready apps. In fact, you can try it
out with the skeleton app. Just ctrl-c the m5 server, and run it this way:

    m5 server -e production
    
You will get a warning that it can't use port 80 because it's not running as root. You can
try using "sudo m5 server -e production" instead if you want to run the app on port 80.

Now reload your app on your phone (or even in the Chrome browser). You won't notice anything
different. Click on a city to do the Ajax request for the JSON data. Now, close your browser, 
and ctrl-c the m5 server.

Now fire up your browser again. The app should load right up. You can even see the city detail
because the JSON data has itself been cached. If you're on Chrome you can open the developer
tools and see in the network page how all resources are being loaded from the application cache.

You can find more info in [offline application support](offline_apps.md).

## Deploying your app

OK. By this time you've seen how to create a new app, run and test it locally, and even test it
with offline caching. That's pretty cool, but now it's time to show the world your creation.

Go into your app directory and try this:

        m5 deploy --scratchpad
        
Your app files will be uploaded to m5apps.org, and assigned a random application URL. The app
URL is printed for you. Now you, or anybody, can visit that URL to run your app. By default
offline caching will be enabled for your app, but if you deploy your app again it will cause
clients to download the new version (because the _cache.manifest_ file will change).

The _--scratchpad_ mode lets you deploy your app without any authentication. But it doesn't
give you a very nice URL. To get more control over your deployments, go signup at 
[m5apps.org](http://m5apps.org) and download an access key.

## Where to go from here?

Try running:

        m5 examples
        
to play with more example apps. The source for these apps is in m5/examples.

Or checkout these other topics:

> [m5 command](m5_command.md)

> [The m5 simulator](sim_console.md)

> [Packaging and deploying apps](app_packaging.md)

> [m5 app philosophy](philosophy.md)




















    
    