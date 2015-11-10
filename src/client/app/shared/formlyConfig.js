'use strict';
angular.module('tcApp2App')

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
                       
  })