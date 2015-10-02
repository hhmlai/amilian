'use strict';

angular.module('tcApp2App')
.factory('relationshipsModel', function ($rootScope, $modal, $stateParams, db, utils) {

  var m = {};
  m.allRels = [];
  
  var relMap = [
    {name : "PESSOA entrevistada por PESSOA, num LOCAL, numa DATA",
     models: {
       entrevistado: {origin: "peopleModel.allPeople", multiple: false, required: true}, 
       entrevistador: {origin: "peopleModel.allPeople", multiple: false, required: false},
       local: {origin: "placesModel.allPlaces", multiple: false, required: false},
       data: {type: "date", multiple: false, required: false}
       },
     formlyTplt: {}
    },
    {name : "PESSOA participou num ACONTECIMENTO citando PESSOA",
     models: {entrevistado: {origin: "peopleModel.allPeople", multiple: false}, entrevistador: {origin: "peopleModel.allPeople", multiple: false}},
     formlyTplt: {}
    },
    {name : "PESSOA nasceu num LOCAL numa DATA",
     models: {entrevistado: {origin: "peopleModel.allPeople", multiple: false}, entrevistador: {origin: "peopleModel.allPeople", multiple: false}},
     formlyTplt: {}
    }
  ]
 
  m.newRel = function (type) {
    var modalInstance = $modal.open({
      templateUrl: 'app/places/place.edit.html',
      controller: 'plcEditCtrl as plcEC',
      resolve: {
        rel:  {
              id: (new Date().toISOString() + '_admin'),
        }
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
      templateUrl: 'app/places/place.edit.html',
      controller: 'plcEditCtrl as plcEC',
      size: 'lg',
      resolve: {
        rel:  m.getRel(id),
      }
    });
    modalInstance.result.then(function (doc) {
      m.updateRel(doc);
    });
  };


  m.getAllRels = function() {
    db.rel.find('relationships') 
        .then (function(res) {
          m.allRels = res.relationships;
          $rootScope.$apply();
          return true
        })
        .catch (function(err) {
          console.log(err);
          return false
        })
    ;
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
