define([
  'underscore',
  'jquery',
  'extensions/search_history',
  'extensions/sockets',
  'text!./history.hbs',
  'text!./history-detail.hbs'
], function (_, $, SearchHistory, Sockets, tplHistorySrc, tplHistoryDetailSrc) {
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
      , self = this
      ;

    _.bindAll(this, 'renderSection', 'renderOne', 'unrenderOne');

    // --------------------------------------------------------
    // We compile our templates in the browser here but we should
    // not do this in production. Instead this would be done in
    // advance on the server using Grunt or similar.
    // --------------------------------------------------------
    this.tplHistory = compiler.compile(tplHistorySrc);
    this.tplHistoryDetail = compiler.compile(tplHistoryDetailSrc);

    this.renderSection();

    // --------------------------------------------------------
    // Store for renderOne() to use.
    // --------------------------------------------------------
    this.$oneEl = $('#history-detail');

    // --------------------------------------------------------
    // Load the historical searches for this user.
    // First get the username from the server.
    // --------------------------------------------------------
    Sockets.whoami(function(err, username) {
      if (err) {
        console.error(err);
        return false;
      }

      // --------------------------------------------------------
      // Now let the search history collection know the username
      // and allow it to check localStorage for historical searches.
      // --------------------------------------------------------
      SearchHistory.registerUser(username, function(err) {
        if (err) {
          return console.log('SearchHistory.registerUser() returned error');
        }

        // --------------------------------------------------------
        // Render the item details.
        // --------------------------------------------------------
        _.each(SearchHistory.getList(), function(search) {
          self.renderOne(search);
        });

        // --------------------------------------------------------
        // Now that the historical searches are added to the collection,
        // we can start listening for other searches that the user does.
        // --------------------------------------------------------
        self.sandbox.on('search_history:added', self.renderOne, self);
        self.sandbox.on('search_history:removed', self.unrenderOne, self);
      });
    });
  };

  /* --------------------------------------------------------
   * renderSection()
   *
   * Render the history section.
   *
   * param       undefined
   * return      undefined
   * -------------------------------------------------------- */
  history.renderSection = function () {
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
