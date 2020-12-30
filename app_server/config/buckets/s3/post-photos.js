const aws = require('aws-sdk');

module.exports = function postPhotos() {

				return new aws.S3({
													    'secretAccessKey': process.env.posts_photo_secretkey ,

													    'accessKeyId': process.env.posts_photo_accesskey ,

													    'region' : process.env.posts_region ,

													    'Bucket' : process.env.posts_bucket ,

															'maxRetries' : 4 ,

															'httpOptions' : {

																	'timeout' : 86400000 ,

																	'connectTimeout' : 12000
															}
});

}