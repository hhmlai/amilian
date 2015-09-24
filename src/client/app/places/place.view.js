'use strict';

angular.module('tcApp2App')
  	.controller('placeViewCtrl', placeViewCtrl); 

function placeViewCtrl($stateParams, placesModel, $window,$state) {

  var v = this;
  v.m = placesModel;
  v.m.setActivePlace($stateParams.docId);
  

  v.deletePlace = function() {
    var confirmMsg = 'Quer mesmo apagar este lugar?'
              if ($window.confirm(confirmMsg)) {
                v.m.removePlace(v.m.activePlace);
                v.m.activePlace = {};
                $state.go('app.places.list')
              }
  }; 

};

