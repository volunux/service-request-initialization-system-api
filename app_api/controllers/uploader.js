var $uploader = require('../config/uploader') , key = '' , params = '' , aremiUserS3 = require('../../app_server/config/buckets/s3/aremiUserS3') , bitmap = '' , aws = require('aws-sdk') , param1 = '';

aws.config.update(aremiUserS3);

const uuidv4 = require('uuid/v4');

var s3 = new aws.S3();


module.exports = {

	'file' : (req , res , next) => {

			res.render('fileuploader');
	} ,

	'signedUrl' : (req , res , next) => {
		
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
				
				}

				s3.createPresignedPost(params , (err , data) => {
																														if (err) {
																																				console.log(err)	
																															} else {	
																																				res.status(200).json({data});
																																}
				})

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