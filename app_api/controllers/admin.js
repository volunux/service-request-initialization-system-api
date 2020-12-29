const mongoose = require('mongoose') , crypto = require('crypto');

module.exports = (opt) => {

	const $Model = opt.$Model;

	const Unit = opt.Unit;

	const Upload = opt.Upload;

	const Country = opt.Country;

	const Department = opt.Department;

	const Faculty = opt.Faculty;

	const Level = opt.Level;

	const response = require('../config/response') , async = require('async');

	const modelCtrl = require('../helpers/model-ctrl');

	const objectControl = require('../config/object');

	const mailer = require('../config/mail');

	return {

	'entryExists' : (req , res , next) => { let entry = req.params.entry;

		if (req.params && req.params.entry) {

				$Model.findOne({'_id' : entry })																		
																				.lean({})

																				.select('_id')
																				
																				.exec((err , entryResult) => {

																								if (err) {						return response.errResponse(res , 400 , err);		}

																								if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}
																																			
																																			return response.response(res , 200 , entryResult);	})		}
			
				else { return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});	}
		} , 

		'entries' : (customQuery) => { return (req , res , next) => { let customQuery = req.body.finalQuery , page = parseInt(req.query.page) ? (parseInt(req.query.page , 10) - 1) * 10 : 0;

				if (req.query.page) {	modelCtrl.removeQueryPage(req.query);	}

				delete customQuery.page;

				console.log('I reached here');

				console.log(customQuery);

				$Model
							.find(customQuery)

							.lean({})

							.skip(page)

							.limit(11)

							.sort('createdAt')

							.select('username firstName lastName emailAddress department faculty level identityNumber role status _id')

							.exec((err , entriesResult) => {

																				if (err) {	return response.errResponse(res , 400 , err);	}

									if (entriesResult.length == 0) {	return response.response(res , 404 , {'message' : `${opt.second} entries does not exists in the record or is not available.`});	}

																										return response.response(res , 200 , entriesResult);	});		}
		} ,

		'entryDetail' : (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) {

						$Model.findOne({'_id' : entry})

						.lean({})

						.hint({'_id' : 1})

						.exec((err , entryResult) => {
																						if (err) {	return response.errResponse(res , 400 , err);	}

																		if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																												return response.response(res , 200 , entryResult);	}); }
				
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});	}
		} ,

		'entryRequestDetail' : (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) {

						$Model.findOne({'_id' : entry})

						.lean({})

						.hint({'_id' : 1})

						.exec((err , entryResult) => {
																						if (err) {	return response.errResponse(res , 400 , err);	}

																		if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

								if (entryResult.status != 'pending') {	return response.response(res , 404 , {'message' : `${opt.second} entry has already been approved and cannot be approved more than once.`});	}

																												return response.response(res , 200 , entryResult);	}); }
				
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});	}
		} ,

		'entryAdd' : (req , res , next) => {

								async.parallel({
																	'Country' : (callback) => {			Country.find({})
																																									.lean({})
																																														.select('_id')
																																																					.hint({'_id' : 1 })
																																																															.exec(callback);	} ,
																	'Department' : (callback) => {	Department.find({})
																																											.lean({})
																																																.select('_id')
																																																								.hint({'_id' : 1 })
																																																																		.exec(callback);	} ,
																	'Faculty' : (callback) => {			Faculty.find({})
																																									.lean({})
																																														.select('_id')
																																																						.hint({'_id' : 1 })
																																																																.exec(callback);	} ,
																	'Level' : (callback) => {				Level.find({})
																																								.lean({})
																																													.select('_id')
																																																					.hint({'_id' : 1 })
																																																															.exec(callback);	} ,
																	'Unit' : (callback) => {				Unit.find({})
																																								.lean({})
																																													.select('_id')
																																																					.hint({'_id' : 1 })
																																																															.exec(callback);	}
				} , (err , result) => {	
																						if (err) {			return response.errResponse(res , 400 , err);		}
																		
																				if (!result) {			return response.response(res , 404 , {'message' : `Data cannot be retrieved.`});	}

											if (result.Country.length == 0) {			return response.response(res , 404 , {'message' : `Country entries does not exists in the record or is not available.`});	}

										if (result.Department.length == 0) {		return response.response(res , 404 , {'message' : `Department entries does not exists in the record or is not available.`});	}

											if (result.Faculty.length == 0) {			return response.response(res , 404 , {'message' : `Faculty entries does not exists in the record or is not available.`});	}

												if (result.Level.length == 0) {			return response.response(res , 404 , {'message' : `Level entries does not exists in the record or is not available.`});	}

												if (result.Unit.length == 0) {			return response.response(res , 404 , {'message' : `Unit entries does not exists in the record or is not available.`});	}

																														return response.response(res , 200 , result);		});
		} ,

		'entryAddSubmit' : (req , res , next) => {	let newEntry = new $Model(req.body);

				newEntry.setPassword(req.body.password);

				newEntry.save((err , newEntryResult) => {
																									if (err) {	return response.errResponse(res , 400 , err);		}

																							if (newEntryResult) { if (newEntryResult.status != 'pending') { mailer.entryAdd(req , res , next , newEntryResult , true);	}

																															return response.response(res , 200 , newEntryResult);		}		});
		} ,

		'entryUpdate' : (req , res , next) => {	let entry = req.params.entry;

			if (req.params && req.params.entry) {

					$Model.findOne({'_id' : entry})

					.lean({})

					.hint({'_id' : 1})

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
																	'Department' : (callback) => {
																																	Department.find({})
																																											.lean({})
																																																.select('_id')
																																																								.hint({'_id' : 1 })
																																																																		.exec(callback);	} ,
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

										if (result.Department.length == 0) {		return response.response(res , 404 , {'message' : `Department entries does not exists in the record or is not available.`});	}

											if (result.Faculty.length == 0) {			return response.response(res , 404 , {'message' : `Faculty entries does not exists in the record or is not available.`});	}

												if (result.Level.length == 0) {			return response.response(res , 404 , {'message' : `Level entries does not exists in the record or is not available.`});	}

												if (result.Unit.length == 0) {			return response.response(res , 404 , {'message' : `Unit entries does not exists in the record or is not available.`});	}

																			if (opt.fifth) {			result[opt.fifth] = entryResult;	}

																														return response.response(res , 200 , result);		});		}	});		}

				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} , 

		'entryUpdateSubmit' : (req , res , next) => { let	$entry = req.body , entry = req.params.entry;

				if (req.params && req.params.entry) {

					$Model.updateOne({'_id' : entry} ,

													{'$set' : $entry})
																						.lean({})

																						.exec((err , entryResult) => {

																																if (err) {		return response.errResponse(res , 400 , err);		}

																				if (!(entryResult.nModified > 0)) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

																					if (entryResult.nModified > 0) {		return response.response(res , 201 , entryResult);	}		});		}
		
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} , 

		'entryRequestUpdate' : (req , res , next) => { let	$entry = req.body , entry = req.params.entry;

				if (req.params && req.params.entry) {

							$Model.findOne({'_id' : entry})

								.select('status _id')

								.exec((err , entryResult) => {

																		if (err) {						return response.errResponse(res , 400 , err);		}

																		if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

									if (entryResult.status != 'pending') {	return response.response(res , 403 , {'message' : `${opt.second} entry has already been approved and cannot be approved more than once.`});	}

							if (entryResult) {

								entryResult.status = 'active';

								entryResult.save((err , entryResult1) => {

																						if (err) {						return response.errResponse(res , 400 , err);		}

																						if (entryResult1) {		return response.response(res , 201 , entryResult1);	}		});		}		});		}
		
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} , 

		'updateProfile' : (req , res , next) => {	let entry = req.params.entry;

				if (req.params && req.params.entry) {

					$Model.findOne({'_id' : entry})

					.lean({})

					.hint({'_id' : 1})

					.select('firstName lastName emailAddress country level jambRegistrationNumber about')

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
																								if (err) {		return response.errResponse(res , 400 , err);			}
																			
																						if (!result) {		return response.response(res , 404 , {'message' : `Data cannot be retrieved.`});	}

												if (result.Country.length == 0) {			return response.response(res , 404 , {'message' : `Country entries does not exists in the record or is not available.`});	}

													if (result.Level.length == 0) {			return response.response(res , 404 , {'message' : `Level entries does not exists in the record or is not available.`});	}

																				if (opt.fifth) {			result[opt.fifth] = entryResult;	}

																															return response.response(res , 200 , result);		});		}	});		}

				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

		'updateProfileSubmit' : (req , res , next) => { let	$entry = req.body , entry = req.params.entry;

				if (req.params && req.params.entry) {

					$Model.updateOne({'_id' : entry} ,

													{'$set' : $entry})
																						.lean({})

																						.exec((err , entryResult) => {

																																if (err) {		return response.errResponse(res , 400 , err);		}

																				if (!(entryResult.nModified > 0)) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

																					if (entryResult.nModified > 0) {		return response.response(res , 201 , {'_id' : $entry._id});	}		});		}
		
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} , 

	'entryDelete' : (req , res , next) => {	let entry = req.params.entry;

			if (req.params && req.params.entry) {

				$Model.findOne({'_id' : entry })																		
																				.lean({})

																				.select('firstName lastName emailAddress country department identityNumber role _id')

																				.exec((err , entryResult) => {

																								if (err) {						return response.errResponse(res , 400 , err);		}

																								if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}
																																			
																																			return response.response(res , 200 , entryResult);		})		}

				else { return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});	}
		} , 

	'entryDeleteSubmit' : (req , res , next) => { let entry = req.params.entry;
		
			if (req.params && req.params.entry) {
					
					$Model.deleteOne({'_id' : entry})
																						.exec((err , entryResult) => {
																																			
																												if (err) {		return response.errResponse(res , 400 , err);		}
															
															if (!(entryResult.deletedCount > 0)) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																if (entryResult.deletedCount > 0) {		return response.response(res , 204 , {'message' : `Entry successfully removed from the record.`});	}		});		} 

				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}			
		} ,

		'entryDeactivate' : (req , res , next) => { let entry = req.params.entry;

			if (req.params && req.params.entry) {

					$Model.findOne({'_id' : entry })																		
																					.lean({})

																					.select('firstName lastName emailAddress identityNumber _id')
																					
																					.exec((err , entryResult) => {

																									if (err) {						return response.errResponse(res , 400 , err);		}

																									if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

																	if (entryResult.status != 'active') {	return response.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

																																				return response.response(res , 200 , entryResult);		})		}
					
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});			}
		} , 

		'entryDeactivateSubmit' : (req , res , next) => { let	$entry = req.body , entry = req.params.entry;

				if (req.params && req.params.entry) {

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

	'entryReactivate' : (req , res , next) => { let entry = req.params.entry;

			if (req.params && req.params.entry) {

					$Model.findOne({'_id' : entry })																		
																					.lean({})

																					.select('firstName lastName emailAddress identityNumber status _id')
																					
																					.exec((err , entryResult) => {

																									if (err) {						return response.errResponse(res , 400 , err);		}

																									if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

														if (entryResult.status != 'deactivated') {	return response.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}
																																				
																																				return response.response(res , 200 , entryResult);		})		}

				else { return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});	}
		} , 

		'entryReactivateSubmit' : (req , res , next) => { let	$entry = req.body , entry = req.params.entry;

				if (req.params && req.params.entry) {

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

	}

}