'use strict';

angular.module('tcApp2App')
  .controller('nodeNewCtrl', function (node, $filter, $uibModal, $window, model, $uibModalInstance, NgTableParams, types) {

    var v = this;

    v.m = model

    v.node = node

    var newFields = types.node[node.doc.type].newForm
    
    v.nodeFields = angular.copy(types.node[node.doc.type])

    v.nodeFields.fields = newFields

    v.ok = function () {
      $uibModalInstance.close(v.node);
    };

    v.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
