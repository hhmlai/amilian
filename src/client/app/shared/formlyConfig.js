'use strict';
angular.module('tcApp2App')

 .run(function(formlyConfig) {
   
     var attributes = [
    'date-disabled',
    'custom-class',
    'show-weeks',
    'starting-day',
    'init-date',
    'min-mode',
    'max-mode',
    'format-day',
    'format-month',
    'format-year',
    'format-day-header',
    'format-day-title',
    'format-month-title',
    'year-range',
    'shortcut-propagation',
    'datepicker-popup',
    'show-button-bar',
    'current-text',
    'clear-text',
    'close-text',
    'close-on-date-selection',
    'datepicker-append-to-body'
  ];

  var bindings = [
    'datepicker-mode',
    'min-date',
    'max-date'
  ];

  var ngModelAttrs = {};

  angular.forEach(attributes, function(attr) {
    ngModelAttrs[camelize(attr)] = {attribute: attr};
  });

  angular.forEach(bindings, function(binding) {
    ngModelAttrs[camelize(binding)] = {bound: binding};
  });
  
       
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
        name: 'datepicker',
        template:  '<div ng-switch="datepickerMode" role="application" ng-keydown="keydown($event)"><uib-daypicker ng-switch-when="day" tabindex="0"></uib-daypicker><uib-monthpicker ng-switch-when="month" tabindex="0"></uib-monthpicker><uib-yearpicker ng-switch-when="year" tabindex="0"></uib-yearpicker></div>',
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        defaultOptions: {
          ngModelAttrs: ngModelAttrs,
          templateOptions: {
            datepickerOptions: {
              format: 'MM.dd.yyyy',
              initDate: new Date()
            }
          }
        },
        controller: ['$scope', function ($scope) {
          $scope.datepicker = {};
    
          $scope.datepicker.opened = false;
    
          $scope.datepicker.open = function ($event) {
            $scope.datepicker.opened = true;
          };
        }]
      });
       
       
     function camelize(string) {
    string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
    // Ensure 1st char is always lowercase
    return string.replace(/^([A-Z])/, function(match, chr) {
      return chr ? chr.toLowerCase() : '';
    });
  }
                       
  })