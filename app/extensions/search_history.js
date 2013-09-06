define([
  'backbone',
  'extensions/utils'
], function (Backbone, Utils) {
  var search_history = {}
    , maxHistory = 20
    , whoami
    , Search            // model
    , SearchHistory     // collection
    , searchHistory     // instance of collection
    , sbRef = Utils.getSandbox().ref
    ;

  'use strict';

  // --------------------------------------------------------
  // Define our search model.
  // --------------------------------------------------------
  Search = Backbone.Model.extend({
    term: ''
    , searchTime: Date.now()
    , results: []
    , isSearching: false
    , idAttribute: 'searchTime'
  });

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
    var sandbox = Utils.getSandbox(sbRef)
      ;
    app.logger.log('Initializing extension: search-history');

    // --------------------------------------------------------
    // Set up listeners.
    // --------------------------------------------------------
    sandbox.on('search_history:add', doAdd, this);
  };

  /* --------------------------------------------------------
   * registerUser()
   *
   * Uses the username to determine the localStorage to use and
   * access. The method must be called first in order to use the
   * search_history extension.
   *
   * param       username
   * param       callback
   * return      undefined
   * -------------------------------------------------------- */
  search_history.registerUser = function(username, callback) {
    var self = this
      , sandbox = Utils.getSandbox(sbRef)
      ;
    whoami = username;

    // --------------------------------------------------------
    // Create the collection with the localStorage component.
    // --------------------------------------------------------
    SearchHistory = Backbone.Collection.extend({
      model: Search,
      initialize: function(options) {
        this.localStorage = new Backbone.LocalStorage(whoami + ':SearchList');
      }
    });
    searchHistory = new SearchHistory();

    // --------------------------------------------------------
    // Populate the collection from localStorage.
    // --------------------------------------------------------
    searchHistory.fetch({
      success: function() {
        callback(void 0);
      }
      , error: function() {
        callback(true);
      }
    });

    // --------------------------------------------------------
    // Notify when a search is added or removed to/from the collection.
    //
    // Usage:
    //    this.sandbox.on('search_history:added', function(model) {
    //      // do something with model
    //    });
    // --------------------------------------------------------
    searchHistory.on('add', function(model) {
      sandbox.emit('search_history:added', model.toJSON());
    });
    searchHistory.on('remove', function(model) {
      sandbox.emit('search_history:removed', model.toJSON());
    });

    // --------------------------------------------------------
    // Automatically prune the collection to a set size.
    // --------------------------------------------------------
    searchHistory.on('add', function(model, collection) {
      var removed
        ;

      while (collection.length > maxHistory) {
        removed = collection.pop();
        console.log('Removing ' + removed.get('term'));
        searchHistory.localStorage.destroy(removed);
      }
    });

    // --------------------------------------------------------
    // Persist the new model to localStorage after adding the
    // id field.
    // --------------------------------------------------------
    searchHistory.on('add', function(model) {
      model.save();
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
    return searchHistory? searchHistory.length: 0;
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
