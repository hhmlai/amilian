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