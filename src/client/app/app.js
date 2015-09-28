'use strict';

angular.module('tcApp2App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'pouchdb',
  'ui.bootstrap',
  'ngCookies',
  'ui.select',
  'btford.socket-io',
  'angular-medium-editor',
  "com.2fdevs.videogular",
  "com.2fdevs.videogular.plugins.controls",
  "com.2fdevs.videogular.plugins.overlayplay",
  'angularLocalStorage',
  'cfp.hotkeys',
  'lrDragNDrop',
  'akoenig.deckgrid',
  'angularResizable',
  'ngImgCrop',
  "leaflet-directive",
  'formly', 
  'formlyBootstrap'
])

  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  //  $urlRouterProvider
  //    .otherwise('/app/documents');

  $stateProvider.
      // Main Layout Structure
     state('app', {
//        abstract: true,
        url: '/app',
        templateUrl: 'app/app.html',
        controller: 'MainCtrl as MC',
        resolve:{
          docs: function(docsModel) { 
            return docsModel.getAllDocs},
          people: function(peopleModel) { 
            return peopleModel.getAllPeople},
          tags: function(tagsModel) { 
            return tagsModel.getAllTags},
          places: function(placesModel) { 
            return placesModel.getAllPlaces}
        }
      })
  })



.config(function(pouchDBProvider, POUCHDB_METHODS) {
  // Example for pouchdb-authentication
  var authMethods = {
    setSchema: 'qify',
    rel: 'qify',
  };
  pouchDBProvider.methods = angular.extend({}, POUCHDB_METHODS, authMethods);
})

.directive('checkh',function ($window) { //declaration
  	function link(scope, element, attrs) { //scope we are in, element we are bound to, attrs of that element
  	  scope.$watch(function(){ //watch any changes to our element
  	    scope.style = { //scope variable style, shared with our controller
  		    height: ($window.innerHeight - element[0].offsetHeight -180) + 'px', //set the height in style to our elements height
  		  };
  	  });
  	}
	  return {
	  	restrict: 'AE', //describes how we can assign an element to our directive in this case like <div master></div
	  	link: link // the function to link to our element
	  };
})

.directive('focusOnShow', function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            if ($attr.ngShow){
                $scope.$watch($attr.ngShow, function(newValue){
                    if(newValue){
                        $timeout(function(){
                            $element[0].focus();
                        }, 0);
                    }
                })      
            }
            if ($attr.ngHide){
                $scope.$watch($attr.ngHide, function(newValue){
                    if(!newValue){
                        $timeout(function(){
                            $element.focus();
                        }, 0);
                    }
                })      
            }

        }
    };
})

.controller('MainCtrl', function($rootScope, $window, $scope, storage, socket, $http, $state, docsModel, peopleModel, tagsModel, placesModel, places)
  {

  $scope.pageSelected = "tags";

  $scope.doBack = function () {
    $window.history.back();
  };
  
  $scope.doForward = function () {
    $window.history.forward();
  };
  
  var v = this;
  v.dm = docsModel;
  v.pm = peopleModel;
  v.tm = tagsModel;
  v.plm = placesModel;
  
  console.log(v.dm.types)
  

  
  storage.bind($scope, 'mainList', {defaultValue: {}, storeName: 'videoLists'});
//  storage.bind($scope, 'mainQueue', {defaultValue: {}, storeName: 'videoQueueLists'})
//  storage.bind($scope, 'mainUploaded', {defaultValue: {}, storeName: 'videoUploadedLists'})
    
/*  Object.keys($scope.mainQueue).forEach(function(doc){
    Object.keys($scope.mainQueue[doc]).forEach(function(video){
        $http({
           url: $scope.mainQueue[doc][video].url,
           method: 'DELETE'
        })
        delete $scope.mainQueue[doc][video]
    })
  })
*/
  $scope.videoButtonMsg ={}
  $scope.merging ={}

  $scope.mainUploaded = $scope.mainUploaded || {}
  var uploadedVideos = '/uploaded-videos/'
  var attachments = '/attachments/'
  $scope.mainQueue = {}
  $scope.mainQueue[uploadedVideos] = {}
  $scope.mainQueue[attachments] = {}

  socket.on('init/uploaded-videos/', function(fileInfo) {
    $scope.mainUploaded[fileInfo.docId] = $scope.mainUploaded[fileInfo.docId] || {}
    $scope.mainUploaded[fileInfo.docId][fileInfo.name]=fileInfo
  })
  socket.on('init/attachments/', function(fileInfo) {
    $scope.mainUploaded[fileInfo.docId] = $scope.mainUploaded[fileInfo.docId] || {}
    $scope.mainUploaded[fileInfo.docId][fileInfo.name]=fileInfo
  })

  $scope.socketListen = function (docId, name, type, callback) {
              console.log('a escuta')
              console.log(docId + type + 'ok:' + name)
              $scope.mainQueue[type][docId] = $scope.mainQueue[type][docId] || {}
              socket.once(docId + type + 'encode/confirm?' + name, function (fileInfo) {
                var answer = $window.confirm('Detectado video MP4. Quer redimensionar este video?')
                socket.emit(docId + type + 'encode:' + name, answer)
              })
              socket.on(docId + type + 'info:' + name, function (fileInfo) {
                $scope.mainQueue[type][docId][name]=fileInfo;
              })
              socket.once(docId + type + 'ok:' + name, function (fileInfo) {
                callback(fileInfo)
              })
  }

  $scope.socketMergeListen = function (v, isMain, callback) {
              socket.on(v.doc.id + '/merge/progress', function (data) {
                $scope.videoButtonMsg[v.doc.id] = 'finalisando ' + data
              })  
              socket.once(v.doc.id + '/merge/end', function (fileInfo) {
                if (isMain) {
                  v.doc.video = fileInfo
                } else {
                  v.doc.videos[fileInfo.name] = fileInfo
                  v.doc.videos[fileInfo.name].description = '<p>'+fileInfo.name.replace(".mp4","").replace(/_/g," ")+'<p>'
                }
                console.log('terminei')
                docsModel.updateDoc(v.doc)
                $scope.merging[v.doc.id] = false
                $scope.videoButtonMsg[v.doc.id] = 'gerar video'
                callback(fileInfo)
              })
  }
  
})



