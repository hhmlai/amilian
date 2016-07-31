'use strict';

angular.module('tcApp2App')
  .factory('model', function ($uibModal, $stateParams, gdb, $q, $filter) {

    var m = {};

    m.all = gdb.all

    m.newLink = function (linkFields, n1) {
      return $q(function (resolve, reject) {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/links/link.edit.html',
          controller: 'linkEditCtrl as linkEC',
          size: 'lg',
          resolve: {
            link: {
              id: ('L_' + linkFields.id + '_' + new Date().toISOString() + '_admin'),
              type: linkFields.id,
              n1: n1
            },
            linkFields: linkFields
          }
        });
        modalInstance.result
          .then(function (link) {
            if (link.n2) {
              gdb.create(link).then(function () {
                console.log('link criado')
                resolve(link)
              })
            } else {
              console.log('link sem segundo parametro')
              reject('link sem segundo parametro')
            }
          })
          .catch(function (err) {
            resolve(err)
          })
      })
    }

    m.remove = function (doc) {
      return $q(function (resolve, reject) {
        gdb.delete(doc)
          .then(function (res) {
            resolve(doc)
          })
          .catch(function (err) {
            resolve(err)
          })
      })
    }


    m.editNode = function (node) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/nodes/node.edit.html',
        controller: 'nodeEditCtrl as nodeEC',
        size: 'lg',
        resolve: {
          node: function () { return node }
        }
      })
      modalInstance.result.then(function (doc) {
        gdb.update(doc);
      });
    }

    m.newNode = function (type, callback) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/nodes/node.edit.html',
        controller: 'nodeEditCtrl as nodeEC',
        size: 'lg',
        resolve: {
          node: {
            id: ('N_' + type + '_' + new Date().toISOString() + '_admin'),
            type: type
          }
        }
      });
      modalInstance.result.then(function (node) {
        gdb.create(node);
      })
    }

    m.getAllLinksOfNode = function (nodeId) {
      console.log('vou testar')
      console.log(nodeId)
      return $filter('filter')(m.all.links, { doc: { n1: nodeId } }).map(function (obj) {
        var newObj = obj.doc
        if (obj.doc.n2) {
          return newObj
        }
      })
    }

    return m
  })