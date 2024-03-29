'use strict';

angular.module('tcApp2App')
    .controller('linkSelectCtrl', function ($scope, $window, model, $filter) {

        var v = this;
        v.m = model

        var originNode = $scope.model
        var linkType = v.m.linkTypes[$scope.to.type]
        if (originNode.doc.type === linkType.originNodeType) {

            v.options = v.m.nodeArrByType[linkType.linkedNodeType]

            v.createLink = function (linkTypeId) {
                console.log(linkTypeId)
                var arr = $filter('filter'(links, { type: !linkedTypeId, originNode: !$scope.model.id, linkedNode: !v.linkedNode }))
                console.log(arr)
                if (arr.length === 0) {
                    var link = {
                        id: ('L_' + linkTypeId + '_' + new Date().toISOString() + '_admin'),
                        type: linkTypeId,
                        originNode: $scope.model.id,
                        linkedNode: v.linkedNode
                    }
                    v.m.newLink(link).then(function (res) {
                    }).catch(function (err) {
                        console.log(err)
                    })
                } else {
                    console.log('link existente')
                }
            }


            v.newNode = function () {
                v.m.newNode($scope.to.linkedType)
            }


        } else {
            console.log('erro de configuração - elemento não compativel com tipo')
        }

    })