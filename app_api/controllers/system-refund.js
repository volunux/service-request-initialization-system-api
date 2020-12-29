const mongoose = require('mongoose');

module.exports = (opt) => {

	const $Model = opt.$Model;

	const Letter = opt.Letter;

	const config = require('../config/response') , async = require('async');

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

							.populate({'path' : 'author' , 'select' : 'firstName lastName level _id'})

							.populate({'path' : 'entryHandler' , 'select' : 'firstName lastName -_id'})

							.populate({'path' : 'stage'})

							.select('applicationNumber status slug updatedAt author stage -_id')

							.exec((err , entriesResult) => {

																				if (err) {	return config.errResponse(res , 400 , err);	}

									if (entriesResult.length == 0) {	return config.response(res , 404 , {'message' : `${opt.second} entries does not exists in the record or is not available.`});	}

																										return config.response(res , 200 , entriesResult);	});
		} ,

		'entryDetail' : (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) { var toHappen = {'run' : true};

						$Model.findOne({'slug' : entry})

						.lean({})

						.hint({slug : 1})

						.populate({'path' : 'author' , 'select' : 'firstName lastName department faculty level _id'})

						.populate({'path' : 'entryHandler' , 'select' : 'firstName lastName -_id'})

						.populate({'path' : 'stage' , 'select' : '_id name'})

						.populate({'path' : 'letter' , 'select' : ' _id'})

						.populate({'path' : 'signature' , 'select' : '_id firstName lastName'})

						.select('message applicationNumber signature documents createdAt updatedAt slug status letter stage author entryHandler faculty department unit -_id')
						
						.exec((err , entryResult) => {
																				
																				if (err) {	return config.errResponse(res , 400 , err);	}

																if (!entryResult) {	return config.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

 																cUser.$isOwnerRf(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege);

																if (entryResult && toHappen.run) {

																		if (entryResult.stage && entryResult.stage._id == '3') {

						Letter.findOne({'_id' : "5ee72cb58630cbf169b5d957"})

																								.lean({})

																								.select('main_body')

																								.exec((err , entryResult1) => {

																													if (err) {	return config.errResponse(res , 400 , err);		}

																								if (!entryResult1) { 	return config.response(res , 200 , entryResult); }

																								if (entryResult1) {		entryResult.Letter = entryResult1;	

																																			return config.response(res , 200 , entryResult);	}	});	}		
																								
																								else {								return config.response(res , 200 , entryResult);	};		}		});		}
				
					else {	return config.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
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

																if (entryResult) {		return response.response(res , 200 , result);		}		});		}

				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} , 

		'entryLetter' : (req , res) => { let entry = req.params.entry;

			if (req.params && req.params.entry) {

					$Model.findOne({'slug' : entry})

					.lean({})

					.hint({'slug' : 1})

					.populate({'path' : 'letter' , 'select' : 'main_body _id'})

					.select('letter')

					.exec((err , entryResult) => {

																			if (err) {	return config.errResponse(res , 400 , err);	}

															if (!entryResult) {	return config.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																									cUser.$isOwnerRf(req , res , next , entryResult , cUser.successReponse , opt.second);

											if (!entryResult.letter) {	return config.response(res , 404 , {'message' : `${opt.second} entry letter does not exists in the record or is not available.`});	}

																									return config.response(res , 200 , entryResult);		}); }

			else {	return config.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}

	} 

	}

}