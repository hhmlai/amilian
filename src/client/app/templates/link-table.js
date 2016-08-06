'use strict';

angular.module('tcApp2App')
  .controller('linkTableCtrl', function ($scope, model, NgTableParams, $filter, $timeout) {

    var v = this;

    v.m = model
    v.node = $scope.model

    v.linkTypesOfNode = v.m.linkTypes.node[v.node.doc.type]
    v.nodeFields = v.m.nodeTypes[v.node.doc.type]

    v.createLink = function (type) {
      v.m.newLink(type, v.node.id).then(function (res) {
        v.loadTables();
      }).catch(function (err) {
        console.log(err)
      })
    }

    v.deleteLink = function (link) {
      console.log('apagar')
      v.m.removeLink(link).then(function (res) {
        console.log('recarregar')
        v.loadTables();
      }).catch(function (err) {
        console.log(err)
      })
    }

    v.loadTables = function () {
      var linksData = v.node.doc.links.map(function (link) {
        return { link: link, linkedNode: v.m.nodeById[link.linkedNode], originNode: v.node }
      })
      var linkedData = v.node.doc.linked.map(function (link) {
        return { link: link, linkedNode: v.node, originNode: v.m.nodeById[link.originNode] }
      })
      v.linksTableParams = new NgTableParams({}, { dataset: linksData });
      v.linkedTableParams = new NgTableParams({}, { dataset: linkedData });
    }

    v.loadTables()

  })