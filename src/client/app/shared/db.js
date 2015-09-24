'use strict';

angular.module('tcApp2App')
  .factory('db', function (pouchDB) {
  	var db = pouchDB('tcAppDB');
    console.log('aqui DB');
  	db.setSchema([
      {
        singular: 'document',
        plural: 'documents',
        relations: {
          person: {hasMany: 'person'},
          tag: {hasMany: 'tag'},
          place: {hasMany: 'place'},
          event: {hasMany: 'event'},
          object: {hasMany: 'object'},
        }
      },
      {
        singular: 'person',
        plural: 'people',
        relations: {
          document: {hasMany: 'document'},
        }
      },
      {
        singular: 'tag',
        plural: 'tags',
        relations: {
          document: {hasMany: 'document'},
        }
      },
      {
        singular: 'place',
        plural: 'places',
        relations: {
          document: {hasMany: 'document'},
        }
      },
      {
        singular: 'event',
        plural: 'events',
        relations: {
          document: {hasMany: 'document'},
        }
      },
      {
        singular: 'object',
        plural: 'objects',
        relations: {
          document: {hasMany: 'document'},
        }
      }    
    ]);

  db.del = function(type , obj ) {
      db.rel.del(type , obj)
        .then (function(response) {
          console.log(type + ' ' + obj + ' deleted');
        }).catch(function(err) {
            console.log(err)
        });
  };
  return db 
})

