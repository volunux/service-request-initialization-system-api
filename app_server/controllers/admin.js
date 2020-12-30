const axios = require('axios');

const { body , check , validationResult } = require('express-validator');

const errHandler = require('./helpers/compiledError');

const $Model = require('../../app_api/models/models').User;

module.exports = function(opt) {

	const url = require('../config/url')[opt.fourth];

	return {

		'index' : (req , res , next) => {

				return res.redirect('/system/admin/entries/manage');

		} ,

		'dashboard' : (req , res , next) => {	let entry = req.user._id , link = `${url}/confirm-admin`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.sixth}/dashboard` , {'title' : `${opt.second} Dashboard` , 'entries' : data , 'view' : 'ud' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'manageRequest' : (req , res , next) => {	let entry = req.user._id , link = `${url}/confirm-admin`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.sixth}/manage-request` , {'title' : `${opt.second} Dashboard` , 'entries' : data , 'view' : 'ud' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'managePayment' : (req , res , next) => {	let entry = req.user._id , link = `${url}/confirm-admin`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.sixth}/manage-payment` , {'title' : `${opt.second} Dashboard` , 'entries' : data , 'view' : 'ud' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'manageOthers' : (req , res , next) => {	let entry = req.user._id , link = `${url}/confirm-admin`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.sixth}/manage-others` , {'title' : `${opt.second} Dashboard` , 'entries' : data , 'view' : 'ud' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'entries' : (req , res , next) => {	let link = `${url}/user/entries` , pageNumber = req.query.page ? parseInt(req.query.page , 10) : 1; userRef = req.query.status ? true : 0;

			axios({'method' : 'get' , 'url' : link , 'params' : req.query })

				.then((response) => { let data = response.data;

						res.render(`${opt.sixth}/entries` , {'title' : `${opt.second} Entries` , 'entries' : data , 'view' : 'ups' , 'uaddress' : opt.first , 

																								'canUpload' : false , 'pageNumber' : pageNumber , 'userRef' : userRef });	})

				.catch((error) => { let status = error.response;

						res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'entryDetail' : (req , res , next) => { let entry = req.params.entry , link = `${url}/user/${entry}/detail`;

			axios({'method' : 'get' , 'url' : link})

				.then((response) => { let data = response.data;

						res.render(`${opt.sixth}/entry-detail` , {'title' : `${opt.second} Entry Detail` , 'entry' : data , 'view' : 'upv' , 'uaddress' : opt.first , 'canUpload' : false });	})

				.catch((error) => { let status = error.response;

						res.render('error' , {'title' : `${opt.second} entry not available.` , 'error' : status 	});	});
		} ,

		'entryUpdate' : (req , res , next) => { let entry = req.params.entry , link = `${url}/user/${entry}/update`;

			axios({'method' : 'get' , 'url' : link})

				.then((response) => {	let data = response.data , country = data.Country , level = data.Level , department = data.Department , faculty = data.Faculty , unit = data.Unit , user = data.User;

						res.render(`${opt.sixth}/entry-update` , {'title' : `Update ${opt.second} Entry` , 'countries' : country , 'departments' : department , 'faculties' : faculty ,

																											'levels' : level , 'units' : unit , '$entry' : user , 'view' : 'uup' , 'uaddress' : opt.first , 'canUpload' : false });	})

				.catch((error) => { let status = error.response;

						res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'entryUpdateSubmit' : [

			body('firstName'			,		'First Name should be provided and cannot be empty.')					.isLength({ 'min' : 2 })
																																																											.withMessage(`First Name cannot be less than 3 character in length.`)
																																															.isLength({ 'max' : 20})
																																																											.withMessage(`First Name cannot be greater than 20 characters in length.`) ,
			body('lastName'				,		'Last Name should be provided and cannot be empty.')					.isLength({ 'min' : 2 })
																																																											.withMessage(`Last Name cannot be less than 3 character in length.`)
																																															.isLength({ 'max' : 20})
																																																											.withMessage(`Last Name cannot be greater than 20 characters in length.`) ,
			body('department'			, 	'Department of User should be provided and cannot be empty.')	.isLength({ 'min' : 1 })

																																															.isLength({ 'max' : 150})
																																																											.withMessage(`Department of User cannot be greater than 150 characters in length.`) ,
			body('faculty'				, 	'Faculty of User should be provided and cannot be empty.')		.isLength({ 'min' : 1 })

																																															.isLength({ 'max' : 150})
																																																											.withMessage(`Faculty of User cannot be greater than 150 characters in length.`) ,
			body('level'					, 	'Level of User should be provided and cannot be empty.')			.isLength({ 'min' : 1 })

																																															.isLength({ 'max' : 150})
																																																											.withMessage(`Level of User cannot be greater than 150 characters in length.`) ,
			body('country'				,		'Country should be provided and cannot be empty.')						.isLength({ 'min' : 1 })

																																															.isLength({ 'max' : 50})
																																																											.withMessage(`Country cannot be greater than 50 characters in length.`) ,
			body('unit'						,		'Unit should be provided and cannot be empty.')								.isLength({ 'min' : 1 })

																																															.isLength({ 'max' : 150})
																																																											.withMessage(`Unit cannot be greater than 150 characters in length.`) ,
			body('about')											.isLength({ 'min' : 0 }) 

																				.isLength({ 'max' : 300})
																																.withMessage(`About User cannot be greater than 300 characters in length.`) ,
			body('matriculationNumber')				.isLength({ 'min' : 0 })

																				.isLength({ 'max' : 30 })
																																.withMessage('Matriculation Number cannot be greater than 30 characters in length.') ,
			body('jambRegistrationNumber')		.isLength({ 'min' : 0 })

																				.isLength({ 'max' : 30 })
																																.withMessage('Jamb Registration Number cannot be greater than 30 characters in length.') ,
			body('identityNumber')						.isLength({ 'min' : 0 })

																				.isLength({ 'max' : 30 })
																																.withMessage('Identity Number cannot be greater than 30 characters in length.') ,

			body('role').custom((value , { req }) => { let role = req.body.role;

				if (opt.roles.indexOf(role) < 0) { throw new Error('A valid role should be provided and cannot be empty.');	}

					if (value == '') throw new Error('A valid role should be provided and cannot be empty.'); 

							return true;	}) ,

			body('status').custom((value , { req }) => { let status = req.body.status;

				if (opt.statuses.indexOf(status) < 0) { throw new Error('A valid status should be provided and cannot be empty.');	}

					if (value == '') throw new Error('A valid status should be provided and cannot be empty.'); 

							return true; }) ,

			body('*').trim() ,
			
			(req , res , next) => { let entry = req.params.entry , link = `${url}/user/${entry}/update` , $entry =  req.body;

			let errors = validationResult(req);

			let errorList = errors.array();

							if (errorList.length !== 0) {

				axios({'method' : 'get' , 'url' : link})

				.then((response) => {	let data = response.data , country = data.Country , level = data.Level , department = data.Department , faculty = data.Faculty , unit = data.Unit , user = data.User;

						res.render(`${opt.sixth}/entry-update` , {'title' : `Update ${opt.second} Entry` , 'countries' : country , 'departments' : department , 'faculties' : faculty ,

																											'levels' : level , 'units' : unit , '$entry' : user , 'errors' : errorList , 'view' : 'uup' , 'uaddress' : opt.first , 'canUpload' : false });		})
						.catch((err) => {	status = err.response;
																												res.render('error' , {'title' : 'Error' , 'error' : status})	});		}
				else {
								axios({  'method': 'put' ,
																						'url' : link ,
																														'data' : req.body })

						.then((response) => {	let data = response.data , link = `/system/user/entries`;

																													req.flash('info', 'Entry successfully updated.');
																																																							res.redirect(link);		})
								.catch((err) => { let	errors = [];
																												if (err.response.status == 400) {
			return axios({'method' : 'get' , 'url' : link})

				.then((response) => {	let data = response.data , country = data.Country , level = data.Level , department = data.Department , faculty = data.Faculty , unit = data.Unit , user = data.User;

															errHandler.formAdd(err , errors);

			return res.render(`${opt.sixth}/entry-update` , {'title' : `Update ${opt.second} Entry` , 'countries' : country , 'departments' : department , 'faculties' : faculty ,

																								'levels' : level , 'units' : unit , '$entry' : user , 'errors' : errors , 'view' : 'uup' , 'uaddress' : opt.first , 'canUpload' : false });	})
			.catch((err) => {	status = err.response;
																									res.render('error' , {'title' : 'Error' , 'error' : status})	});		}
												status = err.response;
																									res.render(`error` , {'title' : 'Error' , 'error' : status 	});		});		}
		 }]	, 

		'entryDelete' : (req , res , next) => { let entry = req.params.entry , link = `${url}/user/${entry}/delete`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.sixth}/entry-delete` , {'title' : `Delete ${opt.second} Entry` , '$entry' : data , 'view' : 'dup' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'entryDeleteSubmit' : (req , res , next) => { let entry = req.params.entry , link = `${url}/user/${entry}/delete`;

			axios({'method' : 'delete' , 'url' : link , 'data' : req.body})

				.then((response) => { let data = response.data , link = `system/user/entries`;

															req.flash('info', 'Entry successfully deleted.');

															res.redirect(link);		})

				.catch((error) => { let status = error.response;

						res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'requestMenu' : (req , res , next) => {	let entry = req.user._id , link = `${url}/user/${entry}/profile`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`user/request-list` , {'title' : `User Dashboard` , 'entries' : data , 'view' : 'ud' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'reviewProfile' : (req , res , next) => {	let entry = req.user._id , link = `${url}/user/${entry}/profile`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`user/review-profile` , {'title' : `User Review Profile` , 'entries' : data , 'view' : 'upr' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'requestList' : (req , res , next) => {	let link = `${url}/user/list`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`user/request-list` , {'title' : `Request List` , 'entries' : data , 'view' : opt.code , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'paymentList' : (req , res , next) => {	let link = `${url}/user/list`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.sixth}/payment-list` , {'title' : `${opt.second} Entries` , 'entries' : data , 'view' : opt.code , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'deactivateProfile' : (req , res , next) => { let entry = req.user._id , link = `${url}/user/${entry}/deactivate`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.sixth}/deactivate-entry` , {'title' : `Deactivate ${opt.second} Entry` , '$entry' : data , 'view' : 'udp' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'deactivateProfileSubmit' : (req , res , next) => { let entry = req.user._id , link = `${url}/user/${entry}/deactivate`;

				axios({'method' : 'put' , 'url' : link , 'data' : req.body})

					.then((response) => { let data = response.data , link = `system/user/entries`;

							res.redirect(link);	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'reactivateProfile' : (req , res , next) => { let entry = req.user._id , link = `${url}/user/${entry}/reactivate`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.sixth}/reactivate-entry` , {'title' : `Reactivate ${opt.second} Entry` , '$entry' : data , 'view' : 'urp' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'reactivateProfileSubmit' : (req , res , next) => { let entry = req.user._id , link = `${url}/user/${entry}/reactivate`;

				axios({'method' : 'put' , 'url' : link , 'data' : req.body})

					.then((response) => { let data = response.data , link = `/system/user/entries`;

							res.redirect(link);	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'updateRequest' : (req , res , next) => { let entry = req.params.entry , link = `${url}/user/${entry}/delete`;

			axios({'method' : 'get' , 'url' : link})

				.then((response) => { let data = response.data;

						res.render(`${opt.sixth}/update-request` , {'title' : `Delete User Account` , 'view' : opt.code , 'canUpload' : false });	})

				.catch((error) => { let status = error.response;

						res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
	} ,

		'updateRequestSubmit' : (req , res , next) => { let entry = req.params.entry , link = `${url}/user/${entry}/delete`;

			axios({'method' : 'get' , 'url' : link})

				.then((response) => { let data = response.data;

						res.render(`${opt.sixth}/update-request` , {'title' : `Delete User Account` , 'view' : opt.code , 'canUpload' : false });	})

				.catch((error) => { let status = error.response;

						res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'entryAdd' : (req , res , next) => { let link = `${url}/user/add`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data , country = data.Country , level = data.Level , department = data.Department , faculty = data.Faculty , unit = data.Unit; 

						res.render(`${opt.sixth}/entry-add` , {'title' : `Create or Add ${opt.second} Entry` , 'countries' : country , 'departments' : department , 'faculties' : faculty , 

																									'levels' : level , 'units' : unit , 'view' : 'ca' , 'uaddress' : opt.first , 'canUpload' : false });	})

				.catch((error) => { let status = error.response;

						res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'entryAddSubmit' : [

			body('firstName'			,		'First Name should be provided and cannot be empty.')		.isLength({ 'min' : 2 })
																																																									.withMessage(`First Name cannot be less than 3 character in length.`)
																																												.isLength({ 'max' : 20})
																																																									.withMessage(`First Name cannot be greater than 20 characters in length.`) ,
			body('lastName'				,		'Last Name should be provided and cannot be empty.')		.isLength({ 'min' : 2 })
																																																									.withMessage(`Last Name cannot be less than 3 character in length.`)
																																												.isLength({ 'max' : 20})
																																																									.withMessage(`Last Name cannot be greater than 20 characters in length.`) ,
			body('emailAddress'		,		'Email Address should be provided and cannot be empty.').isLength({ 'min' : 7 })
																																																									.withMessage(`Email Address cannot be less than 8 character in length.`)
																																												.isLength({ 'max' : 50})
																																																									.withMessage(`Email Address cannot be greater than 20 characters in length.`) ,
			body('username'				,		'Username should be provided and cannot be empty.')			.isLength({ 'min' : 7 })
																																																									.withMessage(`Username cannot be less than 8 character in length.`)
																																												.isLength({ 'max' : 50})
																																																									.withMessage(`Username cannot be greater than 20 characters in length.`) ,
			body('country'				,		'Country should be provided and cannot be empty.')			.isLength({ 'min' : 1 })

																																												.isLength({ 'max' : 50})
																																																								.withMessage(`Country cannot be greater than 50 characters in length.`) ,
			body('level'					, 	'Level of User should be provided and cannot be empty.').isLength({ 'min' : 1 })

																																												.isLength({ 'max' : 50})
																																																								.withMessage(`Level of User cannot be greater than 150 characters in length.`) ,
			body('unit'						, 	'Unit of User should be provided and cannot be empty.')	.isLength({ 'min' : 1 })

																																												.isLength({ 'max' : 150})
																																																								.withMessage(`Unit of User cannot be greater than 50 characters in length.`) ,
			body('department'			, 	'Department should be provided and cannot be empty.')		.isLength({ 'min' : 1 })

																																												.isLength({ 'max' : 150})
																																																								.withMessage(`Department of User cannot be greater than 150 characters in length.`) ,
			body('faculty'				, 	'Faculty of User should be provided and cannot be empty.').isLength({ 'min' : 1 })

																																												.isLength({ 'max' : 150})
																																																								.withMessage(`Faculty of User cannot be greater than 150 characters in length.`) ,
				body('identificationNumber')				.isLength({ 'min' : 0 })

																						.isLength({ 'max' : 30 })
																																			.withMessage('Identification Number cannot be greater than 30 characters in length.') ,
				body('matriculationNumber')					.isLength({ 'min' : 0 })

																						.isLength({ 'max' : 30 })
																																			.withMessage('Matriculation Number cannot be greater than 30 characters in length.') ,
				body('jambRegistrationNumber')			.isLength({ 'min' : 0 })

																						.isLength({ 'max' : 30 })
																																			.withMessage('Jamb Registration Number cannot be greater than 30 characters in length.') ,
				body('about')												.isLength({ 'min' : 0 })

																						.isLength({ 'max' : 300 })
																																			.withMessage('About User cannot be greater than 300 characters in length.') ,

				body('role').custom((value , { req }) => { let role = req.body.role;

				if (opt.roles.indexOf(role) < 0) {	throw new Error('A valid role should be provided and cannot be empty.');	}

						if (value == '') throw new Error('A valid role should be provided and cannot be empty.'); 

								return true;	}) ,

				body('status').custom((value , { req }) => { let status = req.body.status;

					if (opt.statuses.indexOf(status) < 0) {	throw new Error('A valid status should be provided and cannot be empty.');	}

						if (value == '') throw new Error('A valid status should be provided and cannot be empty.'); 

								return true; }) ,

				body('*').trim() ,
				
				(req , res , next) => { let link = `${url}/user/add` , $entry = req.body;

				let errors = validationResult(req);
	
				let errorList = errors.array();

								if (errorList.length !== 0) {

				axios({'method' : 'get' , 'url' : link})

				.then((response) => { let data = response.data , country = data.Country , level = data.Level , department = data.Department , faculty = data.Faculty , unit = data.Unit;

			return res.render(`${opt.sixth}/entry-add` , {'title' : `Create or Add ${opt.second} Entry` ,  'countries' : country , 'departments' : department , 'faculties' : faculty ,

																									'levels' : level , 'units' : unit , '$entry' : $entry , 'errors' : errorList , 'view' : 'ca' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((err) => {	status = err.response;
																										res.render('error' , {'title' : 'Error' , 'error' : status})	});		}
						else {
										axios({  'method': 'post' ,
																								'url' : link ,
																																'data' : req.body })
							.then((response) => {	data = response.data;
																														req.flash('info', 'Entry successfully created.');
																																																							res.redirect(`/system/user/entries`);		})
									.catch((err) => { let	errors = [];
																												if (err.response.status == 400) { 
				return axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data , country = data.Country , level = data.Level , department = data.Department , faculty = data.Faculty , unit = data.Unit; 

																errHandler.formAdd(err , errors);

					return res.render(`${opt.sixth}/entry-add` , {'title' : `Create or Add ${opt.second} Entry` , 'countries' : country , 'departments' : department , 'faculties' : faculty , 

																												'levels' : level , 'units' : unit , '$entry' : $entry , 'errors' : errors , 'view' : 'ca' , 'uaddress' : opt.first , 'canUpload' : false });	})
				.catch((err) => {	status = err.response;
																										res.render('error' , {'title' : 'Error' , 'error' : status})	});		}
													status = err.response;
																										res.render(`error` , {'title' : 'Error' , 'error' : status 	});		});		}
		}]	, 

		'deleteAllUser' : (req , res , next) => { let entry = req.params.entry , link = `${url}/user/all/delete`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.sixth}/delete-all` , {'title' : `Delete All ${opt.second} Account` , 'view' : 'uadp' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'deleteAllUserSubmit' : (req , res , next) => { let entry = req.params.entry , link = `${url}/user/all/delete`;

				axios({'method' : 'delete' , 'url' : link , 'data' : req.body })

					.then((response) => { let data = response.data , link = `/`;

							res.redirect(link);	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,


	}

}