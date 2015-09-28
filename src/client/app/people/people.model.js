'use strict';

angular.module('tcApp2App')
.factory('peopleModel', function ($rootScope, $modal, $stateParams, db, utils) {

  var m = {};
  m.allPeople = [];
  m.activePerson = null;

m.newPerson = function () {
    var modalInstance = $modal.open({
      templateUrl: 'app/people/person.edit.html',
      controller: 'perEditCtrl as perEC',
      size: 'lg',
      resolve: {
        person:  {
              id: (new Date().toISOString() + '_admin'),
        }
      }
    });
    modalInstance.result.then(function (doc) {
      m.updatePerson(doc);
    });
    return {
    }
  };
  
 m.editPerson = function(personId){
    var modalInstance = $modal.open({
      templateUrl: 'app/people/person.edit.html',
      controller: 'perEditCtrl as perEC',
      size: 'lg',
      resolve: {
        person:  m.getPerson(personId),
      }
    });
    modalInstance.result.then(function (doc) {
      m.updatePerson(doc);
    });
  };


  m.getAllPeople = function() {
    db.rel.find('people') 
        .then (function(res) {
          m.allPeople = res.people;
          $rootScope.$apply();
          console.log('got people')
          return true
        })
        .catch (function(err) {
          console.log(err);
          return false
        })
    ;
  };

  m.getPerson = function(docId) {
    return utils.findDocById(m.allPeople , docId);
  };

  m.updatePerson = function(doc) {
      db.rel.save('person', doc)
        .then (function() {
          var index = utils.findIndexById(m.allPeople, doc.id)
          if (index > -1) {
            m.allPeople.splice(index, 1, doc)
          } else {
          m.allPeople.push(doc);            
          };
          $rootScope.$apply();
          return true
        })
        .catch(function(err) {
          console.log(err);
          return false; 
        })
      ;
  };

  m.removePerson = function(doc, callback) {
    var index = m.allPeople.indexOf(doc);
    db.rel.del('person', doc)
        .then (function() {
          m.allPeople.splice(index, 1);
          callback()
          return true; 
        })
        .catch(function(err) {
          console.log(err)
          return false;
        })
      ;

  };

  m.setActivePerson = function(docId) {
    m.activePerson = utils.findDocById(m.allPeople, docId);
    if (m.activePerson === null) {
      return false
    } else {
      return true
    } 
  };

  return m

});
