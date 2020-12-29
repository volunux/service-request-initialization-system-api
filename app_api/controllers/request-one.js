const mongoose = require('mongoose');

module.exports = (opt) => {

	const $Model = opt.$Model;

	const Unit = opt.Unit;

	const Upload = opt.Upload;

	const Comment = mongoose.model(opt.comment); 

	const Reply = mongoose.model(opt.reply); 

	const response = require('../config/response') , async = require('async');

	const modelMessage = require(`../messages/${opt.third}`);

	const modelCtrl = require('../helpers/model-ctrl');

	return {

		'entryExists' : (req , res , next) => {	entry = req.params.entry;

			if (req.params && req.params.entry) {

				$Model.findOne({'slug' : entry })																		
																				.lean({})

																				.select('slug -_id')
																				
																				.exec((err , entryResult) => {

																					if (err) {						return response.errResponse(res , 400 , err);		}

																					if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}
																																
																																return response.response(res , 200 , entryResult);		})		}
					else {
									return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});			}
		} , 

		'entries' : (req , res , next) => { let customQuery = req.body.queryByType , page = req.query.page ? (parseInt(req.query.page , 10) - 1) * 10 : 0;

				if (req.query.page) {	modelCtrl.removeQueryPage(req.query);	}

				delete req.query.page;

				let finalQuery = {...customQuery , ...req.query};

				$Model
							.find(finalQuery)

							.lean({})

							.skip(page)

							.limit(11)

							.sort('createdAt')

						.populate({'path' : 'author' , 'select' : 'firstName lastName studentIdentificationNumber level -_id'})

						.select('applicationNumber createdAt slug status author -_id')

						.exec((err , entriesResult) => {

																			if (err) {	return response.errResponse(res , 400 , err);	}

								if (entriesResult.length == 0) {	return response.response(res , 404 , {'message' : `${opt.second} entries does not exists in the record or is not available.`});	}

																									return response.response(res , 200 , entriesResult);		});
		} ,

		'entryAdd' : (req , res , next) => { let newEntry = new $Model(req.body) , keys = [];

			newEntry.documents.forEach(modelCtrl.pushFileKeys , keys);

				newEntry.save((err , newEntry) => {
																							if (err) {				
																					
																							if (req.body.documents) {		photoDelete.delete(req.body.documents);

																											return response.errResponse(res , 400 , err); 	}

																											return response.errResponse(res , 400 , err);		} 

																							if (newEntry) { let keysUpdate = [];

																								if (keys.length) {

																								for (let itemKey of keys) {
													if (itemKey) {

					Upload.updateOne( {'Key' : itemKey } , { '$set' : {	'requestSlug' : newEntry.slug } } , {'upsert' : true} ).then((entryUpdate) => {	keysUpdate.push(1);

						if (keysUpdate.length == keys.length) {		return response.response(res , 200 , newEntry);		}		});		}		}		}
																							
																					else {			return response.response(res , 200 , newEntry);		}		}	});
		} ,

		'entriesTransferred' : (req , res , next) => {

			async.parallel({
												[opt.first] : (callback) => {
																												$Model.find({})
																																				.lean({})

																																				.hint({'_id' : 1})

																																				.populate({'path' : 'author' , 'select' : 'firstName lastName studentIdentificationNumber level -_id'})

																																				.populate({'path' : 'requestHandler' , 'select' : 'firstName lastName -_id'})

																																				.select('applicationNumber slug status author requestHandler -_id')

																																				.exec(callback);		} ,

												'Transferred' : (callback) => {
																												Comment.find({'unit' : req.user.unit , 'status' : 'Transferred'})

																																										.lean({})

																																										.populate({'path' : 'entry' , 'select' : 'message unit' , 'populate' : [

																																															{'path' : 'author' , 'select' : 'firstName lastName studentIdentificationNumber level -_id'} ,

																																															{'path' : 'requestHandler' , 'select' : 'firstName lastName -_id'} ]})

																																										.select('requestSlug entry -_id')

																																										.exec(callback);		}
			} , (err , result) => {	
															if (err) {							return response.errResponse(res , 400 , err);		}
												
															if (!result) {					return response.response(res , 404 , {'message' : `Data cannot be retrieved.`});		}

								if (result[opt.first].length == 0) {	return response.response(res , 404 , {'message' : `${opt.second} entries does not exist in the record or is not available.`});		}
							
							if (result.Transferred.length == 0) {		return response.response(res , 404 , {'message' : `Transferred entries does not exist in the record or is not available.`});		}

																											return response.response(res , 200 , result);			});
		} ,

		'entryTransferDetail' : (req , res , next) => { let entry = req.params.entry;

			if (req.params && req.params.entry) {

					$Model.findOne({'slug' : entry})

					.lean({})

					.hint({slug : 1})

					.populate({'path' : 'author' , 'select' : 'firstName lastName department faculty level -_id'})

					.populate({'path' : 'requestHandler' , 'select' : 'firstName lastName -_id'})

					.select('message applicationNumber unit slug status author requestHandler -_id')
					
					.exec((err , entryResult) => {

																			if (err) {	return response.errResponse(res , 400 , err);	}

															if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available`});	}

																									return response.response(res , 200 , entryResult);		}); }
			
					else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});			}
			} ,

		'entryDetail' : (req , res , next) => { let entry = req.params.entry;

			if (req.params && req.params.entry) {

					$Model.findOne({'slug' : entry})

					.lean({})

					.hint({slug : 1})

					.populate({'path' : 'author' , 'select' : 'firstName lastName department faculty level -_id'})

					.populate({'path' : 'requestHandler' , 'select' : 'firstName lastName -_id'})

					.select('message applicationNumber documents createdAt updatedAt unit slug status author requestHandler -_id')

					.exec((err , entryResult) => {
																					if (err) {	return response.errResponse(res , 400 , err);	}

																	if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available`});	}

																											return response.response(res , 200 , entryResult);	}); }
					
					else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});			}
		} ,

		'entryUpdate' : (req , res , next) => { let entry = req.params.entry , $entry = {'status' : modelCtrl.setStatus(req.body.status) , 'text' : req.body.text } , status = $entry.status; 

			if (req.params && req.params.entry) {

				$Model.findOne({'slug' : entry})

							.lean({})

							.hint({'slug' : 1})

							.populate({'path' : 'unit' , 'select' : '_id'})

							.select('status slug author unit')

							.exec((err , entryResult) => {
																										if (err) {		return response.errResponse(res , 400 , err);		}

																						if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available`});	}

			if (status == '' || status == undefined || status == null) {	return response.response(res , 400 , {'message' : `You have to provide a valid status before you can update the application.`});		}

		if (entryResult.status == 'Pending') {

	if (entryResult.status ==	'Pending' && status == 'Pending') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to pending more than once.`});		}

	if (entryResult.status ==	'Pending' && status == 'Review') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to review through this channel.`});		}

	if (entryResult.status ==	'Pending' && status == 'Update') {	return response.response(res , 400 , {'message' : `${opt.second} entry has to be set in review before it can be updated.`});		}

if (entryResult.status ==	'Pending' && status == 'Fulfilled') {	return response.response(res , 400 , {'message' : `${opt.second} entry has to be set in review before it can be fulfilled.`});		}

if (entryResult.status ==	'Pending' && status == 'Rejected') {	return response.response(res , 400 , {'message' : `${opt.second} entry has to be set in review before it can be rejected.`});		}
	
			}

		if (entryResult.status == 'Review') {

if (entryResult.status == 'Review' && status == 'Review') {		return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to review more than once.`});	}

if (entryResult.status ==	'Review' && status == 'Pending') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to pending once review starts.`});		}
	
			}

		if (entryResult.status == 'Update')	{

if (entryResult.status == 'Update' && status == 'Update') {			return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to updated more than once.`});		}

if (entryResult.status == 'Update' && status == 'Pending') {		return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to pending more than once.`});		}

	if (entryResult.status == 'Update' && status == 'Review') {		return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to review more than once.`});		}
	
			}

		if (entryResult.status == 'Fulfilled') {

if (entryResult.status == 'Fulfilled' && status == 'Fulfilled') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to fulfilled more than once.`});	}

	if (entryResult.status == 'Fulfilled' && status == 'Pending') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to pending once it is fulfilled.`});	}

	if (entryResult.status == 'Fulfilled' && status == 'Review') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to review once it is fulfilled.`});	}

	if (entryResult.status == 'Fulfilled' && status == 'Update') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to updated once it is fulfilled.`});	}

if (entryResult.status == 'Fulfilled' && status == 'Rejected') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to rejected once it is fulfilled.`});	}
		
			}

		if (entryResult.status == 'Rejected') {

	if (entryResult.status == 'Rejected' && status == 'Rejected') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to rejected more than once.`});	}

	if (entryResult.status == 'Rejected' && status == 'Pending') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to pending once it is rejected.`});	}

		if (entryResult.status == 'Rejected' && status == 'Review') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to review once it is rejected.`});	}

		if (entryResult.status == 'Rejected' && status == 'Update') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to updated once it is rejected.`});	}

if (entryResult.status == 'Rejected' && status == 'Fulfilled') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to fulfilled once it is rejected.`});	}

			}
									if (entryResult) {
			$Model
						.findOneAndUpdate({'slug' : entry} , 

															{'$set' : {'status' : status , 'requestHandler' : req.body.author}} , 

															{'new' : true})
						.lean({})

						.exec((err , entryResult1) => {

												if (err) {						return response.errResponse(res , 400 , err);			}

												if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

												if (entryResult) {

														if (entryResult1.status == 'Fulfilled') {	entry.text = modelMessage.fulfilled();	}

														if (entryResult1.status == 'Rejected') {	entry.text = modelMessage.rejected();	}

		let timeline = Object.assign({'requestHandler' : req.body.author , 'author' : entryResult.author , 'requestSlug' : entryResult.slug , 'unit' : entryResult.unit } , $entry);

		let newComment = new Comment(timeline);

			newComment.save((err , newentryResult) => {

																			if (err) {								return response.errResponse(res , 400 , err);			}

																			if (newentryResult) {			return response.response(res , 201 , entryResult);	}		});		}		});	}		})	}

					else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

		'getTransferred' : (req , res , next) => {

				Comment.find({'status' : 'Transferred'})

				.lean({})

				.hint({slug : 1})

				.populate({'path' : 'author' , 'select' : 'firstName lastName -_id'})

				.populate({'path' : 'entry' , 'select' : 'message' , 'populate' : [{'path' : 'comments' }]})

				.populate({'path' : 'requestHandler' , 'select' : 'firstName lastName -_id'})

				.populate({'path' : 'comments' , 'populate' : [{'path' : 'replies'} ]})

				.select('message applicationNumber slug status unit author requestSlug requestHandler comment -_id')

				.exec((err , entryResult) => {

																		if (err) {	return response.errResponse(res , 400 , err);	}

														if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available`});	}

																								return response.response(res , 200 , entryResult);		});
			
		} ,

	'entryDeleteSubmit' : (req , res , next) => {	entry = req.params.entry;

		if (req.params && req.params.entry) {
										
				$Model.findOneAndDelete({'slug' : entry})
																										.lean({})

																										.hint({'slug' : 1})

																										.select(`slug -_id`)

																														.exec((err , entryResult) => {
																							
																											if (err) {	return config.errResponse(res , 400 , err);		}
																							
																							if (!entryResult) {	return config.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}
																							
																								if (entryResult && entryResult.photos.length != 0) {

				param1 = {'Bucket' : process.env.posts_bucket , 'Delete' : {	'Objects' : entryResult.photos , 'Quiet' : false } };

																s3.deleteObjects(param1 , (err, data) => {
																																						if (err) {
																																												console.log(err);	}
																																					if (data) {
																																											entryResult.photos.forEach((item) => {
															Upload.deleteOne({'Key' : item.Key})
																																	.exec((err , result) => {					
																																														if (err) {
																																																				console.log(err);		}

																																																				console.log(result);		}) });	}		});
													async.parallel({
																										'Comment' : (callback) => {		$Model.deleteComments(entryResult.slug)
																																																													.exec(callback);			} ,
																										'Reply' : (callback) => {			$Model.deleteReplies(entryResult.slug)
																																																													.exec(callback);			} 
														} , (err , result) => {
																											if (err) {				return config.errResponse(res , 400 , err);		}

																											if (result) {			return config.response(res , 204 , {'message' : `Entry successfully removed from the record.`});	} });	}

																								else if (entryResult) {
													async.parallel({
																										'Comment' : (callback) => {		$Model.deleteComments(entryResult.slug)
																																																													.exec(callback);			} ,
																										'Reply' : (callback) => {			$Model.deleteReplies(entryResult.slug)
																																																													.exec(callback);			} 
														} , (err , result) => {
																											if (err) {				return config.errResponse(res , 400 , err);		}

																											if (result) {			return config.response(res , 204 , {'message' : `Entry successfully removed from the record.`});		} });		}	})	}	
	
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