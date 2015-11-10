'use strict';

angular.module('tcApp2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('app.places', {
        abstract: true,
        url: '/places',
        controller: 'placesCtrl as plcC',
        templateUrl: 'app/places/places.html'
      })
     .state('app.places.list', {
        url: '',
        templateUrl: 'app/places/places.list.html'
      })
     .state('app.places.view', {
        url: '/places/:docId',
        templateUrl: 'app/places/place.view.html',
        controller: 'placeViewCtrl as plcVC'
      })
    ;
  })
  
  