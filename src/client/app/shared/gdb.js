'use strict';

angular.module('tcApp2App')
    .factory('gdb', function ($q, pouchDB, utils, $filter, types) {

        var gdb = {}
        var db = pouchDB('tcAppGDB');

        gdb.nodeById = {}
        gdb.nodeArrByType = {}

        Object.keys(types.node).forEach(function (key) {
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
                            doc: obj.doc,
                            get links() {
                                return this.doc.links.map(function (link) {
                                    return { id: link.id, node: gdb.nodeById[link.linkedNode].doc, data: link.data }
                                })
                            },
                            get linked() {
                                return this.doc.linked.map(function (link) {
                                    return { id: link.id, node: gdb.nodeById[link.originNode].doc, data: link.data }
                                })
                            }
                        }
                        let type = obj.id.split('_')[1]
                        gdb.nodeById[obj.id] = node
                        gdb.nodeArrByType[type].push(node)
                        return
                    })
                    resolve('dados carregados')
                    console.log(gdb.nodeById)
                    console.log(gdb.nodeArrByType)
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
                if (!change.deleted) {
                    let node = gdb.nodeById[change.id]
                    if (node) {
                        node.doc = change.doc
                    } else {
                        node = { id: change.id, doc: change.doc }
                        gdb.nodeArrByType[type].push(node)
                    }
                } else {
                    delete gdb.nodeById[change.id]
                    var nodeArr = gdb.nodeArrByType[type]
                    $filter('filter')(nodeArr, { id: change.id }).forEach(function (node) {
                        nodeArr.splice(nodeArr.indexOf(node), 1)
                    })
                    Object.keys(gdb.nodeById).forEach(function (id) {
                        var node = gdb.nodeById[id]
                        $filter('filter')(node.doc.links, { nodeId: change.id }).forEach(function (link) {
                            var index = node.doc.links.indexOf(link)
                            node.doc.links.splice(index, 1)
                            node.links.splice(index, 1)
                        })
                        $filter('filter')(node.doc.linked, { nodeId: change.id }).forEach(function (link) {
                            var index = node.doc.linked.indexOf(link)
                            node.doc.linked.splice(index, 1)
                            node.linked.splice(index, 1)
                        })
                    })
                }
            })
        }).catch(function (err) {
            console.log(err)
        })

        gdb.create = function (node) {
            return $q(function (resolve, reject) {
                node.doc._id = node.doc.id
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
                console.log(node.doc)
                db.get(node.id).then(function (res) {
                    console.log('vou gravar')
                    console.log(node.doc)
                    db.put(node.doc)
                }).then(function (res) {
                    console.log('gravado')
                    console.log(res)
                    resolve(res);
                }).catch(function (err) {
                    console.log(err)
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
                        return db.remove(node.doc)
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