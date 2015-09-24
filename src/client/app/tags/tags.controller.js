'use strict';

angular.module('tcApp2App')
  .controller('tagsCtrl', tagsCtrl);

function tagsCtrl  (tagsModel) {
  var v = this;
  v.m = tagsModel;
};
