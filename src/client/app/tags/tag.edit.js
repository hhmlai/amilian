'use strict';	

angular.module('tcApp2App')
.controller('tagEditCtrl', function (tag, $modalInstance) {
  var v = this;
  v.tag = tag;

  v.ok = function () {
    console.log('vou fechar')
    $modalInstance.close(v.tag);
  };

  v.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
