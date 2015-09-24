'use strict';

angular.module('tcApp2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.tags', {
        abstract: true,
        url: '/tags',
        templateUrl: 'app/tags/tags.html',
        controller: 'tagsCtrl as tagC',
      })
     .state('app.tags.list', {
        url: '',
        templateUrl: 'app/tags/tags.list.html'
      })
     .state('app.tags.view', {
        url: '/tag/:docId',
        templateUrl: 'app/tags/tag.view.html',
        controller: 'tagViewCtrl as tagVC'
      })
    ;
  });