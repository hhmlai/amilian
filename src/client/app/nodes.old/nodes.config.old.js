'use strict';

angular.module('tcApp2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.oldnodes', {
        abstract: true,
        url: '/oldnodes',
        templateUrl: 'app/oldnodes/nodes.html',
        controller: 'oldnodesCtrl as nodesC'
      })
     .state('app.oldnodes.list', {
        url: '',
        templateUrl: 'app/oldnodes/nodes.list.html'
      })
     .state('app.oldnodes.view', {
        url: '/oldnodes/:docId',
        templateUrl: 'app/oldnodes/node.view.html',
        controller: 'oldnodeViewCtrl as nodeVC'
      })
    ;
  });