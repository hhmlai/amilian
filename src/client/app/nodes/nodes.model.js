'use strict';

angular.module('tcApp2App')
.factory('nodesModel', function ($rootScope, $uibModal, $stateParams, db, utils) {

  var m = {};
  m.allNodes = [];
  m.activeNode = null;

m.newNode = function () {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/nodes/node.edit.html',
      controller: 'nodeEditCtrl as nodeEC',
      size: 'lg',
      resolve: {
        node:  {
              id: (new Date().toISOString() + '_admin'),
        }
      }
    });
    modalInstance.result.then(function (doc) {
      m.updateNode(doc);
    });
    return {
    }
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


  m.getAllNodes = db.rel.find('nodes') 
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
