define([
  'underscore'
], function(_) {
  var sockets = {}
    , server
    , whoami = null
    , isConnected = false
    , isSubSearch = false
    , isSubRandom = false
    , isSubRandomInt = false
    ;

  /* --------------------------------------------------------
    * sessionExpired()
    *
    * Simplistic implementation to handle session expiration.
    *
    * param       location - the url of the login page possibly
    * return      undefined
    * -------------------------------------------------------- */
  var sessionExpired = function(location) {
    alert('Session has expired. Please login again.');
    console.dir(location);
    if (location) {
      window.location = location[0];
    }
  };

  /* --------------------------------------------------------
   * search()
   *
   * Private: send the search request to the server and handle the
   * response.
   *
   * param       options  (optional)
   * param       callback
   * return      undefined
   * -------------------------------------------------------- */
  var search = function(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    if (! isOnline()) {
      return callback('Cannot search because we are currently offline.');
    }
    server.emit('search', options, function(data) {
      callback(null, data);
    });
  };

  /* --------------------------------------------------------
   * random()
   *
   * Private: send the request for a random fortune to the server
   * and handle the response.
   *
   * param       options  (optional)
   * param       callback
   * return      undefined
   * -------------------------------------------------------- */
  var random = function(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    server.emit('random', options, function(data) {
      callback(data);
    });
  };

  /* --------------------------------------------------------
   * randomInterval()
   *
   * Private: instruct the server to emit fortunes at specific
   * intervals. Server responds with the message key to listen
   * for.
   *
   * param       options
   * param       callback
   * return      undefined
   * -------------------------------------------------------- */
  var randomInterval = function(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    options || (options = {});
    if (! options.interval) {
      options.interval = 60;    // default seconds between fortunes
    }
    server.emit('random', options, function(msgKey) {
      server.on(msgKey, callback);
    });
  };

  sockets.require = {
    paths: {
      socketio : '/socket.io/socket.io'
    }
  };

  /* --------------------------------------------------------
    * whoami()
    *
    * Who does the server say that I am? Returns the username
    * to the caller. Caches the result so that a server call
    * is not needed everytime.
    *
    * param       callback
    * param       checkServer - don't trust cache; check the server again
    * return      undefined
    * -------------------------------------------------------- */
  sockets.whoami = function(cb, checkServer) {
    if (! _.isFunction(cb)) {
      console.warn('Error: Sockets.whoami() called without a callback.');
      return;
    }
    if (! checkServer && whoami) return cb(null, whoami);
    server.emit('whoami', function(err, username) {
      if (err) {
        console.warn(err);
        return cb(err);
      }
      whoami = username;
      return cb(null, username);
    });
  };

  sockets.initialize = function (app) {
    var self = this
      , isConnected = false
      , ready = app.core.data.deferred()
      ;

    this.io = require('socketio');
    app.logger.log('Initializing extension: sockets');

    server = io.connect('/fortunes');

    server.on('connect', function() {
      isConnected = true;

      app.logger.log('Connect');
      sockets.whoami(function(err, username) {

        //if (! isSubSearch) {
          //app.sandbox.on('search', search);
          //isSubSearch = true;
        //}

        if (! isSubRandom) {
          app.sandbox.on('random', random);
          isSubRandom = true;
        }

        if (! isSubRandomInt) {
          app.sandbox.on('randomInterval', randomInterval);
          isSubRandomInt = true;
        }

        ready.resolve(true);
        app.sandbox.emit('online');
      });


    });

    server.on('disconnect', function() {
      app.logger.log('Disconnect');
      app.sandbox.emit('offline');
    });

    server.on('sessionExpired', sessionExpired);

    // --------------------------------------------------------
    // Force application to wait until sockets are up.
    // --------------------------------------------------------
    return ready.promise();
  };

  return sockets;
});
