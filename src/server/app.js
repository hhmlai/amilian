var express    =       require("express");
var app        =       express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var router = express.Router();
var path       =       require("path");
var bodyParser = require('body-parser');
var fs = require('fs-extra')
var mime = require('mime')


var root       =       path.normalize(__dirname + '/..');

// config the uploader
var options = {
    tmpDir:  __dirname + '/../data/files/tmp',
    publicDir: __dirname + '/../data',
    uploadDir: __dirname + '/../data/files',
    uploadUrl:  '/files/',
    maxPostSize: 11000000000, // 11 GB
    minFileSize:  1,
    maxFileSize:  10000000000, // 10 GB
    acceptFileTypes:  /.+/i,
    // Files not matched by this regular expression force a download dialog,
    // to prevent executing any scripts in the context of the service domain:
    inlineFileTypes:  /\.(gif|jpe?g|png)$/i,
    imageTypes:  /\.(gif|jpe?g|png)$/i,
    imageVersions: {
        maxWidth:  100
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
    },
    nodeStatic: {
        cache:  3600 // seconds to cache served files
    },
    copyImgAsThumb: true
};

var uploader


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(root, '.tmp')));
app.use(express.static(path.join(root, 'client')));
app.use(express.static(path.join(root, 'data')));
app.set('appPath', 'client');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



router.post('/mergeVideos', function(req, res) {
            uploader.mergeVideos(req, res, function (obj) {
                  console.log('terminei!');      
                  console.log(JSON.stringify(obj))        
                  res.send(JSON.stringify(obj));              
            });
    });

router.post('/createImage', function(req, res) {
            uploader.createImage(req, res, function (obj) {
                  console.log('terminei!');      
                  console.log(obj)        
                  res.send(obj);              
            });
    });

router.delete('/files/upload/:id/:name', function(req, res) {
      uploader.delete(req, res, function (obj) {
            res.send(JSON.stringify(obj)); 
      });
});

router.delete('/files/upload/:id/*/:name', function(req, res) {
      uploader.delete(req, res, function (obj) {
            res.send(JSON.stringify(obj)); 
      });
});

router.delete('/files/upload/:id', function(req, res) {
      uploader.deleteDoc(req, res, function (obj) {
            res.send(JSON.stringify(obj)); 
      });
});

/*
var done       =       false;
 app.use(multer({ dest: './uploads/interviews',
 rename: function (fieldname, filename) {
    return filename;
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path)
    done=true;
  }
}));

app.post('/videoUpload',function(req,res){
  if(done==true){
    console.log(req.files);
    res.end();
  }
});

*/

app.use('/', router);


try { 
  server.listen(9000,function(){
      console.log("Working on port " + server.address().port);
            console.log('ligado');
            io.on('connection', function(socket){
              console.log('a user connected');
              uploader = require('./modules/file-upload-manager')(options, socket, io);
              uploader.init();
            });
  });
} catch(err) {
  console.log('Server not started')
} 



//START ELECTRON

try {
  var main = require('app')
  var BrowserWindow = require('browser-window')
  var path = require('path')
  var ipc = require('ipc')
  var dialog = require('dialog')
  var win
  var link
  var ready = false

  main.setPath('userData', path.normalize(__dirname + '/../data/'))

  main.on('ready', function () {
    win = new BrowserWindow({
      title: 'playback',
      frame: true,
      show: true,
      title: "Nós as Pessoas",
      "node-integration": false
    })
    win.setMenu(null);
    win.maximize();
    // grab a random port.
    server.listen(function() {
      address = server.address();
      win.loadUrl('http://localhost:' + address.port + '/#/app/documents')
    });
    
    win.on('dom-ready', function() {
      win.focus()      
    })

    // Register a 'ctrl+x' shortcut listener.
    var gs = require('global-shortcut');
    gs.register('CommandOrControl+A', function() { 
      win.reload()
    })
    gs.register('CommandOrControl+D', function() { 
      win.openDevTools({"detach": true})
    })

    router.post('/saveas', function(req, res) {
      var fileName = path.basename(decodeURIComponent(req.body.file))
      var oldPath = path.normalize(options.publicDir + req.body.file)
      dialog.showSaveDialog(win, { title: 'Guardar em:', defaultPath: fileName}, function(newPath) {
        res.send();
        if (newPath) {
          fs.copy(oldPath, newPath, function() {
            dialog.showMessageBox(win, {message: 'ficheiro copiado', buttons:['OK']})
          })
        }
      });
    });

    router.post('/openfile', function(req, res) {
      var docId = req.body.docId
      var type = req.body.type
      var filter
      var ext
      if (type === '/uploaded-videos/') {
        var filter = [{ name: 'Videos', extensions: ['mp4', 'mov', 'm4v','flv','mpeg', 'avi', 'wmv', 'mov', 'mts', 'webm']}]
        var ext = '.mp4'
      }
      var fileList = []
      dialog.showOpenDialog(win, {filters: filter, properties:['openFile','multiSelections']}, function(result) {
        if (result) {
          String(result).split(",").forEach(function (filePath) {
            var stat = fs.lstatSync(filePath)
            file = {
              path: filePath,
              oldName: path.basename(filePath),
              name: uploader.checkName(path.normalize(options.uploadDir + '/upload/'+ docId.replace(/:/g,'_') + type), path.basename(filePath), ext),
              mime: mime.lookup(filePath),
              size: stat.size,
              lastMod: stat.lastMod
            }
            fileList.push(file.name)
            uploader.processFile(file, docId, type)
          })
        }
        res.send(fileList);
      });
    });
  })


  main.on('window-all-closed', function() {
    main.quit();
  });

} catch(err) {
  console.log('sem electron')
  console.log(err)
};
