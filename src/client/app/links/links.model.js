'use strict';

angular.module('tcApp2App')
.factory('linksModel', function ($rootScope, peopleModel, placesModel, docsModel, $uibModal, $stateParams, db, utils) {
  
  var m = {};
  m.allLinks = [];
  m.activeLink = null;
  

            
  m.newLink = function (linkType, docId, callback) {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/links/link.edit.html',
      controller: 'linkEditCtrl as linkEC',
      size: 'lg',
      resolve: {
        linkType: linkType, 
        link:  {
              id: (new Date().toISOString() + '_admin'),
              docId: docId,
              linkTypeId: linkType.id
        }
      }
    });
    modalInstance.result.then(function (link) {
      m.updateLink(link);
      if (callback) {callback(link)}
    });
    return {
    }
 };
  
  m.getAllLinks = db.rel.find('links') 
          .then (function(res) {
            m.allLinks = res.links;
            $rootScope.$apply();
            console.log('got links')
            return true
          })
          .catch (function(err) {
            console.log(err);
            return false
          })

  m.getLink = function(linkId) {
    return utils.findDocById(m.allLinks , linkId);
  };
  

 m.editLink = function(linkId, linkType, callback){   
    var modalInstance = $uibModal.open({
      templateUrl: 'app/links/link.edit.html',
      controller: 'linkEditCtrl as linkEC',
      size: 'lg',
      resolve: {
        linkType: linkType, 
        link:  m.getLink(linkId)
      }
    });
    modalInstance.result.then(function (link) {
      m.updateLink(link);
      if (callback) {callback()}
    });
  };

  m.updateLink = function(link, callback) {
      db.rel.save('link', link)
        .then (function() {
          var index = utils.findIndexById(m.allLinks, link.id)
          if (index > -1) {
            m.allLinks.splice(index, 1, link)
          } else {
            m.allLinks.push(link);            
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

  m.removeLink = function(linkId, callback) {
    db.rel.del('link', m.getLink(linkId))
        .then (function() {
          m.allLinks.splice(utils.findIndexById(m.allLinks, linkId), 1);
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
