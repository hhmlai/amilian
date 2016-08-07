'use strict';

angular.module('tcApp2App')
  .controller('linkNewCtrl', function (link, typeFields, $uibModal, $window, model, $uibModalInstance) {

    var v = this;

    v.m = model
    v.link = link
    v.linkFields = typeFields

console.log(link)
console.log(typeFields)

    v.ok = function () {
      if (v.link.linkedNode) {
        v.m.newLink(v.link)
        .then(function (link) {
          $uibModalInstance.close(link);
        }).catch(function (err) {
          $window.alert(err)
          console.log(err)
        })

      }
    }

    v.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  });
