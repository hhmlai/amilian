'use strict';

angular.module('tcApp2App')
    .factory('gdb', function ($timeout, $q, pouchDB) {

        console.log('aqui GDB');

        var gdb = {}
        var db = pouchDB('tcAppGDB');

        db.createIndex({
            index: {
                fields: ['n1.id', 'n2.id', 'type.id']
            }
        }).then(function (result) {
            console.log(result);
        }).catch(function (err) {
            console.log(error);
        });

        gdb.changes = db.changes({
            since: 'now',
            live: true,
            include_docs: true
        })

        gdb.getAllNodes = function () {
            return $q(function (resolve, reject) {
                db.allDocs({
                    include_docs: true,
                    startkey: 'N',
                    endkey: 'O',
                    inclusive_end: false
                }).then(function (res) {
                    var all = {}
                    res.rows.forEach(function (row) {
                        all[row.doc.type]= all[row.doc.type]  || {}
                        all[row.doc.type][row.id] = row.doc
                    })
                    console.log(all)
                    resolve(all)
                }).catch(function (err) {
                    reject(err)
                });
            })
        }

        gdb.getAllLinks = function () {
            return $q(function (resolve, reject) {
                db.allDocs({
                    include_docs: true,
                    startkey: 'L_',
                    endkey: 'M_',
                    inclusive_end: false
                }).then(function (result) {
                    var all = {}
                    result.rows.forEach(function (row) {
                        all[row.id] = row.doc
                    })
                    resolve(all)
                }).catch(function (err) {
                    reject(err)
                })
            })
        }

        gdb.link = function (node1, node2, obs) {
            var id = 'L_' + prjID + '_' + Date.now().toJSON()
            db.put({
                _id: id,
                n1: node1,
                n2: node2,
                type: type
            }).then(function (res) {
                console.log(res);
            }).catch(function (err) {
                console.log(err);
            });
        }

        gdb.rmLink = function (link) {
            db.get(link).then(function (res) {
                return db.remove(res)
            }).then(function (response) {
                db.find
            }).catch(function (err) {
                console.log(err);
            });
        }

        gdb.create = function (doc) {
            db.put(doc).then(function (res) {
                console.log(res);
            }).catch(function (err) {
                console.log(err);
            });
        }

        gdb.update = function (mydoc) {
            db.get(mydoc._id).then(function (res) {
                return db.put(mydoc);
            }).then(function (res) {
                console.log(res);
            }).catch(function (err) {
                console.log(err);
            });
        }

        gdb.rmNode = function (mydoc) {
            return $q(function (resolve, reject) {
                db.get(mydoc._id).then(
                    function (doc) {
                        return db.remove(doc)
                            .then(function (res) {
                                resolve(res)
                            })
                            .catch(function (err) {
                                reject(err);
                            })
                    })
                    .catch(function (err) {
                        console.log(err)
                        reject(err);
                    });
            })
        }

        return gdb
    })