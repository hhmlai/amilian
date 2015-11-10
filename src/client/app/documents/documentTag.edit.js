'use strict';

angular.module('tcApp2App')
  .controller('docTagEditCtrl', function (item, $uibModalInstance) {

  var vm = this;  
  vm.tagRef = item
  console.log(item)
  vm.ok = function () {
    $uibModalInstance.close(vm.tagRef);
  };

  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
