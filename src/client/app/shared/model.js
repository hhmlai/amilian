'use strict';

angular.module('tcApp2App')
  .factory('model', function ($uibModal, $state, $stateParams, gdb, $q, types) {

    var m = {};

    m.nodeArrByType = gdb.nodeArrByType
    m.nodeById = gdb.nodeById


    m.nodeTypes = types.nodes
    m.linkTypes = types.links


    m.newLink = function (link) {
      return $q(function (resolve, reject) {
        m.nodeById[link.originNode].doc.links.push(link)
        m.nodeById[link.linkedNode].doc.linked.push(link)
        gdb.update(m.nodeById[link.originNode]).then(function () {
          gdb.update(m.nodeById[link.linkedNode])
        }).then(function () {
          console.log('link criado')
          resolve(link)
        }).catch(function (err) {
          console.log(err)
          reject(err)
        })
      })
    }


    m.updateNode = function (node) {
      return $q(function (resolve, reject) {
        gdb.update(node).then(function (res) {
          node.doc.links.forEach(function (link) {
            var doc = m.nodeById[link.linkedNode].doc
            if (doc.linked.indexOf(link) === -1) {
              doc.linked.push(link)
              gdb.update(m.nodeById[link.linkedNode])
            }
          })
          resolve(res)
        }).catch(function (err) {
          reject(err)
        })
      })
    }



    m.removeLink = function (link) {
      return $q(function (resolve, reject) {
        let refNode = gdb.nodeById[link.linkedNode]
        refNode.doc.linked.splice(refNode.doc.linked.indexOf(link), 1)
        let node = gdb.nodeById[link.originNode]
        node.doc.links.splice(node.doc.links.indexOf(link), 1)
        gdb.update(refNode)
        gdb.update(node)
        resolve()
      }).catch(function (err) {
        reject(err)
      })
    }

    m.removeNode = function (node) {
      return $q(function (resolve, reject) {
        gdb.delete(node).then(function (res) {
          resolve(node)
        }).catch(function (err) {
          reject(err)
        })
      })
    }

    m.newNode = function (type) {
      console.log(type)
      var modalInstance = $uibModal.open({
        templateUrl: 'app/nodes/node.new.html',
        controller: 'nodeNewCtrl as nodeNC',
        size: 'lg',
        resolve: {
          node: {
            doc: {
              id: ('N_' + type + '_' + new Date().toISOString() + '_admin'),
              type: type,
              links: [],
              linked: []
            }
          }
        }
      });
      modalInstance.result.then(function (node) {
        gdb.create(node)
      })
    }

    return m
  })