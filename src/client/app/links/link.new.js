'use strict'; 

angular.module('tcApp2App')
.controller('linkNewCtrl', function (link, linkFields, $uibModal, model, $uibModalInstance) {

  var v = this;

  v.m = model
  v.link = link
  v.linkFields = linkFields
  
  v.ok = function () {
    console.log(v.link)
      $uibModalInstance.close(v.link);
  };
        
  v.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

});
