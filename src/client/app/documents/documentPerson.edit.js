'use strict';

angular.module('tcApp2App')
  .controller('docPersonEditCtrl', function (item, $modalInstance) {
  var vm = this;
  
  vm.personRef = item

  vm.ok = function () {
    $modalInstance.close(vm.personRef);
  };

  vm.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
