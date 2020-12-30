const axios = require('axios');

const { body , check , validationResult } = require('express-validator');

module.exports = function(opt) {

	const url = require('../config/url')[opt.fourth];

	return {

		'entryTimeline' : (req , res , next) => { let entry = req.params.entry , link = `${url}/entry/${entry}/timeline`;

			axios({'method' : 'get' , 'url' : link})

				.then((response) => { let data = response.data , comments = data.timeline , userRole = req.user.role;

					res.render('request/gen-views/timeline' , {'title' : `${opt.second} entry Timeline` , 'entry' : data , 'comments' : comments , 'userRole' : userRole , 'view' : opt.code , 

																											'link' : opt.first , 'viewG' : 'general' , 'canUpload' : false });	})

				.catch((error) => { let status = error.response;

					res.render('error' , {'title' : 'Error' , 'error' : status 	});		});
		} ,

		'entryReview' : (req , res , next) => { let entry = req.params.entry , link = `${url}/entry/${entry}/review`;

			axios({'method' : 'put' , 'url' : link})

				.then((response) => { let data = response.data , link = `/request/${opt.first}/entry/${data.slug}`;

					res.redirect(link);	})

				.catch((error) => { let status = error.response;

					res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'entryCommentAdd' : (req , res , next) => { let entry = req.params.entry , link = `${url}/entry/${entry}/comment`;

			axios({'method' : 'get' , 'url' : link})

				.then((response) => { let data = response.data;

						res.render(`request/gen-views/comment` , {'title' : 'Add a Comment' , 'entry' : data , 'view' : opt.code , 'viewG' : 'general' });	})

				.catch((error) => { let status = error.response;

						res.render('error' , {'title' : `Error` , 'error' : status 	});		});
		} ,

		'entryCommentAddSubmit' : [

			body('text')		.isLength({'min' : 10}).withMessage('Comment body cannot be less than 10 characters in length.')

											.isLength({'max' : 500}).withMessage('Comment body cannot be greater than 500 characters in length.')

											.not().isEmpty().withMessage('Comment body should be provided and cannot be empty.').trim().escape() ,

			(req , res , next) => { let entry = req.params.entry , link = `${url}/entry/${entry}/comment`;

				const errors = validationResult(req);

				let errorList = errors.array();

					if (errorList.length != 0) { let $entry = req.body;

						axios({'method' : 'get' , 'url' : link})

							.then((response) => { let data = response.data , userRole = req.user.role; 

								res.render(`request/gen-views/comment` , {'title' : 'Add a Comment' , 'entry' : data , 'errors' : errorList , 

																													'$entry' : $entry , 'view' : opt.code , 'viewG' : 'general' });	})

							.catch((error) => { let status = error.response;

									res.render('error' , {'title' : 'Error' , 'error' : status 	});		});		}	
					else {
									
						axios({'method' : 'post' , 'url' : link , 'data' : req.body})

							.then((response) => { let data = response.data , link = `/request/${opt.first}/entry/${data.slug}/timeline`;

									res.redirect(link);	})

							.catch((error) => { let status = error.response;

									res.render('error' , {'title' : 'Error' , 'error' : status 		});		});		}
		}] ,

		'entryReplyAdd' : (req , res , next) => { let entry = req.params.entry , comment = req.params.comment , link = `${url}/entry/${entry}/comment/${comment}/reply`;

			axios({'method' : 'get' , 'url' : link})

				.then((response) => { let data = response.data , entry = data[opt.fourth] , comment = data.comment;

					res.render('request/gen-views/reply' , {'title' : 'Add a Reply to a Comment' , 'entry' : entry , 'comment' : comment , 'view' : opt.code , 'viewG' : 'general' });	})

				.catch((error) => { let status = error.response;

					res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'entryReplyAddSubmit' : [

			body('text')		.isLength({'min' : 10}).withMessage('Reply body cannot be less than 10 characters in length.')

											.isLength({'max' : 500}).withMessage('Reply body cannot be greater than 500 characters in length.')

											.not().isEmpty().withMessage('Reply body should be provided and cannot be empty.').trim().escape() ,

			(req , res , next) => { let entry = req.params.entry , comment = req.params.comment , link = `${url}/entry/${entry}/comment/${comment}/reply`;

				const errors = validationResult(req);

				let errorList = errors.array();

					if (errorList.length != 0) { let $entry = req.body;

						axios({'method' : 'get' , 'url' : link})

							.then((response) => {  let data = response.data , entry = data[opt.fourth] , comment = data.comment;

								res.render(`request/gen-views/reply` , {'title' : 'Add a Reply to a Comment' , 'entry' : entry , 'errors' : errorList ,

																												'comment' : comment , '$entry' : $entry , 'view' : opt.code ,'viewG' : 'general'  });	})

							.catch((error) => { let status = error.response;

									res.render('error' , {'title' : 'Error' , 'error' : status 	});	});		}	
					else {

						axios({'method' : 'post' , 'url' : link , 'data' : req.body})

							.then((response) => { let data = response.data , slug = data[opt.fourth].slug , link = `/request/${opt.first}/entry/${slug}/timeline`;

									res.redirect(link);	})

							.catch((error) => { let status = error.response;

									res.render('error' , {'title' : 'Error' , 'error' : status 	});	});		}
		}] ,

		'entryTransfer' : (req , res , next) => { let entry = req.params.entry , link = `${url}/entry/${entry}/transfer`;

			axios({'method' : 'get' , 'url' : link})

				.then((response) => { let data = response.data , entry = data[opt.fifth] , unit = data.Unit;

					res.render(`request/gen-views/transfer` , {'title' : 'Transfer and Move Request' , 'entry' : entry , 'units' : unit , 'view' : opt.code , 'viewG' : 'general' });	})

				.catch((error) => { let status = error.response;

					res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'entryTransferSubmit' : [

			body('text')		.isLength({'min' : 10}).withMessage('Message body cannot be less than 10 characters in length.')

											.isLength({'max' : 500}).withMessage('Message body cannot be greater than 500 characters in length.')

											.not().isEmpty().withMessage('Message body should be provided and cannot be empty.').trim().escape() ,

			body('unit'						,		'Unit should be provided and cannot be empty.')			.isLength({ 'min' : 1 })

																																										.isLength({ 'max' : 150})
																																																						.withMessage(`Unit cannot be greater than 150 characters in length.`) ,
			(req , res , next) => { let entry = req.params.entry , link = `${url}/entry/${entry}/transfer`;

				const errors = validationResult(req);

				let errorList = errors.array();

					if (errorList.length != 0) { let $entry = req.body;

						axios({'method' : 'get' , 'url' : link})

							.then((response) => { let data = response.data , userRole = req.user.role , entry = data[opt.fifth] , unit = data.Unit;

								res.render(`request/gen-views/transfer` , {'title' : 'Transfer and Move Request' , 'entry' : data , 'units' : unit ,

																													'errors' : errorList , '$entry' : $entry , 'view' : opt.code , 'viewG' : 'general' });	})

							.catch((error) => { let status = error.response;

										res.render('error' , {'title' : 'Error' , 'error' : status 	});		});		}
					else {
										
						axios({'method' : 'put' , 'url' : link , 'data' : req.body})

							.then((response) => { let link = `/request/${opt.first}/entries/`;

									res.redirect(link);	})

							.catch((error) => { let status = error.response;

									res.render('error' , {'title' : 'Error' , 'error' : status 	});		});		}
		}]

	}

}