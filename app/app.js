require([
  'bower_components/aura/lib/aura'
], function(Aura) {
  Aura({
    debug: {enable: true}
  })
    .use('extensions/bootstrap')
    .use('extensions/aura-handlebars')
    .use('extensions/backbone')
    .use('extensions/search_history')
    .use('extensions/sockets')
    .start({ components: 'body' }).then(function() {
      console.warn('Aura started...');
    });
});
