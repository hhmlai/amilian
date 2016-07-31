'use strict';

angular.module('tcApp2App')
  .controller('linkTableCtrl', function ($window, model, NgTableParams, $scope, types) {

    var v = this;

    v.m = model
    v.types = types
    
    v.node = $scope.model
    v.linkTypes = types.link.node[v.node.type]
    v.nodeFields = types.node[v.node.type]

    v.createLink = function (typeId) {
      v.m.newLink(typeId, node.id).then(function (res) {
        console.log(res)
      }).catch(function (err) {
        console.log(err)
      })
    }

    var nodeLinks = v.m.getAllLinksOfNode(v.node.id)

    v.tableParams = new NgTableParams({}, { dataset: nodeLinks });

  });
