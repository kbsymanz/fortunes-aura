define([
  'underscore',
  'jquery',
  'extensions/utils',
  'text!./search.hbs'
], function (_, $, Utils, tplSectionSrc) {
  var search = {}
    , serverDelay = 0  // milliseconds to delay to emulate remote server, 0 to disable
      // Use the same sandbox for emits to work correctly, so we store reference.
    , sbRef = Utils.getSandbox().ref
    ;

  'use strict';

  // --------------------------------------------------------
  // Shortcuts for this component.
  // --------------------------------------------------------
  searchFieldSel = 'input#search_field';
  progressBarSel = '#search_progress';

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
    var sandbox = Utils.getSandbox(sbRef)
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
      sandbox.emit('search', options, function(err, results) {
        var fortune
          , data = {}
          ;

        if (err) return sandbox.logger.error(err);
        data.results = results;
        data.term = options.term;
        data.searchTime = Date.now();
        data.id = data.searchTime;
        cb(data);
      });
    }, serverDelay);
  };

  /* --------------------------------------------------------
   * initialize()
   *
   * Sets up the component.
   * -------------------------------------------------------- */
  search.initialize = function () {
    var fOpts = {}
      , search = {}
      , self = this
      , sandbox = Utils.getSandbox(sbRef)
      , compiler = sandbox.template.hbs
      ;

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
    // Respond to a routing event that is produced by the
    // router component.
    // --------------------------------------------------------
    sandbox.on('route.home', function() {
      self.renderSection();
    }, this);

    // --------------------------------------------------------
    // Events and bindings - the <enter> key starts search.
    // --------------------------------------------------------
    this.$el.on('keypress',
        searchFieldSel,
        {cb: self.handleResult, el: progressBarSel},
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
      , sandbox = Utils.getSandbox(sbRef)
      ;

    $el.addClass('hidden');

    // --------------------------------------------------------
    // Add the search to the history.
    // --------------------------------------------------------
    sandbox.emit('search_history:add', search);

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
  search.renderDetail = function(results) {
    var sandbox = Utils.getSandbox(sbRef)
      ;

    // --------------------------------------------------------
    // Convert newlines into breaks.
    // --------------------------------------------------------
    results.results = Utils.lf2br(results.results);

    // --------------------------------------------------------
    // Dynamically starting another component. The search_result
    // component which we are starting here was not in the original
    // DOM when Aura started.
    //
    // Note: Aura v0.9.1 is quirky in that this would not work
    // until I renamed the component from searchResult to
    // search_result.
    // --------------------------------------------------------
    sandbox.start([{
      name: 'search_result'
      , options: {
        el: '#search_result'
        , search: results
      }
    }]);
  };

  return search;
});
