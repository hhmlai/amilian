'use strict';

angular.module('tcApp2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.nodes', {
        abstract: true,
        url: '/nodes',
        templateUrl: 'app/nodes/nodes.html',
        controller: 'nodesCtrl as nodesC'
      })
     .state('app.nodes.list', {
        url: '',
        templateUrl: 'app/nodes/nodes.list.html'
      })
     .state('app.nodes.view', {
        url: '/nodes/:docId',
        templateUrl: 'app/nodes/node.view.html',
        controller: 'nodeViewCtrl as nodeVC'
      })
    ;
  });