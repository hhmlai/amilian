'use strict';

angular.module('tcApp2App')
  .controller('docPlaceEditCtrl', docPlaceEditCtrl)

function docPlaceEditCtrl(item, $modalInstance) {
  var vm = this;
  
  vm.placeRef = item
  console.log(item)

  vm.ok = function () {
    $modalInstance.close(vm.placeRef);
  };

  vm.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
