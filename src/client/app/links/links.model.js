'use strict';

angular.module('tcApp2App')
.factory('linksModel', function ($rootScope, placesModel, docsModel, $uibModal, $stateParams, db, utils) {
  
  var m = {};
  m.allLinks = [];
  m.activeLink = null;
  
  m.linkTypes = {
    teste:
            { id: "teste",
              name: "Referência de uma pessoa a várias pessoas",
              fields: [
                  {key: "relPerson", type: 'selectSingleNode', templateOptions : {readOnly: true, typeId: 'person', label: 'Pessoa referencia', required: true}}, 
                  {key: "relPlace", type: 'selectMultipleNodes', templateOptions : {typeId: 'place', label: 'Lugares relacionados', required: true}}, 
                  {key: "obs", type: 'input', templateOptions : {label: 'Notas', required: true}}
              ]
            },
    entrevistadores:
      {id: "entrevistadores",
      name: "Entrevistadores ",
              fields: [
                  {key: "interviewers", type: 'selectSingleNode', templateOptions : {typeId: 'person', label: 'Nome dos entrevistadores', required: true}}, 
                  {key: "obs", type: 'input', templateOptions : {label: 'Observasões'}}
              ],
     viewFields: [
                  {key: "interviewers", type: 'text', templateOptions : {label: 'Nome dos entrevistadores'}}, 
                  {key: "obs", type: 'text', templateOptions : {label: 'Observasões'}}]
      }
  }
            
  m.newLink = function (linkType, docId) {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/links/link.edit.html',
      controller: 'linkEditCtrl as linkEC',
      size: 'lg',
      resolve: {
        link:  {
              id: (new Date().toISOString() + '_admin'),
              docId: docId,
              linkType: linkType
        }
      }
    });
    modalInstance.result.then(function (link) {
      m.updateLink(link);
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
  

 m.editLink = function(link, callback){   
    var modalInstance = $uibModal.open({
      templateUrl: 'app/links/link.edit.html',
      controller: 'linkEditCtrl as linkEC',
      size: 'lg',
      resolve: {
        link:  link
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
  };

  return m

});
