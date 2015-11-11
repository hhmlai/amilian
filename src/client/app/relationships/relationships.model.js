'use strict';

angular.module('tcApp2App')
.factory('relsModel', function ($rootScope, peopleModel, placesModel, docsModel, $uibModal, $stateParams, db, utils) {
  
  var m = {};
  m.allRels = [];
  m.activeRel = null;
  
  console.log(placesModel.allPlaces)

            
 
  m.newRel = function (relType, docId, callback) {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/relationships/relationship.edit.html',
      controller: 'relEditCtrl as relEC',
      size: 'lg',
      resolve: {
        relType: relType, 
        rel:  {
              id: (new Date().toISOString() + '_admin'),
              docId: docId,
              relTypeId: relType.id
        }
      }
    });
    modalInstance.result.then(function (rel) {
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

  m.getRel = function(relId) {
    return utils.findDocById(m.allRels , relId);
  };
  

 m.editRel = function(relId, relType, callback){   
    var modalInstance = $uibModal.open({
      templateUrl: 'app/relationships/relationship.edit.html',
      controller: 'relEditCtrl as relEC',
      size: 'lg',
      resolve: {
        relType: relType, 
        rel:  m.getRel(relId)
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
          $rootScope.$apply();
          return true
        })
        .catch(function(err) {
          console.log(err);
          return false; 
        })
      ;
  };

  m.removeRel = function(relId, callback) {
    db.rel.del('relationship', m.getRel(relId))
        .then (function() {
          m.allRels.splice(utils.findIndexById(m.allRels, relId), 1);
          if (callback) {callback()}
          $rootScope.$apply();
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
