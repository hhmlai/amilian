'use strict';	

angular.module('tcApp2App')
.controller('tagEditCtrl', function (tag, $modalInstance) {
  var v = this;
  v.tag = tag;

  v.ok = function () {
    v.tag.ref = {
      id: v.tag.id,
      name:v.tag.name}
    $modalInstance.close(v.tag);
  };

  v.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
