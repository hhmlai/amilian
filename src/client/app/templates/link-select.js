'use strict';

angular.module('tcApp2App')
    .controller('linkSelectCtrl', function ($scope, $window, model, $filter) {

        var v = this;

        v.m = model
        v.node = $scope.model
        v.typeId = $scope.options.to.nodeType
        v.nodesArr = v.m.nodesArrByType[type]
        console.log(v.nodesArr)

        v.linkTypesOfNode = v.m.linkTypes.node[v.node.doc.type]
        v.nodeFields = v.m.nodeTypes[v.node.doc.type]

        v.createLink = function ( linkedNodeId, data) {
            var link = {
                id: ('L_' + typeId + '_' + new Date().toISOString() + '_admin'),
                type: type.id,
                originNode: v.node.id,
                linkedNode: linkedNodeId,
                data: data
            }
            if ($window.confirm('criar ligação?')) {
                v.m.newLink(link).then(function (res) {
                    v.node.doc.links = v.m.nodeById[v.node.id].doc.links
                    v.loadTables();
                }).catch(function (err) {
                    console.log(err)
                })

            }
        }

        v.deleteLink = function (link) {
            console.log('apagar')
            v.m.removeLink(link).then(function (res) {
                v.node.doc.links = v.m.nodeById[v.node.id].doc.links
                v.loadTables();
            }).catch(function (err) {
                console.log(err)
            })
        }

        v.loadTables = function () {
            var linksData = v.node.doc.links.map(function (link) {
                return { link: link, linkedNode: v.m.nodeById[link.linkedNode], originNode: v.node }
            })
            var linkedData = v.node.doc.linked.map(function (link) {
                return { link: link, linkedNode: v.node, originNode: v.m.nodeById[link.originNode] }
            })
            v.linksTableParams = new NgTableParams({}, { dataset: linksData });
            v.linkedTableParams = new NgTableParams({}, { dataset: linkedData });
        }

        v.loadTables()

    })