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
          links: {hasMany: 'link'},
          tags: {hasMany: 'tag'}
        }
      },
      {
        singular: 'link',
        plural: 'links',
        relations: {
          document: {belongsTo: 'document'},
          people: {hasMany: 'person'},
          places: {hasMany: 'place'},
          events: {hasMany: 'event'},
          entity: {hasMany: 'nodes'}
        }
      },
      {
        singular: 'person',
        plural: 'people',
        relations: {
          links: {hasMany: 'link'},
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
          links: {hasMany: 'link'},
        }
      },
      {
        singular: 'event',
        plural: 'events',
        relations: {
          links: {hasMany: 'link'},
        }
      },
      {
        singular: 'node',
        plural: 'nodes',
        relations: {
          links: {hasMany: 'link'},
        }
      }    
    ]);

  db.del = function(type , obj) {
      db.rel.del(type , obj)
        .then (function(response) {
          console.log(type + ' ' + obj + ' deleted');
        }).catch(function(err) {
            console.log(err)
        });
  };
  return db 
})

