/*
 * -------------------------------------------------------------------------------
 * backbone.js
 *
 * Expose Backbone as an extension. Adapted from:
 * https://github.com/aurajs/aura/issues/271#issuecomment-20240585
 * -------------------------------------------------------------------------------
 */
define(function () {
  'use strict';

  var historyStarted = false;

  return {

    name: 'backbone',

    require: {
      paths:  {
        backbone:     'bower_components/backbone/backbone'
      },
      shim: {
        backbone: {
          exports: 'Backbone',
          deps: ['underscore', 'jquery']
        }
      }
    },

    initialize: function (app) {
      app.core.backbone = require('backbone');
      app.logger.log('Initializing extension: backbone');
    },

    afterAppStart: function(app) {
      if (! historyStarted) {
        app.core.backbone.history.start();
        historyStarted = true;
      }
      app.logger.log('backbone#afterAppStart()');
    }

  };
});
