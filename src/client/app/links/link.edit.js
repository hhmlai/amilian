'use strict'; 

angular.module('tcApp2App')
.controller('linkEditCtrl', function ($scope, link, formlyTypes, linkType, peopleModel, placesModel, $uibModal, $window, linksModel, $uibModalInstance, utils) {

  var v = this;

  v.m = linksModel
  v.link = link
  
  v.linkFields = formlyTypes.getFormlyFields(linkType)

  v.ok = function () {
      $uibModalInstance.close(v.link);
  };
  
        
  v.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
