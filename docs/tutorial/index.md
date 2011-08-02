M5 Mobile Toolkit
=========

M5 attempts to make building mobile applications as easy as possible. The basic components
of M5 include:

* A basic mobile UI framework - currently jQuery plus jQTouch - for building your application UI
* Javascript support modules for HTML5 features like local storage
* Browser-based simulator which allows you to test and refine your app easily on the desktop
* A free cloud service with API endpoints that make it possible to build "server-less" apps
    
Creating your app
-------------------
Pick a directory where you want to locate your app, and run this:

        m5 create testapp
    
This creates a skeleton for your new app called 'testapp'. Now cd into 'testapp', and run:

        m5 server --simulator

This starts the local web server, serving your new app, and opens a browser window to your app.
You see your app running in the "simulator". This is really just an image of a phone with your
app frame centered inside. (See more info on [the m5 command](m5_command.md) or [the simulator](sim_console.md).)

However, you also see on the right side the simulator console. We'll get to this in a minute.
The skeleton app has a few components:

1. A nav bar with a title
1. A home screen showing a tappable list of cities
1. A 'Settings' button that will open the Settings page
1. A detail screen for each city - just click the city name

It's a good idea to walk through the code of the skeleton app to see how things work. You
can do that right here. Just click on the 'Editor' tab in the simulator console. This
will show you a list of files that make up the app. Click the file *app.html*. 
(See [the simulator](sim_console.md) for more on the simulator).

Now you can see the source code for the app. The HTML and JS for the app is all contained 
entirely in this one file. The basic HTML structure for the app looks like this:

        <div id="jqt">
            <div id="page1">
                ...
            </div>
            <div id="page2">
                ...
            </div>
            ... more pages ...
        </div>
        
M5 apps are known as "single page apps". This means that *all* the HTML that draws all the pages
for the app is contained in a single file. The [jQTouch](http://jqtouch.com/) library specifies
the basic page structure. A top level div with the id 'jqt', and each child div specifies a different
page in the app. At any given time, only one of the page divs is visible, and it takes up the entire
screen of the phone. You setup buttons or lists or JS handlers to switch from one page to another.

(For more info, see [A note on the M5 app philosophy](philosophy.md))

-------------------------------
Let's look at the rest of our template app. The first page div looks like this:

    <div id="home" class="current">
        <div class="toolbar">
            <h1>Cities of the World</h1>
            <a class="button flip" id="infoButton" href="#settings">Settings</a>
        </div>
        ...
        
This defines a page in our app identified by "home". We can make any link or button activate
this page by using the anchor "#home". The "current" class on the div tells jQTouch to
show this div as the first page when our app is loaded. Inside the div, we have defined a 
navigation bar via the "toolbar" class, and inside we've put a label on the nav bar, and
defined a link with the text "Settings". The "button" class will give our link the appearance
of a button, and the "#settings" href tells jQTouch to activate the div with the id "settings"
when the link is pressed. One of the cool features of JQTouch is that it includes a number of
animated page transitions that use CSS animations. We have used the class "flip" on the 
link, which tells jQTouch to use the "flip" animation when showing the settings page. Try
clicking "Settings" in the app to see it in action.

## Page transition events

If you look inside the "home" div, you can see the < ul > < li > structure that draws the list
of cities. You'll notice that each list item contains a single link:

        < li >< a href="#details" >< img ... >< /a >< /li >
    
Each link points to the same page, the 'details' div. But when you click the city, the details
page shows a description specific to each city.

This stuff works by virtue of a "page event". Scroll down to the Javascript block at the bottom
of app.html which looks like this:

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




















    
    