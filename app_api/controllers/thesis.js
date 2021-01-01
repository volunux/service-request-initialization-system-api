const mongoose = require('mongoose') , crypto = require('crypto');

module.exports = (opt) => {

	const $Model = opt.$Model ? opt.$Model : undefined;

	const Unit = opt.Unit ? opt.Unit : undefined;

	const Upload = opt.Upload ? opt.Upload : undefined;

	const Country = opt.Country ? opt.Country : undefined;

	const Department = opt.Department ? opt.Department : undefined;

	const Faculty = opt.Faculty ? opt.Faculty : undefined;

	const Level = opt.Level ? opt.Level : undefined;

	const mailer = require('../config/mail');

	const response = require('../config/response') , async = require('async');

	const objectControl = require('../config/object');

	const modelCtrl = require('../helpers/model-ctrl');

	return {

			'entryAdd' : (req , res , next) => {

								async.parallel({
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
			} , (err , result) => {	
																							if (err) {		return response.errResponse(res , 400 , err);			}
																		
																				if (!result) {			return response.response(res , 404 , {'message' : `Data cannot be retrieved.`});	}

										if (result.Department.length == 0) {		return response.response(res , 404 , {'message' : `Department entries does not exists in the record or is not available.`});	}

											if (result.Faculty.length == 0) {			return response.response(res , 404 , {'message' : `Faculty entries does not exists in the record or is not available.`});	}

																														return response.response(res , 200 , result);			});
			} ,

		'entryAddSubmit' : (req , res , next) => { let $newEntry = new $Model(req.body) , keys = [];

				if ($newEntry.documents && $newEntry.documents.length > 0) { $newEntry.documents.forEach(modelCtrl.pushFileKeys , keys);	}

					$newEntry.save((err , newEntryResult) => {
																											if (err) {

																											if ($newEntry.document && $newEntry.document.location) {	objectControl.objectDeleteServer($newEntry.document.location);

																												return response.errResponse(res , 400 , err); 	}

																												return response.errResponse(res , 400 , err);		} 

																								if (newEntryResult) {

																									if ($newEntry.document && $newEntry.document.location) { let key = $newEntry.document.location.split('\\').pop();

						Upload.updateOne( {'Key' : key } , { '$set' : {	'entryId' : newEntryResult._id } } , {'upsert' : true} ).then((entryUpdate) => {

																												return response.response(res , 200 , newEntryResult);		});		}
																								
																							else {		return response.response(res , 200 , newEntryResult);		}		}	});
		} ,

		'entryDetail' : (req , res , next) => { let entry = req.user._id;

				if (req.user) {

						$Model.findOne({'_id' : entry})

						.lean({})

						.hint({'_id' : 1})

						.exec((err , entryResult) => {
																						if (err) {	return response.errResponse(res , 400 , err);	}

																		if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																												return response.response(res , 200 , entryResult);	}); }
				
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});			}
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
				} , (err , result) => {	
																								if (err) {		return response.errResponse(res , 400 , err);		}
																			
																						if (!result) {		return response.response(res , 404 , {'message' : `Data cannot be retrieved.`});	}

												if (result.Department.length == 0) {	return response.response(res , 404 , {'message' : `Department entries does not exists in the record or is not available.`});	}

													if (result.Faculty.length == 0) {		return response.response(res , 404 , {'message' : `Faculty entries does not exists in the record or is not available.`});	}

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

	}

}