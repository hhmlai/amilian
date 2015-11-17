'use strict'; 

angular.module('tcApp2App')
.controller('nodeEditCtrl', function (node, $scope, $uibModal, $window, nodesModel, $uibModalInstance) {

  var v = this;

  v.m = nodesModel
  v.node = node
  
  v.nodeFields = angular.copy(node.typeParams)
  console.log(v.nodeFields)
    

  v.ok = function () {
      v.node.ref = {
        id: v.node.id,
        name: v.node.name
      }
      $uibModalInstance.close(v.node);
  };
  
  v.addImage = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/shared/crop/crop.html',
      controller: 'cropCtrl as cropC',
      size: 'lg'
    });
    modalInstance.result.then(function (img) {
      
      v.node.picture = img;
    });
  };
      
  v.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
