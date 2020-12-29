const mongoose = require('mongoose');

module.exports = (opt) => {

	const $Model = opt.$Model;

	const Unit = opt.Unit;

	const Upload = opt.Upload;

	const response = require('../config/response') , async = require('async');

	const modelCtrl = require('../helpers/model-ctrl');

	const objectControl = require('../config/object');

	const cUser = require('../config/confirm-user');

	return {

		'entries' : (req , res , next) => { let customQuery = req.body.finalQuery , page = parseInt(req.query.page) ? (parseInt(req.query.page , 10) - 1) * 10 : 0;

				if (req.query.page) {	modelCtrl.removeQueryPage(req.query);	}

				delete customQuery.page;

				$Model
							.find(customQuery)

							.lean({})

							.skip(page)

							.limit(10)

							.sort('createdAt')

							.populate({'path' : 'author' , 'select' : 'firstName lastName identityNumber level _id'})

							.select('applicationNumber status createdAt slug author requestType -_id')

							.exec((err , entriesResult) => {

																				if (err) {	return response.errResponse(res , 400 , err);	}

									if (entriesResult.length == 0) {	return response.response(res , 404 , {'message' : `${opt.second} entries does not exists in the record or is not available.`});	}

																										return response.response(res , 200 , entriesResult);	});
		} ,

		'entryDetail' : (unit) => { return (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) { var toHappen = undefined;

						$Model.findOne({'slug' : entry , 'unit' : unit})

						.lean({})

						.hint({'slug' : 1})

						.populate({'path' : 'author' , 'select' : 'firstName lastName department faculty level _id'})

						.populate({'path' : 'entryHandler' , 'select' : 'firstName lastName -_id'})

						.select('applicationNumber message documents status requestType slug createdAt updatedAt author entryHandler department faculty unit -_id')

						.exec((err , entryResult) => {
																						if (err) {	return response.errResponse(res , 400 , err);	}

																		if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

														cUser.$isOwner(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege);		}); }
				
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});			}		}
		} ,

		'entryExists' : (req , res , next) => { let entry = req.params.entry;

			if (req.params && req.params.entry) {

				$Model.findOne({'slug' : entry })																		
																					.lean({})

																					.select('slug -_id')

																					.exec((err , entryResult) => {

																								if (err) {						return response.errResponse(res , 400 , err);		}

																								if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

																																			return response.response(res , 200 , entryResult);		})		}
						
				else { return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});	}
		} , 

		'entryExists2' : (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) {

						$Model.findOne({'_id' : entry })																		
																						.lean({})

																						.select('_id')
																						
																						.exec((err , entryResult) => {

																										if (err) {						return response.errResponse(res , 400 , err);		}

																										if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}
																																					
																																					return response.response(res , 200 , entryResult);		})		}
						
					else { return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});	}
		} , 

		'entryUpdate' : (req , res , next) => {	let entry = req.params.entry;

			if (req.params && req.params.entry) {

					$Model.findOne({'slug' : entry})

					.lean({})

					.hint({'_id' : 1})

					.select('message requestType unit')

					.exec((err , entryResult) => {
																					if (err) {	return response.errResponse(res , 400 , err);	}

																	if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																if (entryResult) {

								async.parallel({
																	'Unit' : (callback) => {
																																	Unit.find({})
																																								.lean({})
																																													.select('_id')
																																																					.hint({'_id' : 1 })
																																																															.exec(callback);	} ,
			} , (err , result) => {	
																							if (err) {		return response.errResponse(res , 400 , err);		}
																		
																					if (!result) {		return response.response(res , 404 , {'message' : `Data cannot be retrieved.`});	}

												if (result.Unit.length == 0) {			return response.response(res , 404 , {'message' : `Unit entries does not exists in the record or is not available.`});	}

																			if (opt.fifth) {			result[opt.fifth] = entryResult;	}

																														return response.response(res , 200 , result);		});		}	});		}

				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} , 

		'entryUpdateSubmit' : (req , res , next) => {	let entry = req.params.entry;

			$Model
						.findOneAndUpdate({'slug' : entry} , 

															{'$set' : {'message' : req.body.message } } , 

															{'new' : false})
						.lean({})

						.populate({'path' : 'author' , 'select' : 'emailAddress -_id'})

						.select('status author')

						.exec((err , entryResult) => {

																if (err) {			return response.errResponse(res , 400 , err);		}

												if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

													if (entryResult) {		return response.response(res , 200 , {'message' : `${opt.second} Entry successfully updated.`})		}		});
		} , 

		'entryTimeline' : (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) { var toHappen = undefined; 

						$Model.findOne({'slug' : entry})

						.lean({})

						.hint({'slug' : 1})

						.populate({'path' : 'author' , 'select' : 'firstName lastName _id'})

						.populate({'path' : 'entryHandler' , 'select' : 'firstName lastName -_id'})

						.populate({'path' : 'timeline' , 'select' : 'text status slug stage author entryHandler unit -_id' , 

											'populate' : [{'path' : 'author' , 'select' : 'firstName lastName -_id'} , 

																		{'path' : 'entryHandler' , 'select' : 'firstName lastName -_id'} ,

											 {'path' : 'replies' , 'select' : 'text author entryHandler commentAuthorName -_id' , 

											'populate' : [{'path' : 'author' , 'select' : 'firstName lastName -_id'} ,
																		
																		{'path' : 'entryHandler' , 'select' : 'firstName lastName -_id'}] } ]} )

						.select('applicationNumber message status slug stage author entryHandler department faculty unit timeline -_id')

						.exec((err , entryResult) => {

																			if (err) {	return response.errResponse(res , 400 , err);	}

															if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

									if (req.params.isRefund) { cUser.$isOwnerRf(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege); }

									else { cUser.$isOwner(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege); }	});		}
					
					else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});			}
		} ,

	'entryDelete' : (req , res , next) => {	let entry = req.params.entry;

			if (req.params && req.params.entry) {

				$Model.findOne({'slug' : entry })																		
																				.lean({})

																				.select('message status _id')

																				.exec((err , entryResult) => {

																								if (err) {						return response.errResponse(res , 400 , err);		}

																								if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}
																																			
																																			return response.response(res , 200 , entryResult);		})		}

				else { return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});	}
		} , 

		'entryDeleteSubmit' : (req , res , next) => { let	entry = req.params.entry;

				if (req.params && req.params.entry) {
												
						$Model.findOneAndDelete({'slug' : entry})
																											.lean({})

																											.hint({'slug' : 1})

																											.select(`slug documents -_id`)

																											.exec((err , entryResult) => {
																										
																											if (err) {		return config.errResponse(res , 400 , err);		}

																							if (!entryResult) {		return config.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}
																									
																							if (entryResult && entryResult.documents && entryResult.documents.length != 0) { let itemKeys = [];

																									entryResult.documents.forEach((item) => {	itemKeys.push({'Key' : item.key.split('\\').pop() });	});

						param1 = {'Bucket' : process.env.object_bucket , 'Delete' : {	'Objects' : itemKeys , 'Quiet' : false } };

																		s3.deleteObjects(param1 , (err, data) => {
																			
																				if (err) {	console.log(err);	}
																		
																				if (data) {
															
								Upload.deleteMany({'Key' : {'$in' : itemKeys } })
																																	.exec((err , result) => {
																																														if (err) {	console.log(err);		}

																																																				console.log(result);		}) 	}		});
													async.parallel({
																										'Comment' : (callback) => {		$Model.deleteComments(entryResult.slug)
																																																													.exec(callback);	} ,
																										'Reply' : (callback) => {			$Model.deleteReplies(entryResult.slug)
																																																													.exec(callback);	} 
														} , (err , result) => {
																											if (err) {			return config.errResponse(res , 400 , err);		}

																											if (result) {		return config.response(res , 204 , {'message' : `Entry successfully removed from the record.`});	} });		}

																								else if (entryResult) {
													async.parallel({
																										'Comment' : (callback) => {		$Model.deleteComments(entryResult.slug)
																																																													.exec(callback);	} ,
																										'Reply' : (callback) => {			$Model.deleteReplies(entryResult.slug)
																																																													.exec(callback);	} 
														} , (err , result) => {
																											if (err) {				return config.errResponse(res , 400 , err);		}
																											
																											if (result) {			return config.response(res , 204 , {'message' : `Entry successfully removed from the record.`});	} });		}		})		}	
	
				else {	return config.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}	
		} ,

		'entryDeleteAll' : (req , res , next) => {

				$Model.find({})
												.lean({})

												.limit(1)

												.exec((err , entryResult) => {
																												if (err) {	return response.errResponse(res , 400 , err);		}
																		
																		if (entryResult.length == 0) {	return response.response(res , 404 , {'message' : `${opt.second} entries does not exists in the record or is not available.`});		}

																																		return response.response(res , 200 , entryResult);		});
		} ,	

		'entryDeleteAllSubmit' : (req , res , next) => {

				$Model.deleteMany({})
															.exec((err , entryResult) => {

																												if (err) {			return response.errResponse(res , 400 , err);		}

																if (!entryResult.deletedCount > 0) {		return response.response(res , 404 , {'message' : `${opt.second} entries does not exists in the record or is not available.`});		}
																							
																			if (entryResult.deletedCount) {		return response.response(res , 204 , {'message' : `Entries successfully removed from the record.`});		}		});
		} ,	
	}

}