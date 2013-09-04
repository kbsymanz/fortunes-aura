require([
  'bower_components/aura/lib/aura'
], function(Aura) {
  Aura({
    debug: {
      enable: true
      , logEvents: true
    }
  })
    .use('extensions/utils')
    .use('extensions/bootstrap')
    .use('extensions/aura-handlebars')
    .use('extensions/backbone')
    .use('extensions/search_history')
    .use('extensions/sockets')
    // --------------------------------------------------------
    // Start our components manually because router needs to start manually.
    // That means that we are not using the data-aura-component
    // attributes in index.html.
    // --------------------------------------------------------
    .start([
      {name: 'header'
        , options: {
          el: '#page-header-container'
        }
      }
      , {name: 'history'
          , options: {
            el: '#history-container'
          }
        }
      , {name: 'history_detail'
          , options: {
            el: '#search-container'
          }
        }
      , {name: 'search'
          , options: {
            el: '#search-container'
          }
        }
      , {name: 'random'
          , options: {
            el: '#random-container'
          }
        }
      , {name: 'router'
        , options: {
          el: '#router' // this id does not exist and the component is not in the DOM
          }
        }
    ])
    .then(function() {
      console.warn('Aura started...');
    });
});
