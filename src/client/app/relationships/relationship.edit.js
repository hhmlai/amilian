'use strict'; 

angular.module('tcApp2App')
.controller('relEditCtrl', function (rel, peopleModel, placesModel, $scope, $modal, $window, relsModel, $modalInstance, utils) {

  var v = this;
  console.log(peopleModel.allPeople)

  v.m = relsModel
  v.rel = rel
  v.relFields = utils.findDocById(v.m.relTypes, rel.relTypeId)
  console.log(v.relFields.fields[0].templateOptions)
  console.log(peopleModel.allPeople)

  v.ok = function () {
      $modalInstance.close(v.rel);
  };
        
  v.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
