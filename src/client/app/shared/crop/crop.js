'use strict'; 

angular.module('tcApp2App')
.controller('cropCtrl', function ($scope, $modalInstance) {

  var v = this;

  
   v.myImage='';
   v.myCroppedImage='';
        
        
   $scope.onFileSet = function(files) { 
// work your magic here 
         var file=files[0];
          var reader = new FileReader();
          reader.onload = function (evt) {
            $scope.$apply(function($scope){
              v.myImage=evt.target.result;
            });
          };
          reader.readAsDataURL(file);
}

  v.ok = function () {
    console.log(v.myCroppedImage)
      $modalInstance.close(v.myCroppedImage);
    };
          
  v.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
