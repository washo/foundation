;(function ($, window, document, undefined) {
  'use strict';

  window.Foundation = {
    init : function (libraries, method, options, response) {
      var library_arr,
          args = [method, options, response],
          responses = [];

      if (libraries && typeof libraries === 'string') {
        library_arr = libraries.split(' ');

        if (library_arr.length > 0) {
          for (var i = library_arr.length; i >= 0; i--) {
            responses.push(this.init_lib(library_arr[i], args));
          }
        }
      } else {
        for (var i = Foundation.libs.length; i >= 0; i--) {
          responses.push(this.init_lib(Foundation.libs[i], args));
        }
      }

      return this.response_obj(responses, args);
    },

    response_obj : function (response_arr, args) {
      for (var callback in args) {
        if (typeof args[callback] === 'function') {
          return args[callback]({
            error: response_arr.filter(function(s) {
              if (typeof s === 'string') return s;
            })
          });
        }
      }

      return response_arr.join(' ');
    },

    init_lib : function(lib, args) {
      try {
        if (Foundation.libs.hasOwnProperty(lib)) {
          return Foundation.libs[lib].init.apply(Foundation.libs[lib], args);
        }
      } catch (e) {
        return this.error({name: lib, message: 'could not be initialized', more: e.name + ' ' + e.message});
      }
    },

    error : function(error) {
      return 'Foundation error: ' + error.name + ' ' + error.message + '; ' + error.more;
    }
  };

  $.foundation = function () {
    return Foundation.init.apply(Foundation, arguments);
  };

}(jQuery, this, this.document));