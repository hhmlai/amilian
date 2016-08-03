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
                        obj.links = []
                        obj.linked = []
                        let type = obj.id.split('_')[1]
                        gdb.nodeById[obj.doc.id] = obj
                        gdb.nodeArrByType[type].push(gdb.nodeById[obj.doc.id])
                        return
                    })
                    console.log(gdb.nodeArrByType)
                    Object.keys(gdb.nodeById).forEach(function (id) {
                        let node = gdb.nodeById[id]
                        node.doc.links.forEach(function (link) {
                            node.links.push({ id: link.id, node: gdb.nodeById[link.nodeId], data: link.data })
                        })
                        node.doc.linked.forEach(function (link) {
                            node.linked.push({ id: link.id, node: gdb.nodeById[link.nodeId], data: link.data })
                        })
                    })
                    resolve('dados carregados')
                }).catch(function (err) {
                    reject(err)
                });
            })
        }

        getAll().then(function (res) {
            console.log(res)
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
                    let node = {}
                    if (gdb.nodeById.hasOwnProperty(change.id)) {
                        node = gdb.nodeById[change.id]
                        node.doc = change.doc
                    } else {
                        gdb.nodeById[change.id] = change
                        node = gdb.nodeById[change.id]
                        gdb.nodeArrByType[type].push(node)
                    }
                    node.links = []
                    node.linked = []
                console.log('algo mudou:2')

                console.log(node.doc)
                    node.doc.links.forEach(function (link) {
                console.log('algo mudou:3')
                        console.log(link)
                        node.links.push({ id: link.id, node: gdb.nodeById[link.linkedNode], data: link.data })
                    })
                    node.doc.linked.forEach(function (link) {
                        console.log(link)
                        node.linked.push({ id: link.id, node: gdb.nodeById[link.originNode], data: link.data })
                    })
                } else {
                    delete gdb.nodeById[change.id]
                    $filter('filter')(gdb.nodeArrByType[type], { $: { id: change.id } }).forEach(function (node) {
                        gdb.nodeArrByType[type].splice(gdb.nodeArrByType[type].indexOf(node), 1)
                    })
                    console.log(gdb.nodeArrByType)
                    Object.keys(gdb.nodeById).forEach(function (id) {
                        $filter('filter')(gdb.nodeById[id].doc.links, { nodeId: change.id }).forEach(function (link) {
                            gdb.nodeById[id].doc.links.splice(node.doc.links.indexOf(link), 1)
                        })
                        $filter('filter')(gdb.nodeById[id].doc.linked, { nodeId: change.id }).forEach(function (link) {
                            gdb.nodeById[id].doc.linked.splice(node.doc.linked.indexOf(link), 1)
                        })
                    })
                }
                console.log('terminei')
                console.log(gdb.nodeById[change.id])
            })
        }).catch(function (err) {
            console.log(err)
        })

        gdb.create = function (doc) {
            doc._id = doc.id
            return $q(function (resolve, reject) {
                db.put(doc).then(function (res) {
                    resolve(res);
                }).catch(function (err) {
                    reject(err);
                });
            })
        }

        gdb.update = function (mydoc) {
            return $q(function (resolve, reject) {
                db.get(mydoc.id).then(function (res) {
                    db.put(mydoc.doc)
                }).then(function (res) {
                    console.log('link criado')
                    console.log(res)
                    resolve(res);
                }).catch(function (err) {
                    reject(err);
                });
            })
        }

        gdb.delete = function (mydoc) {
            return $q(function (resolve, reject) {
                db.get(mydoc.id).then(
                    function (doc) {
                        return db.remove(doc)
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