'use strict';

angular.module('tcApp2App')
    .controller('placesCtrl', placesCtrl);

function placesCtrl($scope, $modal, $rootScope, $filter, db, placesModel, docsModel) {
    var v = this;
    v.m = placesModel
    v.dm = docsModel

    v.dili = {
        lat: -8.5585,
        lng: 125.5782,
        zoom: 8
    }

        
    v.markers = [];

    v.m.allPlaces.forEach(function (place) {
        if (place.gps) {
            place.gps.message = place.name
            v.markers.push(place.gps)
        }
    })

   


    v.allMarkers = v.markers
    v.places = v.m.allPlaces
     
    // Start watching the search model
    $scope.$watch('mainFilter', function (newVal, oldVal) {
        // Watch gets fired on scope initialization and when empty so differentiate:
        if (newVal !== oldVal && newVal !== '') {
            // Has searchvalue, apply sourcedata, propertyname and searchstring to filter
            // and assign return value of filter to geojson 
            v.markers = $filter('filter')(v.allMarkers, { $: $scope.mainFilter });
            v.places = $filter('filter')(v.m.allPlaces, { $: $scope.mainFilter });
        } else {
            // Search has been initialized or emptied, assign sourcedata to geojsonobject
            v.markers = v.allMarkers;
            v.places = v.m.allPlaces
        }
    });


};

