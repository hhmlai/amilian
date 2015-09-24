var ffmpeg = require('fluent-ffmpeg');
var os= require('os');
var path= require('path');
if (os.platform() === 'win32') {
	ffmpeg.setFfmpegPath(path.normalize(__dirname + 
		'/../bin/win32/ffmpeg/ffmpeg.exe'));
	ffmpeg.setFfprobePath(path.normalize(__dirname + 
		'/../bin/win32/ffmpeg/ffprobe.exe'));
} else if (os.platform() === 'darwin') {
	ffmpeg.setFfmpegPath(path.normalize(__dirname + 
		'/../bin/mac64/ffmpeg/'));
//	ffmpeg.setFfprobePath(path.normalize(__dirname + 
//		'/../../../bin/mac64/ffmpeg/ffprobe'));
};
module.exports =  ffmpeg;