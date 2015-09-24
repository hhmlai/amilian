'use strict';

//socket factory that provides the socket service
angular.module('tcApp2App')
.factory('socket', function(socketFactory) {
        return socketFactory();
    });