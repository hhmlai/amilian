'use strict';
angular.module('tcApp2App')


 .service('formlyTypes', function(peopleModel, placesModel) {
    var selectTypes = {
    person: {
            type: 'ui-select-single',
            options: peopleModel.allPeople, 
            addonRight: {
              class: 'glyphicon glyphicon-plus',
              onClick: function() {peopleModel.newPerson()}
            }
    },
    people: {
            type: 'ui-select-multiple',
            options: peopleModel.allPeople, 
            addonRight: {
              class: 'glyphicon glyphicon-plus',
              onClick: function() {peopleModel.newPerson()}
            }
    },
    place: {
            key: "splace", 
            type: 'ui-select-single',
            label: 'Nome do Lugar', 
            options: placesModel.allPlaces, 
            required: true,
            addonRight: {
              class: 'glyphicon glyphicon-plus',
              onClick: function() {placesModel.newPlace()}
            }
    }  
  };
   return { nodes: [
              {
                id: "person",
                name: "Pessoa",
                fields: [
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
                  }
                ]  
              }],
          links: [
            {id: "refPessoa",
              name: "Referência a uma pessoa",
              fields: [
                  {key: "obs", type: 'input', label: 'Observações', required: true}, 
                  {key: "refStart", type: 'input', label: 'Momento da entrevista (s)', required: false}, 
                  {key: "refLenght", type: 'input', label: 'Duração da referência (s)', required: false}, 
              ]
            },
            {  id: "refPlace",
              name: "Referência a um local",
              fields: [
                  angular.extend({
                    key: "place", 
                    label: 'Nome do Local', 
                    required: true
                    }, selectTypes.place), 
                  {key: "relPlace", type: 'ui-select-single', label: 'Relação com o documento', options: placesModel.types, required: true}, 
                  {key: "obs", type: 'input', label: 'Observações', required: true}, 
                  {key: "refStart", type: 'input', label: 'Momento da entrevista (s)', required: false}, 
                  {key: "refLenght", type: 'input', label: 'Duração da referência (s)', required: false}
              ]
            },
            {  id: "refPessoaLocal",
              name: "Referência a pessoas num local",
              fields: [
                  angular.extend({
                    key: "person", 
                    label: 'Nome da Pessoas', 
                    required: true
                    }, selectTypes.people),           
                angular.extend({
                    key: "place", 
                    label: 'Nome do Local', 
                    required: true
                    }, selectTypes.place), 
                ]
            },
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
          ],         
      getFormlyFields: function(linkType) {
                              var res = []
                              if (linkType !== -1) {
                                linkType.fields.forEach(function(el){
                                  if ((el.type === 'ui-select-single') || (el.type === 'ui-select-multiple')) {
                                    res.push({ 
                                      key: el.key,
                                      type: el.type,
                                      templateOptions: {
                                        optionsAttr: 'bs-options',
                                        ngOptions: 'option[to.valueProp] as option in to.options | filter: $select.search',
                                        label: el.label,
                                        valueProp: 'id',
                                        labelProp: 'name',
                                        options: el.options,
                                        addonRight: el.addonRight, 
                                        required: el.required
                                      }
                                    })
                                  } else if (el.type === 'button') {
                                    res.push({ 
                                      key: el.key,
                                      type: el.type,
                                      templateOptions: {
                                        label: el.label,
                                        text: el.text,
                                        btnType: el.btnType,
                                        onClick: el.onClick,
                                        description: el.description
                                      }
                                    })          
                                  } else {
                                    res.push({ 
                                      key: el.key,
                                      type: el.type,
                                      templateOptions: {
                                        label: el.label,
                                        required: el.required,
                                      }
                                    })          
                                  }
                                })
                              }
                              return res   
                    }
  }
 })

 .run(function(formlyConfig) {
   
    formlyConfig.setType({
      name: 'ui-select-single',
      extends: 'select',
      template: '<ui-select data-ng-model="model[options.key]" data-required="{{to.required}}" data-disabled="{{to.disabled}}" theme="bootstrap"><ui-select-match placeholder="{{to.placeholder}}" data-allow-clear="true">{{$select.selected[to.labelProp]}}</ui-select-match><ui-select-choices data-repeat="{{to.ngOptions}}"><div ng-bind-html="option[to.labelProp] | highlight: $select.search"></div></ui-select-choices></ui-select>'
    });
    
    formlyConfig.setType({
      name: 'ui-select-multiple',
      extends: 'select',
      template: '<ui-select multiple data-ng-model="model[options.key]" data-required="{{to.required}}" data-disabled="{{to.disabled}}" theme="bootstrap"><ui-select-match placeholder="{{to.placeholder}}">{{$item[to.labelProp]}}</ui-select-match><ui-select-choices data-repeat="{{to.ngOptions}}"><div ng-bind-html="option[to.labelProp] | highlight: $select.search"></div></ui-select-choices></ui-select>'
    });
    
    formlyConfig.setType({
      name: 'button',
      template: '<div><button type="{{::to.type}}" class="btn btn-{{::to.btnType}}" ng-click="onClick($event)">{{to.text}}</button></div>',
      wrapper: ['bootstrapLabel'],
      defaultOptions: {
        templateOptions: {
          btnType: 'default',
          type: 'button'
        },
        extras: {
          skipNgModelAttrsManipulator: true // <-- perf optimazation because this type has no ng-model
        }
      },
      controller: function($scope) {
        $scope.onClick = onClick;

        function onClick($event) {
          if (angular.isString($scope.to.onClick)) {
            return $scope.$eval($scope.to.onClick, {$event: $event});
          } else {
            return $scope.to.onClick($event);
          }
        }
      },
      apiCheck: function(check) {
        return {
          templateOptions: {
            onClick: check.oneOfType([check.string, check.func]),
            type: check.string.optional,
            btnType: check.string.optional,
            text: check.string
          }
        }
      }
    });
  })