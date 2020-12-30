var multer = require('multer') , fs = require('fs') , path = require('path') , videoMagic = require('./mime_validator/videomagic.js') , $filename = require('./filename') ,

extra = require('fs-extra') , key = '' , params = '' , errors = require('./errors/video') , videoVideos = require('./buckets/s3/videos') , videoS3 = require('./buckets/s3/videoS3') , bitmap = '' , 

aws = require('aws-sdk') , param1 = '' , multerS3 = require('multer-s3') , s3Conf = videoVideos();

aws.config.update(videoS3);

const { v4: uuidv4 } = require('uuid');

var s3 = new aws.S3();

module.exports = {

		'reqOptions' : {		'url' : 'http://localhost:3000/api/video/' ,
																																			'method' : 'GET' ,
																																													'json' : {} ,
																																																				'qs' : {}			} ,


		'getFileExtension' : (file) => {
																	
																	var ext =  path.extname(file)
																																	return ext;
		} ,

		'renameFile' : (req , res , next) => {


																	var ext =  path.extname(file.originalname) , possible = 'abcdefghijklmnopqrstuvwxyz0123456789' , imgUrl = '' , fileName = '';

																	for(var i = 0 ; i < 6 ; i += 1) {	imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));		}

																	fileName = imgUrl + ext;

																	return fileName;				

		}

}