'use strict'; 

angular.module('tcApp2App')
.controller('perEditCtrl', function (person, $scope, $modal, $window, peopleModel, $modalInstance) {

  var v = this;

  v.m = peopleModel
  v.person = person

  v.ok = function () {
    if ((v.person.name) && (v.person.inicials) && (v.person.roles.length != 0)) {
      v.person.ref = {
        id: v.person.id,
        name: v.person.name
      }
      $modalInstance.close(v.person);
    } else {
      $window.alert('Dados incompletos')
    }
  };
  
  v.addImage = function() {
    var modalInstance = $modal.open({
      templateUrl: 'app/shared/crop/crop.html',
      controller: 'cropCtrl as cropC',
      size: 'lg'
    });
    modalInstance.result.then(function (img) {
      console.log('fechar')
      console.log(img)
      
      v.person.picture = img;
    });
  };
      
  v.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
