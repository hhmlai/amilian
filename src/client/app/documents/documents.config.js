'use strict';

angular.module('tcApp2App')
.config(function ($stateProvider, modalStateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app.documents', {
        abstract: true,
        url: '/documents',
        templateUrl: 'app/documents/documents.html',
        controller: 'documentCtrl as docC',
        resolve:{
          docs: function(docsModel) { 
            return docsModel.getAllDocs},
        }
      })
     .state('app.documents.list', {
        url: '',
        templateUrl: 'app/documents/documents.list.html'
      })
     .state('app.documents.view', {
        url: '/view/:docId',
        templateUrl: 'app/documents/document.view.html',
        controller: 'docViewCtrl as docVC'
      })
     .state('app.documents.tag', {
        url: '/tag/:docId',
        templateUrl: 'app/tags/tag.view.html',
        controller: 'tagViewCtrl as tagVC'
      })
    ;
});
