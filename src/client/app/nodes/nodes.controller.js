'use strict';

angular.module('tcApp2App')
  .controller('nodesCtrl', nodesCtrl);

function nodesCtrl(model, $stateParams) {
  var v = this;
  v.m = model
  v.type = $stateParams.type;
}
