define([
  'text!./header.hbs',
  'underscore'
], function (template, _) {
  'use strict';

  return {

    initialize: function () {
      _.bindAll(this, 'render', 'setup');
      this.render();
    },

    render: function () {
      this.html(template);
      this.setup();
    },

    // --------------------------------------------------------
    // Attach handlers, etc.
    // --------------------------------------------------------
    setup: function() {
      var about = this.$el.find('#about')
        , aboutToggle = this.$el.find('#about-toggle')
        , aboutClose = this.$el.find('#about-footer-close')
        ;

      about.modal({
        show: false
      });
      aboutToggle.click(function() {
        about.modal('show');
      });
      aboutClose.click(function() {
        about.modal('hide');
      });
    }
  };    // end return literal object
});
