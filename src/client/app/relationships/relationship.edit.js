'use strict'; 

angular.module('tcApp2App')
.controller('relEditCtrl', function (rel, peopleModel, placesModel, $scope, $modal, $window, relsModel, $modalInstance, utils) {

  var v = this;

  v.m = relsModel
  v.rel = rel
  console.log('cheguei...')
  console.log(rel)
  v.relFields = getFormlyFields(utils.findDocById(v.m.relTypes, rel.relTypeId))

  v.ok = function () {
      $modalInstance.close(v.rel);
  };
  
 function getFormlyFields(relType) {
      var res = []
      if (relType !== -1) {
        relType.fields.forEach(function(el){
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
                required: el.required
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
      console.log(res)
      return res   
  }

        
  v.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
