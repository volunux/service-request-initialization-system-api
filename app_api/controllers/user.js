const mongoose = require('mongoose') , crypto = require('crypto');

module.exports = (opt) => {

	const $Model = opt.$Model;

	const Unit = opt.Unit;

	const Upload = opt.Upload;

	const Country = opt.Country;

	const Department = opt.Department;

	const Faculty = opt.Faculty;

	const Level = opt.Level;

	const mailer = require('../config/mail');

	const response = require('../config/response') , async = require('async');

	const objectControl = require('../config/object');

	const modelCtrl = require('../helpers/model-ctrl');

	return {

	'entryExists' : (req , res , next) => {	let entry = req.user._id;

		if (req.user) {

				$Model.findOne({'_id' : entry })																		
																				.lean({})

																				.select('_id')
																				
																				.exec((err , entryResult) => {

																			if (err) {						return response.errResponse(res , 400 , err);		}

																			if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}
																														
																														return response.response(res , 200 , entryResult);		})		}
				else {
								return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});			}
		} , 

			'entryAdd' : (req , res , next) => {

								async.parallel({
																	'Country' : (callback) => {
																															Country.find({})
																																							.lean({})
																																												.select('_id')
																																																				.hint({'_id' : 1 })
																																																														.exec(callback);	} ,
																	'Department' : (callback) => {
																																	Department.find({})
																																											.lean({})
																																																.select('_id')
																																																								.hint({'_id' : 1 })
																																																																		.exec(callback);		} ,
																	'Faculty' : (callback) => {
																															Faculty.find({})
																																								.lean({})
																																													.select('_id')
																																																					.hint({'_id' : 1 })
																																																															.exec(callback);	} ,
																	'Unit' : (callback) => {
																														Unit.find({})
																																								.lean({})
																																													.select('_id')
																																																					.hint({'_id' : 1 })
																																																															.exec(callback);	}
			} , (err , result) => {	
																		if (err) {
																														return response.errResponse(res , 400 , err);			}
																		
																				if (!result) {			return response.response(res , 404 , {'message' : `Data cannot be retrieved.`});	}

											if (result.Country.length == 0) {			return response.response(res , 404 , {'message' : `Country entries does not exists in the record or is not available.`});	}

										if (result.Department.length == 0) {		return response.response(res , 404 , {'message' : `Department entries does not exists in the record or is not available.`});	}

											if (result.Faculty.length == 0) {			return response.response(res , 404 , {'message' : `Faculty entries does not exists in the record or is not available.`});	}

												if (result.Unit.length == 0) {			return response.response(res , 404 , {'message' : `Unit entries does not exists in the record or is not available.`});	}

																														return response.response(res , 200 , result);			});
			} ,

			'entryAddSubmit' : (req , res , next) => { let newEntry = new $Model(req.body);

					newEntry.setPassword(req.body.password);

					newEntry.save((err , newEntry) => {
																							if (err) {				return response.errResponse(res , 400 , err);		} 

																							if (newEntry) {		return response.response(res , 200 , newEntry);		}		});
			} ,

		'entryDetail' : (req , res , next) => { let entry = req.user._id;

				if (req.user) {

						$Model.findOne({'_id' : entry})

						.lean({})

						.hint({'_id' : 1})

						.select('-hash -salt -password')

						.exec((err , entryResult) => {
																						if (err) {	return response.errResponse(res , 400 , err);	}

																		if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																												return response.response(res , 200 , entryResult);	}); }
				
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});			}
		} ,

		'entryDeactivateSubmit' : (req , res , next) => { let	$entry = req.body , entry = req.user._id;

				if (req.user) {

							$Model.findOne({'_id' : entry})

								.select('status _id')

								.exec((err , entryResult) => {

																		if (err) {						return response.errResponse(res , 400 , err);		}

																		if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

										if (entryResult.status != 'active') {	return response.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

							if (entryResult) {

								entryResult.status = 'deactivated';

								entryResult.save((err , entryResult1) => {

																						if (err) {						return response.errResponse(res , 400 , err);		}

																						if (entryResult1) {		return response.response(res , 201 , entryResult1);	}		});		}		});		}
		
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

		'entryUpdatePassword' : (req , res , next) => { let $entry = req.body , entry = req.user._id;

				if (req.user) {

				$Model.findOne({'_id' : entry})
																				.select('emailAddress hash salt')

																				.exec((err , entryResult) => {

																				if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

					if (!entryResult.validPassword($entry.password)) {	return response.response(res , 400 , {'message' : `The current password is incorrect and operation cannot not be fulfilled.`});	}

					entryResult.setPassword($entry.newPassword);

					entryResult.save((err , entryResult1) => {
																											if (err) {	return response.errResponse(res , 400 , err);		} 

																							if (entryResult1) {	mailer.passwordUpdate(req , res , next , entryResult1);	

																								delete entryResult1.hash;
																								delete entryResult1.salt;

																																	return response.response(res , 200 , entryResult1);		}		});	});		}
		
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} , 

/** Recent Additions **/

		'entryUpdate' : (req , res , next) => {	let entry = req.user._id;

				if (req.user) {

					$Model.findOne({'_id' : entry})

					.lean({})

					.select('firstName lastName country level about')

					.exec((err , entryResult) => {
																					if (err) {	return response.errResponse(res , 400 , err);	}

																	if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																	if (entryResult) {

									async.parallel({
																		'Country' : (callback) => {
																																Country.find({})
																																								.lean({})
																																													.select('_id')
																																																					.hint({'_id' : 1 })
																																																															.exec(callback);	} ,
																		'Level' : (callback) => {
																																Level.find({})
																																							.lean({})
																																												.select('_id')
																																																				.hint({'_id' : 1 })
																																																														.exec(callback);	} ,
				} , (err , result) => {	
																								if (err) {		return response.errResponse(res , 400 , err);		}
																			
																						if (!result) {		return response.response(res , 404 , {'message' : `Data cannot be retrieved.`});	}

												if (result.Country.length == 0) {			return response.response(res , 404 , {'message' : `Country entries does not exists in the record or is not available.`});	}

													if (result.Level.length == 0) {			return response.response(res , 404 , {'message' : `Level entries does not exists in the record or is not available.`});	}

																				if (opt.fifth) {			result[opt.fifth] = entryResult;	}

																															return response.response(res , 200 , result);		});		}	});		}

				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

		'entryUpdateSubmit' : (req , res , next) => { let	$entry = req.body , entry = req.user._id;

				if (req.user) {

					$Model.updateOne({'_id' : entry} ,

													{'$set' : $entry})
																						.lean({})

																						.exec((err , entryResult) => {

																												if (err) {		return response.errResponse(res , 400 , err);		}

																	if (!(entryResult.nModified > 0)) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

																		if (entryResult.nModified > 0) {	return response.response(res , 201 , {'_id' : req.user._id});	}		});		}
		
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} , 

		'updatePasswordSubmit' : (req , res , next) => { let $entry = req.body , entry = req.params.entry;

				if (req.params && req.params.entry) {

				$Model.findOne({'_id' : entry})
																				.select('hash salt')

																				.exec((err , entryResult) => {

																				if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

					if (!entryResult.validPassword($entry.password)) {	return response.response(res , 400 , {'message' : `The current password is incorrect and operation cannot not be fulfilled.`});	}

					entryResult.setPassword($entry.newPassword);

					entryResult.save((err , entryResult1) => {
																											if (err) {	return response.errResponse(res , 400 , err);		} 

																							if (entryResult1) {	mailer.passwordUpdate(newEntry);	

																																	return response.response(res , 200 , entryResult1);		}		});	});		}
		
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

		'updateProfilePhotoAndSignatureSubmit' : (req , res , next) => { let $entry = req.body , entry = req.user._id , keys = [];

				modelCtrl.pushSignatureAndPhoto($entry , keys);

				if (req.user) {

						$Model.findOneAndUpdate({'_id' : entry} , 

																		{'$set' : $entry } , 

																		{'new' : true })
																										.lean({})

																										.select('role _id')

																										.exec((err , entryResult) => {

															if (err) { for (var dxxx in $entry) {

																if ($entry[dxxx] && $entry[dxxx]['location']) { objectControl.objectDeleteServer($entry[dxxx]['location']);	}	}

																			return response.errResponse(res , 400 , err);	}

														if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

										if (entryResult) {

											if (keys && keys.length > 0) {

								Upload.updateMany( {'Key' :  {'$in' : keys } } , { '$set' : {	'entrySlug' : entryResult._id } } , {'upsert' : true} ).then((entryUpdate) => {

																														return response.response(res , 200 , entryResult);		});		}
																										
																									else {		return response.response(res , 200 , entryResult);		}		}		});		}
		
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		}  ,

			'entryDeactivate' : (req , res , next) => { let entry = req.user._id;

				if (req.user) {

						$Model.findOne({'_id' : entry })																		
																						.lean({})

																						.select('emailAddress identityNumber status _id')
																						
																						.exec((err , entryResult) => {

																				if (err) {						return response.errResponse(res , 400 , err);		}

																				if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

												if (entryResult.status != 'active') {	return response.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

																															return response.response(res , 200 , entryResult);		})		}

				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});			}
		} , 

		'entryReactivate' : (req , res , next) => { let entry = req.user._id;

				if (req.user) {

						$Model.findOne({'_id' : entry })																		
																						.lean({})

																						.select('emailAddress identityNumber status _id')
																						
																						.exec((err , entryResult) => {

																				if (err) {						return response.errResponse(res , 400 , err);		}

																				if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

									if (entryResult.status != 'deactivated') {	return response.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}
																															
																															return response.response(res , 200 , entryResult);		})		}

				else { return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});	}
		} ,

		'entryReactivateSubmit' : (req , res , next) => { let	$entry = req.body , entry = req.user._id;

				if (req.user) {

							$Model.findOne({'_id' : entry})

								.select('status _id')

								.exec((err , entryResult) => {

																						if (err) {			return response.errResponse(res , 400 , err);		}

																			if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

								if (entryResult.status != 'deactivated') {	return response.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

					if (entryResult) {

						entryResult.status = 'active';

						entryResult.save((err , entryResult1) => {

																				if (err) {						return response.errResponse(res , 400 , err);		}

																				if (entryResult1) {		return response.response(res , 201 , entryResult1);	}		});		}		});		}
		
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

		'resetPassword' : (req, res, next) => { let token = req.params.token;

			 $Model.findOne({ 'resetPasswordToken' : token , 'resetPasswordExpires' : { $gt : Date.now() } })

			 		.lean({})

			 		.select('_id')

			 		.exec((err , entryResult) => {
			
									if (!entryResult) { return response.response(res , 400 , {'message' : `Password reset token is invalid or has expired. Kindly request for another password reset token`});	}

									if (entryResult) {	return response.response(res , 200 , {'message' : `${opt.second} password reset token successfully retrieved.`});	}	});
		} ,

		'resetPasswordSubmit' : (req , res , next) => { let token = req.params.token;

				async.waterfall([
						
					(done) => {

					$Model.findOne({ 'resetPasswordToken' : token , 'resetPasswordExpires' : { $gt: Date.now() } })

							.select('resetPasswordToken resetPasswordExpires hash salt password emailAddress')

							.exec((err , entryResult) => {

								if (err) { done(err , entryResult); }

						if (!entryResult) { return response.response(res , 400 , {'message' : `Password reset token is invalid or has expired. Kindly request request for another password reset token.`});	}

									entryResult.setPassword(req.body.newPassword);

									entryResult.resetPasswordToken = undefined;
									
									entryResult.resetPasswordExpires = undefined;

									entryResult.save((err , entryResult1) => { done(err , entryResult);	});		}); } ,
					
					(user , done) => { mailer.successfulReset(req , res , next , user , done);	

								done(null , user);	} ] ,

					(err) => {

							if (err) {	return response.response(res , 400 , {'message' : `Password reset token is invalid or has expired. Kindly request request for another password reset token`});	}
								
								else {	return response.response(res , 200 , {'message' : `Password successfully changed and updated.`});	}
				});
		} ,

		'entryforgotPasswordSubmit' : (req , res , next) => {

				async.waterfall([
					
					(done) => {					crypto.randomBytes(20 , (err , buf) => {	token = buf.toString('hex');
															
															done(err , token);	});		} ,

					(token , done) => {
															$Model.findOne({ 'emailAddress' : req.body.emailAddress })

																.select('resetPasswordToken resetPasswordExpires emailAddress _id')

																.exec((err , entryResult) => {

								if (!entryResult) {		return response.response(res , 404 , {'message' : `No account or profile with that email address exists in the record.`});	}

							if (entryResult) {
																	entryResult.resetPasswordToken = token;

																	entryResult.resetPasswordExpires = Date.now() + 3600000;

																	entryResult.save((err) => {	done(err , token , entryResult);		});		}		});		} ,

				(token , user , done) => { mailer.forgotPassword(req , res , next , token , user , done);	

								done(null , user); 	}		] ,

				(err , user) => {

										if (err) {	return response.errResponse(res , 400 , err);	}

																return response.response(res , 200 , {'message' : `A message to be able to reset your profile password have been sent to your email address`});		});
		} ,

	}

}