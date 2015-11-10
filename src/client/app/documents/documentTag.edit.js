'use strict';

angular.module('tcApp2App')
  .controller('docTagEditCtrl', function (item, $modalInstance) {

  var vm = this;  
  vm.tagRef = item
  console.log(item)
  vm.ok = function () {
    $modalInstance.close(vm.tagRef);
  };

  vm.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
