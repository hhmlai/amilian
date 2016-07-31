'use strict';

angular.module('tcApp2App')
  .controller('nodeViewCtrl', nodeViewCtrl);

function nodeViewCtrl($stateParams, model, $window, $state, types) {


  var v = this;
  v.m = model;
  console.log($stateParams)
  v.node = v.m.all.id[$stateParams.id].doc;
  v.nodeFields = types.node[$stateParams.type]
  v.deleteNode = function () {
    console.log('vou apagar')
    var confirmMsg = 'Quer mesmo apagar?'
    if ($window.confirm(confirmMsg)) {
      v.m.remove(v.node).then(function () {
        console.log('vou mudar')
        $state.go('app.nodes.list', { type: $stateParams.type })
      }).catch(function (err) {
        console.log(err);
      })
    }
  }
}

