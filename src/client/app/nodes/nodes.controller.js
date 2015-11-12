'use strict';

angular.module('tcApp2App')
  .controller('nodesCtrl', nodesCtrl);

function nodesCtrl  ($scope, $uibModal, $rootScope, db, nodesModel, docsModel) {
  var v = this;
  v.m = nodesModel
  v.dm = docsModel


};
