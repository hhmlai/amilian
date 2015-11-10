'use strict';

angular.module('tcApp2App')
.factory('relsModel', function ($rootScope, peopleModel, placesModel, docsModel, $uibModal, $stateParams, db, utils) {
  
  var m = {};
  m.allRels = [];
  m.activeRel = null;
  console.log(placesModel.allPlaces)

  m.relTypes = [
    {  id: "refPessoa",
       name: "Referência a uma pessoa",
       fields: [
          {key: "person", type: 'ui-select-single', label: 'Nome da Pessoa', options: peopleModel.allPeople, required: true}, 
          {key: "obs", type: 'input', label: 'Observações', required: true}, 
          {key: "refStart", type: 'input', label: 'Momento da entrevista (s)', required: false}, 
          {key: "refLenght", type: 'input', label: 'Duração da referência (s)', required: false}, 
       ]
     },
    {  id: "refPlace",
       name: "Referência a um local",
       fields: [
          {key: "place", type: 'ui-select-single', label: 'Nome do Local', options: placesModel.allPlaces, required: true}, 
          {key: "relPlace", type: 'ui-select-single', label: 'Relação com o documento', options: placesModel.types, required: true}, 
          {key: "obs", type: 'input', label: 'Observações', required: true}, 
          {key: "btn", type: 'button', label: 'Clica-me', text: 'OK', onClick: function() {alert('You clicked me!')}}, 
          {key: "refStart", type: 'input', label: 'Momento da entrevista (s)', required: false}, 
          {key: "refLenght", type: 'input', label: 'Duração da referência (s)', required: false}, 
       ]
     },
    {  id: "refPessoaLocal",
       name: "Referência a uma pessoa num local",
       fields: [
          {key: "people", type: 'ui-select-single', label: 'Nome da Pessoa', options: peopleModel.allPeople, required: true}, 
          {key: "relation", type: 'input', label: 'Relação da pessoa com o local', required: true}, 
          {key: "place", type: 'ui-select-single', label: 'Local referênciado', options: placesModel.allPlaces, required: true}, 
          {key: "refStart", type: 'input', label: 'Momento da entrevista (s)', required: false}, 
          {key: "refLenght", type: 'input', label: 'Duração da referência (s)', required: false}, 
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
  ]
            
 
  m.newRel = function (relTypeId, docId, callback) {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/relationships/relationship.edit.html',
      controller: 'relEditCtrl as relEC',
      size: 'lg',
      resolve: {
        rel:  {
              id: (new Date().toISOString() + '_admin'),
              docId: docId,
              relTypeId: relTypeId 
        },
        new: true,
      }
    });
    modalInstance.result.then(function (rel) {
      console.log(rel)
      m.updateRel(rel);
      if (callback) {callback(rel)}
    });
    return {
    }
 };
  
  m.getAllRels = db.rel.find('relationships') 
          .then (function(res) {
            m.allRels = res.relationships;
            $rootScope.$apply();
            console.log('got Rels')
            return true
          })
          .catch (function(err) {
            console.log(err);
            return false
          })

  m.getRel = function(docId) {
    console.log(m.allRels)
    console.log(docId)
    return utils.findDocById(m.allRels , docId);
  };


 m.editRel = function(rel, callback){
    var modalInstance = $uibModal.open({
      templateUrl: 'app/relationships/relationship.edit.html',
      controller: 'relEditCtrl as relEC',
      size: 'lg',
      resolve: {
        rel:  rel
      }
    });
    modalInstance.result.then(function (rel) {
      m.updateRel(rel);
      if (callback) {callback()}
    });
  };

  m.updateRel = function(rel, callback) {
      db.rel.save('relationship', rel)
        .then (function() {
          var index = utils.findIndexById(m.allRels, rel.id)
          if (index > -1) {
            m.allRels.splice(index, 1, rel)
          } else {
            m.allRels.push(rel);            
          };
          if (callback) {callback()}
          return true
        })
        .catch(function(err) {
          console.log(err);
          return false; 
        })
      ;
  };

  m.removeRel = function(rel, callback) {
    var index = utils.findIndexById(m.allRels, rel.id);
    db.rel.del('relationship', rel)
        .then (function() {
          m.allRels.splice(index, 1);
          if (callback) {callback()}
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
