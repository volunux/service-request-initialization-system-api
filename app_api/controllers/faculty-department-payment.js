module.exports = (opt) => {

	const $Model = opt.$Model;

	const response = require('../config/response') , async = require('async');

	const modelCtrl = require('../helpers/model-ctrl');

	const cUser = require('../config/confirm-user');

	return {

		'entryDetail' : (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) {

						$Model.findOne({'_id' : entry})

						.lean({})

						.populate({'path' : 'author' , 'select' : 'firstName lastName matriculationNumber identityNumber level _id'})

						.select('paymentReference paymentType description fullName phoneNumber emailAddress department faculty paidOn amount status refunded author _id')

						.exec((err , entryResult) => {
																						if (err) {	return response.errResponse(res , 400 , err);	}

																		if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

										cUser.$isOwnerPayment(req , res , next , entryResult , opt.second , undefined , ['student' , ...opt.normalPrivilege] , cUser.successReponse , opt.leastPrivilege);	}); }
				
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});			}
		} ,

		'checkPayment' : (req , res , next) => {

				$Model.findOne({'author' : req.user._id , 'paymentType' : opt.paymentType})

				.lean({})

				.select('paymentReference status _id')

				.exec((err , entryResult) => {
																				if (err) {	return response.errResponse(res , 400 , err);	}

																if (!entryResult) {	return response.response(res , 200 , {'message' : `none` });	}

																										return response.response(res , 200 , entryResult);	}); 
		} ,

		'entryUpdate' : (req , res , next) => { let entry = req.params.entry , $entry = req.body;

			if (req.params && req.params.entry) {

				$Model
							.updateOne({'_id' : entry} , 

																{'$set' : $entry } , {'runValidators' : false})

							.exec((err , entryResult) => {
																									if (err) {		return response.errResponse(res , 400 , err);		}

													if (!(entryResult.nModified > 0)) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

														if (entryResult.nModified > 0) {		return response.response(res , 201 , {'_id' : entry });	}		});		}

							else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

		'entryUpdateRefund' : (req , res , next) => { let entry = req.params.entry , $entry = req.body;

			if (req.params && req.params.entry) {

					$Model
								.updateOne({'_id' : entry} ,

																	{'$set' : {'refunded' : true } } , {'runValidators' : false})

								.exec((err , entryResult) => {
																										if (err) {		return response.errResponse(res , 400 , err);		}

														if (!(entryResult.nModified > 0)) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

															if (entryResult.nModified > 0) {		return response.response(res , 201 , {'_id' : entry });	}		});		}

				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

	}

}