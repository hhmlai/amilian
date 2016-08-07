'use strict';

angular.module('tcApp2App')
  .factory('model', function ($uibModal, $state, $stateParams, gdb, $q, types) {

    var m = {};

    m.nodeArrByType = gdb.nodeArrByType
    m.nodeById = gdb.nodeById


    var newLinks = {
      person: {
        id: 'bornPlace',
        name: 'Local de Nascimento',
        fields: [
          {
            key: 'selectedPerson',
            type: "select-link",
            templateOptions: {
              linkedType: 'place',
              label: 'local de Nascimento',
              optionsAttr: 'bs-options',
              description: 'Selecione o Local de Nascimento da Pessoa',
              get options() {
                return m.nodeArrByType['place'].map(function (obj) {
                  return obj.doc
                })
              }
            }
          },
          {
            key: "data",
            type: 'input',
            templateOptions: {
              label: 'Notas'
            }
          }
        ]
      }
    }



    var generateLinkTypes = function (links) {
      var res = { node: {}, id: {} }
      angular.forEach(links, function (nodeLinks, nodeTypeId) {
        res.node[nodeTypeId] = []
        angular.forEach(nodeLinks, function (link) {
          var newLink = {
            id: link.id,
            name: link.label,
            fields: [
              {
                key: 'linkedNode',
                type: 'select-link',
                templateOptions: {
                  label: link.label,
                  linkedType: link.linkedNodeType,
                  optionsAttr: 'bs-options',
                  description: link.description,
                  get options() {
                    return m.nodeArrByType[link.linkedNodeType].map(function (obj) {
                      return obj.doc
                    })
                  },
                  valueProp: 'id',
                  labelProp: 'name',
                  required: true
                }
              },
              { key: "data", type: 'input', templateOptions: { label: 'Observações' } }
            ]

          }
          res.node[nodeTypeId].push(newLink)
          res.id[newLink.id] = newLink
        }
        )
      })
      return res
    }

    m.linkTypes = generateLinkTypes(types.links)
    m.newlinkTypes = newLinks
    m.nodeTypes = types.node


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