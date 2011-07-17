/*
 @@@@@@@@@@@@@>      @@@@@@@@@@>
 @>    @@@>  @>      @>         
 @>     @>   @>      @@@@@@@@@@>
 @>          @>               @>
 @>          @>               @>
 @>          @>      @@@@@@@@@>       
 
 (c) Scott Persinger 2011. See LICENSE.txt for license.
 
 M5 simulator
 
 Set M5.settings.no_sim_panel = true to prevent display of a control panel.
*/

M5.onTouchReady(function() {
  var socket = null;
  var wsAddress = "ws://localhost:12345/relay";
  var remote_key = null;
  
  function remote_send(message) {
    //socket.send(message);
    $.post('send_command__', {key: remote_key, command: message})
  }

  function remote_command(command) {
    remote_send(M5.settings.app_name + ":" + command);
  }
  
  function run_remote_command(command) {
    var m;
    if (m = command.match(/([\w_\.]+):(.*)/)) {
      return eval(m[2]);
    }
  }
  
  function poll_commands() {
    if (!remote_key)
      return;
    $.get('get_command__', {key: remote_key}, function(command) {
      if (command != "") {
        var res;
        try {
          res = M5.util.inspect(run_remote_command(command));
        } catch (e) {
          res = "Error: " + e.message;
        }
        $.post('send_response__', {key: remote_key, response: res});
      }
    }, 'text').error(function() {
      setTimeout(remote_connect, 2000);
    });
  }

  function html_escape(val) {
    return val.replace(/</g,"&lt;").replace(/>/g,'&gt;');
  }
  
  function poll_responses() {
    if (!remote_key)
      return;
    $.get('get_response__', {key: remote_key}, function(response) {
      if (response != "") {
        M5.simulator.debug(html_escape(response));
      }
    }, 'text').error(function() {
      setTimeout(remote_connect, 2000);
    });
  }
  
  function remote_connect() {
    $.post('remote_connect__', {name: M5.settings.app_name}, function(result) {
      remote_key = result.key;
    }, 'json');
    
    setInterval(poll_commands, 200);
    setInterval(poll_responses, 250);
    
    // socket = new WebSocket(wsAddress);
    // 
    // socket.onopen = function () {
    //   console.log("Websocket opened");
    // };
    // socket.onmessage = function (event) {
    //   var m = event.data.match(/\[.*?\] (.*)/);
    //   if (m) {
    //     var cmd = m[1];
    //     console.log("Remote command: " + cmd);
    //     remote_send("<reply: " + eval(cmd));
    //   } else if ((m = event.data.match(/^<reply: (.*)/))) {
    //     console.log(m[1]);
    //   } else {
    //     console.log("Unknown remote msg: " + cmd);
    //   }
    // };
    // 
    // socket.onerror = function () {
    //   console.log("Websocket error");
    //   setTimeout(remote_connect, 500);
    // };
    // 
    // socket.onclose = function (event) {
    //   var logMessage = 'Closed (';
    //   if ((arguments.length == 1) && ('CloseEvent' in window) &&
    //       (event instanceof CloseEvent)) {
    //     logMessage += 'wasClean = ' + event.wasClean;
    //     // code and reason are present only for
    //     // draft-ietf-hybi-thewebsocketprotocol-06 and later
    //     if ('code' in event) {
    //       logMessage += ', code = ' + event.code;
    //     }
    //     if ('reason' in event) {
    //       logMessage += ', reason = ' + event.reason;
    //     }
    //   } else {
    //     logMessage += 'CloseEvent is not available';
    //   }
    //   console.log("Websocket: " + logMessage + ')', event);
    //   setTimeout(remote_connect, 500);
    // };
    // 
    // console.log('Websocket: connect: ' + wsAddress);
  }

  function remote_close() {
    //socket.close();
  }
  
  M5.remote = {
    command: remote_command,
    connect: remote_connect,
    close: remote_close
  }
  
  function debug(msg) {
    if (msg instanceof Array) {
        msg = msg.join(" ");
    }
    $('#m5-simpanel .m5-log').append(msg + "\n");
  }
  M5.addConsoleListener(debug);
  
  function loadBig() {
    setTimeout(function() {
      console.log("Setting margin");
      $(document.body).css('background', 'url(m5/assets/iphone.png) no-repeat');
    }, 200);
    var leftMargin = 28;
    var topMargin = 77;
    var height = $(window).height()
    $('#jqt').css({width:(320), height:(480), 'margin-left' :'26px', 'margin-top': '77px', overflow:'hidden'});
    $(document.body).append(buildIframePanel());
  }
  
  function buildIframePanel() {
    var height = $(window).height() - 50;
    return '<div id="m5-simpanel" style="width:700px;height:95%;padding:0"><iframe src="http://' + window.location.host + '/sim__" style="width:100%;height:100%"></iframe>';
  }
  
  function loadInline() {
    $('#jqt').append('<div id="m5-sim" style=""><div class="toolbar"><h1>Debug</h1><a class="button goback" href="#">Close</a></div>' +
      buildInlinePanel() + '</div>');
  }
  
  function buildInlinepanel() {  
    return '<div><div id="m5-simpanel">' +
      '<div>Environment: ' + M5.env + '</div>' +
      '<div>UserAgent: ' + navigator.userAgent + '</div>' +
      '<button class="m5-reload touch">Reload App</button><button class="m5-clear">Clear Log</button><br />' + 
      '<button class="m5-update touch">Update App Cache</button><br />' + 
      '<button class="m5-reset touch">Clear Local Storage</button><br />' +
      '<button class="m5-test1 touch">Test iframe</button><br />' +
      '<div class="m5-header">Log</div>' +
      '<textarea class="m5-log touch"></textarea>' +
      '</div></div>';
  }


  // Immediate code

  if (!M5.settings.no_sim_panel) {
    if (M5.settings.inline_sim || M5.iPhone || M5.Android) {
      loadInline();
    } else {
      loadBig();
    }
  }
  remote_connect();
    
  $('#m5-simpanel .m5-reload').bind('click touchstart', function() {
    alert("Reloading app");
    M5.setUpdateListener(function() {
      M5.silent_update(false);
      window.location.reload();
    });
    M5.silent_update(true);
    window.applicationCache.update();
  });
  $('#m5-simpanel .m5-update').click(function() {
    window.applicationCache.update();
  });
  $('#m5-simpanel .m5-clear').bind('click touchstart', function() {
    $('#m5-simpanel .m5-log').html('');
  });
  $('#m5-simpanel .m5-reset').click(function() {
    if (typeof(SimpleStorage) == "object") {
      SimpleStorage.db.tables(function(tables) {
        $.each(tables, function() {
          debug("Dropping: " +this);
          SimpleStorage.db.drop_table(this);
        });
      });
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        keys.push(localStorage.key(i));
      }
      $.each(keys, function() { 
        debug("Removing localStorage: " + this);
        localStorage.removeItem(this) 
      });
      
    } else {
      debug("Please load SimpleStorage module");
    }
  });
  
  $('#m5-simpanel .m5-test1').click(function () {
    $('#fullstory').append('<iframe style="height:400px" src="http://www.google.com/" />');
  });
  
  function app_key() {
    return remote_key;
  }
  
  M5.simulator = {
    app_key: app_key,
    debug: debug
  }
});
