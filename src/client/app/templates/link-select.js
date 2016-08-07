'use strict';

angular.module('tcApp2App')
    .controller('linkSelectCtrl', function ($scope, $window, model, $filter) {

        var v = this;
        v.m = model
        console.log($scope.to)

        v.newNode = function () {
            v.m.newNode($scope.to.linkedType)
        }

    })