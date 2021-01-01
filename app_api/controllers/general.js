const mongoose = require('mongoose');

module.exports = (opt) => {

	const $Model = opt.$Model ? opt.$Model : undefined;

	const Unit = opt.Unit ? opt.Unit : undefined;

	const Upload = opt.Upload ? opt.Upload : undefined;

	const Comment = opt.comment ? mongoose.model(opt.comment) : undefined; 

	const Reply = opt.reply ? mongoose.model(opt.reply) : undefined;

	const response = require('../config/response') , async = require('async');

	const modelMessage = require(`../messages/general`);

	const modelCtrl = require('../helpers/model-ctrl');

	const mailer = require('../config/mail');

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

							.limit(11)

							.sort('createdAt')

							.populate({'path' : 'author' , 'select' : 'firstName lastName identityNumber level _id'})

							.select('applicationNumber num status createdAt slug author requestType -_id')

							.exec((err , entriesResult) => {

																				if (err) {	return response.errResponse(res , 400 , err);	}

									if (entriesResult.length == 0) {	return response.response(res , 404 , {'message' : `${opt.second} entries does not exists in the record or is not available.`});	}

																										return response.response(res , 200 , entriesResult);	});
		} ,

		'entryAdd' : (req , res , next) => { let $newEntry = new $Model(req.body) , keys = [];

				if ($newEntry.documents && $newEntry.documents.length > 0) { $newEntry.documents.forEach(modelCtrl.pushFileKeys , keys);	}

					$newEntry.save((err , newEntryResult) => {
																											if (err) {

																											if ($newEntry.documents && $newEntry.documents.length > 0) {	objectControl.deleteMany($newEntry.documents);

																												return response.errResponse(res , 400 , err); 	}

																												return response.errResponse(res , 400 , err);		} 

																								if (newEntryResult) {

																									if (keys && keys.length > 0) {

						Upload.updateMany( {'Key' :  {'$in' : keys } } , { '$set' : {	'entryId' : newEntryResult.slug } } , {'upsert' : true} ).then((entryUpdate) => {

																												return response.response(res , 200 , newEntryResult);		});		}
																								
																							else {		return response.response(res , 200 , newEntryResult);		}		}	});
		} ,

		'entryDetail' : (unit) => { return (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) { var toHappen = undefined;

						$Model.findOne({'slug' : entry , 'unit' : unit})

						.lean({})

						.hint({'slug' : 1})

						.populate({'path' : 'author' , 'select' : 'firstName lastName department faculty level _id'})

						.populate({'path' : 'entryHandler' , 'select' : 'firstName lastName -_id'})

						.select('applicationNumber message documents status requestType requestUsername requestPassword slug createdAt updatedAt author entryHandler department faculty unit -_id')

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

	'entryAddComment' : (req , res , next) => { let entry = req.params.entry , canPass = undefined;

		if (req.params && req.params.entry) { var toHappen = {'run' : true};

			if (req.body && req.body.canPass) {	canPass = req.body.canPass;	}
			
			$Model.findOne({'slug' : entry})
																				.lean({})

																				.populate({'path' : 'author' , 'select' : '_id'})

																				.select('message slug status department faculty unit -_id')
																			
																				.exec((err , entryResult) => {

																															if (err) {		return response.errResponse(res , 400 , err);		}

																											if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

											if (req.params.isRefund) { cUser.$isOwnerRf(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege); }

											else { cUser.$isOwner(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege); }

																		if (entryResult && toHappen.run) {

																	if (entryResult.status == 'Fulfilled') {	return response.response(res , 400 , {'message' : `Comment entry cannot be added once ${opt.second} entry is fulfilled.`});	}

																	if (entryResult.status == 'Rejected') {		return response.response(res , 400 , {'message' : `Comment entry cannot be added once ${opt.second} entry is rejected.`});	}

								if (entryResult.status != 'Update' && canPass != 'true') {	return response.response(res , 400 , {'message' : `Comment entry cannot be added if ${opt.second} entry is not yet updated.`});	}
		
																																						return response.response(res , 200 , entryResult);	}		});	 }

			else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
	} ,

		'entryAddCommentSubmit' : (req , res , next) => { let comment = req.body , entry = req.params.entry , canPass = undefined;

				if (req.params && req.params.entry) { var toHappen = {'run' : true};

					if (req.body && req.body.canPass) {	canPass = req.body.canPass;	}

					$Model.findOne({'slug' : entry})
																					.lean({})

																					.populate({'path' : 'author' , 'select' : '_id'})

																					.select('status slug author entryHandler department faculty unit -_id')

																					.exec((err , entryResult) => {

																								if (err) {				return response.errResponse(res , 400 , err);		}

																					if (!entryResult) {			return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

									if (req.params.isRefund) { cUser.$isOwnerRf(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege); }

									else {  cUser.$isOwner(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege); }

																		if (entryResult && toHappen.run) {

												if (entryResult.status == 'Fulfilled') {	return response.response(res , 400 , {'message' : `Comment entry cannot be added once ${opt.second} entry is fulfilled.`});	}

												if (entryResult.status == 'Rejected') {		return response.response(res , 400 , {'message' : `Comment entry cannot be added once ${opt.second} entry is rejected.`});	}

			if (entryResult.status != 'Update' && canPass != 'true') {	return response.response(res , 400 , {'message' : `Comment entry cannot be added if ${opt.second} entry is not yet updated.`});	}

					let timeline = Object.assign({'author' : req.body.author , 'entrySlug' : entryResult.slug} , comment , { 'status' : 'Update'});

					if (canPass) { timeline.status = 'Review'; }

					let newComment = new Comment(timeline);

					newComment.save((err , commentResult) => {
																											if (err) {	return response.errResponse(res , 400 , err);	}	

																													else {	return response.response(res , 200 , entryResult);	}		});		}		});	 }

					else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

		'entryReview' : (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) {

						$Model.findOne({'slug' : entry})

						.lean({})

						.hint({'slug' : 1})

						.populate({'path' : 'author' , 'select' : 'emailAddress _id'})

						.select('status slug author unit -_id')

						.exec((err , entryResult) => {
																									if (err) {	return response.errResponse(res , 400 , err);		}

																				if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

												if (entryResult.status == 'Review') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to review more than once.`});		}

											if (entryResult.status !=	'Pending') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be updated at this stage.`});			}
																	
				$Model.updateOne({'slug' : entry} , {'$set' : {'status' : 'Review' , 'entryHandler' : req.body.author } } , {'runValidators' : false })

													.exec((err , entryResult1) => {

																				if (err) {	return response.errResponse(res , 400 , err);		}

															if (!(entryResult1.nModified > 0)) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

															if (entryResult1.nModified > 0) { let $entry = { 'title' : modelMessage.review().title , 'text' : modelMessage.review().message };

																	mailer.entryReview(req , res , next , entryResult.author , $entry.title , $entry.text);

																		let timeline = Object.assign({'author' : entryResult.author._id , 'entryHandler' : req.body.author ,

																			'entrySlug' : entryResult.slug , 'unit' : entryResult.unit , 'status' : 'Review' } , $entry);

																		let newComment = new Comment(timeline);

			newComment.save((err , newEntryResult) => {

																				if (err) {		return response.errResponse(res , 400 , err);		}

															if (newEntryResult) {		entryResult.status = 'Review';

																return response.response(res , 201 , entryResult);	}		});	}		});		});
			
			} else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		
		} ,

		'entryAddReplytoComment' : (req , res , next) => { let entry = req.params.entry , comment = req.params.comment , canPass = undefined;

				if (req.params && req.params.entry) { var toHappen = {'run' : true};

					if (req.body && req.body.canPass) {	canPass = req.body.canPass;	}

					$Model.findOne({'slug' : entry })
																						.lean({})

																						.populate({'path' : 'author' , 'select' : '_id'})

																						.select('status slug requestType author department faculty unit -_id')

																						.exec((err , entryResult) => {

																										if (err) {							return response.errResponse(res , 400 , err);		}

																										if (!entryResult) {			return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

										if (req.params.isRefund) { cUser.$isOwnerRf(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege); }

										else {  cUser.$isOwner(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege); }

																				if (entryResult && toHappen.run) {

																	if (entryResult.status == 'Fulfilled') {	return response.response(res , 400 , {'message' : `Reply cannot be added once ${opt.second} entry is fulfilled.`});	}

																	if (entryResult.status == 'Rejected') {		return response.response(res , 400 , {'message' : `Reply cannot be added once ${opt.second} entry is rejected.`});	}

				Comment.findOne({'slug' : comment , 'entrySlug' : entryResult.slug })
																																							.lean({})

																																							.populate({'path' : 'author' , 'select' : 'firstName lastName _id'})

																																							.select('text status slug entrySlug updatedAt author -_id')

																																							.exec((err , commentResult) => {

																											if (err) {		return response.errResponse(res , 400 , err);		}

																						if (!commentResult) {		return response.response(res , 404 , {'message' : `Comment entry does not exists in the record or is not available for this entry.`});	}

			if (commentResult.status != 'Update' && canPass != 'true') {	return response.response(res , 404 , {'message' : `Reply entry cannot be added to this comment.`});		}

						$entryReply = {	[opt.first] : entryResult ,

															'comment' : commentResult	};
																																		return response.response(res , 200 , $entryReply);	});		}		});	}
					else {
									return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

		'entryAddReplytoCommentSubmit' : (req , res , next) => { let entry = req.params.entry , comment = req.params.comment , reply = new Reply(req.body) , canPass = undefined;

				if (req.body.commentauthorname) { reply.commentAuthorName = req.body.commentauthorname;	}

				if (req.params && req.params.entry) { var toHappen = {'run' : true};

					if (req.body && req.body.canPass) {	canPass = req.body.canPass;	}
					
					$Model.findOne({'slug' : entry})
																					.lean({})

																					.hint({slug : 1})

																					.populate({'path' : 'author' , 'select' : '_id'})

																					.select('status slug department faculty unit author entryHandler unit -_id')
																					
																					.exec((err , entryResult) => {

																														if (err) {	return response.errResponse(res , 400 , err);		}
											
																									if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

										if (req.params.isRefund) { cUser.$isOwnerRf(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege); }

										else {  cUser.$isOwner(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege); }

																				if (entryResult && toHappen.run) {

																if (entryResult.status != 'Update' && canPass != 'true') {	return response.response(res , 404 , {'message' : `Reply entry cannot be added to this comment.`});		}
			if (entryResult) {

				if (req.params && req.params.comment) {

					Comment.findOne({'slug' : comment , 'entrySlug' : entryResult.slug })
																																								.lean({})

																																								.select('status slug -_id')

																																								.populate({'path' : 'replies' , 'select' : 'slug -_id'})
																							.exec((err , commentResult) => {

																												if (err) {		return response.errResponse(res , 400 , err);		}
																							
																							if (!commentResult) {		return response.response(res , 404 , {'message' : `Comment entry does not exists in the record or is not available for this entry.`});		}

				if (commentResult.status != 'Update' && canPass != 'true') {	return response.response(res , 404 , {'message' : `Reply entry cannot be added to this comment.`});		}

																if (commentResult.replies.length >= 1) {	return response.response(res , 400 , {'message' : `You can only reply once after been requested to respond by the system.`});		}
					if (commentResult) {

						reply.set('entrySlug' , entryResult.slug);

						reply.set('commentSlug' , commentResult.slug);

						reply.save((err , replyResult) => {
																							
								if (err) {	return response.errResponse(res , 400 , err);	}	
																														
									else {	$entryReply = {	[opt.first] : entryResult , 'comment' : commentResult , 'reply' : replyResult	};

														return response.response(res , 200 , $entryReply);	}	});	}	});		}
					
						else {	return response.response(res , 404 , {'message' : `No comment id provided. Please provide a valid comment id.`});		}		}		}		});		}
						
						else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

		'entryTransfer' : (req , res , next) => {	let entry = req.params.entry;

				if (req.params && req.params.entry) { var toHappen = {'run' : true};

						$Model.findOne({'slug' : entry })
																							.lean({})

																							.populate({'path' : 'author' , 'select' : 'firstName lastName _id'})

																							.populate({'path' : 'entryHandler' , 'select' : 'firstName lastName -_id'})

																							.select(`message slug status department faculty unit -_id`)

																							.exec((err , entryResult) => {

																													if (err) {	return response.errResponse(res , 400 , err);	}

																									if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

										if (req.params.isRefund) { cUser.$isOwnerRf(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege); }

										else {  cUser.$isOwner(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege); }

														if (entryResult && toHappen.run) {

																			if (entryResult.status ==	'Fulfilled') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be transferred once it is fulfilled.`});	}

																			if (entryResult.status ==	'Rejected' ) {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be transferred once it is rejected.`});		}
				async.parallel({
													'Unit' : (callback) => {
																										Unit.find({})

																										.lean({})

																										.select('_id')

																										.hint({'_id' : 1})

																										.exec(callback);	} ,
				} , (err , result) => {	
																			if (err) {		return response.errResponse(res , 400 , err);	}
							
																	if (!result) {		return response.response(res , 404 , {'message' : `Data cannot be retrieved.`});	}
						
									if (result.Unit.length == 0) {		return response.response(res , 404 , {'message' : `Unit entries does not exists in the record or is not available.`});	}

															if (entryResult) { result[opt.first] = entryResult }
			
																										return response.response(res , 200 , result);		});	}		});		}

				else { return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});	}
	} ,

		'entryTransferSubmit' : (req , res , next) => { let entry = req.params.entry , $entry = req.body , transferredTo = $entry.unit ? modelCtrl.setTransfer($entry.unit) : '';

				if (req.params && req.params.entry) { var toHappen = {'run' : true};

						$Model.findOne({'slug' : entry})

						.lean({})

						.hint({slug : 1})

						.populate({'path' : 'author' , 'select' : '_id'})

						.select('status slug author entryHandler department faculty unit -_id')

						.exec((err , entryResult) => {
																										if (err) {			return response.errResponse(res , 400 , err);		}

																					if (!entryResult) {				return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

										if (req.params.isRefund) { cUser.$isOwnerRf(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege); }

										else {  cUser.$isOwner(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege); }

																	if (entryResult && toHappen.run) {

													if (entryResult.status ==	'Fulfilled') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be transferred once it is fulfilled.`});		}

														if (entryResult.status ==	'Rejected') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be transferred once it is rejected.`});		}

													if (entryResult.unit == transferredTo) {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be transferred more than once to the same unit.`});	}

				if ((entryResult.status == 'Transferred') && entryResult.unit == transferredTo) {

							return response.response(res , 400 , {'message' : `${opt.second} entry cannot be transferred more than once to the same unit.`});	}

										if (entryResult) {

				$Model.updateOne({'slug' : entry} , {'$set' : {'status' : 'Transferred' , 'unit' : transferredTo , 'requestType' : $entry.requestType} } , {'runValidators' : true })
										
															.exec((err , entryResult1) => {

																									if (err) {		return response.errResponse(res , 400 , err);		}

													if (!(entryResult1.nModified > 0)) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																				if (entryResult1.nModified > 0) {

				let timeline = Object.assign({'author' : entryResult.author , 'entryHandler' : req.body.author , 'entrySlug' : entryResult.slug , 'status' : 'Transferred'} ,

																								 $entry , {'unit' : entryResult.unit , 'transferredTo' : transferredTo} );
				let newComment = new Comment(timeline);

			newComment.save((err , newEntryResult) => {
																										if (err) { 	return response.errResponse(res , 400 , err);		}

																				if (newEntryResult) {		return response.response(res , 201 , newEntryResult);	}		});	}		});		}		}		});	}

			else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}

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

		'entryDeleteMany' : () => { return (req , res , next) => { let entries = req.body.entries && req.body.entries.length ? req.body.entries : [];

			if (entries.length > 0) {

				$Model.deleteMany({'num' : {'$in' : entries } })

															.lean({})

															.exec((err , entryResult) => {

																					if (err) {			return response.errResponse(res , 400 , err);		}

									if (!entryResult.deletedCount > 0) {		return response.response(res , 404 , {'message' : `${opt.second} entries does not exists in the record or is not available.`});		}
																
												if (entryResult.deletedCount) {		return response.response(res , 204 , {'message' : `Entries successfully removed from the record.`});	}		});		}

					else { return response.response(res , 404 , {'message' : `${opt.second} entries does not exists in the record or is not available.`}); }
		} },	

		'entryDeleteAll' : (req , res , next) => {

				$Model.find({})
												.lean({})

												.limit(1)

												.select('_id')

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