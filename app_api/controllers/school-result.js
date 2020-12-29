const mongoose = require('mongoose');

module.exports = (opt) => {

	const $Model = opt.$Model;

	const Comment = mongoose.model(opt.comment); 

	const response = require('../config/response');

	const modelMessage = require(`../messages/${opt.third}`);

	const modelCtrl = require('../helpers/model-ctrl');

	const mailer = require('../config/mail');

	const cUser = require('../config/confirm-user');

	return {

		'entryUpdate' : (req , res , next) => { let entry = req.params.entry , $entry = {'status' : modelCtrl.setStatus(req.body.status) , 'text' : req.body.text } , status = $entry.status; 

				if (req.params && req.params.entry) { var toHappen = {'run' : true};

						$Model.findOne({'slug' : entry})

							.lean({})

							.hint({'slug' : 1})

							.populate({'path' : 'unit' , 'select' : '_id'})

							.select('status slug author unit')

							.exec((err , entryResult) => {
																								if (err) {		return response.errResponse(res , 400 , err);		}

																				if (!entryResult) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});		}

													cUser.$isOwnerUpdate(req , res , next , entryResult , opt.second , toHappen , opt.normalPrivilege , ['staff' , ...opt.superPrivilege] , cUser.successReponse , opt.leastPrivilege);

																						if (entryResult && toHappen.run) {

			if (status == '' || status == undefined || status == null) {	return response.response(res , 400 , {'message' : `You have to provide a valid status before you can process the application.`});	}


		if (entryResult.status == 'Pending') {

	if (entryResult.status ==	'Pending' && status == 'Pending') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to pending more than once.`});		}

	if (entryResult.status ==	'Pending' && status == 'Review') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to review through this channel.`});	}

	if (entryResult.status ==	'Pending' && status == 'Update') {	return response.response(res , 400 , {'message' : `${opt.second} entry has to be set in review before it can be updated.`});	}

if (entryResult.status ==	'Pending' && status == 'Fulfilled') {	return response.response(res , 400 , {'message' : `${opt.second} entry has to be set in review before it can be fulfilled.`});	}

if (entryResult.status ==	'Pending' && status == 'Rejected') {	return response.response(res , 400 , {'message' : `${opt.second} entry has to be set in review before it can be rejected.`});		}
	
			}

		if (entryResult.status == 'Review') {

if (entryResult.status == 'Review' && status == 'Review') {		return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to review more than once and through this channel.`});		}

if (entryResult.status ==	'Review' && status == 'Pending') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to pending once review starts.`});		}
	
			}

		if (entryResult.status == 'Update')	{

if (entryResult.status == 'Update' && status == 'Update') {			return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to updated more than once.`});		}

if (entryResult.status == 'Update' && status == 'Pending') {		return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to pending once review starts.`});		}

	if (entryResult.status == 'Update' && status == 'Review') {		return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to review more than once.`});	}
	
			}

		if (entryResult.status == 'Fulfilled') {	return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to fulfilled more than once.`});	}

		if (entryResult.status == 'Rejected') {		return response.response(res , 400 , {'message' : `${opt.second} entry cannot be set to rejected more than once.`});	}

									if (entryResult) {
			$Model
						.findOneAndUpdate({'slug' : entry} , 

															{'$set' : {'status' : status , 'entryHandler' : req.body.author} } , 

															{'new' : true})
						.lean({})

						.populate({'path' : 'author' , 'select' : 'emailAddress -_id'})

						.select('status author')

						.exec((err , entryResult1) => {

																if (err) {			return response.errResponse(res , 400 , err);		}

												if (!entryResult1) {		return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

												if (entryResult1) {

														if (entryResult1.status == 'Fulfilled') {	let $entry = modelMessage.fulfilled(req , res , next);

																mailer.entryFulfilled(req , res , next , entryResult1.author , $entry.title , $entry.message);	}

														if (entryResult1.status == 'Rejected') { let $entry = modelMessage.rejected(req , res , next);

																mailer.entryRejected(req , res , next , entryResult1.author , $entry.title , $entry.message);	}

		let timeline = Object.assign({'author' : entryResult.author , 'entryHandler' : req.body.author , 'unit' : entryResult.unit , 'entrySlug' : entryResult.slug} , $entry);

		let newComment = new Comment(timeline);

			newComment.save((err , newEntryResult) => {

																			if (err) {								return response.errResponse(res , 400 , err);		}

																			if (newEntryResult) {			return response.response(res , 201 , entryResult);	}		});		}		});	}		}	})	}

					else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} ,

	}

}