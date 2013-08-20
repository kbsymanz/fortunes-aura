define([
  'underscore',
  'jquery',
  'text!./search_result.hbs'
], function (_, $, tplSrc) {
  var search_result = {}
    ;

  'use strict';

  /* --------------------------------------------------------
   * initialize()
   *
   * Pass data in the data element of the object passed.
   *
   * param       options
   * return      undefined
   * -------------------------------------------------------- */
  search_result.initialize = function (options) {
    var compiler = this.sandbox.template.hbs
      ;

    // --------------------------------------------------------
    // We compile our templates in the browser here but we should
    // not do this in production. Instead this would be done in 
    // advance on the server using Grunt or similar.
    // --------------------------------------------------------
    this.tplResult = compiler.compile(tplSrc);

    this.render(options.search);
  };

  search_result.render = function (data) {
    this.html(this.tplResult(data));
  };

  return search_result;

});
