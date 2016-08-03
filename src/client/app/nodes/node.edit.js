'use strict';

angular.module('tcApp2App')
  .controller('nodeEditCtrl', function (node, $uibModal, $window, model, $uibModalInstance, NgTableParams, types) {

    var v = this;

    v.m = model

    v.node = node

    v.nodeFields = types.node[node.doc.type]

    v.ok = function () {
      $uibModalInstance.close(v.node);
    };

    v.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
