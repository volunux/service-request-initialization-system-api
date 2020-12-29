var mongoose = require('mongoose') , compiledErrors = {} , errors = '';

module.exports = {

	'gracefulShutdown' : function(msg , callback) {
																										mongoose.connection.close(function() {
																																														console.log('Mongoose disconnected through ' + msg);
																																																																									callback();
																										});
	} ,

	'response' : function(res , status , body) {
																								res.status(status);
																																		res.json(body);
	} ,

	'errResponse' : (res , status , err) => {

					errors	= err.errors;

					compiledErrors = {};

				for (error in errors) {

										 compiledErrors[error] = {};

											for (here in errors[error]) {

													compiledErrors[error]['message'] = errors[error]['message'];	

													compiledErrors[error]['name'] = errors[error]['name'];

									//				compiledErrors[error]['reason'] = errors[error]['reason'];

											}
								}

										res
												.status(status)
																				.json(compiledErrors);

	} ,

'joiErrResponse' : (res , status , err) => {

					var errors	= err;

					compiledErrors = {};

				for (error in errors) {

										 compiledErrors[error] = {};

											for (here in errors[error]) {

													compiledErrors[error]['message'] = errors[error]['message'].replace(/"/g , '');	

													compiledErrors[error]['name'] = errors[error]['name'];
											}
								}

										res
												.status(status)
																				.json(compiledErrors);

	} 

}