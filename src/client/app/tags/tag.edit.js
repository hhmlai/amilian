'use strict';	

angular.module('tcApp2App')
.controller('tagEditCtrl', function (tag, $uibModalInstance) {
  var v = this;
  v.tag = tag;

  v.ok = function () {
    v.tag.ref = {
      id: v.tag.id,
      name:v.tag.name}
    $uibModalInstance.close(v.tag);
  };

  v.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
