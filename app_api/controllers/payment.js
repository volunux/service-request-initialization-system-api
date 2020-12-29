const response = require('../config/response');

const modelMessage = require(`../messages/payment`);

const axios = require('axios');

module.exports = (opt) => {

	const modelCtrl = require('../helpers/model-ctrl');

	const mailer = require('../config/mail');

	const cUser = require('../config/confirm-user');

	const $Model = opt.$Model;

	const mySecretKey = process.env.paystack;

	return {

		'initializeTransaction' : (req , res , next) => { let url = 'https://api.paystack.co/transaction/initialize';

		axios.defaults.headers.common['Authorization'] = mySecretKey;

		const options = {

						'Authorization' : 'Bearer ' + mySecretKey ,

						'Content-Type': 'application/json',
						
						'Cache-Control': 'no-cache' };

		const callback = (error , response , body) => { return mycallback(error , body);	}

			axios({	'method': 'post' , 'url' : url , 'data' : req.body , 'headers' : options })

			.then((entryResult) => {	

				return response.response(res , 200 , entryResult.data);	})
			
			.catch((err) => {		

				return response.response(res , 400 , {'message' : 'Network Error'}); });
	
		} ,

		'verifyTransaction' : (req , res , next) => { const ref = req.query && req.query.reference ? req.query.reference : '91xyq7sahjsa';

			let url = 'https://api.paystack.co/transaction/verify/' + encodeURIComponent(ref);

		const options = {
							 
						'Authorization' : 'Bearer ' + mySecretKey,
				
						'contenrt-type': 'application/json',
				
						'cache-control': 'no-cache'		};

		const callback = (error, response, body) => {	return mycallback(error , body);	}

		return axios({ 'method': 'get' , 'url' : url , 'headers' : options })

			.then((entryResult) => {		

				return response.response(res , 200 , entryResult.data);	})
			
			.catch((err) => {	return response.response(res , 400 , {'message' : 'Error has occured'}); })
	
		} ,

	 'refundTransaction' : (req , res , next) => { let url = 'https://api.paystack.co/refund';

		const options = {

						'Authorization' : 'Bearer ' + mySecretKey ,

						'content-type': 'application/json',
						
						'cache-control': 'no-cache' };

		const callback = (error , response , body) => { return mycallback(error , body);	}

			axios({	'method': 'post' , 'url' : url , 'data' : req.body , 'headers' : options })

			.then((entryResult) => {

				console.log(entryResult);

				return response.response(res , 200 , entryResult.data);	})
			
			.catch((err) => {	

				console.log(err);

				return response.response(res , 400 , {'message' : 'Error has occured'}); })
	
	 } ,

		'entryAdd' : (req , res , next) => { let $newEntry = new $Model(req.body);

			$Model.findOne({'paymentReference' : req.body.paymentReference})

						.lean({})

						.exec((err , entryResult) => {

								if (err) {	return response.errResponse(res , 400 , err); 	}

								if (!entryResult) { return $newEntry.save((err , entryResult1) => {

											if (err) {	return response.errResponse(res , 400 , err); }

												else {	
																if (entryResult1.status == 'success') { let transactionType = entryResult1.paymentType == 'department' ? 'Departmental Fee' : 'Faculty Fee';

																	let $entry = modelMessage.fulfilled(req , res , next , transactionType , entryResult1);

																		mailer.entryFulfilled(req , res , next , entryResult1.author , $entry.title , $entry.message);	}

																if (entryResult1.status == 'failed') { let transactionType = entryResult1.paymentType == 'department' ? 'Departmental Fee' : 'Faculty Fee';

																	let $entry = modelMessage.rejected(req , res , next , transactionType , entryResult1);

																		mailer.entryRejected(req , res , next , entryResult1.author , $entry.title , $entry.message);	}

													return response.response(res , 200 , entryResult1);	}	});		}

									if (entryResult.status == 'success') { let transactionType = entryResult.paymentType == 'department' ? 'Departmental Fee' : 'Faculty Fee';

										let $entry = modelMessage.fulfilled(req , res , next , transactionType , entryResult);

											mailer.entryFulfilled(req , res , next , entryResult.author , $entry.title , $entry.message);	}

									if (entryResult.status == 'failed') { let transactionType = entryResult.paymentType == 'department' ? 'Departmental Fee' : 'Faculty Fee';

										let $entry = modelMessage.rejected(req , res , next , transactionType , entryResult);

											mailer.entryRejected(req , res , next , entryResult.author , $entry.title , $entry.message);	}

								return response.response(res , 200 , entryResult);	});
			} ,
 		
		'entryAdd2' : (req , res , next) => { let newEntry = new $Model(req.body);

				$Model.findOneAndUpdate({ 'paymentReference' : req.body.paymentReference } , {'$set' : req.body } , {'new' : true , 'upsert' : true})

				.lean({})

				.populate({'path' : 'author' , 'select' : 'emailAddress  -_id'})

				.select('paymentReference paymentType status author _id')

				.exec((err , entryResult) => {
																				if (err) {	return response.errResponse(res , 400 , err); }

																						else {

														if (entryResult.status == 'success') {

															if (entryResult.paymentType == 'department') { let $entry = modelMessage.fulfilled(req , res , next , 'Departmental Fee' , entryResult);

																mailer.entryFulfilled(req , res , next , entryResult.author , $entry.title , $entry.message);	}

															if (entryResult.paymentType == 'faculty') { let $entry = modelMessage.fulfilled(req , res , next , 'Faculty Fee' , entryResult);

																mailer.entryFulfilled(req , res , next , entryResult.author , $entry.title , $entry.message);	}		}


														if (entryResult.status == 'failed') {

															if (entryResult.paymentType == 'department') { let $entry = modelMessage.rejected(req , res , next , 'Departmental Fee' , entryResult);

																mailer.entryRejected(req , res , next , entryResult.author , $entry.title , $entry.message);	}

															if (entryResult.paymentType == 'faculty') { let $entry = modelMessage.rejected(req , res , next , 'Faculty Fee' , entryResult);

																mailer.entryRejected(req , res , next , entryResult.author , $entry.title , $entry.message);	}		}

																				return response.response(res , 200 , entryResult);		}		});
		} ,

		'entryUpdate' : (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) {

						$Model.findOne({'_id' : entry})

						.lean({})

						.populate({'path' : 'author' , 'select' : 'firstName lastName matriculationNumber identityNumber level _id'})

						.select('paymentReference paymentType description fullName phoneNumber emailAddress department faculty paidOn amount status refunded author _id')

						.exec((err , entryResult) => {
																						if (err) {	return response.errResponse(res , 400 , err);	}

																		if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}		

																												return response.response(res , 200 , entryResult);	});	}
				
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});			}
		} ,

		'entryUpdateSubmit' : (req , res , next) => {	let entry = req.params.entry;

			$Model
						.findOneAndUpdate({'_id' : entry} , 

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

	'entryDelete' : (req , res , next) => {	let entry = req.params.entry;

			if (req.params && req.params.entry) {

				$Model.findOne({'_id' : entry })																		
																				.lean({})

																				.select('payerName fullName payerPhone phoneNumber payerEmail emailAddress description amount _id')

																				.exec((err , entryResult) => {

																								if (err) {						return response.errResponse(res , 400 , err);		}

																								if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}
																																			
																																			return response.response(res , 200 , entryResult);		})		}

				else { return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});	}
		} , 

		'entryDeleteSubmit' : (req , res , next) => {	let entry = parseInt(req.params.entry);

			if (req.params && req.params.entry) {
				
				$Model.deleteOne({'num' : entry})
																					.exec((err , entryResult) => {
																																		
																																	if (err) {		return response.errResponse(res , 400 , err);		}
																				
																				if (!(entryResult.deletedCount > 0)) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																					if (entryResult.deletedCount > 0) {		return response.response(res , 204 , {'message' : `Entry successfully removed from the record.`});	}		});		} 	
			
				else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

}

}