const passport = require('passport');

const mongoose = require('mongoose');

const User = mongoose.model('User');

const response = require('../../config/response');

var Country = require('../../models/models').Country , Department = require('../../models/models').Department , 

Faculty = require('../../models/models').Faculty , Level = require('../../models/models').Level , async = require('async') , security = require('../../config/security') , token = '' , foundUser = '';

module.exports = {

	'signup' : (req , res , next) => {		
		
			async.parallel({
							'Department' : (callback) => {
															Department.find({})
																				.hint({'_id' : 1})

																				.select('_id')

																				.exec(callback);	} ,
							'Faculty' : (callback) => {
														Faculty.find({})
																		.hint({'_id' : 1})

																		.select('_id')

																		.exec(callback);	} ,
							'Level' : (callback) => {
														Level.find({})
																	.hint({'_id' : 1})

																	.select('_id')

																	.exec(callback);	}	} , 
			(err , result) => {	
																if (err) { return response.errResponse(res , 400 , err);	}

														if (!result) { return response.response(res , 404 , {'message' : 'Data cannot be retrieved.'});	}

			if (result.Department.length == 0) { return response.response(res , 404 , {'message' : 'Department entries does not exist in the record or is not available.'});		}

					if (result.Faculty.length == 0) { return response.response(res , 404 , {'message' : 'Faculty entries does not exist in the record or is not available.'});		}

						if (result.Level.length == 0) {	return response.response(res , 404 , {'message' : 'Level entries does not exist in the record or is not available.'});		}

														return response.response(res , 200 , result); });
	} , 

	'signupSubmit' : (req , res) => { userData = req.body;

		if (!req.body.emailAddress && !req.body.password && !req.body.username) {	return response.response(res , 400 , {'message' : 'All fields are required.'});		}

									async.parallel({
													'emailUser' : (callback) => { User.findOne({'emailAddress' : userData.emailAddress} , {'emailAddress' : 1})
																																																																						.exec(callback);	} ,
													'usernameUser' : (callback) => { User.findOne({'username' : userData.username} , {'username' : 1})
																																																																				.exec(callback);	}	} ,
				(err , result) => {	
										if (err) {	return response.errResponse(res , 400 , err);		}
			
			if (result.emailUser) { return response.response(res , 409 , {'message' : 'E-mail Address already exist in the record and is not avaialable to new a user.'});		}
	
		if (result.usernameUser) {	return response.response(res , 409 , {'message' : 'Username already exist in the record and is not avaialable to new a user.'});		}

			if (!(result.emailUser && result.usernameUser)) { let user = new User(req.body);
				
				user.setPassword(req.body.password);

				user.save((err , user ) => {
											if (err) {	return response.errResponse(res , 400 , err);	} 

												else { uIdentity = user._id;

															token = user.generateJwt();

															security.encryptor(req , res , token , uIdentity);	}		});		}		});
		} ,

		'signin' : (req, res) => {

			if (!req.body.emailAddress || !req.body.password) { return response.response(res , 400 , {'message' : 'All fields are required.'});	}

				passport.authenticate('local', (err, user, info) => {
					
						if (err) { return response.response(res , 400 , err);	}

						if (user) {	let uIdentity = user._id;

													token = user.generateJwt();

													security.encryptor(req , res , token , uIdentity); }
					
				else { return response.response(res , 401 , info);	} })(req , res);
		} ,

		'signout' : (req, res) => { let token = req.cookies.sid && req.cookies.s_id;

			if (!token) {	return response.response(res , 401 , {'message' : 'Please provide credentials.'}); }

					res.clearCookie('sid');

					res.clearCookie('s_id');

					response.response(res , 200 , {'message' : 'Successfully signed out.'});
		}

}
//http://evening-garden-47445.herokuapp.com/api/continent