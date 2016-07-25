'use strict'; 

angular.module('tcApp2App')
.controller('nodeEditCtrl', function (node, $uibModal, $window, nodesModel, $uibModalInstance) {

  var v = this;

  v.m = nodesModel
  v.node = node
  console.log(v.node)
  v.nodeFields = v.m.types[node.type]
  console.log(v.nodeFields)   

  v.ok = function () {
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
