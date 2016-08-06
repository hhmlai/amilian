'use strict';

angular.module('tcApp2App')
  .controller('linkTableCtrl', function ($scope, $uibModal, model, NgTableParams, $filter, $timeout) {

    var v = this;

    v.m = model
    v.node = $scope.model

    v.linkTypesOfNode = v.m.linkTypes.node[v.node.doc.type]
    v.nodeFields = v.m.nodeTypes[v.node.doc.type]

    v.createLink = function (type) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/links/link.new.html',
        controller: 'linkNewCtrl as linkNC',
        size: 'lg',
        resolve: {
          link: {
            id: ('L_' + type.id + '_' + new Date().toISOString() + '_admin'),
            type: type.id,
            originNode: v.node.id
          },
          linkFields: type
        }
      });
      
      modalInstance.result
        .then(function (link) {
          v.m.newLink(link).then(function (res) {
            v.node.doc.links = v.m.nodeById[v.node.id].doc.links
            v.loadTables();
          }).catch(function (err) {
            console.log(err)
          })
        })
    }

    v.deleteLink = function (link) {
      console.log('apagar')
      v.m.removeLink(link).then(function (res) {
        v.node.doc.links = v.m.nodeById[v.node.id].doc.links
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