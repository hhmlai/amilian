'use strict';

angular.module('tcApp2App')
  .factory('nodesModel', function ($rootScope, $uibModal, $stateParams, gdb, utils, filterFilter) {

    var m = {};

    gdb.getAllNodes().then(function (res) {
      m.allNodes = res
      console.log(m.allNodes)
    }).catch(function (err) {
      console.log(err)
    })
    gdb.changes.on('change', function (change) {
      if (change.id.charAt(0) === 'N') {
        var type = utils.getTypeById(change.id)
        console.log(type)
        console.log(change.id)
        if (!change.deleted) {
          m.allNodes[type]=m.allNodes[type] || {}
          m.allNodes[type][change.id] = change.doc
        } else {
          delete m.allNodes[type][change.id]
        }
      }
    })

    m.editNode = function (node) {
      console.log(node)
      var modalInstance = $uibModal.open({
        templateUrl: 'app/nodes/node.edit.html',
        controller: 'nodeEditCtrl as nodeEC',
        size: 'lg',
        resolve: {
          node: function(){return node}
        }
      })
      modalInstance.result.then(function (doc) {
        console.log(doc)
        gdb.update(doc);
      });
    }
    m.removeNode = function (doc, callback) {
      console.log(doc)
      gdb.rmNode(doc)
        .then(function (res) {
          console.log(doc)
          callback(res)
          return true;
        })
        .catch(function (err) {
          console.log(err)
          return false;
        })
    }
    m.newNode = function (type, callback) {
      var modalInstance = $uibModal.open({
        templateUrl: 'app/nodes/node.edit.html',
        controller: 'nodeEditCtrl as nodeEC',
        size: 'lg',
        resolve: {
          node: {
            _id: ('N_' + type+'_' + new Date().toISOString() + '_admin'),
            type: type
          }
        }
      });
      modalInstance.result.then(function (node) {
        console.log(node)
        gdb.create(node);
      })
    }
    

    m.types = {
      person:
      {
        id: "person",
        name: "Pessoa",
        fields: [
          {
            key: 'name',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
              type: 'text',
              label: 'Nome Completo',
              placeholder: 'Enter your name',
              required: true
            }
          },
          {
            key: 'inicials',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              type: 'text',
              label: 'Iniciais',
              placeholder: 'Entrar as iniciais',
              required: true
            }
          },
          {
            key: 'notes',
            type: 'textarea',
            className: 'col-md-12',
            templateOptions: {
              type: 'text',
              cols: 5,
              label: 'Observações',
              placeholder: 'Escrever aqui',
              required: false
            }
          }
        ]
      },
      place:
      {
        id: "place",
        name: "Lugar ou localidade",
        fields: [
          {
            key: 'name',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
              type: 'text',
              label: 'Nome do lugar',
              required: true
            }
          },
          {
            key: 'gps',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              type: 'text',
              label: 'Coordenadas GPS',
              placeholder: 'Entrar coordenadas GPS',
              required: true
            }
          },
          {
            key: 'notes',
            type: 'textarea',
            className: 'col-md-12',
            templateOptions: {
              type: 'text',
              cols: 5,
              label: 'Observações',
              placeholder: 'Escrever aqui',
              required: false
            }
          }
        ]
      },
      interview:
      {
        id: "interview",
        name: "Entrevista",
        fields: [
          {
            key: 'name',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
              type: 'text',
              label: 'Nome do Entrevistado',
              required: true
            }
          },
          {
            key: 'notes',
            type: 'textarea',
            className: 'col-md-12',
            templateOptions: {
              type: 'text',
              cols: 5,
              label: 'Observações',
              placeholder: 'Escrever aqui',
              required: false
            }
          }
        ]
      }
    }

    return m
  })