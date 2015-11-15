'use strict';
angular.module('tcApp2App')

 .service('formlyTypes', function(nodesModel, peopleModel, placesModel) {
    var selectTypes = {
    person: {
            type: 'ui-select-single',
            options: nodesModel.getNodes('person'), 
            addonRight: {
              class: 'glyphicon glyphicon-plus',
              onClick: function() {nodesModel.newNode('person')}
            }
    },
    people: {
            type: 'ui-select-multiple',
            options: nodesModel.getNodes('person'), 
            addonRight: {
              class: 'glyphicon glyphicon-plus',
              onClick: function() {nodesModel.newNode('person')}
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
   return {nodes: 
            {person : 
              { id: "person",
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
              }
          },
          links: [
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

