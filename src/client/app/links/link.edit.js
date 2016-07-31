'use strict'; 

angular.module('tcApp2App')
.controller('linkEditCtrl', function ($scope, link, $uibModal, $window, model, $uibModalInstance, utils) {

  var v = this;

  v.m = model
  v.link = link
  console.log(link)
  
  v.linkFields = v.m.linkTypes[link.type]

  v.ok = function () {
      $uibModalInstance.close(v.link);
  };
        
  v.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});
