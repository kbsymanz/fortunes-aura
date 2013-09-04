/*
 * -------------------------------------------------------------------------------
 * backbone.js
 *
 * Expose Backbone as an extension. Adapted from:
 * https://github.com/aurajs/aura/issues/271#issuecomment-20240585
 * https://github.com/tony/aura/blob/master/src/extensions/backbone/sandbox.js
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
      app.logger.log('Initializing extension: backbone');
    },
  };
});
