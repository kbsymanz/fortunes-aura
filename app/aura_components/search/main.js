define([
  'underscore',
  'jquery',
  'text!./search.hbs'
], function (_, $, tplSectionSrc) {
  var search = {}
    , serverDelay = 0  // milliseconds to delay to emulate remote server, 0 to disable
    ;

  'use strict';

  // --------------------------------------------------------
  // Shortcuts for this component.
  // --------------------------------------------------------
  searchFieldSel = 'input#search_field';
  progressBarSel = '#search_progress';

  // --------------------------------------------------------
  // The Aura Logger which is assigned in initialize().
  // --------------------------------------------------------
  var logger;

  /* --------------------------------------------------------
   * handleSearch()
   *
   * Manages the search being sent to the server and the UI
   * being updated for the user. The callback that is passed
   * as data in the event object from the caller is passed
   * onto doSearch().
   *
   * param       evt - jQuery event with data object
   * return      undefined
   * -------------------------------------------------------- */
  var handleSearch = function(evt) {
    var sandbox = evt.data.sandbox
      , term
      , cb = evt.data.cb
      , $el = $(evt.data.el)
      , opts = {}
      ;

    // --------------------------------------------------------
    // When the user presses Enter, do the search.
    //
    // Note: set serverDelay in the module in order to emulate
    // a server with latency.
    // --------------------------------------------------------
    if (evt.which === 13) {
      evt.preventDefault();
      term = $(evt.target).val();
      opts.term = term;

      // --------------------------------------------------------
      // Send the search to the server.
      // --------------------------------------------------------
      doSearch(sandbox, opts, cb);

      // --------------------------------------------------------
      // Update the display to let the user know that we are searching.
      // --------------------------------------------------------
      $el.removeClass('hidden');
    }
  };

  /* --------------------------------------------------------
   * doSearch()
   *
   * Search for the term against the server and send the results
   * back to the caller via callback.
   *
   * return      undefined
   * -------------------------------------------------------- */
  var doSearch = function(sandbox, options, cb) {
    // --------------------------------------------------------
    // setTimeout() is for testing only to allow the UI to update
    // when searching against localhost, i.e. portrays a server
    // with latency experience.
    // --------------------------------------------------------
    setTimeout(function() {
      sandbox.emit('search', options, function(err, result) {
        var fortune
          , data = {}
          ;

        if (err) return sandbox.logger.error(err);
        data.result = result;
        data.term = options.term;
        data.searchTime = Date.now();
        cb(data);
      });
    }, serverDelay);
  };

  /* --------------------------------------------------------
   * lf2br()
   *
   * Change the line feeds into breaks.
   *
   * param       result
   * return      new array
   * -------------------------------------------------------- */
  var lf2br = function(result) {
    return _.map(result, function(rst) {
      return rst.split('\n').join('<br />');
    });
  };

  /* --------------------------------------------------------
   * initialize()
   *
   * Sets up the component.
   * -------------------------------------------------------- */
  search.initialize = function () {
    var compiler = this.sandbox.template.hbs
      , fOpts = {}
      , search = {}
      ;

    logger = this.sandbox.logger;

    _.bindAll(this, 'renderSection', 'handleResult', 'renderDetail');

    // --------------------------------------------------------
    // We compile our templates in the browser here but we should
    // not do this in production. Instead this would be done in
    // advance on the server using Grunt or similar.
    // --------------------------------------------------------
    this.tplSection = compiler.compile(tplSectionSrc);

    // --------------------------------------------------------
    // Create the section and setup handlers.
    // --------------------------------------------------------
    this.renderSection();

    // --------------------------------------------------------
    // Events and bindings - the <enter> key starts search.
    // --------------------------------------------------------
    this.$el.on('keypress',
        searchFieldSel,
        {sandbox: this.sandbox, cb: this.handleResult, el: progressBarSel},
        handleSearch);
  };

  /* --------------------------------------------------------
   * renderSection()
   *
   * Render the component for the first time.
   *
   * param       undefined
   * return      undefined
   * -------------------------------------------------------- */
  search.renderSection = function () {
    var $about
      , $aboutToggle
      , $aboutClose
      , tplData = {}
      ;

    this.html(this.tplSection());

    // --------------------------------------------------------
    // Attach the handlers for the about button.
    // --------------------------------------------------------
    $about = this.$el.find('#search-about');
    $aboutToggle = this.$el.find('#search-about-toggle');
    $aboutClose = this.$el.find('#search-about-footer-close');

    $about.modal({
      show: false
    });
    $aboutToggle.click(function() {
      $about.modal('show');
    });
    $aboutClose.click(function() {
      $about.modal('hide');
    });
  };

  /* --------------------------------------------------------
   * handleResult()
   *
   * Adjust the UI for the user since the search is done, store
   * the search and results in history, and render the search results.
   *
   * param       result
   * return      undefined
   * -------------------------------------------------------- */
  search.handleResult = function(search) {
    var $el = $(progressBarSel)
      ;

    $el.addClass('hidden');

    // --------------------------------------------------------
    // Add the search to the history.
    // --------------------------------------------------------
    this.sandbox.emit('search_history:add', search);

    this.renderDetail(search);
  };

  /* --------------------------------------------------------
   * renderDetail()
   *
   * Render the result of the search. This is accomplished by
   * dynamically starting the search_result component that will
   * do the actual manipulation of the DOM.
   *
   * param       result
   * return      undefined
   * -------------------------------------------------------- */
  search.renderDetail = function(result) {

    // --------------------------------------------------------
    // Convert newlines into breaks.
    // --------------------------------------------------------
    result.result = lf2br(result.result);

    // --------------------------------------------------------
    // Dynamically starting another component. The search_result
    // component which we are starting here was not in the original
    // DOM when Aura started.
    //
    // Note: Aura v0.9.1 is quirky in that this would not work
    // until I renamed the component from searchResult to
    // search_result.
    // --------------------------------------------------------
    this.sandbox.start([{
      name: 'search_result'
      , options: {
        el: '#search_result'
        , search: result
      }
    }]);
  };

  return search;
});
