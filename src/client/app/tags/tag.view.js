'use strict';

angular.module('tcApp2App')
  	.controller('tagViewCtrl', tagViewCtrl); 

function tagViewCtrl($uibModal, $window, $state, $scope, $stateParams, utils, tagsModel, docsModel) {

  var v = this;
  v.m = tagsModel;
  v.dm = docsModel;
  v.m.setActiveTag($stateParams.docId);

  v.editTag = function () {
    var doc = v.m.activeTag;
    var modalInstance = $uibModal.open({
      templateUrl: 'app/tags/tag.edit.html',
      controller: 'tagEditCtrl as tagEC',
      scope: $scope,
      resolve: {
        tag: function () {return v.m.activeTag}
      }
    });
    modalInstance.result.then(function (doc) {
      v.m.updateTag(doc);
      console.log('Modal dismissed at: ' + new Date());
    });
  };

  v.deleteTag = function() {
    var confirmMsg = 'Quer mesmo apagar esta colecção?'
              if ($window.confirm(confirmMsg)) {
                v.m.removeTag(v.m.activeTag, function(){
                  v.m.activeTag = {};
                  $state.go('app.tags.list')                  
                });
              }
  }; 

};

