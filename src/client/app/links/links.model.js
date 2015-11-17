'use strict';

angular.module('tcApp2App')
.factory('linksModel', function ($rootScope, formlyUtils, peopleModel, placesModel, docsModel, $uibModal, $stateParams, db, utils) {
  
  var m = {};
  m.allLinks = [];
  m.activeLink = null;
  
  m.linkTypes = {
    teste:
            { id: "teste",
              name: "Referência",
              fields: [
                  {key: "relPerson", type: 'ui-select-person', templateOptions : {label: 'Pessoa referencia', required: true}}, 
                  {key: "obs", type: 'input', templateOptions : {label: 'Observações', required: true}}
              ]
            },
    refPlace:
            {  id: "refPlace",
              name: "Referência a um local",
              fields: [
                  angular.extend({
                    label: 'Nome do Local', 
                    required: true
                    }, formlyUtils.selectTypes('place')), 
                  {key: "relPlace", type: 'ui-select-single', label: 'Relação com o documento', options: placesModel.types, required: true}, 
                  {key: "obs", type: 'input', label: 'Observações', required: true}, 
                  {key: "refStart", type: 'input', label: 'Momento da entrevista (s)', required: false}, 
                  {key: "refLenght", type: 'input', label: 'Duração da referência (s)', required: false}
              ]
            },
      refPessoaLocal:
            {  id: "refPessoaLocal",
              name: "Referência a pessoas num local",
              fields: [
                  angular.extend({
                    label: 'Nome da Pessoa', 
                    required: true
                    }, formlyUtils.selectTypes('person')),           
                angular.extend({
                    key: "place", 
                    label: 'Nome do Local', 
                    required: true
                    }, formlyUtils.selectTypes('place')), 
                ]
            },
     dadosEntrevista:
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
  }
            
  m.newLink = function (typeParams, docId, callback) {
    var modalInstance = $uibModal.open({
      templateUrl: 'app/links/link.edit.html',
      controller: 'linkEditCtrl as linkEC',
      size: 'lg',
      resolve: {
        link:  {
              id: (new Date().toISOString() + '_admin'),
              docId: docId,
              typeParams: typeParams
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
  };

  return m

});
