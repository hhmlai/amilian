'use strict';

angular.module('tcApp2App')
  .controller('nodeViewCtrl', nodeViewCtrl);

function nodeViewCtrl($stateParams, model, $window, $state, types) {


  var v = this;
  
  v.m = model;
  
  v.node = v.m.nodeById[$stateParams.id];

  console.log(v.node)
  
  v.nodeFields = types.node[v.node.doc.type]

  v.deleteNode = function () {
    console.log('vou apagar')
    var confirmMsg = 'Quer mesmo apagar?'
    if ($window.confirm(confirmMsg)) {
      v.m.remove(v.node.doc).then(function () {
        $state.go('app.nodes.list', { type: v.node.doc.type})
      }).catch(function (err) {
        console.log(err);
      })
    }
  }

}

