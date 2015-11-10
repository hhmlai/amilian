'use strict';

angular.module('tcApp2App')
.factory('placesModel', function ($rootScope, $timeout, $uibModal, $stateParams, db, utils) {

  var m = {};
  m.allPlaces = [];
  m.activePlace = null;
  m.countries = [
    {
        lat: -8.5585,
        lng: 125.5782,
        zoom: 7,
        message: "Timor-Leste",
        draggable: true
    },
    {
        lat: 39.3999,
        lng: -8.2245,
        zoom: 6,
        message: "Portugal",
        draggable: true      
    }]
 
 m.types = [{id:0, name: "Local da entrevista"}, {id: 1, name: "Local referênciado"}, {id: 2, name: "Outro"}];

m.newPlace = function (role) {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/places/place.edit.html',
      controller: 'plcEditCtrl as plcEC',
      size: 'lg',
      resolve: {
        place:  {
              id: (new Date().toISOString() + '_admin'),
        }
      }
    });
    modalInstance.result.then(function (doc) {
      m.updatePlace(doc);
    });
    return {
    }
  };
  
 m.editPlace = function(placeId){
    var modalInstance = $uibModal.open({
      templateUrl: 'app/places/place.edit.html',
      controller: 'plcEditCtrl as plcEC',
      size: 'lg',
      resolve: {
        place:  m.getPlace(placeId),
      }
    });
    modalInstance.result.then(function (doc) {
      m.updatePlace(doc);
    });
  };


  m.getAllPlaces = db.rel.find('places') 
        .then (function(res) {
          m.allPlaces = res.places;
          $rootScope.$apply();
          console.log('got places')
          return true
        })
        .catch (function(err) {
          console.log(err);
          return false
        })
    ;
  

  m.getPlace = function(docId) {
    return utils.findDocById(m.allPlaces , docId);
  };

  m.updatePlace = function(doc) {
      db.rel.save('place', doc)
        .then (function() {
          var index = utils.findIndexById(m.allPlaces, doc.id)
          if (index > -1) {
            m.allPlaces.splice(index, 1, doc)
          } else {
          m.allPlaces.push(doc);            
          };
          $timeout(function(){$rootScope.$apply()}, 100);
          return true
        })
        .catch(function(err) {
          console.log(err);
          return false; 
        })
      ;
  };

  m.removePlace = function(doc, callback) {
    var index = m.allPlaces.indexOf(doc);
    db.rel.del('place', doc)
        .then (function() {
          console.log(m.allPlaces.indexOf(doc));
          m.allPlaces.splice(index, 1);
          callback();
          return true; 
        })
        .catch(function(err) {
          console.log(err)
          return false;
        })
      ;

  };

  m.setActivePlace = function(docId) {
    m.activePlace = utils.findDocById(m.allPlaces, docId);
    if (m.activePlace === null) {
      return false
    } else {
      return true
    } 
  }; 


  return m

});
