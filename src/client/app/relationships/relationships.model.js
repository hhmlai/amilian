'use strict';

angular.module('tcApp2App')
.factory('relsModel', function ($rootScope, peopleModel, placesModel, $modal, $stateParams, db, utils) {
  
  console.log('pessoas-inicial')
  console.log(peopleModel.allPeople)
  var people = peopleModel

  var m = {};
  m.relTypes = [
    {  id: "perIntPeo",
       name: "Dados Entrevista",
       description: "PESSOA entrevistada por PESSOAS, num LOCAL, numa DATA",
       fields: getFormlyFields([
          {key: "entrevistado", type: 'ui-select-single', label: 'Entrevistado', options: people.getAllPeople, required: true}, 
       ])
     },
    {  id: "perIntPeo1",
       name: "Dados Entrevista",
       description: "PESSOA entrevistada por PESSOAS, num LOCAL, numa DATA",
       fields: getFormlyFields([
          {key: "entrevistado", type: 'ui-select-single', label: 'Entrevistado', options: peopleModel.allPeople, required: true}, 
          {key: "entrevistadores", type: 'ui-select-multiple', label: 'Entrevistadores', options: people.allPeople, required: false},
          {key: "local", type: 'ui-select-single', label: 'Entrevistado', origin: "placesModel.allPlaces", required: false},
          {key: "date",  type: "date", label: 'data da entrevista', required: false}
       ])
       
     }
  ]
    
  function getFormlyFields(fieldsArr) {
      var res = []
      fieldsArr.forEach(function(el){
        if ((el.type === 'ui-select-single') || (el.type === 'ui-select-multiple')) {
          res.push({ 
            key: el.key,
            type: el.type,
            templateOptions: {
              optionsAttr: 'bs-options',
              ngOptions: 'option[to.valueProp] as option in to.options() | filter: $select.search',
              label: el.label,
              valueProp: 'id',
              labelProp: 'name',
              options: el.options,
              required: el.required
            }
          })
          console.log('pessoas:')
          console.log(el.options)
        } else {
          res.push({ 
            key: el.key,
            type: el.type,
            templateOptions: {
              label: el.label,
              required: el.required
            }
          })          
        }
      })
      console.log(res)
      return res   
  }
        
  
   var fields = [
      {
        key: 'text',
        type: 'input',
        templateOptions: {
          label: 'Text',
          placeholder: 'Formly is terrific!'
        }
      },
      {
        key: 'nested.story',
        type: 'textarea',
        templateOptions: {
          label: 'Some sweet story',
          placeholder: 'It allows you to build and maintain your forms with the ease of JavaScript :-)',
          description: ''
        },
        expressionProperties: {
          'templateOptions.focus': 'formState.awesomeIsForced',
          'templateOptions.description': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'And look! This field magically got focus!';
            }
          }
        }
      },
      {
        key: 'awesome',
        type: 'checkbox',
        templateOptions: { label: '' },
        expressionProperties: {
          'templateOptions.disabled': 'formState.awesomeIsForced',
          'templateOptions.label': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'Too bad, formly is really awesome...';
            } else {
              return 'Is formly totally awesome? (uncheck this and see what happens)';
            }
          }
        }
      },
      {
        key: 'whyNot',
        type: 'textarea',
        expressionProperties: {
          'templateOptions.placeholder': function(viewValue, modelValue, scope) {
            if (scope.formState.awesomeIsForced) {
              return 'Too bad... It really is awesome! Wasn\'t that cool?';
            } else {
              return 'Type in here... I dare you';
            }
          },
          'templateOptions.disabled': 'formState.awesomeIsForced'
        },
        hideExpression: 'model.awesome',
        templateOptions: {
          label: 'Why Not?',
          placeholder: 'Type in here... I dare you'
        },
        watcher: {
          listener: function(field, newValue, oldValue, formScope, stopWatching) {
            if (newValue) {
              stopWatching();
              formScope.model.awesome = true;
              formScope.model.whyNot = undefined;
              field.hideExpression = null;
              formScope.options.formState.awesomeIsForced = true;
            }
          }
        }
      },
      {
        key: 'custom',
        type: 'custom',
        templateOptions: {
          label: 'Custom inlined',
        }
      },
      {
        key: 'exampleDirective',
        template: '<div example-directive></div>',
        templateOptions: {
          label: 'Example Directive',
        }
      }
    ];
    
    
 
  m.newRel = function (relTypeId, docId) {
    var modalInstance = $modal.open({
      templateUrl: 'app/relationships/relationship.edit.html',
      controller: 'relEditCtrl as relEC',
      size: 'lg',
      resolve: {
        rel:  {
              id: (new Date().toISOString() + '_admin'),
              document: docId,
              relTypeId: relTypeId 
        },
        new: true,
      }
    });
    modalInstance.result.then(function (doc) {
      m.updateRel(doc);
    });
    return {
    }
 };
  
 m.editRel = function(id){
    var modalInstance = $modal.open({
      templateUrl: 'app/relationships/relationship.edit.html',
      controller: 'relEditCtrl as relEC',
      size: 'lg',
      resolve: {
        rel:  m.getRel(id),
      }
    });
    modalInstance.result.then(function (doc) {
      m.updateRel(doc);
    });
  };


  m.getAllRels = function(callback) {
      db.rel.find('relationships') 
          .then (function(res) {
            m.allRels = res.relationships;
            $rootScope.$apply();
            callback()
            return true
          })
          .catch (function(err) {
            console.log(err);
            return false
          })
  };

  m.getRel = function(docId) {
    return utils.findDocById(m.allRels , docId);
  };

  m.updateRel = function(doc) {
      db.rel.save('relationship', doc)
        .then (function() {
          var index = utils.findIndexById(m.allRels, doc.id)
          if (index > -1) {
            m.allRels.splice(index, 1, doc)
          } else {
            m.allRels.push(doc);            
          };
          return true
        })
        .catch(function(err) {
          console.log(err);
          return false; 
        })
      ;
  };

  m.removeRel = function(doc, callback) {
    var index = m.allRels.indexOf(doc);
    db.rel.del('relationship', doc)
        .then (function() {
          m.allRels.splice(index, 1);
          callback();
          return true; 
        })
        .catch(function(err) {
          console.log(err)
          return false;
        })
      ;

  };

  return m

});
