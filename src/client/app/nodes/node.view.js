'use strict';

angular.module('tcApp2App')
  .controller('nodeViewCtrl', nodeViewCtrl);

function nodeViewCtrl($stateParams, model, $window, $state) {


  var v = this;

  v.m = model;

  v.node = angular.copy(v.m.nodeById[$stateParams.id]);

  v.fields = v.m.nodeTypes[v.node.doc.type].fields

  v.cancel = function () {
    $state.go('app.nodes.list', { type: v.node.doc.type })
  }

  v.save = function () {
    v.m.updateNode(v.node)
  }

  v.remove = function () {
    var confDelete = false
    if (v.node.doc.linked.length > 0) {
      confDelete = $window.confirm('Este elemento está referido por outros. Se o apagar vai também apagar estas referências.\n\nQuer mesmo apagar?')
    } else {
      confDelete = $window.confirm('Quer mesmo apagar este elemento ?')
    }
    if (confDelete) {
      v.m.removeNode(v.node).then(function () {
        $state.go('app.nodes.list', { type: v.node.doc.type })
      }).catch(function (err) {
        console.log(err);
      })
    }
  }

}

