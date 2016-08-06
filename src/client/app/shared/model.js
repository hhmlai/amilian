'use strict';

angular.module('tcApp2App')
  .factory('model', function ($uibModal, $state, $stateParams, gdb, $q, types) {

    var m = {};

    m.nodeArrByType = gdb.nodeArrByType
    m.nodeById = gdb.nodeById

    var generateLinkTypes = function (links) {
      var res = { node: {}, id: {} }
      angular.forEach(links, function (nodeLinks, nodeTypeId) {
        res.node[nodeTypeId] = []
        angular.forEach(nodeLinks, function (link) {
          var newLink = {
            id: link.id,
            name: link.linkedNode.label,
            fields: [
              {
                key: "linkedNode",
                type: 'ui-select-single',
                templateOptions: {
                  label: link.linkedNode.label,
                  optionsAttr: 'bs-options',
                  description: link.linkedNode.description,
                  get options() {
                    return m.nodeArrByType[link.linkedNode.id].map(function (obj) {
                      return obj.doc
                    })
                  },
                  valueProp: 'id',
                  labelProp: 'name',
                  required: true
                }
              },
              { key: "data", type: 'input', templateOptions: { label: 'Notas' } }
            ]

          }
          res.node[nodeTypeId].push(newLink)
          res.id[newLink.id] = newLink
        }
        )
      })
      return res
    }

    console.log(types)

    m.linkTypes = generateLinkTypes(types.links)
    m.nodeTypes = types.node

    m.updateNode = function (node) {
      return $q(function (resolve, reject) {
        gdb.update(node).then(function (res) {
          resolve(res)
        }).catch(function (err) {
          reject(err)
        })

      })
    }

    m.newLink = function (link) {
      return $q(function (resolve, reject) {
        if (link.linkedNode) {
          m.nodeById[link.originNode].doc.links.push(link)
          m.nodeById[link.linkedNode].doc.linked.push(link)
          gdb.update(m.nodeById[link.originNode]).then(function () {
            gdb.update(m.nodeById[link.linkedNode])
          }).then(function () {
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