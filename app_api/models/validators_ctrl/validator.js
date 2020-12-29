const joiOptions = { 'convert' : false , 'abortEarly' : false , 'allowUnknown' : true };

const joiToMongoose = require('joi-errors-for-forms').mongoose;

const config = require('../../config/config');

const photoSchemaValidator = require('../validators/photo');

const articleSchemaValidator = require('../validators/article');

const nameSchemaValidator = require('../validators/name');

var photoS3 = require('../../../app_server/config/buckets/s3/photoS3');

aws.config.update(photoS3);

s3 = new aws.S3();

const convertToMongoose = joiToMongoose({
																					'string.regex.base': (context) => {
																						
																						switch (context.pattern.toString()) {
																							
																							case /^[0-9a-fA-F]{24}$/.toString() :

																								return i18n('"${label}" should be a valid and an existing id in the record.');
																			} }
	});


module.exports = {

	'photo' : (req , res , next) => {

		photoSchemaValidator.photoSchema.validate(req.body , joiOptions , (err) => {

			if (err) {

					key = req.body.photo_detail.key , params = {'Bucket' : process.env.photos_bucket , 'Key' : key };

							s3.deleteObject(params , (err , deleted) => {
																														if (err) {
																																				console.log(err) }      
								 																						else {
					 																															console.log("Successfully deleted myBucket/myKey"); }		}); 
									var errors = convertToMongoose(err);

									return config.joiErrResponse(res , 400 , errors);			
			}		else {
									return next();			}		});
	} ,

	'name' : (req , res , next) => {

		photoSchemaValidator.nameSchema.validate(req.body , joiOptions , (err) => {

			if (err) {

					key = req.body.photo_detail.key , params = {'Bucket' : process.env.names_bucket , 'Key' : key };

							s3.deleteObject(params , (err , deleted) => {
																														if (err) {
																																				console.log(err) }      
								 																						else {
					 																															console.log("Successfully deleted myBucket/myKey"); }		}); 
									var errors = convertToMongoose(err);

									return config.joiErrResponse(res , 400 , errors);			
			}		else {
									return next();			}		});
	} ,

	'article' : (req , res , next) => {

		articleSchemaValidator.articleSchema.validate(req.body , joiOptions , (err) => {

			if (err) {

					key = req.body.photo_detail.key , params = {'Bucket' : process.env.posts_bucket , 'Key' : key };

							s3.deleteObject(params , (err , deleted) => {
																														if (err) {
																																				console.log(err) }      
								 																						else {
					 																															console.log("Successfully deleted myBucket/myKey"); }		}); 
									var errors = convertToMongoose(err);

									return config.joiErrResponse(res , 400 , errors);			
			}		else {
									return next();			}		});
	} 

}

function i18n(str) { return str; } 