'use strict'; 

angular.module('tcApp2App')
.controller('plcEditCtrl', function (place, $scope, $modal, $window, placesModel, $modalInstance) {

  var v = this;

  v.m = placesModel
  v.place = place
  place.gps = place.gps || {}
  
$scope.center = {
                      lat: place.gps.lat || 0,
                      lng: place.gps.lng || 0,
                      zoom: place.gps.zoom || 8
                }

$scope.markers = {place: {
                      lat: place.gps.lat || 0,
                      lng: place.gps.lng || 0,
                      message: place.name,
                      focus: true,
                      draggable: true
                      }
               }

console.log($scope.markers.place)
  
  $scope.$on('leafletDirectiveMarker.dragend', function(event, args){
    if (args.modelName = 'place') {
      place.gps = {
        lat: Math.round(args.model.lat*10000)/10000,
        lng: Math.round(args.model.lng*10000)/10000
      };      
    }
  });
   

  v.ok = function () {
    if (v.place.name.lenght != 0) {
      v.place.ref = {
        id: v.place.id,
        name: v.place.name
      }
      $modalInstance.close(v.place);
      
    } else {
      $window.alert('Dados incompletos')
    }
  };
  
  v.addImage = function() {
    var modalInstance = $modal.open({
      templateUrl: 'app/shared/crop/crop.html',
      controller: 'cropCtrl as cropC',
      size: 'lg'
    });
    modalInstance.result.then(function (img) {
      console.log('fechar')
      console.log(img)
      
      v.place.picture = img;
    });
  };
      
  v.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
