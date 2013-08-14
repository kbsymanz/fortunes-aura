define([
  'text!./random-section.hbs',
  'text!./random.hbs',
  'underscore'
], function (tplSectionSrc, tplItemSrc, _) {
  var random = {}
    , fortuneInterval = 10
    , shortFortunes = true
    , maxFortunes = 3
    ;

  'use strict';

  /* --------------------------------------------------------
   * getFortune()
   *
   * Emits the key and params to the sockets extension for
   * communication with the server. Potential keys include
   * 'random' and 'randomInterval'. The first returns one
   * fortune via the callback. The second repeatedly returns
   * a fortune via the callback based on the options specified.
   *
   * param       key - random or randomInterval
   * param       options - options to be sent to the server
   * param       ctx - the caller's context
   * param       cb - callback
   * return      undefined
   * -------------------------------------------------------- */
  var getFortune = function(key, options, ctx, cb) {
    ctx.sandbox.emit(key, options, function(fortune) {
      cb(null, fortune);
    });
  };

  random.initialize = function () {
    var hbs = this.sandbox.template.hbs
      , fOpts = {}
      , self = this
      ;

    _.bindAll(this, 'renderSection', 'renderItem');

    // --------------------------------------------------------
    // We compile our templates in the browser here but we should
    // not do this in production. Instead this would be done in 
    // advance on the server using Grunt or similar.
    // --------------------------------------------------------
    this.tplSection = hbs.compile(tplSectionSrc);
    this.tplItem = hbs.compile(tplItemSrc);

    // --------------------------------------------------------
    // Create the section and setup handlers.
    // --------------------------------------------------------
    this.renderSection();

    // --------------------------------------------------------
    // Get the initial fortune from the server and populate DOM.
    // --------------------------------------------------------
    fOpts.isShort = shortFortunes;
    getFortune('random', fOpts, this, function(err, fortune) {
      if (err) return self.sandbox.logger.error(err);
      self.renderItem(fortune);
    });

    // --------------------------------------------------------
    // Request the server to send fortunes are regular intevals
    // which repeatedly calls our callback in order to render 
    // to the DOM.
    // --------------------------------------------------------
    fOpts.interval = fortuneInterval;
    fOpts.name = 'ControllerWithFortunes';
    getFortune('randomInterval', fOpts, this, function(err, fortune) {
      if (err) return self.sandbox.logger.error(err);
      self.renderItem(fortune);
    });
  };

  // --------------------------------------------------------
  // Create the section in the DOM and attach the handlers.
  // --------------------------------------------------------
  random.renderSection = function () {
    var $about
      , $aboutToggle
      , $aboutClose
      ;

    this.html(this.tplSection());

    $about = this.$el.find('#random-about');
    $aboutToggle = this.$el.find('#random-about-toggle');
    $aboutClose = this.$el.find('#random-about-footer-close');

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

  // --------------------------------------------------------
  // Prepend fortunes to the list, keeping it pruned to size.
  // --------------------------------------------------------
  random.renderItem = function(item) {
    var $el = this.$find('#random-list')
      , $children = $el.children()
      , ctx = {}
      ;

    // --------------------------------------------------------
    // Remove oldest fortunes per limit.
    // --------------------------------------------------------
    if ($children.length === maxFortunes) {
      $children.last().remove();
    }

    ctx.fortune = item;
    $el.prepend(this.tplItem(ctx));
  };

  return random;
});
