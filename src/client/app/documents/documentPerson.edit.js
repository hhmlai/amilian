'use strict';

angular.module('tcApp2App')
  .controller('docPersonEditCtrl', function (item, $uibModalInstance) {
  var vm = this;
  
  vm.personRef = item

  vm.ok = function () {
    $uibModalInstance.close(vm.personRef);
  };

  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})
