module.exports = (opt) => {

	const $Model = opt.$Model;

	const response = require('../config/response') , async = require('async');

	const cUser = require('../config/confirm-user');

	return {

		'entries' : (req , res , next) => {

				$Model
							.find({})

							.lean({})

							.hint({'_id' : 1})

							.populate({'path' : 'author' , 'select' : 'firstName lastName identityNumber _id'})

							.exec((err , entriesResult) => {

																				if (err) {	return response.errResponse(res , 400 , err);	}

									if (entriesResult.length == 0) {	return response.response(res , 404 , {'message' : `${opt.second} entries does not exists in the record or is not available.`});	}

																										return response.response(res , 200 , entriesResult);		});
		} ,

		'entryAddSubmit' : (req , res , next) => {

				$Model.findOne( {'author' : req.body.author })

				.exec((err , entryUpdate) => {
																				if (err) {	return response.errResponse(res , 400 , err);	}

																if (!entryUpdate) {	

				return $Model.updateOne( {'author' : req.body.author } , { '$inc' : { 'numberRemaining' : 1 } } , {'upsert' : true } ).then((entryUpdate) => {

																										return response.response(res , 200 , entryUpdate);	});		}

																if (entryUpdate) { entryUpdate.numberRemaining = entryUpdate.numberRemaining + 1;

				return entryUpdate.save((err , entryResult) => {

																				if (err) {	return response.errResponse(res , 400 , err);	}

																										return response.response(res , 200 , entryResult);	});		}		});
		} ,

			'entryAdd2' : (req , res , next) => {

				$Model.updateOne( {'author' : req.body.author } , { '$inc' : { 'numberRemaining' : 1 } } , {'upsert' : true , 'runValidators' : true} ).then((entryUpdate) => {

																										return response.response(res , 200 , entryUpdate);		});																						
		} ,


		'entryDetail' : (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) {

						$Model.findOne({'_id' : entry})

						.lean({})

						.populate({'path' : 'author' , 'select' : 'firstName lastName identityNumber _id'})

						.select('_id author numberRemaining status updatedAt')

						.exec((err , entryResult) => {
																						if (err) {	return response.errResponse(res , 400 , err);	}

																		if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																												cUser.$isOwnerGeneral(req , res , next , entryResult , cUser.successReponse , opt.second);		}); }
				
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,


		'entryUpdate' : (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) {

						$Model.findOne({'_id' : entry})

						.lean({})

						.populate({'path' : 'author' , 'select' : 'firstName lastName identityNumber _id'})

						.select('numberRemaining author status')

						.exec((err , entryResult) => {
																						if (err) {	return response.errResponse(res , 400 , err);	}

																		if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																												cUser.$isOwnerGeneral(req , res , next , entryResult , cUser.successReponse , opt.second);		}); }
				
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

		'entryUpdateSubmit' : (req , res) => { let entry = req.params.entry;

			if (req.body && req.body.numberRemaining && req.body.numberRemaining > 3) {	

				return response.response(res , 400 , {'message' : `Number Remaining for Entry cannot be greater than or exceed number 3.`});	}

				if (req.params && req.params.entry) {

					$Model.findOne( {'_id' : entry })

					.exec((err , entryUpdate) => {
																					if (err) {	return response.errResponse(res , 400 , err);	}

																	if (!entryUpdate) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																	if (entryUpdate) { entryUpdate.numberRemaining = req.body.numberRemaining;

					return entryUpdate.save((err , entryResult) => {

																					if (err) {	return response.errResponse(res , 400 , err);	}

																											return response.response(res , 200 , entryResult);	});		}		});
			
				} else {	return response.response(res , 404 , {'message' : `No ${modelType} id provided. Please provide a valid ${modelType} id.`});		}
		} ,

		'entryExists' : (req , res , next) => { let entry = req.params.entry;

			if (req.params && req.params.entry) {

					$Model.findOne({'_id' : entry })																		
																					.lean({})

																					.select('_id')
																					
																					.exec((err , entryResult) => {

																												if (err) {			return response.errResponse(res , 400 , err);		}

																									if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}
																																				
																																				return response.response(res , 200 , entryResult);		})		}
					
				else { return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});	}
		} , 

		'entryDelete' : (req , res , next) => {	let entry = req.params.entry;

			if (req.params && req.params.entry) {
				
				$Model.findOne({'_id' : entry})

																		.lean({})

																		.populate({'path' : 'author' , 'select' : 'firstName lastName identityNumber _id'})

																		.select('numberRemaining author -_id')

																		.exec((err , entryResult) => {
																																		
																								if (err) {		return response.errResponse(res , 400 , err);		}
																				
																				if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																					if (entryResult) {	return response.response(res , 200 , entryResult);	}		});		} 	
			
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

	}

}