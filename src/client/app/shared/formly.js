'use strict';

angular.module('tcApp2App')

  .run(function (formlyConfig) {
    // NOTE: This next line is highly recommended. Otherwise Chrome's autocomplete will appear over your options!
    formlyConfig.extras.removeChromeAutoComplete = true

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


    function camelize(string) {
      string = string.replace(/[\-_\s]+(.)?/g, function (match, chr) {
        return chr ? chr.toUpperCase() : '';
      });
      // Ensure 1st char is always lowercase
      return string.replace(/^([A-Z])/, function (match, chr) {
        return chr ? chr.toLowerCase() : '';
      });
    }


    var ngModelAttrs = {};

    angular.forEach(attributes, function (attr) {
      ngModelAttrs[camelize(attr)] = { attribute: attr };
    });

    angular.forEach(bindings, function (binding) {
      ngModelAttrs[camelize(binding)] = { bound: binding };
    });

    var uiSelectSingle = '<ui-select data-ng-model="model[options.key]" data-required="{{to.required}}" data-disabled="{{to.disabled}}" theme="bootstrap"><ui-select-match placeholder="{{to.placeholder}}" data-allow-clear="true">{{$select.selected[to.labelProp]}}</ui-select-match><ui-select-choices data-repeat="option[to.valueProp] as option in to.options | filter: $select.search"><div ng-bind-html="option[to.labelProp] | highlight: $select.search"></div></ui-select-choices></ui-select>'

    var uiSelectMultiple = '<ui-select multiple data-ng-model="model[options.key]" data-required="{{to.required}}" data-disabled="{{to.disabled}}" theme="bootstrap"><ui-select-match placeholder="{{to.placeholder}}">{{$item[to.labelProp]}}</ui-select-match><ui-select-choices data-repeat="option[to.valueProp] as option in to.options | filter: $select.search"><div ng-bind-html="option[to.labelProp] | highlight: $select.search"></div></ui-select-choices></ui-select></script>'

    // Configure custom types
    formlyConfig.setType({
      name: 'ui-select-single',
      extends: 'select',
      template: uiSelectSingle
    });
    formlyConfig.setType({
      name: 'ui-select-multiple',
      extends: 'select',
      template: uiSelectMultiple
    });
    formlyConfig.setType({
      name: 'link-table',
      templateUrl: 'app/shared/templates/link-table.html',
      controller: 'linkTableCtrl as ltC'
    });
    formlyConfig.setType({
      name: 'link-select',
      templateUrl: 'app/shared/templates/link-select.html',
      controller: 'linkSelectCtrl as lsC'
    });
    formlyConfig.setType({
      name: 'datepicker',
      templateUrl: 'app/shared/templates/datepicker.html',
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
          $scope.datepicker.opened = !$scope.datepicker.opened;
        };
      }]
    });

  });

