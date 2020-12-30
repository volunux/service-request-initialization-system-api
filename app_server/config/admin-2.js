var imageMagic = require('./mime_validator/photomagic.js') , $nameFile = require('./name_file') , key = '' , params = '' , bitmap = '' , multer = require('multer');

objectValidation = {'objectType' : true , 'objectSize' : true , 'objectValid' : true} ,

errors = require('./errors/request') , photoPhotos = require('./buckets/s3/photo-photos') , photoS3 = require('./buckets/s3/photoS3') , $fileName = require('./filename');

aws = require('aws-sdk') , param1 = '' , multerS3 = require('multer-s3') , s3Conf = photoPhotos() , fs = require('fs');

aws.config.update(photoS3);
	
var s3 = new aws.S3();

module.exports = {

	'mConfig' : multerS3({
													's3' : s3Conf ,
												
													'bucket': process.env.photos_bucket ,
																					        													
													'acl': 'public-read-write' , 

				'key' : (req, file, cb) => {	fileName = $nameFile.renameFile(file.originalname);

																cb(null, fileName)	} ,

				'metadata' : (req , file , cb) => {
																			
																cb(null , {'fieldName' : file.fieldname})		}
		}) ,

		'checkFileUpload' : (req , res , next) => {

			return next();
		
		} ,

	'deleteAfterType' : (req , res , next) => { let itemKeys = [] , availableobject = false;

		if (req.files && req.body.error3)	{

				for (let j in req.files) {

					if (req.files[j].length) {

						if (!req.body.error8) { req.body.error8 = errors.error8;	}

						availableobject = true;

						req.files[j].forEach((item , idx) => { 

							delete req.files[j].splice(idx , 1);

							itemKeys.push({'Key' : item.key});	})	}	}

					if (availableobject) {

			params = {'Bucket' : process.env.photos_bucket , 'Delete' : {'Objects' : itemKeys	} };

				s3.deleteObjects(params , (err , deleted) => {	if (err) {	console.log(err) }      
					
							else {	console.log(deleted); }

							return next();	});		}	}

				else {	return next();	}
	} ,

	'deleteAfterSize' : (req , res , next) => {  let itemKeys = [] , keysDelete = [];

		if (Object.keys(req.files).length && req.body.error7)	{

				for (let j in req.files) {

										if (req.files[j].length) {

						if (!req.body.error8) { req.body.error8 = errors.error8;	}

						req.files[j].forEach((item , idx) => { 

							delete req.files[j].splice(idx , 1);

							itemKeys.push({'Key' : item.key});		})	}	}

			params = {'Bucket' : process.env.photos_bucket , 'Delete' : {'Objects' : itemKeys	} };

				s3.deleteObjects(params , (err , deleted) => {	if (err) {	console.log(err) }      
					
					else { console.log(deleted); }	}); 	}

		return next();

	} ,

	'checkFileSize' : (req , res , next) => { var counter = 0 , numFiles = 0 , runned = false;

		var imageSize = 500 * 1024;	

		if (Object.keys(req.files).length) {

			for (var i in req.files) {

					numFiles += req.files[i].length;

				if (req.files[i].length) {

			req.files[i].forEach(checkImageSize);	}		}

			function checkImageSize(item) {

				if (item.size > imageSize) {

					params = {'Bucket' : process.env.photos_bucket , 'Key' : item.key };

					s3.deleteObject(params , (err , deleted) => {	if (err) { console.log(err) }	});

						if (!req.body.error7) { 

							req.body.error7 = errors.error7;	

								runned = true;

							return next();	}		}		

							else { counter++;		}		}	

								if (counter == numFiles && !runned) {	return next();	}	}
			
			else {	return next();	}
	} ,

	'validate' : (req , res , next) => {	var counter = 0 , numFiles = 0 , runned = false;

		if (Object.keys(req.files).length) {

		for (var i in req.files) {

			numFiles += req.files[i].length;

			req.files[i].forEach(checkItem);	}

		function checkItem(item , idx) {

			params = {'Bucket' : process.env.photos_bucket , 'Key' : item.key };

			s3.getObject(params , (err , data) => {

				if (data) {

					if (data.Body) { let bitmap = data.Body.toString('hex' , 0 , 4);

						if (!imageMagic.checkMagic(bitmap , req)) {

							return s3.deleteObject(params , (err , deleted) => {	if (err) {	console.log(err) 	}

								else { console.log(deleted); }

								delete req.files[i].splice(idx , 1);

				if (!req.body.error3) {	req.body.error3 = errors.error;

					runned = true;

					return next();	}	});		}	

				else { counter++;

							if (counter == numFiles && !runned) { return next();	}	}		}	}	});	}	}
									
				else {	return next();	} 		
	} ,

	'addFileUpload' : (req , res , next) => { let imageNames = ['profilePhoto' , 'signature'] , idx = 0;

			if (Object.keys(req.files).length) {

				for (let j in req.files) {

					if (req.files[j].length) {

						for (let k = 0; k <= Object.keys(req.files).length; k++) {

							if (req.files[imageNames[k]]) {

							 req.body[imageNames[k]] = req.files[j][0];	 }

							 idx += 1;		}	}	}	}

				return next();
	} ,

		'confirmPhotoAndSignature' : (req , res , next) => {

			if (req.body.compProfilePhoto) {	req.body.compProfilePhoto = JSON.parse(req.body.compProfilePhoto);	}

				if (req.body.compSignature) {	req.body.compSignature = JSON.parse(req.body.compSignature);	}

			if (req.body.compProfilePhoto && req.body.compProfilePhoto.location) {	

				if (req.body.compProfilePhoto.location) { req.body.profilePhoto = req.body.compProfilePhoto;

					delete req.body.compProfilePhoto;	}

					else { delete req.body.compProfilePhoto	}	}

			if (req.body.compSignature) {	

				if (req.body.compSignature.location) { req.body.compSignature = req.body.compSignature;

					delete req.body.compSignature;	}

					else { delete req.body.compSignature;	}	}
	} ,

		'addUploadErrors' : (req , res , next , errorList) => {

			if (req.body.error3) {	errorList.push(req.body.error3);		}

			if (req.body.error7) {	errorList.push(req.body.error7);		}

			if (req.body.error8) {	errorList.push(req.body.error8);		}

	} ,

	'delete' : (req , errorList) => {	

		if ((!(req.body.error3 || req.body.error7)) && Object.keys(req.files).length) {

			errorList.push(errors.error6);

				for (let j in req.files) {

						if (req.files[j].length) {

						req.files[j].forEach((item , idx) => { 

							delete req.files[j].splice(idx , 1);

							itemKeys.push({'Key' : item.key});		})	}		}

			params = {'Bucket' : process.env.photos_bucket , 'Delete' : {'Objects' : itemKeys	} };

				s3.deleteObjects(params , (err , deleted) => {	if (err) {	console.log(err) }      
					
							else {	console.log(deleted); }	}); }			
			} 
}