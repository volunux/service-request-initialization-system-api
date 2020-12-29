var $uploader = require('../config/uploader') , key = '' , params = '' , aremiUserS3 = require('../../app_server/config/buckets/s3/aremiUserS3') , bitmap = '' , aws = require('aws-sdk') , param1 = '';

aws.config.update(aremiUserS3);

const { v4: uuidv4 } = require('uuid');

var s3 = new aws.S3();

const objectControl = require('../config/object');


module.exports = {

	'photoDelete' : (req , res , next) => { let entry = req.params.entry;

		if (req.params && req.params.entry) { objectControl.objectDeleteClient(req, res , next , entry); }	

		else { return config.response(res , 404 , {'message' : `No Photo id provided. Please provide a valid Photo id.`});		}

	} ,

	'signedUrl' : (req , res , next) => {
		
			params = {

					'Bucket' : process.env.photos_bucket ,

					'Fields' : {
												'key' : uuidv4() + $uploader.getFileExtension(req.body.filename) ,

												'acl' : 'public-read-write' ,

												'Content-Type' : req.body.contentType ,

												'success_action_status' : '201' ,

												'Expires' : '86400000' } ,

					'Conditions' : [
														{'bucket' : process.env.photos_bucket} ,

														{'acl' : 'public-read-write'} ,

														{'success_action_status' : '201'} ,

														['starts-with' , '$Content-Type' , ''] ,

														["content-length-range" , '0' , '1048576'] ] ,

					'Expires' : '86400000'

				}

				s3.createPresignedPost(params , (err , data) => {
							
							if (err) { console.log(err); }
							
								 else {	res.status(200).json({data});	}		})
	} ,

	'signPhoto' : (req , res , next) => {

			params = {

					'Bucket' : process.env.photos_bucket ,

					'Fields' : {
												'key' : uuidv4() + $uploader.getFileExtension(req.body.filename) ,

												'acl' : 'public-read-write' ,

												'Content-Type' : req.body.contentType ,

												'success_action_status' : '201' ,

												'Expires' : '86400000' ,
					} ,

					'Conditions' : [
														{'bucket' : process.env.photos_bucket} ,

														{'acl' : 'public-read-write'} ,

														{'success_action_status' : '201'} ,

														['starts-with' , '$Content-Type' , ''] ,

														["content-length-range" , '0' , '1048576'] ,
														
					] ,

					'Expires' : '86400000' ,

					'ServerSideEncryption' : 'AES256'
				
				}

				s3.createPresignedPost(params , (err , data) => {
							
							if (err) {	console.log(err)	} 

							else { res.status(200).json({data});	}
				});
	} ,

	'signBook' : (req , res , next) => {

			params = {

					'Bucket' :  process.env.books_bucket,

					'Fields' : {
												'key' : uuidv4() + $uploader.getFileExtension(req.body.filename) ,

												'acl' : 'public-read-write' ,

												'Content-Type' : req.body.contentType ,

												'success_action_status' : '201' ,

												'Expires' : '86400000' ,
					} ,

					'Conditions' : [
														{'bucket' : process.env.books_bucket} ,

														{'acl' : 'public-read-write'} ,

														{'success_action_status' : '201'} ,

														['starts-with' , '$Content-Type' , ''] ,

														["content-length-range" , '0' , '1048576'] ,
														
							] ,

					'Expires' : '86400000' ,

					'ServerSideEncryption' : 'AES256'
				
				}

				s3.createPresignedPost(params , (err , data) => {
																														if (err) {
																																				console.log(err)	
																															} else {	
																																				res.status(200).json({data});
																																}
				})

	} 

}	