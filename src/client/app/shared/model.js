'use strict';

angular.module('tcApp2App')
  .factory('model', function ($uibModal, $stateParams, gdb, $q, types) {

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

    m.newLink = function (linkFields, nodeId) {
      return $q(function (resolve, reject) {
        var modalInstance = $uibModal.open({
          templateUrl: 'app/links/link.edit.html',
          controller: 'linkEditCtrl as linkEC',
          size: 'lg',
          resolve: {
            link: {
              id: ('L_' + linkFields.id + '_' + new Date().toISOString() + '_admin'),
              type: linkFields.id,
              originNode: nodeId
            },
            linkFields: linkFields
          }
        });
        modalInstance.result
          .then(function (link) {
            if (link.linkedNode) {
              m.nodeById[nodeId].doc.links.push(link)
              m.nodeById[link.linkedNode].doc.linked.push(link)
              gdb.update(m.nodeById[nodeId]).then(function () {
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

    m.newNode = function (type) {
      console.log(type)
      var modalInstance = $uibModal.open({
        templateUrl: 'app/nodes/node.edit.html',
        controller: 'nodeEditCtrl as nodeEC',
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
        gdb.create(node.doc);
      })
    }

    return m
  })