'use strict';

angular.module('tcApp2App')
  .config(function ($stateProvider) {
      $stateProvider
        .state('app.veditor', {
          url: '/veditor',
          templateUrl: 'app/shared/veditor/veditor.html',
          controller: 'veditorCtrl as vEC',
	      resolve:{
	        docs: function(docsModel) { 
	            return docsModel.getAllDocs
	        }
     	  }
        })
});

