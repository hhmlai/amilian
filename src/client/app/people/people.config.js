'use strict';

angular.module('tcApp2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.people', {
        abstract: true,
        url: '/people',
        templateUrl: 'app/people/people.html',
        controller: 'peopleCtrl as peoC'
      })
     .state('app.people.list', {
        url: '',
        templateUrl: 'app/people/people.list.html'
      })
     .state('app.people.view', {
        url: '/people/:docId',
        templateUrl: 'app/people/person.view.html',
        controller: 'personViewCtrl as perVC'
      })
    ;
  });