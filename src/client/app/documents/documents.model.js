'use strict'; 

angular.module('tcApp2App')
.factory('docsModel', function ($rootScope, $http, $stateParams, db, utils, placesModel) {
  
  var m = {};
  m.allDocs = {};
  m.activeDoc = null;
  
  m.getAllDocs = db.rel.find('documents') 
        .then (function(res) {
          m.allDocs = res.documents;
          m.setActiveDoc($stateParams.docId);
          $rootScope.$apply();
          console.log('got documents')
          return true
        })
        .catch (function(err) {
          console.log(err);
          return false
        })
    ;
 
  m.types = ['entrevista','documentário','documento'];
  m.languages = [{name: 'Portugues', code: 'pt'}, {name: 'Tetum', code: 'tet'}, {name: 'Ingles', code: 'en'}]

  m.doc = function(docId) {
    return utils.findDocById(m.allDocs , docId);
  };

  m.addDoc = function(obj) {
    db.rel.save('document', obj)
        .then (function() {
          m.allDocs.push(obj);
          $rootScope.$apply()
        })
        .catch(function(err) {
          console.log(err);
          return false;
        })
    ;
  };

  m.updateDoc = function(doc) {
      db.rel.save('document', doc)
        .then (function() {
          m.allDocs.splice(utils.findIndexById(m.allDocs, doc.id), 1, doc);
          $rootScope.$apply();
        })
        .catch(function(err) {
                    console.log(err)

        })
      ;
  };

  m.removeDoc = function(doc, callback) {
    var index = m.allDocs.indexOf(doc);
    db.rel.del('document', doc)
        .then (function() {
          console.log(m.allDocs.indexOf(doc));
          m.allDocs.splice(index, 1);
          callback()
          return true; 
        })
        .catch(function(err) {
          console.log(err)
          return false;
        })
      ;

  };

  m.setActiveDoc = function(docId) {
    m.activeDoc = utils.findDocById(m.allDocs, docId);
    if (m.activeDoc === null) {
      return false
    } else {
      return true
    } 
  };

  m.saveActiveDoc = function() {
    return m.updateDoc(m.activeDoc)
  }

  m.newDoc = function() {
    var newDoc = {
      id: (new Date().toISOString() + '_admin'),
      languages: [m.languages[0]],
      attach: {},
      videos: {},
      rels: {}
    };
    return  newDoc
  };

  return m
    
})