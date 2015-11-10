'use strict';

angular.module('tcApp2App')
.controller('docEditCtrl', function (document, $uibModalInstance, peopleModel) {
  var vm = this;
  vm.doc = document;

  vm.ok = function () {
    $uibModalInstance.close(vm.doc);
  };

  vm.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
