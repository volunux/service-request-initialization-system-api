const mongoose = require('mongoose') , crypto = require('crypto');

module.exports = (opt) => {

	const $Model = opt.$Model;

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

		'verifyEmail' : (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) {

						$Model.findOne({'emailAddress' : entry})

						.lean({})

						.hint({'_id' : 1})

						.exec((err , entryResult) => {
																						if (err) {	return response.errResponse(res , 400 , err);	}

																		if (!entryResult) {	return response.response(res , 200 , {'isAvailable' : true , 'emailAddress' : entry});	}

																												return response.response(res , 404 , {'isAvailable' : false , 'emailAddress' : entry});	}); }
				
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});	}
		} ,



		'verifyUsername' : (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) {

						$Model.findOne({'username' : entry})

						.lean({})

						.hint({'_id' : 1})

						.exec((err , entryResult) => {
																						if (err) {	return response.errResponse(res , 400 , err);	}

																		if (!entryResult) {	return response.response(res , 200 , {'isAvailable' : true , 'username' : entry});	}

																												return response.response(res , 404 , {'isAvailable' : false , 'username' : entry});	}); }

				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});	}
		} ,


		'entryAddSubmit' : (req , res , next) => {	let newEntry = new $Model(req.body);

				newEntry.setPassword(req.body.password);

				newEntry.save((err , newEntryResult) => {
																									if (err) {	return response.errResponse(res , 400 , err);		}

																							if (newEntryResult) { if (newEntryResult.status != 'pending') { mailer.entryAdd(newEntryResult);	}

																															return response.response(res , 200 , newEntryResult);		}		});
		} ,


	}

}