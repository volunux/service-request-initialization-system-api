var multer = require('multer') , fs = require('fs') , path = require('path') , imageMagic = require('./photomagic.js') , $filename = require('./filename') ,

extra = require('fs-extra') , key = '' , params = '' , userPhotos = require('./buckets/s3/user-photos') , userS3 = require('./buckets/s3/userS3') , bitmap = '' , 

aws = require('aws-sdk') , param1 = '' , multerS3 = require('multer-s3') , s3Conf = userPhotos();

aws.config.update(userS3);

var s3 = new aws.S3();

module.exports = {

	'reqOptions' : {		'url' : 'http://localhost:3000/api/' ,
																														'method' : 'GET' ,
																																								'json' : {} ,
																																															'qs' : {}		
		} ,

	'multer' :  multer.diskStorage({
 																		'destination' : function (req, file, cb) {
																																								var photoPath = String('./public/users/');
																																																															cb(null, photoPath);		
																											  } ,

							'filename' : function (req , file , cb) {
																												fileName = $filename(file);
    																																									cb(null, fileName)			}
  		}) ,

		'checkFileUpload' : (req , res , next) => {
																									if (!req.file) {		req.body.error2 = errors.error2;		}
																				next();
		} ,

		'validate' : (req , res , next) => {
				
				if (req.file) {		key = req.file.key;

													params = {'Bucket' : 'aremi-users-photo' , 'Key' : key };
													
													s3.getObject(params , (err , data) => {	

														if (data) {

																if (data.Body) {
																									let bitmap = data.Body.toString('hex' , 0 , 4);

																													if (!imageMagic.checkMagic(bitmap)) {

									 								s3.deleteObject(params , (err , deleted) => {
											 																														if (err) {
											 																																				console.log(err) }      
											 																																					
											 																																					else {
								 																																												req.body.error3 = errors.error;
										 																																										
										 																																										console.log("Successfully deleted myBucket/myKey"); }
									 																									return next();
									 										});			}
																										else  {
																															return next();
												}		}			}			});
										}
					next();
		} ,

	'addFileUpload' : (req , res , next) => {
																						if (req.file) {	
																														req.body.profile_photo = req.file; }
																						next();
	} ,

	'mConfig' : multerS3({
													's3' : s3Conf ,
																			    'bucket': 'aremi-users-photo' ,
																					        													'acl': 'public-read-write' , 
																			    																																'key' : (req, file, cb) => {
																																																																				fileName = $filename(file);
																			     																																																													 cb(null, fileName)						} ,

																			    																																	'metadata' : (req , file , cb) => {
																			    																																																				cb(null , {'fieldName' : file.fieldname})				}
						}) ,

	'delete' : (req , errArr) => {
			
			errArr.push({
										'location' : 'body' ,
										'param' : 'profile_photo' ,
										'value' : '' ,
										'msg' : 'Profile Photo have to be re-uploaded due to invalid data in other field parameters.'
			});
						key = req.file.key;
																params = {'Bucket' : 'aremi-users-photo' , 'Key' : key };

																			 								s3.deleteObject(params , (err , deleted) => {
																				 																														if (err) {
																				 																																				console.log(err) }      
																													 																																					else {
																										 																																												console.log("Successfully deleted myBucket/myKey"); }		}); 
			} 

}