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
          people: {hasMany: 'person'},
          tags: {hasMany: 'tag'},
          places: {hasMany: 'place'},
          events: {hasMany: 'event'},
          objects: {hasMany: 'object'},
        }
      },
      {
        singular: 'person',
        plural: 'people',
        relations: {
          documents: {hasMany: 'document'},
        }
      },
      {
        singular: 'tag',
        plural: 'tags',
        relations: {
          documents: {hasMany: 'document'},
        }
      },
      {
        singular: 'place',
        plural: 'places',
        relations: {
          documents: {hasMany: 'document'},
        }
      },
      {
        singular: 'event',
        plural: 'events',
        relations: {
          documents: {hasMany: 'document'},
        }
      },
      {
        singular: 'object',
        plural: 'objects',
        relations: {
          documents: {hasMany: 'document'},
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

