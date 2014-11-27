require.config({
//  baseUrl: '/webapp/',
  shim: {
    $: {
      exports: 'zepto'
    },
    _: {
      exports: '_'
    },
    B: {
      deps: [
        '_',
        '$'
      ],
      exports: 'Backbone'
    },
    common: {
      deps: [
        'libs'
      ]
    }
  },
  paths: {
    '$': 'res/libs/zepto',
    '_': 'res/libs/underscore',
    'B': 'res/libs/backbone',
    'libs': 'libs_r',
    'common': 'app/common'
  }
});

require(['$', '_', 'B'], function () {

});