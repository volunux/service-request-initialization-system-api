module.exports = (opt) => {

	const $Model = opt.$Model;

	const Faculty = opt.Faculty;

	const response = require('../config/response') , async = require('async');

	const modelCtrl = require('../helpers/model-ctrl');

	return {

		'entryAdd' : (req , res , next) => {

							async.parallel({
																'Faculty' : (callback) => {
																														Faculty.find({})
																																							.lean({})
																																												.select('_id')
																																																				.hint({'_id' : 1 })
																																																														.exec(callback);	} ,
		} , (err , result) => {	
																						if (err) {	return response.errResponse(res , 400 , err);		}
																	
																				if (!result) {	return response.response(res , 404 , {'message' : `Data cannot be retrieved.`});	}

										if (result.Faculty.length == 0) {		return response.response(res , 404 , {'message' : `Faculty entries does not exists in the record or is not available.`});	}

																												return response.response(res , 200 , result);			});
		} ,

		'entryUpdate' : (selectFields) => { return (req , res , next) => {	let entry = parseInt(req.params.entry);

			if (req.params && req.params.entry) {

					$Model.findOne({'num' : entry})

					.lean({})

					.select(selectFields)

					.exec((err , entryResult) => {
																					if (err) {	return response.errResponse(res , 400 , err);	}

																	if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																if (entryResult) {

								async.parallel({
																	'Faculty' : (callback) => {
																															Faculty.find({})
																																							.lean({})
																																												.select('_id')
																																																				.hint({'_id' : 1 })
																																																														.exec(callback);	} ,
			} , (err , result) => {	
																							if (err) {		return response.errResponse(res , 400 , err);		}
																		
																					if (!result) {		return response.response(res , 404 , {'message' : `Data cannot be retrieved.`});	}

											if (result.Faculty.length == 0) {			return response.response(res , 404 , {'message' : `Faculty entries does not exists in the record or is not available.`});	}

																			if (opt.fifth) {			result[opt.fifth] = entryResult;	}

																														return response.response(res , 200 , result);		});		}	});		}

				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} }, 

}

}