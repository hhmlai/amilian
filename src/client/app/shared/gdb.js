'use strict';

angular.module('tcApp2App')
    .factory('gdb', function ($q, pouchDB, utils, $filter, types) {

        var gdb = {}
        var db = pouchDB('tcAppGDB');

        gdb.nodeById = {}
        gdb.nodeArrByType = {}

        Object.keys(types.nodes).forEach(function (key) {
            gdb.nodeArrByType[key] = []
        })

        var getAll = function () {
            return $q(function (resolve, reject) {
                db.allDocs({
                    include_docs: true
                }).then(function (res) {
                    res.rows.map(function (obj) {
                        var node = {
                            id: obj.id,
                            doc: obj.doc
                        }
                        let type = obj.id.split('_')[1]
                        gdb.nodeById[obj.id] = node
                        if (gdb.nodeArrByType[type]) {
                            gdb.nodeArrByType[type].push(node)
                        }
                        return
                    })
                    resolve('dados carregados')
                }).catch(function (err) {
                    reject(err)
                });
            })
        }

        getAll().then(function (res) {
            gdb.changes = db.changes({
                since: 'now',
                live: true,
                include_docs: true
            })
            gdb.changes.on('change', function (change) {
                console.log('algo mudou:')
                console.log(change)
                let type = change.id.split('_')[1]
                let node = gdb.nodeById[change.id]
                console.log(node)
                if (!change.deleted) {
                    if (node) {
                        node.doc = change.doc
                    } else {
                        node = { id: change.id, doc: change.doc }
                        gdb.nodeById[node.id] = node
                        gdb.nodeArrByType[type].push(gdb.nodeById[node.id])
                    }
                } else {
                    let nodeArr = gdb.nodeArrByType[type]
                    $filter('filter')(nodeArr, { id: change.id }).forEach(function (node) {
                        nodeArr.splice(nodeArr.indexOf(node), 1)
                    })
                    node.doc.links.forEach(function (link) {
                        var refNode = gdb.nodeById[link.linkedNode]
                        if (refNode) {
                            refNode.doc.linked.splice(refNode.doc.linked.indexOf(link), 1)
                            gdb.update(refNode)
                        }
                    })
                    node.doc.linked.forEach(function (link) {
                        var refNode = gdb.nodeById[link.originNode]
                        if (refNode) {
                            refNode.doc.links.splice(refNode.doc.links.indexOf(link), 1)
                            gdb.update(refNode)
                        }
                    })
                    delete gdb.nodeById[change.id]
                }
            })
        }).catch(function (err) {
            console.log(err)
        })

        gdb.create = function (node) {
            return $q(function (resolve, reject) {
                node.doc._id = node.doc.id
                console.log(node)
                db.put(node.doc).then(function (res) {
                    resolve(res);
                }).catch(function (err) {
                    reject(err);
                });
            })
        }

        gdb.update = function (node) {
            return $q(function (resolve, reject) {
                console.log('vou actualizar')
                db.get(node.id).then(function (res) {
                    db.put(node.doc)
                }).then(function (res) {
                    resolve(res);
                }).catch(function (err) {
                    if (err.name === "not_found") {
                        gdb.create(node)
                        resolve()
                    } else {
                        reject(err);
                    }
                });
            })
        }

        gdb.delete = function (node) {
            return $q(function (resolve, reject) {
                db.get(node.id).then(
                    function (doc) {
                        db.remove(node.doc)
                            .then(function (res) {
                                resolve(res)
                            })
                    })
                    .catch(function (err) {
                        reject(err);
                    });
            })
        }

        return gdb
    })