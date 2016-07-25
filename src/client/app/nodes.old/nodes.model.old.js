'use strict';

angular.module('tcApp2App')
.factory('oldnodesModel', function ($rootScope, $uibModal, $stateParams, gdb, utils, filterFilter) {

  var m = {};
  m.allNodes = gdb.allNodes
  m.activeNode = null;
  m.typeParams =  {
          person : 
              { id: "person",
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
                      key: 'image',
                      type: 'profileImage',
                      className: 'col-md-6',
                      templateOptions: {
                          type: 'date',
                          label: 'Imagem do perfil',
                          required: false
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
          place : 
              { id: "place",
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
              }
 }

  m.newNode = function (typeId, callback) {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/nodes/node.edit.html',
      controller: 'nodeEditCtrl as nodeEC',
      size: 'lg',
      resolve: {
        node:  {
              id: (new Date().toISOString() + '_admin'),
              typeId: typeId,
              typeParams: m.typeParams[typeId]
        }
      }
    });
    modalInstance.result.then(function (doc) {
      console.log(doc)
      m.updateNode(doc);
      callback(doc)
    })
  };
  
 m.editNode = function(nodeId){
    var modalInstance = $uibModal.open({
      templateUrl: 'app/nodes/node.edit.html',
      controller: 'nodeEditCtrl as nodeEC',
      size: 'lg',
      resolve: {
        node:  m.getNode(nodeId),
      }
    });
    modalInstance.result.then(function (doc) {
      m.updateNode(doc);
    });
  };
  
  m.getAllNodes = gdb.rel.find('nodes') 
        .then (function(res) {
          m.allNodes = res.nodes;
          $rootScope.$apply();
          console.log('got nodes')
          return true
        })
        .catch (function(err) {
          console.log(err);
          return false
        })
    ;

  m.getNode = function(docId) {
    return utils.findDocById(m.allNodes , docId);
  };

  m.getNodes = function(typeId) {
    console.log(typeId)
    console.log(m.allNodes)
    console.log(filterFilter(m.allNodes, {typeParams: {id: typeId}}))
    return filterFilter(m.allNodes, {typeParams: {id: typeId}});
  };
  
  m.updateNode = function(doc) {
      db.rel.save('node', doc)
        .then (function() {
          var index = utils.findIndexById(m.allNodes, doc.id)
          if (index > -1) {
            m.allNodes.splice(index, 1, doc)
          } else {
          m.allNodes.push(doc);            
          };
          $rootScope.$apply();
          return true
        })
        .catch(function(err) {
          console.log(err);
          return false; 
        })
      ;
  };

  m.removeNode = function(doc, callback) {
    var index = m.allNodes.indexOf(doc);
    db.rel.del('node', doc)
        .then (function() {
          m.allNodes.splice(index, 1);
          callback()
          return true; 
        })
        .catch(function(err) {
          console.log(err)
          return false;
        })
      ;

  };

  m.setActiveNode = function(docId) {
    m.activeNode = utils.findDocById(m.allNodes, docId);
    if (m.activeNode === null) {
      return false
    } else {
      return true
    } 
  };

  return m

});
