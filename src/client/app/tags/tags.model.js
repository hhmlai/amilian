'use strict';

angular.module('tcApp2App')
.factory('tagsModel', function ($rootScope, $modal, db, utils) {

  var m = {};
  m.allTags = [];
  m.activeTag = null;

  m.getAllTags = db.rel.find('tags') 
        .then (function(res) {
          m.allTags = res.tags;
          $rootScope.$apply();
          console.log('got tags')
          return true
        })
        .catch (function(err) {
          console.log(err);
          return false
        });

  m.newTag = function () {
      var modalInstance = $modal.open({
          templateUrl: 'app/tags/tag.edit.html',
          controller: 'tagEditCtrl as tagEC',
          resolve: {
            tag: function() {return {id: (new Date().toISOString() + '_admin')}}
          }
      });
      modalInstance.result.then(function (doc) {
          m.updateTag(doc);
      });
  };


  m.tag = function(docId) {
    return utils.findDocById(m.allTags , docId);
  };


  m.updateTag = function(doc) {
      db.rel.save('tag', doc)
        .then (function() {
          var index = utils.findIndexById(m.allTags, doc.id)
          if (index > -1) {
            m.allTags.splice(index, 1, doc)
          } else {
          m.allTags.push(doc);            
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

  m.removeTag = function(doc, callback) {
    var index = m.allTags.indexOf(doc);
    db.rel.del('tag', doc)
        .then (function() {
          m.allTags.splice(index, 1);
          callback()
          return true; 
        })
        .catch(function(err) {
          console.log(err)
          return false;
        })
      ;

  };


  m.setActiveTag = function(docId) {
    console.log(docId);
    m.activeTag = utils.findDocById(m.allTags, docId);
    if (m.activeTag === null) {
      return false
    } else {
      return true
    } 
  };

  return m

});
