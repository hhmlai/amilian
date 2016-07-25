'use strict';

angular.module('tcApp2App')
  .controller('oldnodesCtrl', oldnodesCtrl);

function oldnodesCtrl  ($scope, $uibModal, $rootScope, db, nodesModel, docsModel) {
  var v = this;
  v.m = nodesModel
  v.dm = docsModel


};
