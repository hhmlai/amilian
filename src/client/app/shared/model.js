'use strict';

angular.module('tcApp2App')
  .factory('model', function ($uibModal, $stateParams, gdb, $q) {

    var m = {};

    m.all = gdb.all

    m.newLink = function (type, n1) {
      return $q(function (resolve, reject) {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/links/link.edit.html',
          controller: 'linkEditCtrl as linkEC',
          size: 'lg',
          resolve: {
            link: {
              _id: ('L_' + type + '_' + new Date().toISOString() + '_admin'),
              type: type,
              n1: n1
            }
          }
        });
        modalInstance.result
          .then(function (link) {
            if (link.n2) {
              gdb.create(link)
              resolve(link)
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
            _id: ('N_' + type + '_' + new Date().toISOString() + '_admin'),
            type: type
          }
        }
      });
      modalInstance.result.then(function (node) {
        gdb.create(node);
      })
    }

    return m
  })