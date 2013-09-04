define(function () {
  'use strict';

  var utils = {}
    ;

  utils.name = 'utils';

  utils.initialize = function (application) {
    utils._app = application;
    application.logger.log('Initializing extension: utils');
  };

  /* --------------------------------------------------------
    * getSandbox()
    *
    * Return a sandbox. Required for more complex components
    * when the same sandbox needs to be used for repeated
    * or different operations, within different scopes, etc.
    * If a sandbox reference is passed, that sandbox is returned,
    * otherwise a new one is created and returned.
    *
    * param       ref   - sandbox.ref
    * return      sandbox
    * -------------------------------------------------------- */
  utils.getSandbox = function(ref) {
    if (ref) {
      return utils._app.sandboxes.get(ref);
    }
    return utils._app.sandboxes.create();
  };

  /* --------------------------------------------------------
  * lf2br()
  *
  * Change the line feeds into breaks.
  *
  * param       data
  * return      new array
  * -------------------------------------------------------- */
  utils.lf2br = function(data) {
    return _.map(data, function(rst) {
      return rst.split('\n').join('<br />');
    });
  };

  return utils;
});
