var imageMagic = require('./mime_validator/photomagic.js') , $nameFile = require('./name_file') , key = '' , params = '' , bitmap = '' ,

objectValidation = {'objectType' : true , 'objectSize' : true , 'objectValid' : true} ,

errors = require('./errors/image') , photoPhotos = require('./buckets/s3/photo-photos') , photoS3 = require('./buckets/s3/photoS3');	

aws = require('aws-sdk') , param1 = '' , multerS3 = require('multer-s3') , s3Conf = photoPhotos() , fs = require('fs');

aws.config.update(photoS3);
	
var s3 = new aws.S3();

module.exports = {

		'reqOptions' : {		'url' : 'http://localhost:3000/api/photo/' ,
																																			'method' : 'GET' ,
																																													'json' : {} ,
																																																				'qs' : {}			} ,
		'checkFileUpload' : (req , res , next) => {

																									if (!req.file) {		req.body.error2 = errors.error2;		}
																				next();
		} ,

		'validate' : (req , res , next) => {

				if (req.file) {		key = req.file.key;

													params = {'Bucket' : process.env.photos_bucket , 'Key' : key };
													
													s3.getObject(params , (err , data) => {	

														if (data) {

																if (data.Body) {
																									let bitmap = data.Body.toString('hex' , 0 , 4);

																													if (!imageMagic.checkMagic(bitmap , req)) {

									 								s3.deleteObject(params , (err , deleted) => {
											 																														if (err) {
											 																																				console.log(err) 			}
				 																																					else {
				 																																									objectValidation.objectType = false;

				 																																									req.body.error3 = errors.error;
				 																																										
				 																																									return next();
				 																																	}			});		}
																		else {	
																							return next();	}
									}			}				});			}
					else {
									return next();
					}
	} ,

	'checkFileSize' : (req , res , next) => {

		var imageSize = 500 * 1024 * 1024;

		if (req.file) {
												if (req.file.size > imageSize && objectValidation.objectType) {	key = req.file.key;

														params = {'Bucket' : process.env.photos_bucket , 'Key' : key };

										 								 s3.deleteObject(params , (err , deleted) => {
												 																														if (err) {
												 																																				console.log(err) 			}
																																											else {
									 																																							req.body.error7 = errors.error7;

																																																	return next(); }
																																										});			}

												else if (req.file.size > imageSize) {
									 																						req.body.error7 = errors.error7;
																																							
																																							return next();		}
													else {
																	return next();		}		}
				else {
								return next();
				}
	} ,

	'localcheckFileSize' : (req , res , next) => {

		var imageSize = 500 * 1024 * 1024;

		if (req.files) {

		for (var i in req.files) {

					req.files[i].forEach(checkImageSize);			
		}

			function checkImageSize(item) {

				if (item.size > imageSize) {	key = item.filename;

						fs.unlinkSync('./public/photos/' + item.filename);

						if (!req.body.error7) req.body.error7 = errors.error7;

									}	
			}

									return next();

								}

												else if (req.file.size > imageSize) {
									 																						req.body.error7 = errors.error7;
																																							
																																							return next();		}
													else {
																	return next();		}		}



				else {
								return next();
				}
	} ,

	'localValidate' : (req , res , next) => {	if (req.files) {

		for (var i in req.files) {

			console.log(req.files[i]);

					req.files[i].forEach(checkItem);			
		}

		function checkItem(item) {

			console.log('11111');

			console.log(item);

			console.log('28187127821');

		var bitmap = fs.readFileSync('./public/photos/' + item.filename).toString('hex' , 0 , 4);

			if (!imageMagic.checkMagic(bitmap)) {
																				
						fs.unlinkSync('./public/photos/' + item.filename);
																																		req.body.error3 = errors.error	}  }	}

																																		console.log(req.body);

								return;
															next(); 		
	} ,

	'addFileUpload' : (req , res , next) => {
																						if (req.file) {	
																															req.body.photo_detail = req.file; }
				return next();
	} ,

	'mConfig' : multerS3({
													's3' : s3Conf ,
																			    'bucket': process.env.photos_bucket ,
																					        													
																					        													'acl': 'public-read-write' , 
																			    																																'key' : (req, file, cb) => {
																																																																				fileName = $nameFile.renameFile(file.originalname);

																			     																																																cb(null, fileName)			} ,

																			    																																	'metadata' : (req , file , cb) => {
																			    																																																				cb(null , {'fieldName' : file.fieldname})				}
															}) ,

	'delete' : (req , errArr) => {	

		if (!(req.body.error3 || req.body.error7)) {

			errArr.push(errors.error6);

			key = req.file.key , params = {'Bucket' : process.env.photos_bucket , 'Key' : key };

					s3.deleteObject(params , (err , deleted) => {
																												if (err) {
																																		console.log(err) }      
						 																						else {
			 																															console.log("Successfully deleted myBucket/myKey"); }
							}); 		}	
			} 
}