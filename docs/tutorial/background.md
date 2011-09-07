M5 Backstory
============
I believe it has become possible to create really great mobile apps using just HTML5 and Javascript. Some
examples of these great apps include: Gmail, Google Plus, Twitter mobile, Linkedin Touch, and Yahoo Mail.
However, you'll notice that all of these apps come from big companies, and none of them are open source.
I built M5 as a toolkit to make it easier for me and for others to build great HTML5 mobile apps just like
the big boys.

Compared to something like Apple's iOS platform, the tools, documentation, and _collective intelligence_ around
building _great_ mobile web apps is sorely lacking. M5 is my attempt to help start closing that gap, but
providing:

* A toolkit which supports all the steps required for app development - from getting started, to development
and testing, through to deployment.
* A place to codify _best practices_ for building great mobile web apps. 

Shouldn't I just build a native app?
======================================
Yup. You should - I strongly recommend it. I've built iOS apps and the Apple platform is great. I
estimate it should take a good developer about 8 weeks, full time, to become proficient on iOS. 
Now once you're over that hurdle, go pay $99 to Apple and submit your app for approval. Wait a
few more weeks and you should be ready to launch! Now when you want to port your app to Android,
go repeat the process, subtracting a few weeks for app approval, but adding them to the learning
time due to Android's less mature platform.

Or, you could build and launch an HTML app **today**. True, launching on the web does not (currently)
give you access to any App Stores for distribution. And your app will not run as smoothly as
a native app. And if you want to be paid for your app, then the App Store is pretty hard to beat.
But I think there's a world of apps that don't necessarily have these requirements. 

Anti-patterns
==============
M5 is not designed to support certain types of apps:

* Apps which need access to native device features. If you need to shoot photos, or read the
phone's address book, or run completely disconnected from the internet, then you should build a native app.
* Games. Games have their own special requirements, and M5 is not designed to address those. There are other frameworks and tools built to help you build HTML5 games.
* Apps to be distributed through the App Store or Android Market. It is possible to build HTML5 apps and 
wrap them as native apps for distribution through an app store. [Phonegap](http://phonegap.com) is the
leading solution here. M5 can help you build one of these apps, but I designed the toolkit with web distribution
in mind, and it includes techniques to make web-distributed apps work better.


What is an M5 app?
==================

Due to the flexibility of web technology, exactly **how** you build an HTML "app" is subject to much
debate. I tend to think about the various options like this:

1. Standard web site. No special mobile support.
1. Web site with mobile stylesheet. Custom styles make web pages easier to read on mobile device screens.
1. Server generated mobile app. App is composed of pages with special CSS rules and Javascript to enable
an "app-like" experience on a mobile device. But, each page is still generated on the server and served
through a separate HTTP request.
1. Client generated mobile app. The user interface for the app is generated in Javascript on the
mobile device. Server requests are made only for data updates (usually JSON) and then displayed in
the app via client-side DOM injection.

The farther down you go on this list, the closer you get to the native "app" experience that users
have come to expect. And if you look at the mobile apps from the leading tech companies (Google,
Twitter, LinkedIn), they all use approach #4. For this reason, M5 is designed to build apps
in that way. Thus M5 uses the following app definition:

> *An app which generates the dynamic portion of its interface via Javascript executed on the client.
Static HTML for all pages is usually included in the home page. The app is designed to be cached on the 
device, and only requires access to the internet in order to retrieve application data.
Most apps will employ local storage and the application cache, and ideally should be able to
run even in the absence of any internet connection.*

This is not necessarily the easiest way to create a mobile web app. But apps that do adopt this architecture
benefit from these advantages:

* Server-independent. Since logic runs on the client, these apps may need little to no server-side
code.
* Short load times.
* Good perceived responsiveness since app updates run locally.

Web distribution is awesome
===========================
Yes, app stores are cool, especially for independent developers. However, as the Apple App Store 
approaches 500,000 apps, its good to question whether that distribution channel is really that 
huge an advantage. Especially with the "winner take all" sorting lists (self reinforcing sorts like 
"Most Popular"), it gets harder every day to stand out in the crowded app store.

Launching on the web on the other hand gives you all the power of existing web-based distribution
approaches: organic search, social links, advertising, and upselling from existing sites. Even better
is you can launch and update any time, no approval needed.

