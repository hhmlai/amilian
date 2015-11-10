'use strict';

angular.module('tcApp2App')
  .controller('docPlaceEditCtrl', docPlaceEditCtrl)

function docPlaceEditCtrl(item, $uibModalInstance) {
  var vm = this;
  
  vm.placeRef = item

  vm.ok = function () {
    $uibModalInstance.close(vm.placeRef);
  };

  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
};
