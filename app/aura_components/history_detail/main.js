define([
  'underscore',
  'jquery',
  'extensions/search_history',
  'extensions/utils',
  'text!./history_detail.hbs'
], function (_, $, SearchHistory, Utils, tplHistoryDetailSrc) {
  'use strict';

  return {

    initialize: function () {
      var compiler = this.sandbox.template.hbs
        , self = this
        ;

      // --------------------------------------------------------
      // We compile our templates in the browser here but we should
      // not do this in production. Instead this would be done in
      // advance on the server using Grunt or similar.
      // --------------------------------------------------------
      this.tplHistoryDetail = compiler.compile(tplHistoryDetailSrc);

      _.bindAll(this, 'render');

      // --------------------------------------------------------
      // Respond to a routing event that is produced by the 
      // router component.
      // --------------------------------------------------------
      this.sandbox.on('route.history', function(id) {
        self.render(id);
      });
    },

    render: function (id) {
      var search = SearchHistory.get(id)
        ;

      search.result = Utils.lf2br(search.result);
      this.html(this.tplHistoryDetail(search));
    }
  };

});
