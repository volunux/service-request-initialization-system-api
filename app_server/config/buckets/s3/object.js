const aws = require('aws-sdk');

module.exports = function postPhotos() {

				return new aws.S3({
													    'secretAccessKey': 'Yq4z5msvKVRX4mGzCHqsqpd5Zl5DFob7b/eJ0NMw' ,
													
													    'accessKeyId': 'AKIAIDBRNJCTTC64MODA' ,

													    'region' : 'eu-central-1' ,

															'httpOptions' : {

																	'timeout' : 86400000 ,

																	'connectTimeout' : 12000
															} 
});

}