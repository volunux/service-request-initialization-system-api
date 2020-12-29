module.exports = (opt) => {

	const $Model = opt.$Model;

	const response = require('../config/response');

	const modelCtrl = require('../helpers/model-ctrl');

	return {	

		'entries' : (selectFields) => { return (req , res , next) => { let customQuery = req.body.queryByType , page = req.query.page ? (parseInt(req.query.page , 10) - 1) * 10 : 0;

				if (req.query.page) {	modelCtrl.removeQueryPage(req.query);	}

				delete req.query.page;

				let finalQuery = {...customQuery , ...req.query};

				$Model
							.find(finalQuery)

							.lean({})

							.skip(page)

							.limit(11)

							.sort('createdAt')

							.select(selectFields)

							.exec((err , entryResult) => {
																							if (err) {	return response.errResponse(res , 400 , err);		}
													
													if (entryResult.length == 0) {	return response.response(res , 404 , {'message' : `${opt.second} entries does not exists in the record or is not available.`});		}

																													return response.response(res , 200 , entryResult);		});
		} 	},

		'entryCreate' : (req , res , next) => {	

				$Model.find({})
												.lean({})

												.select(`_id`)

												.hint({'_id' : 1})

												.exec((err , entryResult) => {
																												if (err) {	return response.errResponse(res , 400 , err);		}
																		
																		if (entryResult.length == 0) {	return response.response(res , 404 , {'message' : `${opt.second} entries does not exists in the record or is not available.`});		}

																																		return response.response(res , 200 , entryResult);		});
		} ,

		'entryExists' : (req , res , next) => {	let entry = parseInt(req.params.entry);
				
				if (req.params && req.params.entry) {

					$Model.findOne({'num' : entry })																		
																						.lean({})

																						.select(`_id`)
																						
																						.exec((err , entryResult) => {

																								if (err) {		return response.errResponse(res , 400 , err);		}

																				if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}
																															
																															return response.response(res , 200 , entryResult);		})	}
					
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

		'entryDetail' : (selectFields) => { return (req , res , next) => { let entry = parseInt(req.params.entry);

			if (req.params && req.params.entry) {

				$Model.findOne({'num' : entry})
																				.lean({})

																				.select(selectFields)

																				.exec((err , entryResult) => {

																								if (err) {		return response.errResponse(res , 400 , err);		}

																				if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																															return response.response(res , 200 , entryResult);	});	}		

				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} },

		'entryAddSubmit' : (req , res , next) => { let newEntry = new $Model(req.body);

				newEntry.save((err , entryResult) => {
																								if (err) {	return response.errResponse(res , 400 , err);		}
																											
																														return response.response(res , 200 , entryResult);	});
		} ,

		'entryUpdate' : (selectFields) => { return (req , res , next) => {	let entry = parseInt(req.params.entry);

			if (req.params && req.params.entry) {

					$Model.findOne({'num' : entry})

					.lean({})

					.select(selectFields)

					.exec((err , entryResult) => {
																					if (err) {	return response.errResponse(res , 400 , err);	}

																	if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																	if (entryResult) {	return response.response(res , 200 , entryResult);	}		});		}

					else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} }, 

		'entryUpdate2' : (selectFields) => { return (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) {

						$Model.findOne({'_id' : entry})

						.lean({})

						.hint({'_id' : 1})

						.select(selectFields)

						.exec((err , entryResult) => {
																						if (err) {	return response.errResponse(res , 400 , err);	}

																		if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																												return response.response(res , 200 , entryResult);	}); }
				
					else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} } , 

		'entryUpdateSubmit' : (req , res , next) => { let $entry = req.body , entry = parseInt(req.params.entry);

				if (req.params && req.params.entry) {

					$Model.findOneAndUpdate({'num' : entry} , {'$set' : $entry} , 

																	{'new' : true , 'runValidators' : true})
																
																	.lean({})

																	.select(`_id name`)

																	.exec((err , entryResult) => {

																								if (err) {		return response.errResponse(res , 400 , err);			}

																				if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																				if (entryResult) {		return response.response(res , 201 , entryResult);	}		});		} 

				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

		'entryUpdateSubmit2' : (req , res , next) => { let $entry = req.body , entry = req.params.entry;

				if (req.params && req.params.entry) {
																	
					$Model.findOneAndUpdate({'_id' : entry} , {'$set' : $entry} , 

																	{'new' : true , 'runValidators' : true})
																
																	.lean({})

																	.select(`_id name`)

																	.exec((err , entryResult) => {

																									if (err) {		return response.errResponse(res , 400 , err);		}

																					if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																					if (entryResult) {		return response.response(res , 201 , entryResult);	}		});		} 

				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

		'entryDelete' : (selectFields) => { return (req , res , next) => {	let entry = parseInt(req.params.entry);

			if (req.params && req.params.entry) {

				$Model.findOne({'num' : entry})

																		.lean({})

																		.select(selectFields)

																		.exec((err , entryResult) => {

																						if (err) {		return response.errResponse(res , 400 , err);		}

																		if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																			if (entryResult) {	return response.response(res , 200 , entryResult);	}		});		} 	
			
					else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} } ,

		'entryDelete2' : (selectFields) => { return (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) {

						$Model.findOne({'_id' : entry})

						.lean({})

						.hint({'_id' : 1})

						.select(selectFields)

						.exec((err , entryResult) => {
																						if (err) {	return response.errResponse(res , 400 , err);	}

																		if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																												return response.response(res , 200 , entryResult);	}); }
				
					else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} } , 

		'entryDeleteSubmit' : (req , res , next) => {	let entry = parseInt(req.params.entry);

			if (req.params && req.params.entry) {
				
				$Model.deleteOne({'num' : entry})
																					.exec((err , entryResult) => {

																								if (err) {		return response.errResponse(res , 400 , err);		}

											if (!(entryResult.deletedCount > 0)) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

												if (entryResult.deletedCount > 0) {		return response.response(res , 204 , {'message' : `Entry successfully removed from the record.`});	}		});		} 	
	
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

		'entryDeleteSubmit2' : (req , res , next) => {	let entry = req.params.entry;

			if (req.params && req.params.entry) {
				
				$Model.deleteOne({'_id' : entry})
																					.exec((err , entryResult) => {

																								if (err) {		return response.errResponse(res , 400 , err);		}

											if (!(entryResult.deletedCount > 0)) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

												if (entryResult.deletedCount > 0) {		return response.response(res , 204 , {'message' : `Entry successfully removed from the record.`});	}		});		} 	
	
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

}

}