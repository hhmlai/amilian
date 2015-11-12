'use strict'; 

angular.module('tcApp2App')
.controller('nodeEditCtrl', function (node, $scope, $uibModal, $window, nodesModel, $uibModalInstance) {

  var v = this;

  v.m = nodesModel
  v.node = node
  
      v.nodeFields = [
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
      v.node.ref = {
        id: v.node.id,
        name: v.node.name
      }
      $uibModalInstance.close(v.node);
  };
  
  v.addImage = function() {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/shared/crop/crop.html',
      controller: 'cropCtrl as cropC',
      size: 'lg'
    });
    modalInstance.result.then(function (img) {
      console.log('fechar')
      console.log(img)
      
      v.node.picture = img;
    });
  };
      
  v.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
