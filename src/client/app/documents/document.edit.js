'use strict';

angular.module('tcApp2App')
.controller('docEditCtrl', function (document, $modalInstance, peopleModel) {
  var vm = this;
  vm.doc = document;

  vm.ok = function () {
    $modalInstance.close(vm.doc);
  };

  vm.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
