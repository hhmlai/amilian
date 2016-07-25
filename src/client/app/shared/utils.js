'use strict';

angular.module('tcApp2App')
.factory('utils', function () {
  return {
    // Util for finding an object by its 'id' property among an array
    findDocById: function findDocById(a, id) {
      if (a) {
      for (var i = 0; i < a.length; i++) {
        if (a[i].id == id) return a[i];
      }
      }
      return -1;
    },
    getTypeById: function getTypeById(id) {
      return id.split('_')[1]
    },
    findDocByName: function findDocByName(a, id) {
      if (a) {
        for (var i = 0; i < a.length; i++) {
          if (a[i].name == id) return a[i];
        }
      return -1;
      }      
    },
    findIndexById: function findIndexById(a, id) {
      if (a) {
        for (var i = 0; i < a.length; i++) {
          if (a[i].id == id) return i;
        }
      }
      return -1;
    },
    findIndexByName: function findIndexByName(a, id) {
      if (a) {
      for (var i = 0; i < a.length; i++) {
        if (a[i].name == id) return i;
      }
      }
      return -1;
    },
    fileArr: function fileArr(obj) {
      if (obj) {
        return Object.keys(obj).map(function (key) {return obj[key]});
      }
    },


    // Util for returning a random key from a collection that also isn't the current key
    newRandomKey: function newRandomKey(coll, key, currentKey){
      var randKey;
      do {
        randKey = coll[Math.floor(coll.length * Math.random())][key];
      } while (randKey == currentKey);
      return randKey;
    }
  };
})
.directive("contenteditable", function() {
  return {
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function() {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function() {
        scope.$apply(read);
      });
    }
  }
})
.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
})
.filter('millSecondsToSeconds', function() {
  return function(millseconds) {
    var seconds = Math.floor(millseconds / 100)/10;
    return seconds.toFixed(1);
}
})
.filter('bytesToMbytes', function() {
  return function(bytes) {
    var Mbytes = Math.floor(bytes /1024/1024*10)/10;
    return Mbytes.toFixed(1);
}
})