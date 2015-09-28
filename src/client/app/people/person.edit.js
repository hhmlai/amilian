'use strict'; 

angular.module('tcApp2App')
.controller('perEditCtrl', function (person, $scope, $modal, $window, peopleModel, $modalInstance) {

  var v = this;

  v.m = peopleModel
  v.person = person
  
      v.personFields = [
        {
            key: 'name',
            type: 'input',
            className: 'col-md-12',
            templateOptions: {
                type: 'text',
                label: 'Nome Completo',
                placeholder: 'Enter your name',
                required: true
            }
        },
        {
            key: 'inicials',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
                type: 'text',
                label: 'Iniciais',
                placeholder: 'Entrar as iniciais',
                required: true
            }
        },
        {
            key: 'bornDate',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
                type: 'date',
                label: 'Data de nascimento',
                placeholder: '',
                required: false
            }
        },
        {
            key: 'notes',
            type: 'textarea',
            className: 'col-md-12',
            templateOptions: {
                type: 'text',
                cols: 5,
                label: 'Observações',
                placeholder: 'Escrever aqui',
                required: false
            }
        },
    ];


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
