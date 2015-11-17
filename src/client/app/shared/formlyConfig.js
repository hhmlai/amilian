'use strict';
angular.module('tcApp2App')

 .run(function(formlyConfig, nodesModel, $uibModal) {
   var selectSingleTemplate = '<div class="input-group"><ui-select class="form-control" data-ng-model="model[options.key]" data-required="{{to.required}}" data-disabled="{{to.disabled}}" theme="bootstrap"><ui-select-match placeholder="{{to.placeholder}}" data-allow-clear="true">{{$select.selected[to.labelProp]}}</ui-select-match><ui-select-choices data-repeat="{{to.ngOptions}}"><div ng-bind-html="option[to.labelProp] | highlight: $select.search"></div></ui-select-choices></ui-select><span class="input-group-btn"><button class="btn btn-sm glyphicon glyphicon-plus align-right" ng-click="newNode()"></button></span></div>'
   var selectMultipleTemplate = '<div class="input-group"><ui-select class="form-control" multiple data-ng-model="model[options.key]" data-required="{{to.required}}" data-disabled="{{to.disabled}}" theme="bootstrap"><ui-select-match placeholder="{{to.placeholder}}">{{$item[to.labelProp]}}</ui-select-match><ui-select-choices data-repeat="{{to.ngOptions}}"><div ng-bind-html="option[to.labelProp] | highlight: $select.search"></div></ui-select-choices></ui-select><span class="input-group-btn"><button class="btn btn-sm glyphicon glyphicon-plus align-right" ng-click="newNode()"></button></span></div>'
   var defaultOptions = {
        templateOptions: {
              valueProp: 'id',
              labelProp: 'name',
              options: [],
              ngOptions: 'option[to.valueProp] as option in to.options | filter: $select.search'
        }
   }
   
   formlyConfig.templateManipulators.preWrapper.push(function (template, options, scope) {
      if (scope.formState.readOnly) {
        options.noFormControl = true;
      }
      return template;
    });
    
        // Replace formlyBootstrap input field type to implement read-only forms
    formlyConfig.setType({
      name: 'input',
      template: '<div><input ng-if="!formState.readOnly" class="form-control" ng-model="model[options.key]"><p ng-if="formState.readOnly" class="form-control-static">{{model[options.key]}}</p></div>',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
  
    formlyConfig.setType({
      name: 'selectMultipleNodes',
	    wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      template: selectMultipleTemplate,      
      defaultOptions: defaultOptions,
      controller: function($scope) {
                $scope.to.options = nodesModel.getNodes($scope.to.typeId);
                $scope.newNode = function() {
                  nodesModel.newNode($scope.to.typeId, function(doc) {
                    $scope.to.options.push(doc)
                  })
                }
      }
    });
    
            
    formlyConfig.setType({
      name: 'selectSingleNode',
	    wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      template: selectSingleTemplate,      
      defaultOptions: defaultOptions,
      controller: function($scope) {
                $scope.to.options = nodesModel.getNodes($scope.to.typeId);
                $scope.newNode = function() {
                  nodesModel.newNode($scope.to.typeId, function(doc) {
                    $scope.to.options.push(doc)
                  })
                }
      }
    });
    
    formlyConfig.setType({
      name: 'profileImage',
      template: '<img class="img-circle" ng-src="{{model[options.key]}}"/><button class="btn btn-info btn-xs" ng-click="addProfileImage()">Alterar imagem</button>',      
      defaultOptions: defaultOptions,
      controller: function($scope) {
                $scope.addProfileImage = function() {
                  var modalInstance = $uibModal.open({
                    templateUrl: 'app/shared/crop/crop.html',
                    controller: 'cropCtrl as cropC',
                    size: 'lg'
                  });
                  modalInstance.result.then(function (img) {
                    console.log('fechar') 
                    $scope.model[$scope.options.key] = img;
                  });
                };
              

      }
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