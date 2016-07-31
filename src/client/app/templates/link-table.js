'use strict';

angular.module('tcApp2App')
  .controller('linkTableCtrl', function ($window, model, NgTableParams, $scope, types) {

    var v = this;

    v.m = model
    v.node = $scope.model
    console.log(v.node)
    v.nodeFields = types.node[v.node.type]
    console.log(v.nodeFields)

/*
    v.m.getLinkedNodes(node._id).then(function (data) {
      console.log(data)
      v.tableParams = new NgTableParams({}, { dataset: data });
    })
*/
  });
