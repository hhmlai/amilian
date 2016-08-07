'use strict';

angular.module('tcApp2App')
  .controller('nodeNewCtrl', function (node, $filter, $uibModal, $window, model, $uibModalInstance, NgTableParams, types) {

    var v = this;

    v.m = model

    v.node = node
    console.log(types.node[node.doc.type].fields)

    var newFields = $filter('filter')(types.node[node.doc.type].fields, { templateOptions: { required: true } })
    v.nodeFields = angular.copy(types.node[node.doc.type])
    console.log(v.nodeFields)
    v.nodeFields.fields = newFields

    v.ok = function () {
      $uibModalInstance.close(v.node);
    };

    v.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
