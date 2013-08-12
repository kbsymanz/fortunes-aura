require([
  'bower_components/aura/lib/aura'
], function(Aura) {
  Aura({
    debug: {enable: true}
  })
    .use('extensions/aura-awesome-extension')
    .use('extensions/bootstrap')
    .start({ components: 'body' }).then(function() {
      console.warn('Aura started...');
    });
});
