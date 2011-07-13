jQTouch
==================

jQTouch is a UI framework that mimics the iOS ui in mobile webkit browsers. It builds on the jQuery library,
adding support for 'touch' events and a basic notion of application "pages" with the ability to
navigate between pages by touching page elements and using WebKit animations to animate the transition
from one page to another.

Looking through the code
------------------------

-Config settings
-util functions
-all the event handler functions, like clickHandler and tapHandler
-doNavigation, core function for 'goTo' command to switch pages
-goBack function for returning to previous page
-init function
    Based on the jQTouch construct call in your page <head>, this function generates all the
        <link> and <meta> tags to describe your app to the iPhone.
-form submit functions
-device capability functions
-touchStartHandler. This is the master function that contains all the touch handling. It
tracks touch movements to determine taps vs. slides.

-document.ready function. This guy extends jQuery with the synthetic touch events like
$().tap and $().swipe. If you want to bind this to your elements, then you need to make sure
your code runs AFTER this ready handler.

-If you want to see the page animations, you can find them at the bottom of jQTouch.css. All
animations are defined strictly with CSS rules - there is no animation Javascript.