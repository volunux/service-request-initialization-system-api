const aws = require('aws-sdk');

module.exports = function postPhotos() {

				return new aws.S3({
<<<<<<< HEAD
													    'secretAccessKey': process.env.aremiuser_secretkey ,
													
													    'accessKeyId': process.env.aremiuser_accesskey ,
=======
													    'secretAccessKey': '2121ix97218218217281' ,
													
													    'accessKeyId': '921298298xzzmhjsa' ,
>>>>>>> 4c7506cef1d1dba796e0e79831742c952f5daed4

													    'region' : process.env.photos_region ,

															'httpOptions' : {

																	'timeout' : 86400000 ,

																	'connectTimeout' : 12000
															} 
});

}
