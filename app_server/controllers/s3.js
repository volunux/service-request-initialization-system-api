var crypto = require('crypto') , fs = require('fs') , path = require('path') , videoMagic = require('../config/mime_validator/videomagic.js') , $uploader = require('../config/uploader') ,

key = '' , params = '' , errors = require('../config/errors/video') , videoVideos = require('../config/buckets/s3/videos') , videoS3 = require('../config/buckets/s3/videoS3') , bitmap = '' , 

aws = require('aws-sdk') , param1 = '' , multerS3 = require('multer-s3') , s3Conf = videoVideos() , queryString = require('querystring');

aws.config.update(videoS3);

const { v4: uuidv4 } = require('uuid');

var s3 = new aws.S3();


module.exports = {

	'file' : (req , res , next) => {

			res.render('fileuploader');
	} ,

	'getS3Credentials' : (config, filename) =>{
	
						return {
					
						'endpoint_url': "https://aremi-videos-video.s3.amazonaws.com" ,
						
						'params' : buildS3Params(config, filename)
					}
		} ,

	'buildS3Params' : (req , config , filename) => {

	var credential = formatAmzCredential(config);

	var policy = buildS3UploadPolicy(config , filename, credential);

	var policyBase64 = new Buffer(JSON.stringify(policy)).toString('base64');

		return {
							'key' : uuidv4() + $uploader.getFileExtension(req.query.filename) ,
							'acl' : 'public-read' ,
							'success_action_status' : '201' ,
							'policy ': policyBase64 ,
							'x-amz-algorithm' : 'AWS4-HMAC-SHA256',
							'x-amz-credential' : credential,
							'x-amz-date' : module.exports.dateString() + 'T000000Z',
							'x-amz-signature': module.exports.buildS3UploadSignature(config , policyBase64 , credential)
					}
			} ,

	'formatAmzCredential' : (config) => {

				 return ['AKIASQSGHEVCMXXXR66F' , module.exports.dateString() , 'eu-central-1' , 's3/aws4_request'].join('/')
		} ,

	'buildS3UploadPolicy' : (req , config , filename , credential) => {
					
						return {
					
							'expiration' : new Date((new Date).getTime() + (180 * 60 * 1000)).toISOString() ,

							'conditions' : [
																{ 'bucket' : 'aremi-videos-video' } ,

																{ 'key' : uuidv4() + $uploader.getFileExtension(req.query.filename) } ,
																
																{ 'acl' : 'public-read' } ,

																{ 'success_action_status' : '201' } ,

																['content-length-range' , 0 , 1000000] ,

																{ 'x-amz-algorithm' : 'AWS4-HMAC-SHA256' } ,

																{ 'x-amz-credential' : credential } ,

																{ 'x-amz-date' : module.exports.dateString() + 'T000000Z' }
													],
											}
			} ,

	'dateString' : () => {
			
					var date = new Date().toISOString()
				
					return date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2)
		} ,

	'buildS3UploadSignature' : (config , policyBase64 , credential) => {

				  var dateKey = hmac('AWS4' + 'zO9LrkpPMYIXHE2C3EU26Tzcgqzx3nrG+zTaVjso' , module.exports.dateString())

				  var dateRegionKey = hmac(dateKey , 'eu-central-1')

				  var dateRegionServiceKey = hmac(dateRegionKey , 's3')

				  var signingKey = hmac(dateRegionServiceKey , 'aws4_request')

				  return module.exports.hmac(signingKey, policyBase64).toString('hex')
		} ,

	'hmac' : (key, string) => {
		
				  var hmac = crypto.createHmac('sha256', key)
		
				  hmac.end(string)
		
				  return hmac.read()
		}

}	