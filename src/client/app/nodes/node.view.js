'use strict';

angular.module('tcApp2App')
  	.controller('nodeViewCtrl', nodeViewCtrl); 

function nodeViewCtrl($stateParams, nodesModel, $window,$state) {

  var v = this;
  v.m = nodesModel;
  v.m.setActiveNode($stateParams.docId);
  

  v.deleteNode = function() {
    console.log('aqui')
    var confirmMsg = 'Quer mesmo apagar esta pessoa?'
              if ($window.confirm(confirmMsg)) {
                v.m.removeNode(v.m.activeNode, function(){
                  v.m.activeNode = {};
                  $state.go('app.nodes.list')              
                });
              }
  }; 

};
