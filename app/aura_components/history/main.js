define([
  'underscore',
  'jquery',
  'extensions/search_history',
  'text!./history.hbs',
  'text!./history-detail.hbs'
], function (_, $, SearchHistory, tplHistorySrc, tplHistoryDetailSrc) {
  var history = {}
    ;

  'use strict';

  /* --------------------------------------------------------
   * initialize()
   *
   * Instantiate the history section view. Responds to these
   * events:
   *    search_history:added
   *    search_history:removed
   *
   * param       undefined
   * return      undefined
   * -------------------------------------------------------- */
  history.initialize = function () {
    var compiler = this.sandbox.template.hbs
      ;

    _.bindAll(this, 'render', 'renderOne', 'unrenderOne');

    // --------------------------------------------------------
    // We compile our templates in the browser here but we should
    // not do this in production. Instead this would be done in
    // advance on the server using Grunt or similar.
    // --------------------------------------------------------
    this.tplHistory = compiler.compile(tplHistorySrc);
    this.tplHistoryDetail = compiler.compile(tplHistoryDetailSrc);

    this.sandbox.on('search_history:added', this.renderOne, this);
    this.sandbox.on('search_history:removed', this.unrenderOne, this);

    this.render();
  };

  /* --------------------------------------------------------
   * render()
   *
   * Render the history section. Calls renderOne() for rendering
   * each line item.
   *
   * param       undefined
   * return      undefined
   * -------------------------------------------------------- */
  history.render = function () {
    var sectionData = {}
      , detailData
      , self = this
      , $oneEl
      ;

    // --------------------------------------------------------
    // Render the section.
    // --------------------------------------------------------
    sectionData.length = SearchHistory.length();
    this.html(this.tplHistory(sectionData));

    // --------------------------------------------------------
    // Store for renderOne() to use.
    // --------------------------------------------------------
    this.$oneEl = $('#history-detail');

    // --------------------------------------------------------
    // Render the item details.
    // --------------------------------------------------------
    _.each(SearchHistory.getList(), function(search) {
      self.renderOne(search);
    });
  };

  /* --------------------------------------------------------
   * renderOne()
   *
   * Render one search into the list.
   *
   * param       data
   * return      undefined
   * -------------------------------------------------------- */
  history.renderOne = function(data) {
    this.$oneEl.prepend(this.tplHistoryDetail(data));
  };

  /* --------------------------------------------------------
   * unrenderOne()
   *
   * Remove one search result from the list.
   *
   * param       data
   * return      undefined
   * -------------------------------------------------------- */
  history.unrenderOne = function(data) {
    $('#' + data.searchTime).remove();
  };

  return history;
});
