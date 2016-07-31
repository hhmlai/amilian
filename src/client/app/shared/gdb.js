'use strict';

angular.module('tcApp2App')
    .factory('gdb', function ($q, pouchDB, utils) {

        var gdb = {}
        var db = pouchDB('tcAppGDB');

        gdb.all = { id: {}, type: {}, nodes: [], links: [] }


        var getAll = function () {
            return $q(function (resolve, reject) {
                db.allDocs({
                    include_docs: true
                }).then(function (res) {
                    res.rows.map(function (obj) {
                        obj.doc.id = obj.doc._id
                        let type = obj.id.charAt(0)
                        gdb.all.id[obj.doc.id] = obj
                        gdb.all.type[obj.doc.type] = gdb.all.type[obj.doc.type] || []
                        gdb.all.type[obj.doc.type].push(gdb.all.id[obj.doc.id])
                        if (type === 'N') {
                            gdb.all.nodes.push(gdb.all.id[obj.doc.id])
                        } else if (type === 'L')
                            gdb.all.links.push(gdb.all.id[obj.doc.id])
                        return
                    })
                    console.log(gdb.all)
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
                if (!change.deleted) {
                    change.doc.id = change.id
                    if (gdb.all.id.hasOwnProperty(change.id)) {
                        gdb.all.id[change.id].doc = change.doc
                    } else {
                        gdb.all.id[change.id] = change
                        gdb.all.type[change.doc.type] = gdb.all.type[change.doc.type] || []
                        gdb.all.type[change.doc.type].push(gdb.all.id[change.id])
                    }
                } else {
                    utils.deleteDocById(gdb.all.type[utils.getTypeById(change.id)], change.id)
                    delete gdb.all.id[change.id]
                }
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
                    db.put(mydoc)
                }).then(function (res) {
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