'use strict';

angular.module('tcApp2App')
  .controller('linkTableCtrl', function ($scope, model, NgTableParams,  $filter) {

    var v = this;

    v.m = model    
    v.node = $scope.model
    console.log(v.node.doc.type)
    v.linkTypesOfNode = v.m.linkTypes.node[v.node.doc.type]
    console.log(v.m.linkTypes)
    v.nodeFields = v.m.nodeTypes[v.node.doc.type]

    v.createLink = function (typeId) {
      v.m.newLink(typeId, node.id).then(function (res) {
        console.log(res)
      }).catch(function (err) {
        console.log(err)
      })
    }

    v.deleteLink = function(linkId){
      console.log('vou apagar')
      v.m.remove(linkId).then(function(res){
        console.log(res)
      }).catch(function(err){
        console.log(err)
      })
    }

console.log(v.node.links)

    v.LinksTableParams = new NgTableParams({}, { dataset: v.node.links });
    v.LinkedTableParams = new NgTableParams({}, { dataset: v.node.linked });

  });