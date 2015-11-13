'use strict'; 

angular.module('tcApp2App')
.controller('nodeEditCtrl', function (node, nodeType, $scope, $uibModal, $window, nodesModel, $uibModalInstance) {

  var v = this;

  v.m = nodesModel
  v.node = node
  
      v.nodeFields = getFormlyFields(nodeType)
    
    function getFormlyFields(nodeType) {
      var res = []
      if (nodeType !== -1) {
        nodeType.fields.forEach(function(el){
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
