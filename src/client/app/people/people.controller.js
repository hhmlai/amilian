'use strict';

angular.module('tcApp2App')
  .controller('peopleCtrl', peopleCtrl);

function peopleCtrl  ($scope, $modal, $rootScope, db, peopleModel, docsModel) {
  var v = this;
  v.m = peopleModel
  v.dm = docsModel


};
