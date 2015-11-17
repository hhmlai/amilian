'use strict'; 

angular.module('tcApp2App')
.controller('linkEditCtrl', function ($scope, link, formlyUtils, peopleModel, placesModel, $uibModal, $window, linksModel, $uibModalInstance, utils) {

  var v = this;

     
  
  v.m = linksModel
  v.link = link
  
  v.linkFields = link.typeParams.fields
 console.log(v.linkFields)
 
  v.ok = function () {
      $uibModalInstance.close(v.link);
  };
  
        
  v.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
