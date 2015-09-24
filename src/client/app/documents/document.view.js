'use strict';

angular.module('tcApp2App')
  	.controller('docViewCtrl', docViewCtrl); 

function docViewCtrl(
  $scope, 
  $location, 
  $anchorScroll, 
  $http, 
  $modal,
  $stateParams, 
  $state, 
  $timeout,
  $window,
  utils, 
  db, 
  docsModel,
  peopleModel, 
  socket,
  hotkeys) 
{

  var v = this;
  v.state = null;
  v.API = null;

  v.m = docsModel;
  v.pm = peopleModel;
  v.m.setActiveDoc($stateParams.docId);
  v.doc = docsModel.activeDoc;
  v.videoMsg = false
    
  $scope.panel = 0;

$scope.initHotkeys = function () {
  hotkeys.bindTo($scope)
    .add({
      combo: 'ctrl+up',
      description: 'Volume UP',
      callback: function() {
        var volume = v.API.volume + 0.1
        if (volume > 1) {volume = 1} 
        v.API.setVolume(volume)
      }
    })
    .add({
      combo: 'ctrl+down',
      description: 'Volume DOWN',
      callback: function() {
        var volume = v.API.volume - 0.1
        if (volume < 0) {volume = 0} 
        v.API.setVolume(volume)
      }
    })
    .add({
      combo: 'left',
      description: 'Rewind',
      callback: function() {
        var time = v.API.currentTime - 1000
        if (time < 0) {time = 0} 
        v.API.seekTime(time/1000)
      }
    })
    .add({
      combo: 'ctrl+left',
      description: 'Rewind',
      callback: function() {
        var time = v.API.currentTime - 10000
        if (time < 0) {time = 0} 
        v.API.seekTime(time/1000)
      }
    })
            .add({
      combo: 'ctrl+right',
      description: 'Rewind',
      callback: function() {
        var time = v.API.currentTime + 10000
        if (time < 0) {time = 0} 
        v.API.seekTime(time/1000)
      }
    })
    .add({
      combo: 'right',
      description: 'Forward',
      callback: function() {
        var time = v.API.currentTime + 1000
        if (time > v.API.totalTime) {time = v.API.totalTime} 
        v.API.seekTime(time/1000)
      }
    })
    .add({
      combo: 'space',
      description: 'Play/Pause',
      callback: function() {
        v.API.playPause()                       
      }
    })
  }

  $scope.initHotkeys()


  v.checkType = function(file, type) {
    return (file.mime.split("/")[0] === type)
  }
 
  v.addRefPerson = function(role){
      v.doc.refPeople.push({person: {role: role}}); 
  }


  v.fileArr = utils.fileArr
  
  v.editVideo = function(){
    v.videogularConf = []
    v.modal = $modal.open({
      templateUrl: 'app/shared/veditor/veditor.html',
      controller: 'veditorCtrl as vEC',
      size: 'lg',
      scope: $scope,
      resolve: {
          document: function() { 
              return v.doc
          },
          mode: function() { 
              return 'veditor'
          },
      }
    });
    v.modal.result.then(function (url) {
      v.m.updateDoc(v.doc)
      console.log('modal fechada')
      v.init()
    }).catch(function(){
      v.init()
    })
  };

  v.cancel = function () {
    $modalInstace.dismiss()
  }


  v.createClip = function(){
    v.API.pause()
    var modalInstance = $modal.open({
      templateUrl: 'app/shared/veditor/ceditor.html',
      controller: 'veditorCtrl as vEC',
      scope: $scope,
      size: 'lg',
      resolve: {
          document: function() { 
              return v.doc
          },
          mode: function() { 
              return 'ceditor'
          },
      }
    });

    modalInstance.result.then(function (file) {
      $scope.initHotkeys
    });
  };

  v.videoGallery = function(video) {
    v.API.pause()
    video.active = true
    var modalInstance = $modal.open({
      templateUrl: 'app/documents/vgallery.html',
      scope: $scope,
      size: 'lg',
    });
    modalInstance.result.then(function () {
    });
  }

  v.attachGallery = function(attachment) {
    v.API.pause()
    attachment.active = true
    var modalInstance = $modal.open({
      templateUrl: 'app/documents/agallery.html',
      scope: $scope,
      size: 'lg',
    });
    modalInstance.result.then(function () {
    });
  }


  v.showTime = function (time) {
    var minutes = Math.floor(time/60);
    var seconds = (Math.floor(time) - (minutes * 60));
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
  }

  function scrollTo(id) {
      $anchorScroll(id);
    };

  v.activeLine = -1;

  var newTxtLine = {};

  v.selectedLang = 0;

v.edit = function (index, langCode) {
    if (v.activeLine === -1) {
      v.doc.transcription[index].edit = true;
    } else {
      v.closeEdit(v.activeLine, langCode);
      v.doc.transcription[index].edit = true;
    };
    v.activeLine = index;
    $timeout(function(){
      document.getElementById(v.videogularConf.cuePoints.transcription[index].params.id+"#md").focus()
    }, 200) 
};

  v.closeEdit = function (index, langCode) {
    v.doc.languages.forEach(function (lang) {
        if ((!v.doc.transcription[index].txt[lang.code]) 
          && (lang.code !== langCode)) {
          v.doc.transcription[index].txt[lang.code] = 
            v.doc.transcription[index].txt[langCode].replace('<p>','<p>[').replace('</p>',']</p>')
        }
    });
    v.doc.transcription[index].edit = false;
    v.activeLine = -1;
    v.m.updateDoc(v.doc);
  };

  v.onPlayerReady = function(API) {
      v.API = API;
      v.init()
  };


  v.doc.video = v.doc.video || {url: '', thumbUrl: ''};

v.changeTime = function (index) {
  if (index > 0) {
    v.videogularConf.cuePoints.transcription[index - 1]
        .timeLapse.end = v.doc.transcription[index].start;
  }
  v.videogularConf.cuePoints.transcription[index]
                  .timeLapse.start = v.doc.transcription[index].start;
  v.API.seekTime(v.doc.transcription[index].start);
};

v.init = function () {

            var loaded = false;
            var transcription = [];
            v.doc.transcription = v.doc.transcription || [{start:0}];

            for (var i=0, l = v.doc.transcription.length; i<l; i++) {
                var line = {};
                line.timeLapse = v.getTimeLapse(i);
                line.onLeave = this.onLeave.bind(this);
                line.onUpdate = this.onUpdate.bind(this);
                line.onComplete = this.onComplete.bind(this);
                line.params = {id: 'line_' + i, selected: false};
                transcription.push(line);

            }

            if (v.doc.video.url) {
              v.videogularConf = {
                  sources : [{src: v.doc.video.url, type: "video/mp4"}],
                  cuePoints: {transcription: transcription}
              };
            }
};

v.getTimeLapse = function (i) {
          var timeLapse = {};          
          timeLapse.start = v.doc.transcription[i].start
          if (i < (v.doc.transcription.length -1)) {
                  timeLapse.end = v.doc.transcription[i+1].start
          } else {
                  timeLapse.end = v.doc.video.size
          };            
          return timeLapse            
};


  v.delLine = function (i) {
          if (i>0) {
            v.videogularConf.cuePoints
              .transcription[i-1].timeLapse.end = v.doc.transcription[i+1].start;
          }
          v.doc.transcription.splice(i , 1);
          v.videogularConf.cuePoints
            .transcription.splice(i , 1);
  }

  v.addLine = function (personId, langCode) {
          var videogularLine = function (i) { 
            return {               
                timeLapse: v.getTimeLapse(i),
                onLeave: v.onLeave.bind(v),
                onUpdate: v.onUpdate.bind(v),
                onComplete: v.onComplete.bind(v),
                params: {id: 'line_' + v.doc.transcription.length, selected: false}
            };
          }

          var line = {};
          line.start = Math.round(v.API.currentTime/100)/10;
          line.txt = {};
          v.doc.languages.forEach(function (lang) {
            line.txt[lang.code] = ''
          });
          line.personId = personId;
          line.edit = true;
          var i=0
          v.doc.transcription[0] = v.doc.transcription[0] || {start: 0};
          v.doc.transcription[0].params =v.doc.transcription.params || {};

          if (v.doc.transcription[0].start > line.start) {
            v.doc.transcription.unshift(line);
            v.videogularConf.cuePoints.transcription
              .unshift(videogularLine(0));
          } else {
            var l = v.doc.transcription.length;
            for (i=1; (i<l); i++) {
              if (v.doc.transcription[i].start > line.start) {
                v.doc.transcription.splice(i, 0, line);
                v.videogularConf.cuePoints.transcription
                  .splice(i, 0, videogularLine(i));
                v.videogularConf.cuePoints.transcription[i-1]
                  .timeLapse.end = line.start;
                break;
              }
            }
          }
          if (i === l) {
                v.doc.transcription.push(line);
                v.videogularConf.cuePoints.transcription
                  .push(videogularLine(i));
                v.videogularConf.cuePoints.transcription[i-1]
                  .timeLapse.end = line.start;
          }
          v.edit(i, langCode);
          console.log(v.videogularConf.cuePoints.transcription)
          console.log(v.doc.transcription)
  };

  v.onLeave = function (currentTime, timeLapse, params) {
 //           params.completed = false;
            params.selected = false;
  };

  v.onComplete = function (currentTime, timeLapse, params) {
  //          params.completed = true;
              params.selected = false;
  };

  v.onUpdate = function (currentTime, timeLapse, params) {
            if (!params.selected) {
//                segmentElements[params.index].scrollIntoView();
    //            params.completed = false;
                console.log('updated ' + params.id);
                params.selected = true;
                scrollTo(params.id)
            }
  };

  v.editDoc = function (size) {
    var doc = v.m.activeDoc;
    var modalInstance = $modal.open({
      templateUrl: 'app/documents/document.edit.html',
      controller: 'docEditCtrl as docEC',
      scope: $scope,
      size: size,
      resolve: {
        document: function () {return doc}
      }
    });
    modalInstance.result.then(function (doc) {
      v.m.updateDoc(doc);
      v.m.activeDoc = doc;
      console.log('Modal dismissed at: ' + new Date());
    });
  };

  v.deleteDoc = function() {
    var confirmMsg = 'Quer mesmo apagar este documento?'
                        if ($window.confirm(confirmMsg)) {
                            $http({
                                url: '/files/upload/' + $stateParams.docId,
                                method: 'DELETE'
                            }).then(
                                function () {
                                    v.m.removeDoc(v.m.activeDoc, function(){
                                      v.m.activeDoc = {}  
                                      $state.go('app.documents.list');
                                    });
                                },
                                function () {
                                    $window.alert('erro a apagar')
                            });
                        }

  };

  v.saveAs = function (fileUrl) {
    $http.post('/saveAs', {file: fileUrl}).
                success(function() {
                  console.log('gravado');
                  return true
                 }).
                error(function(err) {
                  console.log('erro');
                  return false
                });    
  };

  v.openFile = function () {
      $http.post('/openfile', {docId: v.doc.id, type: '/attachments/'}).
          success(function(fileList) {
            fileList.forEach( function (name) {
              $scope.socketListen(v.doc.id, name, '/attachments/', function(file) {
                v.doc.attach[file.name] = v.doc.attach[file.name] || {description: '<p>'+file.name.replace(".mp4","").replace(/_/g," ")+'<p>'}
                v.doc.attach[file.name].file = file
                if ((file.mime.split('/')[0] === 'image') || (file.mime === 'video/mp4')) {
                  v.doc.attach[file.name].preview = true
                } else {
                  v.doc.attach[file.name].preview = false
                }
                v.m.updateDoc(v.doc)
              })
            })
          }).error(function(err) {
              console.log('erro');
          });
   };

  v.createImage = function () {
      var time = v.API.currentTime/1000
      $http.post('/createImage', {docId: v.doc.id, type: '/attachments/', time:time, videoUrl: v.doc.video.url, imgName: v.doc.video.name+"_"+time+".jpg"})
          .success(function(name) {
              $scope.socketListen(v.doc.id, name, '/attachments/', function(file) {
                v.doc.attach[file.name] = v.doc.attach[file.name] || {description: '<p>'+file.name.replace(".mp4","").replace(/_/g," ")+'<p>'}
                v.doc.attach[file.name].file = file
                if ((file.mime.split('/')[0] === 'image') || (file.mime === 'video/mp4')) {
                  v.doc.attach[file.name].preview = true
                } else {
                  v.doc.attach[file.name].preview = false
                }
                v.m.updateDoc(v.doc)
              })
            })
          .error(function(err) {
              console.log('erro');
          });
   };

  v.deleteVideo = function (video) {
                                  console.log(video.name)
    var answer = $window.confirm('Pretende apagar definitivamente este video?')
                if (answer) {
                          $http({
                                url: video.url,
                                method: 'DELETE'
                            }).then(
                                function () {
                                    delete v.doc.videos[video.name];
                                    v.m.updateDoc(v.doc)
                                },
                                function () {
                                    delete v.doc.videos[video.name];
  //                                  v.m.updateDoc(v.doc)
 //                                   $window.alert('erro a apagar')
                            });
    }
  }
  v.deleteAttach = function (attachment) {
    var answer = $window.confirm('Pretende apagar definitivamente este ficheiro?')
                if (answer) {
                          $http({
                                url: attachment.file.url,
                                method: 'DELETE'
                            }).then(
                                function () {
                                    delete v.doc.attach[attachment.file.name];
                                    v.m.updateDoc(v.doc)
                                },
                                function () {
                                    delete v.doc.attach[attachment.file.name];
                                    v.m.updateDoc(v.doc)
 //                                   $window.alert('erro a apagar')
                            });
    }
  }

};

