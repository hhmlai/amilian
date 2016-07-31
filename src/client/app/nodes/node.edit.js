'use strict';

angular.module('tcApp2App')
  .controller('nodeEditCtrl', function (node, $uibModal, $window, model, $uibModalInstance, NgTableParams, types) {

    var v = this;

    v.m = model
    v.node = node
    v.nodeFields = types.node[node.type]

    v.ok = function () {
      $uibModalInstance.close(v.node);
    };
/*
    v.m.getLinkedNodes(node._id).then(function (data) {
      console.log(data)
      v.tableParams = new NgTableParams({}, { dataset: data });
    })
*/

    v.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
