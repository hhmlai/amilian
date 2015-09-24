module.exports = function(opts, socket, io) {


  var async = require('async')
  var path = require('path'),
    childProcess = require('child_process'),
    os= require('os'),
    fs = require('fs-extra'),
    ffmpeg = require('./ffmpeg'),
    _existsSync = fs.existsSync || path.existsSync,
    nameCountRegexp = /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/,
    options = {
      nEncodeProc: opts.nEncodeProc || 1,
      nCopyProc: opts.nCopyProc || 1,
      tmpDir: opts.tmpDir || __dirname + '/tmp',
      publicDir: opts.publicDir || __dirname + '/public',
      uploadDir: opts.uploadDir || __dirname + '/public/files',
      uploadUrl: opts.uploadUrl || '/files/',
      maxPostSize: opts.maxPostSize || 11000000000, // 11 GB
      minFileSize: opts.minFileSize || 1,
      maxFileSize: opts.maxFileSize || 10000000000, // 10 GB
      acceptFileTypes: opts.acceptFileTypes || /.+/i,
      copyImgAsThumb: opts.copyImgAsThumb && true,
      useSSL: opts.useSSL || false,
      UUIDRegex: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
      // Files not matched by this regular expression force a download dialog,
      // to prevent executing any scripts in the context of the service domain:
      inlineFileTypes: opts.inlineFileTypes || /\.(gif|jpe?g|png)/i,
      imageTypes: opts.imageTypes || /\.(gif|jpe?g|png)/i,
      videoTypes: opts.videoTypes || /\.(flv|mpe?g|mp4|avi|wmv|mov|mts|webm)/i,
      thumbnail: {
          width: (opts.imageVersions && opts.imageVersions.maxWidth) ? opts.imageVersions.maxWidth : 100,
          height: (opts.imageVersions && opts.imageVersions.maxHeight) ? opts.imageVersions.maxHeight : 'auto'
      },
      accessControl: {
        allowOrigin: (opts.accessControl && opts.accessControl.allowOrigin) ? opts.accessControl.allowOrigin : '*',
        allowMethods: (opts.accessControl && opts.accessControl.allowMethods) ? opts.accessControl.allowMethods : 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: (opts.accessControl && opts.accessControl.allowHeaders) ? opts.accessControl.allowHeaders : 'Content-Type, Content-Range, Content-Disposition'
      },
      videoPreset: opts.videoPreset || 
        function myPreset(command) {
        command
          .audioCodec('libmp3lame')
          .videoCodec('libx264')
          .withSize('1280x720')
          .autopad([color='black'])
          .fps(25)
          .addOptions(["-movflags", "faststart","-preset","fast"])
        },
      videoFormat: opts.videoFormat || 'mp4'
/*      videoPreset: opts.videoPreset || 
        function myPreset(command) {
        command
          .audioCodec('libvorbis')
          .videoCodec('libvpx')
          .withSize('1280x720')
          .autopad([color='black'])
          .fps(25)
          .addOptions(["-b:v", "1M", "-crf", "10"])
        },
      videoFormat: opts.videoFormat || 'webm'*/
    };

  var tasks = {}

  var copyTask = function (data, callback) {
    data.fileInfo.status = 'A copiar';
    io.emit(data.id + 'info:' + data.fileInfo.name, data.fileInfo)
    fs.copy(data.origin, data.dest, callback)
  }
  
  var encodeTask = function (data, callback) {
    var fileInfo = data.fileInfo
    var origin = data.origin
    var file = data.file
    var id = data.id

    fileInfo.status = 'A redimensionar';
    io.emit(id + 'info:' + fileInfo.name, fileInfo)
    tasks[id + fileInfo.name] = fileInfo
    fileInfo.progress = 0;
    ffmpeg(origin)
                  .preset(options.videoPreset)
                  .format(options.videoFormat)
                  .save(file.tmpDir + fileInfo.name)                   
                  // setup event handlers
                  .on('progress', function(progress) {
                    fileInfo.progress = progress.percent;
                    io.emit(id + 'info:' + fileInfo.name, fileInfo)
                  })
                  .on('end', function() {
                    fileInfo.progress = 0;
                    fileInfo.status = 'a finalizar';
                    io.emit(id + 'info:' + fileInfo.name, fileInfo)
                    fs.removeSync(file.uploadDir + fileInfo.name)
                    setTimeout(function () {
                      fs.move(file.tmpDir + fileInfo.name, 
                        file.uploadDir + fileInfo.name, function(err) {
                            callback(err)
                          })
                    }, 1000)
                  })
                  .on('error', function(err) {
                    console.log(err)
                  })
  }

  var copyQueue = async.queue(copyTask, options.nCopyProc)
  var encodeQueue = async.queue(encodeTask, options.nEncodeProc)

  var ffmpegCommand = path.normalize(__dirname + '/../bin/win32/ffmpeg/ffmpeg.exe');

  var b = function (a) {
    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b)
  }

  var resize = function(imageFile, newSize, convertedFile) {
    //FALTA localização do MAC
    childProcess
    	.spawnSync(gmCommand, 
      		['convert', imageFile, '-resize', newSize + 'x', convertedFile])
  }

  var nameCountFunc = function(s, index, ext) {
    return ' (' + ((parseInt(index, 10) || 0) + 1) + ')' + (ext || '');
  };

  var encode = function(file, id, fileInfo,  callback) {
      var uploadDir = file.uploadDir
      var tmpDir = file.tmpDir

      fs.ensureDirSync(tmpDir)
/*      fileInfo.status = 'A aguardar para copiar';
      io.emit(id + 'info:' + fileInfo.name, fileInfo)
      copyQueue.push({origin: file.path, dest: tmpDir + 'original', id: id, fileInfo:fileInfo}, function (err) {
        if (err) {
          console.log(err)
          fs.remove(tmpDir);
          callback(err)
        } else {*/
          fileInfo.status = 'A aguardar para redimensionar';
          io.emit(id + 'info:' + fileInfo.name, fileInfo)
          encodeQueue.push({fileInfo: fileInfo, origin: file.path, file: file, id: id}, function (err){
            console.log(err)
            if (err) {
              fs.remove(file.uploadDir + fileInfo.name);              
            }
            callback(err)
            }
          )
       // }
   //   })
  }


  var FileInfo = function(file) {
    this.name  = file.name;
    this.size = file.size;
    this.mime = file.mime;
    this.thumbName = file.name.substr(0, file.name.lastIndexOf('.')) + '.jpg'
  };



  FileInfo.prototype.safeName = function(uploadDir) {

    this.name = path.basename(this.name).replace(/^\.+:/, '').replace(/\s+/g, '_');
    // Prevent overwriting existing files:
    while (_existsSync(uploadDir + this.name)) {
      this.name = this.name.replace(nameCountRegexp, nameCountFunc);
    }
  };


  var fileUploader = {};


  fileUploader.mergeVideos = function(req, res, callback) {
    var baseDir =  path.normalize(options.uploadDir + '/'+ req.body.destination +'/');
    var tmpDir =  path.normalize(options.uploadDir + '/tmp/'+ req.body.destination +'/merge/');
    var baseUrl =  path.normalize(options.uploadUrl + '/'+ req.body.destination +'/');
    var newVideoName = req.body.name + '.' + options.videoFormat
    var newThumbName = req.body.name + '.jpg'
    var newVideo = path.normalize(baseDir + '/' + newVideoName )
    var fileInfo = {
      name: newVideoName,
      url: path.normalize(baseUrl + '/' + newVideoName ),
      thumbUrl:  path.normalize(baseUrl + '/thumbnail/' + newThumbName)
    }
    var fileList = req.body.files;
    var command = '';
    var count = fileList.length;
    var newFile, fileName, fileDir
    var countSpawn = 0
    var length

    fs.ensureDirSync(baseDir);
    fs.ensureDirSync(tmpDir);

    callback(fileInfo)

    var timeMerging = 0

    var informClient = setInterval(function() {
      timeMerging = timeMerging + 5
      io.emit(req.body.docId + '/merge/progress', timeMerging)
    }, 5000)
    for (var i = 0; i < count; i++) {
      fileList[i].start = fileList[i].start || 0;
      fileList[i].end = fileList[i].end || 0;
      length = fileList[i].end - fileList[i].start;

      if (length > 0) {
        fileName = path.normalize(path.basename(decodeURIComponent(fileList[i].url)));
        fileDir = path.normalize(options.publicDir + path.dirname(decodeURIComponent(fileList[i].url) + '/'));
        newFile = path.normalize(tmpDir + '/file_' + i +'.' + options.videoFormat);
        command += "file '" + newFile +"'\n"
        countSpawn++
        var ffmpegCut = childProcess.spawn(
          ffmpegCommand, 
          ["-y", "-ss", fileList[i].start, "-i", fileName, "-t", length, "-c", "copy", newFile], 
          {cwd: fileDir + '\\'}
        );
        ffmpegCut.on('exit', function (code) {
          countSpawn--
          if ((countSpawn === 0) && (i === count)) {
              concat()
          }
        });
      };
    };

    function concat () {
        fs.writeFileSync(path.normalize(tmpDir + '/files.cmd'), command);
        var ffmpegConcat = childProcess.spawn(
          ffmpegCommand, ["-y", "-f", "concat", "-i", "files.cmd", "-c", "copy", newVideo], 
            {cwd: tmpDir}
        )
        ffmpegConcat.on('exit', function (code) {
            finalize()
        })
    }

    function finalize () {
      ffmpeg(newVideo)
              .inputOptions("-y")
              .screenshots({
                timestamps: ['10%'],
                filename: newThumbName,
                folder: path.normalize(baseDir + '/thumbnail/'),
                size: '720x?'
              })
              .on('codecData', function(data) {
                var dur = data.duration.split(":")
                fileInfo.duration = Number(dur[0])*3600+Number(dur[1])*60+Number(dur[2])
                fileInfo.start = 0
                fileInfo.end = fileInfo.duration
              })
              .on('end', function() {
                    clearInterval(informClient)
                    io.emit( req.body.docId + '/merge/end', fileInfo)
              })
    }

  };

  fileUploader.createImage = function(req, res, callback) {
    var originVideo = path.normalize(options.publicDir + '/'+ req.body.videoUrl);
    var destPath = path.normalize(options.uploadDir + '/tmp/screenshots/');
    var filePath = destPath + req.body.imgName
    var name = fileUploader.checkName(path.normalize(options.uploadDir + '/upload/'+ req.body.docId.replace(/:/g,'_') + type), path.basename(filePath), '.jpg')
    callback(name)
    fs.ensureDirSync(destPath)
    var type = '/attachments/'
          ffmpeg(originVideo)
              .inputOptions("-y")
              .screenshots({
                timestamps: [req.body.time],
                filename: req.body.imgName,
                folder: path.normalize(destPath),
                size: '720x?'
              })
              .on('end', function(err){
                if (!err) {
                  var stat = fs.lstatSync(filePath)
                  file = {
                    path: filePath,
                    oldName: req.body.imgName,
                    name: name,
                    mime: 'image/jpg',
                    size: stat.size,
                    lastMod: stat.lastMod
                  }
                  fileUploader.processFile(file, req.body.docId, type)
                }
              })
  }

  fileUploader.delete = function(req, res, callback) {
        var fileDir = path.normalize(options.publicDir + path.dirname(decodeURIComponent(req.url).replace(/:/g,'_')) + '/');
        var fileName = path.basename(decodeURIComponent(req.url));
        if (fileName[0] !== '.') {    
          fs.remove(fileDir + fileName, function(ex) {
            fs.remove(fileDir + 'data/' + fileName +'.dat', function(ex) {
              fs.remove(fileDir + 'thumbnail/' + fileName.substr(0, fileName.lastIndexOf('.')) + '.jpg');
                callback({
                  success: !ex
                });
              });
          });
          return;
        };
        callback({
          success: false
        });
  };

  fileUploader.checkName = function(uploadDir, name, ext) {
    if (ext) {
      name = name.substr(0, name.lastIndexOf('.')) + ext
    }
    var res = path.basename(name).replace(/^\.+:/, '').replace(/\s+/g, '_');
    // Prevent overwriting existing files:
    res = name
    while (_existsSync(uploadDir + res)) {
      res = res.replace(nameCountRegexp, nameCountFunc);
    }
    return res
  };

  fileUploader.deleteDoc = function(req, res, callback) {
        var dir = path.normalize(options.publicDir + decodeURIComponent(req.url).replace(/:/g,'_') + '/');
        fs.remove(dir, function(ex) {
            callback({
              success: !ex
            });
        });
  };


  var processVideo = function(file, id, fileInfo, callback) {
    var uploadDir = file.uploadDir
    var uploadUrl = file.uploadUrl
    fs.ensureDirSync(uploadDir);
    fs.ensureDirSync(uploadDir + 'thumbnail/')
    fs.writeFileSync(path.normalize(uploadDir + fileInfo.name), "");

    if (options.videoTypes.test(file.name)) {
      fileInfo.status = 'A criar imagem';
      io.emit(id + 'info:' + fileInfo.name, fileInfo)
      ffmpeg(file.path)
          .screenshots({
                timestamps: ['10%'],
                filename: fileInfo.thumbName,
                folder: path.normalize(uploadDir + 'thumbnail/'),
                size: '720x?'
          })
          .on('codecData', function(data) {
                var dur = data.duration.split(":");
                fileInfo.duration = Number(dur[0])*3600+Number(dur[1])*60+Number(dur[2])
                fileInfo.start = 0
                fileInfo.end = fileInfo.duration

          })
          .on('end', function() {
                fileInfo.thumbnailUrl = path.normalize(uploadUrl + '/thumbnail/' + fileInfo.thumbName);
                fileInfo.url = path.normalize(uploadUrl + fileInfo.name);
                if (file.encode) {
                  encode(file, id, fileInfo, function (err) {                    
                        console.log('finished processing '+ fileInfo.name);
                        callback(err)
                  })
                } else {
                  fileInfo.status = 'A aguardar para copiar';
                  io.emit(id + 'info:' + fileInfo.name, fileInfo)
                  copyQueue.push({origin:file.path, dest: uploadDir + fileInfo.name, id: id, fileInfo:fileInfo}, function(err) {
                    callback(err)
                  })
                }
          })
    } else {
      fileInfo.status = 'A aguardar para copiar';
      io.emit(id + 'info:' + fileInfo.name, fileInfo)
      copyQueue.push({origin:file.path, dest: uploadDir + fileInfo.name, id: id, fileInfo:fileInfo}, function(err) {
        if (options.imageTypes.test(fileInfo.name)) {
              fileInfo.status = 'A criar imagem';
              io.emit(id + 'info:' + fileInfo.name, fileInfo)
              ffmpeg(file.path)
                  .size('720x?')
                  .save(path.normalize(uploadDir + 'thumbnail/' + fileInfo.thumbName))                   
                  .on('end', function() {
                    fileInfo.thumbnailUrl = path.normalize(uploadUrl + '/thumbnail/' + fileInfo.thumbName);
                    fileInfo.url = path.normalize(uploadUrl + fileInfo.name);
                    callback(err)
                  })
        } else {
          callback(err)
        }
      })
    }
  }


  fileUploader.processFile = function(file, docId, type) {


    file.uploadUrl = options.uploadUrl + '/upload/'+ docId.replace(/:/g,'_') + type
    file.uploadDir = path.normalize(options.uploadDir + '/upload/'+ docId.replace(/:/g,'_') + type);
    file.tmpDir = path.normalize(options.uploadDir + '/tmp/upload/'+ docId.replace(/:/g,'_') + type);

    
    var id = docId + type
    var fileInfo = new FileInfo(file);
    fileInfo.docId = docId;
    io.emit(id + 'info:' + fileInfo.name)
    fileInfo.status = 'Em espera';
    io.emit(id + 'info:' + fileInfo.name, fileInfo)
    if (type === '/uploaded-videos/') {file.encode = options.videoTypes.test(file.name)}
    fs.ensureDirSync(file.uploadDir + '/data/')

    var finalize = function() {
      processVideo(file, id, fileInfo, function(err) {
         if (err) {
          fileInfo.status = 'error'
          io.emit(id + 'info:' + fileInfo.name, fileInfo)
          console.log(err)
         } else {
          fileInfo.status = 'ok'
          fs.writeFile(path.normalize(file.uploadDir + '/data/' + file.name +'.dat'), JSON.stringify(fileInfo));
          io.emit(id + 'ok:' + fileInfo.name, fileInfo)
         }
         console.log('terminado')
         console.log(id + 'ok:' + fileInfo.name)
      })      
    }

  if ((file.mime === 'video/mp4') && (type === '/uploaded-videos/')) {
        io.emit(id +'encode/confirm?' + fileInfo.name, fileInfo.name)
        socket.on(id + 'encode:' + fileInfo.name, function (data) {
          file.encode = data
          finalize()
        })
      } else {
        finalize()
      }
  }

  fileUploader.init = function() {
    fs.removeSync(path.normalize(options.uploadDir + '/tmp'))
    fs.readdir(options.uploadDir + '/upload/', function(err, docList) {
        docList = docList || [];
        docList.forEach(function(docId) {
          var dir = path.normalize(options.uploadDir + '/upload/' + docId + '/uploaded-videos/')
          fs.readdir(dir, function(err, list) {
            list = list || [];
            list.filter(function (file) {
              return fs.statSync(dir + file).isFile()
            }).forEach(function(name) {
              fs.readJson(dir + '/data/' + name + '.dat', function(err, data) {
                if (err) {
                  fs.remove(dir + name)                  
                  fs.remove(dir + '/thumbnail/' + name.substr(0, name.lastIndexOf('.')) + '.jpg')                  
                } else{
                  io.emit('init/uploaded-videos/', data)                                
                }
              })
            })
          })
        })
    })
  }

  return fileUploader;
};

