const aws = require('aws-sdk');

module.exports = function aremiUser() {

				return new aws.S3({
													   'secretAccessKey': process.env.aremiuser_secretkey ,

													   'accessKeyId': process.env.aremiuser_accesskey ,

														'httpOptions' : {

																'timeout' : 86400000 ,

																'connectTimeout' : 12000
														}
});

}