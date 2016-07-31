'use strict'; 

angular.module('tcApp2App')
.controller('linkEditCtrl', function ($scope, link, $uibModal, $window, model, types, $uibModalInstance, utils) {

  var v = this;

  v.m = model
  v.link = link
  console.log(link)
  
  v.linkFields = link.type
  console.log(link)
  

  v.ok = function () {
    console.log(v.link)
      $uibModalInstance.close(v.link);
  };
        
  v.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});
