'use strict';

angular.module('tcApp2App')
  .controller('nodeViewCtrl', nodeViewCtrl);

function nodeViewCtrl($stateParams, model, $window, $state, types) {


  var v = this;

  v.m = model;

  v.node = v.m.nodeById[$stateParams.id];

  v.nodeFields = types.node[v.node.doc.type]

  v.deleteNode = function () {
    console.log('vou apagar')
    var confDelete = false
    console.log(v.node.doc.linked)
    if (v.node.doc.linked.length > 0) {
      confDelete = $window.confirm('Este elemento está referido por outros. Se o apagar vai também apagar estas referências.\n\nQuer mesmo apagar?')
    } else {
      confDelete = $window.confirm('Quer mesmo apagar este elemento ?')
    }
    console.log(confDelete)
    if (confDelete) {
      v.m.removeNode(v.node).then(function () {
        $state.go('app.nodes.list', { type: v.node.doc.type })
      }).catch(function (err) {
        console.log(err);
      })
    }
  }

}

