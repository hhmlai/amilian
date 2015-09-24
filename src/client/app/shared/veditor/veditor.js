'use strict';

angular.module('tcApp2App')
  .controller('veditorCtrl', veditorCtrl);
  
function veditorCtrl  (document, mode, $window, $modalInstance, $state, $scope, $rootScope, $http, $timeout, socket, utils, storage, docsModel, hotkeys) 

{

  var vm = this;
  var type = '/uploaded-videos/'
  vm.m = docsModel;
  vm.utils = utils;
  vm.play = false; 

  vm.doc = document;

  vm.mainVideo = [angular.copy(document.video)];
  vm.mainVideo[0].name = document.name;

  $scope.videoButtonMsg[vm.doc.id] = $scope.videoButtonMsg[vm.doc.id] || "gerar video"
  $scope.merging[vm.doc.id] = $scope.merging[vm.doc.id] || false

  $scope.mainList[document.id] = $scope.mainList[document.id] || []
  $scope.mainUploaded[document.id] = $scope.mainUploaded[document.id] || {}

  $scope.mainQueue[type][document.id] = $scope.mainQueue[type][document.id] || {}

  vm.queue = $scope.mainQueue[type][document.id]

  if (mode === 'veditor') {
    vm.list = $scope.mainList[document.id]
    console.log($scope.mainUploaded)
    vm.uploadedList = $scope.mainUploaded[document.id]
    console.log(vm.uploadedList)
  } else {
    vm.list = [vm.mainVideo[0]]
  }
            vm.config = {
                preload: "true",
                autoHide: true,
                autoHideTime: 3000,
                autoPlay: true,
            };




  vm.setVideo = function(index,time) {
                if (isNaN(time) || time<0) {time=0}
                vm.currentVideo = index;
                vm.config.sources = [
                    {src: vm.list[index].url+ "#t=" + time, type: "video/mp4"}
                ];
  };

  vm.seekTime = function (time) {
    if (!time) {return}
    vm.API.seekTime(time)
  }

  vm.checkTime = function (file) {
    if (!file.start) {file.start = 0}
    if (!file.end) {file.end = file.duration}
  }

  vm.saveAs = function(file) {
      console.log(file)
      $http.post('/saveAs', {file: file}).
                success(function(data) {
                }).
                error(function(err) {
                  console.log('erro');
                });    
  }


  vm.finalize = function (isMain) {
    if ($scope.merging[vm.doc.id]) {return}
    $scope.merging[vm.doc.id] = true
    $scope.videoButtonMsg[vm.doc.id] = 'finalizando...'
    vm.API.stop()
    var name = document.name.replace(/ /g,'_')
    if (mode !='veditor') {
      var name = name + '_clip';
      var i=0
      while (vm.list[i]) {
        if (isNaN(vm.list[i].start) ||  isNaN(vm.list[i].end) || vm.list[i].start >= vm.list[i].end) {
          return false
        } else {
          name = name +  '_de_' + vm.list[i].start +'s_a_' +  vm.list[i].end + 's';
          i++
        }
      }
    }
    var destination = '/upload/' + document.id.replace(/:/g,'_') + '/videos/' 
    var docId = document.id 
    $http.post('/mergeVideos', {files: vm.list, name: name, destination: destination, docId: document.id}).
                success(function(data) {
                  vm.data = data;
                  console.log(data)      
                  $scope.socketMergeListen(vm, isMain, function(fileInfo) {
                    console.log('terminei')
                    $modalInstance.close(data.url);
                  })   
                }).
                error(function(err) {
                  console.log('erro');
                  return false
                });    
  };

  vm.cancel = function () {
      $modalInstance.dismiss('cancel');   
  };


  vm.docs = docsModel.allDocs;

  
  vm.m = docsModel.allDocs;
  vm.state = null;
  vm.API = null;

  vm.onPlayerReady = function(API) {
                console.log('ready')
                vm.API = API;

                vm.playing = false
                if (vm.list.length > 0) {
                  vm.setVideo(0,0)
                }
                $scope.$watch(
                  function() {
                    return Math.round(API.currentTime/100)/10
                  },
                  function(newTime) {
                    if ((typeof vm.currentVideo != 'undefined') && (newTime > vm.list[vm.currentVideo].end)) {
                      if (vm.currentVideo === (vm.list.length -1)) {
                        vm.API.pause()
                      } else{
                        vm.setVideo(vm.currentVideo+1, vm.list[vm.currentVideo+1].start)
                      }
                    }
                  }
                )
  };

  vm.putStart = function() {
                vm.list[vm.currentVideo].start = Math.round(vm.API.currentTime/100)/10;              
  };

  vm.putEnd = function() {
              vm.list[vm.currentVideo].end = Math.round(vm.API.currentTime/100)/10;
  };

  vm.split = function() {
              console.log(vm.list[vm.currentVideo])
              console.log(vm.currentVideo)
              var time = Math.round(vm.API.currentTime/100)/10
              var endTime = vm.list[vm.currentVideo].end 
              vm.list.splice(vm.currentVideo,0, angular.copy(vm.list[vm.currentVideo]))
              vm.list[vm.currentVideo +1].start = time;              
              vm.list[vm.currentVideo +1].end = endTime;              
              vm.list[vm.currentVideo +1].copy = true;              
              vm.list[vm.currentVideo].end = time;
              vm.setVideo(vm.currentVideo + 1, time)
  };


  vm.videoRemove = function (index) {
      vm.list.splice(index, 1);                    
  }

    vm.uploadVideo = function () {  
      $http.post('/openfile', {docId: document.id, type: type}).
          success(function(fileList) {
            console.log(fileList)
            fileList.forEach( function (name) {
              console.log(name)
              $scope.socketListen(document.id, name, type, function(fileInfo) {

                delete $scope.mainQueue[type][document.id][name]
                $scope.mainUploaded[document.id][fileInfo.name] = fileInfo
                var l = $scope.mainList[document.id].length
                var i = 0
                if (!l) {
                  $scope.mainList[document.id].push(fileInfo)
                } else {
                  while (i < l) {
                    if ($scope.mainList[document.id][i].name < fileInfo.name) {
                      i++
                      if (i === l) {$scope.mainList[document.id].push(fileInfo)}
                    } else {
                      $scope.mainList[document.id].splice(i,0,fileInfo)
                      return
                    }
                  }
                }
                $scope.mainUploaded[document.id][fileInfo.name] = fileInfo
              })
            })
          }).error(function(err) {
              console.log('erro');
          });
    }

  vm.cancelUpload = function (video) {
  }

  vm.add = function (video) {
      vm.list.push(angular.copy(video))      
      vm.setVideo(vm.list.length -1,0)
  }

  vm.uploadRemove = function (file) {
         var answer = $window.confirm('Pretende apagar definitivamente este video?')
                if (answer) {
                          console.log(vm.uploadedList)
                          $http({
                                url: vm.uploadedList[file.name].url,
                                method: 'DELETE'
                            }).then(
                                function () {
                                  delete vm.uploadedList[file.name]
                                },
                                function () {
                                  delete vm.uploadedList[file.name]
                                  $window.alert('erro a apagar')
                            });
                }
  }
  vm.uploadRemoveAll = function () {
        var answer = $window.confirm('Pretende apagar definitivamente os videos?')
        if (answer) {
                        utils.fileArr(vm.uploadedList).forEach(function(file){
                          $http({
                                url: file.url,
                                method: 'DELETE'
                            }).then(
                                function () {
                                  delete vm.uploadedList[file.name]
                                },
                                function () {
                                  delete vm.uploadedList[file.name]
                                  $window.alert('erro a apagar ' + file.name)
                            });
                        })
                        vm.list = []
        }
  }
}