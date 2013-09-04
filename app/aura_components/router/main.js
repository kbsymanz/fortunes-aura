/*
 * -------------------------------------------------------------------------------
 * router.js
 *
 * This is a non-DOM component, i.e. it does not have a representation within the 
 * DOM. Instead, it is responsible for forwarding all route changes to the event 
 * system so that components can respond to them as desired by listening to 
 * 'route...' events.
 *
 * Adapted from:
 * https://github.com/tony/aura/blob/master/src/widgets/router/main.js
 * -------------------------------------------------------------------------------
 */
define([
  'underscore',
  'backbone'
], function (_, Backbone) {
  'use strict';

  return function(element) {
    var self = this;
    var Router = Backbone.Router.extend({
      initialize: function () {
        Backbone.history.start({pushstate: true});
        self.sandbox.emit('initialized', 'Initialized Router');
      },

      routes: {
        'history/:id': 'history'
        , '/': 'home'
        , '#': 'home'
        , '': 'home'
      },

      history: function(id) {
        var route = 'route.history'
          ;
        self.sandbox.emit.apply(self, [route, id]);
      },

      home: function() {
        var route = 'route.home'
          ;
        self.sandbox.emit.apply(self, [route]);
      },

      router: function(args) {
        if (! args) return;
        var slice = Array.prototype.slice;
        var event, route;
        args = args.split('/');   // split by slashes
        event = slice.call(args,0);
        event.unshift('route');   // prepend 'route' namespace
        route = event.join('.');  // join into delimeter format
        route = [route];          // wrap route in an array

        // ['route.example', arg1, arg2, arg3]
        self.sandbox.emit.apply(self, route.concat(args));
      }
    });

    var router = new Router();
  };
});
