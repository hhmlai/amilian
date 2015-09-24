'use strict';

angular.module('tcApp2App')
  	.controller('personViewCtrl', personViewCtrl); 

function personViewCtrl($stateParams, peopleModel, $window,$state) {

  var v = this;
  v.m = peopleModel;
  v.m.setActivePerson($stateParams.docId);
  

  v.deletePerson = function() {
    console.log('aqui')
    var confirmMsg = 'Quer mesmo apagar esta pessoa?'
              if ($window.confirm(confirmMsg)) {
                v.m.removePerson(v.m.activePerson);
                v.m.activePerson = {};
                $state.go('app.people.list')
              }
  }; 

};

