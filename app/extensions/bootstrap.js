define({
  require: {
    paths: {
      bootstrap: 'bower_components/bootstrap/dist/js/bootstrap',
      jquery: 'bower_components/jquery/jquery'
    },
    shim: {
      bootstrap: {
        exports: '$.fn.popover',
        deps: ['jquery']
      },
      enforceDefine: true
    }
  },

  initialize: function(app) {
    app.logger.log('Initializing extension: bootstrap');
  }
});

