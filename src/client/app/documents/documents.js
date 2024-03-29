'use strict';	

angular.module('tcApp2App')
  	.controller('documentCtrl', documentCtrl); 

function documentCtrl($state, $window, $http, $scope, $uibModal, docsModel, db, tagsModel) {
  
  var v = this;
  v.m = docsModel;
  v.tm = tagsModel;
  

  v.newDoc = function () {
      var modalInstance = $uibModal.open({
          templateUrl: 'app/documents/document.edit.html',
          controller: 'docEditCtrl as docEC',
          scope: $scope,
          resolve: {
            document: function() {return new v.m.newDoc}
          }
      });
    modalInstance.result.then(function (document) {
      v.m.addDoc(document)
    });
  };

  v.$destroy = function (name, arr, confirmMsg) {
                        confirmMsg = confirmMsg || 'Quer mesmo apagar este ficheiro?'
                        if ($window.confirm(confirmMsg)) {
                            $http({
                                url: arr[name].file.deleteUrl,
                                method: arr[name].file.deleteType
                            }).then(
                                function () {
                                    delete arr[name];
                                    docsModel.saveActiveDoc()
                                    console.log(docsModel.activeDoc.videos);
                                },
                                function () {
                                    $window.alert('erro a apagar')
                            });
                        }
                }

};

