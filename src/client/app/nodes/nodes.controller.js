'use strict';

angular.module('tcApp2App')
  .controller('nodesCtrl', nodesCtrl);

function nodesCtrl  (nodesModel, $stateParams) {
  var v = this;
  v.m = nodesModel
  v.type = $stateParams.type;
};
