What is an M5 app?
==================

There are many ways to build a "mobile web app". In fact, there's much debate over exactly what 
makes some HTML+JS into an "app". M5 specifies the following definition of a "mobile web app":

> *A mobile web app is a single-page web app that downloads all of its HTML to the mobile device
on load. The app is designed to be cached on the device, and only requires access to the internet
in order to retrieve application data. This data is drawn on the mobile device via DOM updates.
Most apps will employ local storage and the application cache, and ideally should be able to
run even in the absence of any internet connection.*

Why this definition? Well, a blog that returns server-generated HTML using a mobile theme is not
really an "app" by any definition that a user would use. Users think of apps as something they
"install" on their device, and that runs locally on that device, even if it frequently accesses
the internet to retrieve more information. Apps do not retrieve wholly new interface screens
from the internet. And yet a mobile web app that uses Ajax to retrieve HTML content which it
displays as the "next screen" is doing exactly that. But what's the difference for the user?
The difference is cognitive. While your app is using Ajax to load the next screen, I'm staring
at some busy spinner. Contrast this with the way most "apps" work, say the native iPhone Twitter or
Facebook apps, where the next screen slides into view, and then within that screen a spinner
appears while it downloads new data from the internet. It may seem insignificant, but the
perceptual difference in "responsiveness" of the app is significant.

