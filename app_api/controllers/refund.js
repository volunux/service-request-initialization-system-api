const mongoose = require('mongoose');

module.exports = (opt) => {

	const $Model = opt.$Model;

	const Unit = opt.Unit;

	const Upload = opt.Upload;

	const Letter = opt.Letter;

	const Comment = mongoose.model(opt.comment); 

	const Reply = mongoose.model(opt.reply); 

	const config = require('../config/response') , async = require('async');

	const modelMessage = require(`../messages/${opt.third}`);

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

		'entryUpdate' : (req , res , next) => { let entry = req.params.entry , stage = req.body.stage , status = req.body.status , refund = {'status' : status , 'text' : req.body.text };

			if (req.params && req.params.entry) { var toHappen = {'run' : true};

					$Model.findOne({'slug' : entry})

						.lean({})

						.populate({'path' : 'author' , 'select' : 'emailAddess _id'})

						.populate({'path' : 'entryHandler' , 'select' : '_id'})

						.populate({'path' : 'stage' , 'select' : '_id name'})

						.populate({'path' : 'signature' , 'select' : '_id firstName lastName'})

						.select('signature status slug author entryHandler letter stage faculty department -_id')

						.exec((err , entryResult) => {
																						if (err) {			return config.errResponse(res , 400 , err);		}

																		if (!entryResult) {			return config.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

 																cUser.$isOwnerRf(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege);

 															if (entryResult && toHappen.run) {

if (entryResult.stage._id == undefined || entryResult.stage._id == null) {	return config.response(res , 400 , {'message' : `Entry need to be set in review before it can be updated by the system.`});	}

			if (entryResult.stage._id == '2') {

if (entryResult.status == 'Review' && entryResult.stage._id == '2' && stage == '2') {	return config.response(res , 400 , {'message' : `${opt.second} entry cannot be at stage 2 more than once.`});	}		}

			if (entryResult.stage._id == '3') {

if (entryResult.status == 'Review' && entryResult.stage._id == '3' && stage == '3') {	return config.response(res , 400 , {'message' : `${opt.second} entry cannot be at stage 3 more than once.`});	}

if (entryResult.status == 'Review' && entryResult.stage._id == '3' && stage == '6') {	return config.response(res , 400 , {'message' : `${opt.second} entry cannot be at stage 6 until after stage 3 , 4 and 5.`});	}

		}

			if (entryResult.stage._id == '4') {

if (entryResult.status == 'Review' && entryResult.stage._id == '4' && stage == '4') {	return config.response(res , 400 , {'message' : `${opt.second} entry cannot be at stage 4 more than once.`});	}		}

			if (entryResult.stage._id == '5') {

if (entryResult.status == 'Review' && entryResult.stage._id == '5' && stage == '5' && entryResult.signature.length >= 2) {	return config.response(res , 400 , {'message' : `${opt.second} entry cannot be at stage 5 more than once.`});	}
	
		}

			if (entryResult.stage._id == '6') {

if (entryResult.status == 'Fulfilled' && entryResult.stage._id == '6') {	return config.response(res , 400 , {'message' : `${opt.second} entry cannot be fulfilled more than once.`});	}

if (entryResult.status == 'Rejected' && entryResult.stage._id == '6') {		return config.response(res , 400 , {'message' : `${opt.second} entry cannot be rejected more than once.`});	}
		
		}

if (entryResult.status == 'Fulfilled') {	return config.response(res , 400 , {'message' : `${opt.second} entry cannot be fulfilled more than once.`});	}

if (entryResult.status == 'Rejected') {		return config.response(res , 400 , {'message' : `${opt.second} entry cannot be rejected more than once.`});	}

									if (entryResult) {

										if (stage == '2') {

											if (refund.status == 'Rejected') {

									$Model.updateOne({'slug' : entry} , 

																						{'$set' : {'stage' : '1' , 'status' : 'Rejected' , 'entryHandler' : req.body.author}} ,	{'runValidators' : false })

													.exec((err , entryResult1) => {
																															if (err) {		return config.errResponse(res , 400 , err);		}

																			if (!(entryResult1.nModified > 0)) {	return config.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																				if (entryResult1.nModified > 0) {	let timeline = Object.assign({'author' : entryResult.author._id , 'entryHandler' : req.body.author , 

																													'entrySlug' : entryResult.slug , 'stage' : '1'} , refund , { 'status' : 'Rejected'});

																													let newComment = new Comment(timeline);

																												 	let $entry = modelMessage.rejected(req , res , next);

																													mailer.entryRejected(req , res , next , entryResult.author , $entry.title , $entry.message);	
						newComment.save((err , newEntryResult) => {

																								if (err) {			return config.errResponse(res , 400 , err);		}

																			if (newEntryResult) {			return config.response(res , 201 , entryResult);	}		});		}		});		}
						else {
										$Model.updateOne({'slug' : entry} , 

																						{'$set' : {'stage' : '2' , 'status' : 'Review' , 'entryHandler' : req.body.author}} , {'runValidators' : false })

													.exec((err , entryResult1) => {
																															if (err) {			return config.errResponse(res , 400 , err);		}

																			if (!(entryResult1.nModified > 0)) {		return config.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																			if (entryResult1.nModified > 0) {	let timeline = Object.assign({'author' : entryResult.author._id , 'entryHandler' : req.body.author ,  

																													'entrySlug' : entryResult.slug , 'stage' : '2'} , refund , { 'status' : 'Review'});

																													let newComment = new Comment(timeline);
			newComment.save((err , newEntryResult) => {

																									if (err) {		return config.errResponse(res , 400 , err);		}

																			if (newEntryResult) {			return config.response(res , 201 , entryResult);	}		});		}		});		}		}

													else if (stage == '3') {

											if (refund.status == 'Rejected') {

										$Model.updateOne({'slug' : entry} , 

																						{'$set' : {'stage' : '2' , 'status' : 'Rejected' , 'entryHandler' : req.body.author}} , {'runValidators' : false})

													.exec((err , entryResult1) => {
																															if (err) {			return config.errResponse(res , 400 , err);		}

																			if (!(entryResult1.nModified > 0)) {		return config.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																			if (entryResult1.nModified > 0) {	let timeline = Object.assign({'author' : entryResult.author._id , 'entryHandler' : req.body.author , 

																													'entrySlug' : entryResult.slug , 'stage' : '2'} , refund , { 'status' : 'Rejected'});

																													let newComment = new Comment(timeline);

																												 	let $entry = modelMessage.rejected(req , res , next);

																													mailer.entryRejected(req , res , next , entryResult.author , $entry.title , $entry.message);
			newComment.save((err , newEntryResult) => {

																								if (err) {			return config.errResponse(res , 400 , err);		}

																			if (newEntryResult) {			return config.response(res , 201 , entryResult);	}		});		}		});		}
					else {
										$Model.updateOne({'slug' : entry} , 

																						{'$set' : {'stage' : '3' , 'status' : 'Review' , 'entryHandler' : req.body.author}} , {'runValidators' : false})

													.exec((err , entryResult1) => {
																															if (err) {			return config.errResponse(res , 400 , err);		}

																			if (!(entryResult1.nModified > 0)) {		return config.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																			if (entryResult1.nModified > 0) { let timeline = Object.assign({'author' : entryResult.author._id , 'entryHandler' : req.body.author , 

																													'entrySlug' : entryResult.slug , 'stage' : '3'} , refund , { 'status' : 'Review'});
																													
																													let newComment = new Comment(timeline);
			newComment.save((err , newEntryResult) => {

																								if (err) {			return config.errResponse(res , 400 , err);		}

																			if (newEntryResult) {			return config.response(res , 201 , entryResult);	}		});		}		});		}	}

													else if (stage == '4') { let letter = req.body; letter['entrySlug'] = entryResult.slug;

														let newLetter = new Letter(letter);

				newLetter.save((err , letterResult) => {
																										if (err) {	return config.errResponse(res , 400 , err);		}

									$Model.updateOne({'slug' : entry} , 

																						{'$set' : {'stage' : '4' , 'status' : 'Review' , 'letter' : letterResult._id}} , {'runValidators' : false})

													.exec((err , entryResult1) => {
																															if (err) {			return config.errResponse(res , 400 , err);		}

																			if (!(entryResult1.nModified > 0)) {		return config.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																			if (entryResult1.nModified > 0) { let timeline = Object.assign({ 'author' : entryResult.author._id , 'entryHandler' : entryResult.entryHandler._id ,

																							'entrySlug' : entryResult.slug , 'stage' : '4'} , refund , { 'status' : 'Review' , 'text' : 'Content of the Letter'});

																							let newComment = new Comment(timeline);

			newComment.save((err , newEntryResult) => {

																								if (err) {		return config.errResponse(res , 400 , err);		}

																			if (newEntryResult) {		return config.response(res , 201 , entryResult);	}		});		}		});		});		}

													else if (stage == '5') { let userVote = {'voted' : undefined };

													if (entryResult.signature && entryResult.signature.length >= 1) {

							entryResult.signature.find((sign) => {

							if (sign._id == req.body.author) {	userVote.voted = true;

										return true;	}		});
																															if (userVote.voted) {
																																											return config.response(res , 400 , {'message' : `You can't make signature more than once for an entry.`});		}		
																															else {

			$Model.updateOne({'slug' : entry } , { '$set' : {'stage' : '5' } , '$addToSet' : {'signature' : req.body.author } } , {'runValidators' : false})

																	.exec((err , voteResult) => {
																																if (err) {	return config.errResponse(res , 400 , err);		}

																					if (voteResult.nModified > 0) { let timeline = Object.assign({'author' : entryResult.author._id , 'entryHandler' : req.body.author ,

																																						'entrySlug' : entryResult.slug , 'stage' : '5'} , refund , { 'status' : 'Review'});

																												let newComment = new Comment(timeline);
			newComment.save((err , newEntryResult) => {

																								if (err) {		return config.errResponse(res , 400 , err);		}

																			if (newEntryResult) {		return config.response(res , 201 , entryResult);	}		});		}		});		}		}  

																	else {

			$Model.updateOne({'slug' : entry } , {'$addToSet' : {'signature' : req.body.author } } , {'runValidators' : false})

																	.exec((err , voteResult) => {
																																	if (err) {	return config.errResponse(res , 400 , err);		}

																			if (voteResult.nModified > 0) { let timeline = Object.assign({'author' : entryResult.author._id , 'entryHandler' : req.body.author ,

																																			'entrySlug' : entryResult.slug , 'stage' : entryResult.stage._id} , refund , { 'status' : 'Review'});

																											let newComment = new Comment(timeline);
			newComment.save((err , newEntryResult) => {

																								if (err) {			return config.errResponse(res , 400 , err);		}

																			if (newEntryResult) {			return config.response(res , 201 , entryResult);	}		});		}		});		}

																		} else if (stage == '6') {

											if (entryResult.signature.length < 2) {		return config.errResponse(res , 400 , {'message' : 'Documents and letter need to be signed before being forwarded to the Bursary'});	}

											if (refund.status == 'Rejected') {

										$Model.updateOne({'slug' : entry} , 

																						{'$set' : {'stage' : '5' , 'status' : 'Rejected' , 'entryHandler' : req.body.author}} , {'runValidators' : false})

													.exec((err , entryResult1) => {
																															if (err) {		return config.errResponse(res , 400 , err);		}

																			if (!(entryResult1.nModified > 0)) {	return config.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																				if (entryResult1.nModified > 0) {	let timeline = Object.assign({'author' : entryResult.author._id , 'entryHandler' : req.body.author ,

																													'entrySlug' : entryResult.slug , 'stage' : '5'} , refund , {'status' : 'Rejected'});

																													let newComment = new Comment(timeline);

																												 	let $entry = modelMessage.rejected(req , res , next);

																													mailer.entryRejected(req , res , next , entryResult.author , $entry.title , $entry.message);	
			newComment.save((err , newEntryResult) => {

																								if (err) {		return config.errResponse(res , 400 , err);		}

																			if (newEntryResult) {		return config.response(res , 201 , entryResult);	}		});		}		});		}
					else {
										$Model
													.findOneAndUpdate({'slug' : entry} , 

																						{'$set' : {'stage' : '6' , 'status' : status , 'entryHandler' : req.body.author}} , {'new' : true , 'runValidators' : false })
													.lean({})

													.select('status -_id')

													.exec((err , entryResult1) => {

																								if (err) {		return config.errResponse(res , 400 , err);		}

																			if (!entryResult1) {		return config.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																			if (entryResult1) {

																					if (entryResult1.status == 'Fulfilled') {	let $entry = modelMessage.fulfilled(req , res , next);

																mailer.entryFulfilled(req , res , next , entryResult.author , $entry.title , $entry.message);	}

																					if (entryResult1.status == 'Rejected') { let $entry = modelMessage.rejected(req , res , next);

																mailer.entryRejected(req , res , next , entryResult.author , $entry.title , $entry.message);	}

		let timeline = Object.assign({'entryHandler' : req.body.author , 'author' : entryResult.author._id , 'entrySlug' : entryResult.slug , 'stage' : '6'} , refund);

		let newComment = new Comment(timeline);

			newComment.save((err , newEntryResult) => {

																			if (err) {								return config.errResponse(res , 400 , err);		}

																			if (newEntryResult) {			return config.response(res , 201 , entryResult);	}		});		}		});		}		}		}		}		});	}

			else {	return config.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}

		} ,

		'entryReview' : (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) {

						$Model.findOne({'slug' : entry})

						.lean({})

						.hint({'slug' : 1})

						.populate({'path' : 'author' , 'select' : 'emailAddress _id'})

						.select('status slug author unit -_id')

						.exec((err , entryResult) => {
																									if (err) {	return config.errResponse(res , 400 , err);		}

																				if (!entryResult) {		return config.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

												if (entryResult.status == 'Review') {	return config.response(res , 400 , {'message' : `${opt.second} entry cannot be set to review more than once.`});		}

											if (entryResult.status !=	'Pending') {	return config.response(res , 400 , {'message' : `${opt.second} entry cannot be updated at this stage.`});		}
																	
				$Model.updateOne({'slug' : entry} , {'$set' : {'status' : 'Review' , 'stage' : '1' , 'entryHandler' : req.body.author } } , {'runValidators' : false })

													.exec((err , entryResult1) => {

																				if (err) {	return config.errResponse(res , 400 , err);		}

															if (!(entryResult1.nModified > 0)) {	return config.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

															if (entryResult1.nModified > 0) { let $entry = {'title' : modelMessage.review().title , 'text' : modelMessage.review().message };

																	mailer.entryReview(req , res , next , entryResult.author , $entry.title , $entry.text);

																		let timeline = Object.assign({'author' : entryResult.author._id , 'entryHandler' : req.body.author ,

																			'entrySlug' : entryResult.slug , 'status' : 'Review' , 'stage' : '1'} , $entry);

																		let newComment = new Comment(timeline);

			newComment.save((err , newEntryResult) => {

																				if (err) {		return config.errResponse(res , 400 , err);	}

															if (newEntryResult) { entryResult.status ='Review';

															entryResult.stage = {'_id' : '1'};

																	return config.response(res , 201 , entryResult);	}		});	}		});		});
			
			} else {	return config.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		
		} ,

	'entryLetter' : (req , res , next) => { let entry = req.params.entry;

			if (req.params && req.params.entry) { let toHappen = {'run' : true};

					$Model.findOne({'slug' : entry})

					.lean({})

					.hint({'slug' : 1})

					.populate({'path' : 'letter' , 'select' : 'main_body _id'})

					.select('letter slug author')

					.exec((err , entryResult) => {

																			if (err) {	return config.errResponse(res , 400 , err);	}

															if (!entryResult) {	return config.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

 													return cUser.$isOwnerRf(req , res , next , entryResult , opt.second , null , opt.normalPrivilege , opt.superPrivilege , cUser.successReponse , opt.leastPrivilege);

 													if (entryResult && toHappen.run) {

											if (!entryResult.letter) {	return config.response(res , 404 , {'message' : `${opt.second} entry letter does not exists in the record or is not available.`});		}

																									return config.response(res , 200 , entryResult);	}	}); }

			else {	return config.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}

	} 

	}

}