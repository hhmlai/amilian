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
          relationships: {hasMany: 'relationship'},
          tags: {hasMany: 'tag'}
        }
      },
      {
        singular: 'relationship',
        plural: 'relationships',
        relations: {
          documents: {belongsTo: 'document'},
          types: {belongsTo: 'reltype'},
          people: {hasMany: 'person'},
          places: {hasMany: 'place'},
          events: {hasMany: 'event'},
          entity: {hasMany: 'entities'}
        }
      },
      {
        singular: 'reltype',
        plural: 'reltypes',
        relations: {
          relationships: {hasMany: 'relationship'},
        }
      },
      {
        singular: 'person',
        plural: 'people',
        relations: {
          relationships: {hasMany: 'relationship'},
        }
      },
      {
        singular: 'tag',
        plural: 'tags',
        relations: {
          relationships: {hasMany: 'relationship'},
        }
      },
      {
        singular: 'place',
        plural: 'places',
        relations: {
          relationships: {hasMany: 'relationship'},
        }
      },
      {
        singular: 'event',
        plural: 'events',
        relations: {
          relationships: {hasMany: 'relationship'},
        }
      },
      {
        singular: 'entity',
        plural: 'entities',
        relations: {
          relationships: {hasMany: 'relationship'},
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

