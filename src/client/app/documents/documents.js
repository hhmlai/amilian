'use strict';	

angular.module('tcApp2App')
  	.controller('documentCtrl', documentCtrl); 

<<<<<<< HEAD
function documentCtrl($state, $window, $scope, $modal, docsModel, peopleModel, db, tagsModel) {
=======
function documentCtrl($state, $window, $http, $scope, $modal, docsModel, peopleModel, db, tagsModel) {
>>>>>>> ac4302a4681cbc3652fba82f04b22ce005345ddd

  var v = this;
  v.m = docsModel;
  v.pm = peopleModel;
  v.tm = tagsModel;
  

  v.newDoc = function () {
      var modalInstance = $modal.open({
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

  v.newTag = function () {
      var modalInstance = $modal.open({
          templateUrl: 'app/documents/document.edit.html',
          controller: 'docEditCtrl as docEC',
          scope: $scope,
          resolve: {
            document: function() {return v.m.newDoc}
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


  //PEOPLE
};

