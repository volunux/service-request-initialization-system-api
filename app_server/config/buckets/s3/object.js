const aws = require('aws-sdk');

module.exports = function postPhotos() {

				return new aws.S3({
													    'secretAccessKey': '2121ix97218218217281' ,
													
													    'accessKeyId': '921298298xzzmhjsa' ,

													    'region' : 'eu-central-1' ,

															'httpOptions' : {

																	'timeout' : 86400000 ,

																	'connectTimeout' : 12000
															} 
});

}
