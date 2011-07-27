M5 Simulator
============
The simulator is a helper application that makes it easy to see you app as it will appear on a real mobile device,
and to test and modify your app very easily.

When you run the simulator, you are actually just running your app, but the m5.simulator.js script re-frames your
app's main div inside an image of a device, and it adds an iframe to the page which shows the simulator console.

The advantage of "injecting" the simulator into your app in this way is that the browser debugger is talking
directly to your app's page. This means you can use all the normal browser debugger tools with your app.

The simulator console gives you these additional features:

* Remote debugging console. Works no matter where your app is running.
* Simple code editor
* Local storage browser

The simulator console is able to talk to your app remotely using Ajax calls. When you're running your
app in the browser, the console isn't super useful since it works the same as the Javascript console.
However, the remote console will also work if you run your app somewhere else, like on an actual phone
or in the iPhone simulator, as long as you're connected to your local server.

To try it, go look at where you ran the _m5 server_ command. It shows a line like this:

        Access the app from your phone using: http://scottp-leopard.local:8000
        
Go open that link on your phone. Now, enter this in the simulator console:

        $('#jqt).hide()
        
You should see your app screen disappear on the phone. 


