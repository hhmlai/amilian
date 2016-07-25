'use strict';

angular.module('tcApp2App')
  	.controller('nodeViewCtrl', nodeViewCtrl); 

function nodeViewCtrl( $stateParams, nodesModel, $window,$state) {


  var v = this;
  v.m = nodesModel;
  console.log($stateParams)
  v.node = v.m.allNodes[$stateParams.type][$stateParams.id];
  v.nodeFields = v.m.types[$stateParams.type]

  v.deleteNode = function() {
  console.log('vou apagar')
  var confirmMsg = 'Quer mesmo apagar?'
              if ($window.confirm(confirmMsg)) {
                v.m.removeNode(v.node, function(){
                  $state.go('app.nodes.list')              
                });
              }
  }
}

