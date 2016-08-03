'use strict';

angular.module('tcApp2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.nodes', {
        abstract: true,
        url: '/nodes',
        templateUrl: 'app/nodes/nodes.html'
      })
     .state('app.nodes.list', {
        url: '/:type',
        templateUrl: 'app/nodes/nodes.list.html',
        controller: 'nodesCtrl as nodesC'
      })
     .state('app.nodes.view', {
        url: '/nodes/:id',
        templateUrl: 'app/nodes/node.view.html',
        controller: 'nodeViewCtrl as nodeVC'
      })
  })