const joiOptions = { 'convert' : false , 'abortEarly' : false , 'allowUnknown' : true };

const joiToMongoose = require('joi-errors-for-forms').mongoose;

const convertToMongoose = joiToMongoose({
																					'string.regex.base': (context) => {
																						
																						switch (context.pattern.toString()) {
																							
																							case /^[0-9a-fA-F]{24}$/.toString() :

																								return i18n('"${label}" should be a valid and an existing id in the record.');
																			} }
	});


module.exports = {

	'courseRegistration' : (req , res , next) => {

		courseRegistration.courseRegistration.validate(req.body , joiOptions , (err) => {

			if (err) {
									var errors = convertToMongoose(err);

									console.log(errors);

									return config.joiErrResponse(res , 400 , errors);			
			}		else {
									return next();			}		});
	} ,

	'courseRegistration1' : (req , res , next) => {

		console.log('Request Reached');

		console.log(req.body);

		console.log('Follows');

		status = 	courseRegistration.courseRegistration.validate(req.body , joiOptions);

		console.log(JSON.stringify(status));

		var errors = convertToMongoose(status);

		console.log(errors);
	} ,
}

function i18n(str) { return str; } 