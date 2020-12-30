var multer = require('multer') , fs = require('fs') , path = require('path') , videoMagic = require('../config/mime_validator/videomagic.js') , $uploader = require('../config/uploader') ,

key = '' , params = '' , errors = require('../config/errors/video') , videoVideos = require('../config/buckets/s3/videos') , videoS3 = require('../config/buckets/s3/videoS3') , bitmap = '' , 

aws = require('aws-sdk') , param1 = '' , multerS3 = require('multer-s3') , s3Conf = videoVideos() , queryString = require('querystring');

aws.config.update(videoS3);

const uuidv4 = require('uuid/v4');

var s3 = new aws.S3();


module.exports = {

	'file' : (req , res , next) => {

			res.render('fileuploader');
	} ,

	'signedUrlBook' : (req , res , next) => {

			params = {

					'Bucket' : 'aremi-book-photos' ,

					'Fields' : {
												'key' : uuidv4() + $uploader.getFileExtension(req.query.filename) ,

												'acl' : 'public-read-write' ,

												'Content-Type' : req.query.contentType ,

												'success_action_status' : '201' ,

												'Expires' : 12000 ,

					} ,

					'Conditions' : [

														{'bucket' : 'aremi-book-photos'} ,

														{'acl' : 'public-read-write'} ,

														{'success_action_status' : '201'} ,

														['starts-with' , '$Content-Type' , ''] 
														
							] ,

					// ServerSideEncryption: 'AES256' // <-- uncomment to add server-side encryption
				
				}

				s3.createPresignedPost(params , (err , data) => {	
																													if (err) {
																																			console.log(err)
																																		
																																			} else {
																																				
																																				res.status(200).json({data});
																																		}

				})


	}

	'signedUrlPhoto' : (req , res , next) => {

			params = {

					'Bucket' : 'aremi-photos-photo' ,

					'Fields' : {
												'key' : uuidv4() + $uploader.getFileExtension(req.query.filename) ,

												'acl' : 'public-read-write' ,

												'Content-Type' : req.query.contentType ,

												'success_action_status' : '201' ,

												'Expires' : 12000 ,

					} ,

					'Conditions' : [

														{'bucket' : 'aremi-photos-photo'} ,

														{'acl' : 'public-read-write'} ,

														{'success_action_status' : '201'} ,

														['starts-with' , '$Content-Type' , ''] 
														
							] ,

					// ServerSideEncryption: 'AES256' // <-- uncomment to add server-side encryption
				
				}

				s3.createPresignedPost(params , (err , data) => {	
																													if (err) {
																																			console.log(err)
																																		
																																			} else {
																																				
																																				res.status(200).json({data});
																																		}

				})


	}

	'signedUrlSound' : (req , res , next) => {

			params = {

					'Bucket' : 'aremi-sounds-sound' ,

					'Fields' : {
												'key' : uuidv4() + $uploader.getFileExtension(req.query.filename) ,

												'acl' : 'public-read-write' ,

												'Content-Type' : req.query.contentType ,

												'success_action_status' : '201' ,

												'Expires' : 12000 ,

					} ,

					'Conditions' : [

														{'bucket' : 'aremi-sounds-sound'} ,

														{'acl' : 'public-read-write'} ,

														{'success_action_status' : '201'} ,

														['starts-with' , '$Content-Type' , ''] 
														
							] ,

					// ServerSideEncryption: 'AES256' // <-- uncomment to add server-side encryption
				
				}

				s3.createPresignedPost(params , (err , data) => {	
																													if (err) {
																																			console.log(err)
																																		
																																			} else {
																																				
																																				res.status(200).json({data});
																																		}

				})


	}

	'signedUrlVideo' : (req , res , next) => {

			params = {

					'Bucket' : 'aremi-videos-video' ,

					'Fields' : {
												'key' : uuidv4() + $uploader.getFileExtension(req.query.filename) ,

												'acl' : 'public-read-write' ,

												'Content-Type' : req.query.contentType ,

												'success_action_status' : '201' ,

												'Expires' : 12000 ,

					} ,

					'Conditions' : [

														{'bucket' : 'aremi-videos-video'} ,

														{'acl' : 'public-read-write'} ,

														{'success_action_status' : '201'} ,

														['starts-with' , '$Content-Type' , ''] 
														
							] ,

					// ServerSideEncryption: 'AES256' // <-- uncomment to add server-side encryption
				
				}

				s3.createPresignedPost(params , (err , data) => {	
																													if (err) {
																																			console.log(err)
																																		
																																			} else {
																																				
																																				res.status(200).json({data});
																																		}

				})


	}

	'signedUrlUser' : (req , res , next) => {

			params = {

					'Bucket' : 'aremi-users-photo' ,

					'Fields' : {
												'key' : uuidv4() + $uploader.getFileExtension(req.query.filename) ,

												'acl' : 'public-read-write' ,

												'Content-Type' : req.query.contentType ,

												'success_action_status' : '201' ,

												'Expires' : 12000 ,

					} ,

					'Conditions' : [

														{'bucket' : 'aremi-users-photo'} ,

														{'acl' : 'public-read-write'} ,

														{'success_action_status' : '201'} ,

														['starts-with' , '$Content-Type' , ''] 
														
							] ,

					// ServerSideEncryption: 'AES256' // <-- uncomment to add server-side encryption
				
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