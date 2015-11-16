'use strict'; 

angular.module('tcApp2App')
.controller('linkEditCtrl', function ($scope, link, formlyUtils, linkType, peopleModel, placesModel, $uibModal, $window, linksModel, $uibModalInstance, utils) {

  var v = this;

  var linkTypes = {
    refPlace:
            {  id: "refPlace",
              name: "Referência a um local",
              fields: [
                  angular.extend({
                    label: 'Nome do Local', 
                    required: true
                    }, formlyUtils.selectTypes('place')), 
                  {key: "relPlace", type: 'ui-select-single', label: 'Relação com o documento', options: placesModel.types, required: true}, 
                  {key: "obs", type: 'input', label: 'Observações', required: true}, 
                  {key: "refStart", type: 'input', label: 'Momento da entrevista (s)', required: false}, 
                  {key: "refLenght", type: 'input', label: 'Duração da referência (s)', required: false}
              ]
            },
      refPessoaLocal:
            {  id: "refPessoaLocal",
              name: "Referência a pessoas num local",
              fields: [
                  angular.extend({
                    label: 'Nome da Pessoa', 
                    required: true
                    }, formlyUtils.selectTypes('person')),           
                angular.extend({
                    key: "place", 
                    label: 'Nome do Local', 
                    required: true
                    }, formlyUtils.selectTypes('place')), 
                ]
            },
     dadosEntrevista:
            {  id: "dadosEntrevista",
              name: "Dados Entrevista Completo",
              unique: true,
              description: "PESSOA entrevistada por PESSOAS, num LOCAL, numa DATA",
              fields: [
                  {key: "entrevistado", type: 'ui-select-single', label: 'Entrevistado', options: peopleModel.allPeople, required: true}, 
                  {key: "entrevistadores", type: 'ui-select-multiple', label: 'Entrevistadores', options: peopleModel.allPeople, required: false},
                  {key: "local", type: 'ui-select-single', label: 'Local da Entrevista', options: placesModel.allPlaces, required: false},
                  {key: "date",  type: "input", label: 'data da entrevista', required: false}
              ]       
            }
  }   
  
  v.m = linksModel
  v.link = link
  
  v.linkFields = formlyUtils.getFields(linkTypes[link.typeId])
  console.log(v.linkFields)

  v.ok = function () {
      $uibModalInstance.close(v.link);
  };
  
        
  v.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
