define([
  'backbone'
], function (Backbone) {
  var search_history = {}
    , maxHistory = 20
    ;

  'use strict';

  // --------------------------------------------------------
  // Define our search model.
  // --------------------------------------------------------
  var Search = Backbone.Model.extend({
    term: ''
    , searchTime: Date.now()
    , result: []
    , isSearching: false
    , idAttribute: 'searchTime'
  });

  // --------------------------------------------------------
  // Define our search collection and instantiate it.
  // --------------------------------------------------------
  var SearchHistory = Backbone.Collection.extend({
    model: Search
  });
  var searchHistory = new SearchHistory();

  // --------------------------------------------------------
  // Automatically prune the collection to a set size.
  // --------------------------------------------------------
  searchHistory.on('add', function(model, collection) {
    var removed
      ;

    while (collection.length > maxHistory) {
      removed = collection.pop();
    }
  });

  // --------------------------------------------------------
  // Sort in descending order by creation time.
  // --------------------------------------------------------
  searchHistory.comparator = function(model1, model2) {
    var st1 = 0
      , st2 = 0
      ;

    if (! model1.disposed) {
      st1 = model1.get('searchTime');
    }
    if (! model2.disposed) {
      st2 = model2.get('searchTime');
    }

    if (st1 < st2) return 1;
    if (st1 > st2) return -1;
    return 0;
  };

  /* --------------------------------------------------------
   * doAdd()
   *
   * Add a new search to the collection.
   *
   * param       model
   * return      undefined
   * -------------------------------------------------------- */
  var doAdd = function(model) {
    searchHistory.add(model);
  };


  // ========================================================
  // ========================================================
  // Exposed methods of the module below.
  // ========================================================
  // ========================================================
  search_history.name = 'search-history';

  /* --------------------------------------------------------
   * initialize()
   *
   * Initialize the search_history extension. The extension
   * listens for these events:
   *    search_history:add
   *
   * The extension emits these events:
   *    search_history:added
   *    search_history:removed
   *
   * param       app
   * return      undefined
   * -------------------------------------------------------- */
  search_history.initialize = function (app) {
    app.logger.log('Initializing extension: search-history');

    // --------------------------------------------------------
    // Set up listeners.
    // --------------------------------------------------------
    app.sandbox.on('search_history:add', doAdd, this);

    // --------------------------------------------------------
    // Notify when a search is added or removed to/from the collection.
    //
    // Usage:
    //    this.sandbox.on('search_history:added', function(model) {
    //      // do something with model
    //    });
    // --------------------------------------------------------
    searchHistory.on('add', function(model) {
      app.sandbox.emit('search_history:added', model.toJSON());
    });
    searchHistory.on('remove', function(model) {
      app.sandbox.emit('search_history:removed', model.toJSON());
    });
  };

  /* --------------------------------------------------------
   * length()
   *
   * Return the number of records are in the collection.
   *
   * param       undefined
   * return      number
   * -------------------------------------------------------- */
  search_history.length = function() {
    return searchHistory.length;
  };

  /* --------------------------------------------------------
   * getList()
   *
   * Returns an array of searches in JSON format.
   *
   * param       undefined
   * return      array
   * -------------------------------------------------------- */
  search_history.getList = function() {
    return searchHistory.toJSON();
  };

  /* --------------------------------------------------------
   * get()
   *
   * Return a search in JSON format to the caller as specified
   * by the id.
   *
   * param       id
   * return      object
   * -------------------------------------------------------- */
  search_history.get = function(id) {
    return searchHistory.get(id).toJSON();
  };

  return search_history;
});
