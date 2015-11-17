'use strict';
angular.module('tcApp2App')

.service('formlyUtils', function(nodesModel, peopleModel, placesModel) {
  return {  
   selectTypes: function(typeId) {
     console.log('a carregar listas')
     if (typeId === 'person') {
       return {
            key: 'person',
            type: 'ui-select-single',
            options: [], 
            addonRight: {
              class: 'glyphicon glyphicon-plus',
              onClick: function() {nodesModel.newNode('person')}
            },
            controller: function($scope) {
                $scope.to.options = nodesModel.getNodes('person');
            }
        }
      } else if (typeId === 'people') {
        return {
        key: 'people',
        type: 'ui-select-multiple',
            options: nodesModel.getNodes('person'), 
            addonRight: {
              class: 'glyphicon glyphicon-plus',
              onClick: function() {nodesModel.newNode('person')}
            }
        }
      } else if (typeId === 'place') {
        return {
            key: "place", 
            type: 'ui-select-single',
            label: 'Nome do Lugar', 
            options: placesModel.allPlaces, 
            required: true,
            addonRight: {
              class: 'glyphicon glyphicon-plus',
              onClick: function() {placesModel.newPlace()}
            }
        }  
      }
  },  
  getFields: function(typeParams) {
                              var res = []
                              if (typeParams) {
                                typeParams.fields.forEach(function(el){
                                  if ((el.type === 'ui-select-single') || (el.type === 'ui-select-person') || (el.type === 'ui-select-multiple')) {
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
                                    console.log('outro')
                                    console.log(el)
                                    res.push({ 
                                      key: el.key,
                                      type: el.type,
                                      templateOptions: el.templateOptions
                                    })          
                                  }
                                })
                              }
                              return res   
                    }
  }
 })

 .run(function(formlyConfig, nodesModel) {
   
    formlyConfig.setType({
      name: 'ui-select-single',
      extends: 'select',
      template: '<ui-select data-ng-model="model[options.key]" data-required="{{to.required}}" data-disabled="{{to.disabled}}" theme="bootstrap"><ui-select-match placeholder="{{to.placeholder}}" data-allow-clear="true">{{$select.selected[to.labelProp]}}</ui-select-match><ui-select-choices data-repeat="{{to.ngOptions}}"><div ng-bind-html="option[to.labelProp] | highlight: $select.search"></div></ui-select-choices></ui-select>',
    });
    
    formlyConfig.setType({
      name: 'ui-select-person',
      extends: 'select',
      template: '<ui-select data-ng-model="model[options.key]" data-required="{{to.required}}" data-disabled="{{to.disabled}}" theme="bootstrap"><ui-select-match placeholder="{{to.placeholder}}" data-allow-clear="true">{{$select.selected[to.labelProp]}}</ui-select-match><ui-select-choices data-repeat="option[to.valueProp] as option in to.options | filter: $select.search"><div ng-bind-html="option[to.labelProp] | highlight: $select.search"></div></ui-select-choices></ui-select>',
      defaultOptions: {
        templateOptions: {
              optionsAttr: 'bs-options',
              valueProp: 'id',
              labelProp: 'name',
              options: ['aaa'],
              addonRight: {
                class: 'glyphicon glyphicon-plus',
                onClick: function() {nodesModel.newNode('person')}
              }
        }
      },
      controller: function($scope) {
                $scope.to.options = nodesModel.getNodes('person');
                console.log('controlador formly')
      }
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