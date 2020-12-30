const axios = require('axios');

const { body , check , validationResult } = require('express-validator');

const multer = require('multer') , pConfig = require('../config/admin');

const upload = multer({'storage' : pConfig.mConfig });

const errHandler = require('./helpers/compiledError');

const $Model = require('../../app_api/models/models').User;

module.exports = function(opt) {

	const url = require('../config/url')[opt.fourth];

	return {

		'index' : (req , res , next) => {

				res.redirect('/user/dashboard');

		} ,

		'dashboard' : (req , res , next) => {	let entry = req.user._id , link = `${url}/entry/detail`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.first}/dashboard` , {'title' : `${opt.second} Dashboard` , 'entries' : data , 'view' : 'ud' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'entryView' : (req , res , next) => { let entry = req.user._id , link = `${url}/entry/detail`;

			axios({'method' : 'get' , 'url' : link})

				.then((response) => { let data = response.data;

						res.render(`admin/profile-view` , {'title' : `${opt.second} Profile Details` , 'entry' : data , 'view' : 'upv' , 'uaddress' : opt.first , 'canUpload' : false });	})

				.catch((error) => { let status = error.response;

						res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'reviewProfile' : (req , res , next) => {	let entry = req.user._id , link = `${url}/entry/detail`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.first}/review-profile` , {'title' : `${opt.second} Review Profile` , 'entries' : data , 'view' : 'upr' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'updatePassword' : (req , res , next) => { let entry = req.user._id , link = `${url}/entry/change-password`;

			axios({'method' : 'get' , 'url' : link})

				.then((response) => { let data = response.data;

						res.render(`${opt.first}/update-password` , {'title' : `Change and Update User Password` , 'view' : 'up' , 'uaddress' : opt.first , 'canUpload' : false });	})

				.catch((error) => { let status = error.response;

						res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'updatePasswordSubmit' : [

			body('password'					,		'Password should be provided and cannot be empty.')				.isLength({ 'min' : 7 })
																																																											.withMessage(`Password cannot be less than 8 character in length.`)
																																														.isLength({ 'max' : 20})
																																																											.withMessage(`Password cannot be greater than 20 characters in length.`) ,
			body('newPassword'			,		'New Password should be provided and cannot be empty.')		.isLength({ 'min' : 7 })
																																																											.withMessage(`New Password cannot be less than 8 character in length.`)
																																														.isLength({ 'max' : 20})
																																																											.withMessage(`New Password cannot be greater than 20 characters in length.`) ,
			body('confirmPassword').custom((value , { req }) => { let newPassword = req.body.newPassword;

					if (newPassword) {

					if (value != newPassword) {	throw new Error('New Password must and should match Confirmation Password.');	}		}

						if (value && value.length > 20) {	throw new Error('New Password Confirmation cannot be greater than 20 characters in length.');	}

					if (value == '') throw new Error('New Password Confirmation should be provided and cannot be empty.'); 

							return true;
			}) ,
			
			body('*').trim() ,
			
			(req , res , next) => { let entry = req.user._id , link = `${url}/entry/change-password`;

			let errors = validationResult(req);

			let errorList = errors.array();

							if (errorList.length !== 0) {

				axios({'method' : 'get' , 'url' : link})

				.then((response) => {	let data = response.data , user = data.User;

						res.render(`${opt.first}/update-password` , {'title' : `Change and Update ${opt.second} Password` , '$entry' : user , 'errors' : errorList ,

																													 'uaddress' : opt.first , 'view' : 'up' , 'canUpload' : false });	})

						.catch((err) => {	status = err.response;
																												res.render('error' , {'title' : 'Error' , 'error' : status})	});		}
				else {
								axios({  'method': 'put' ,
																						'url' : `${link}` ,
																																'data' : req.body })
						.then((response) => {	data = response.data;
																													req.flash('info', 'Entry successfully updated.');
																																																							res.redirect(`/user/profile-view`);		})
								.catch((err) => { let	errors = [];
																													if (err.response.status == 400) { 
					return axios({'method' : 'get' , 'url' : link})

						.then((response) => {	let data = response.data 

																	errHandler.formAdd2(err , errors);

						return res.render(`${opt.first}/update-password` , {'title' : `Change and Update ${opt.second} Password` , 'errors' : errors ,

																																'view' : 'up' , 'uaddress' : opt.first , 'canUpload' : false });	})
									.catch((err) => {	status = err.response;
																															res.render('error' , {'title' : 'Error' , 'error' : status})	});			}
																		status = err.response;
																															res.render(`error` , {'title' : 'Error' , 'error' : status 	});		});		}
		 }]	, 

		'changeSignatureAndPicture' : (req , res , next) => { let entry = req.user._id , link = `${url}/entry/change-signature-picture`;

			axios({'method' : 'get' , 'url' : link})

				.then((response) => { let data = response.data;

						res.render(`${opt.first}/change-signature-picture` , {'title' : `Change ${opt.second} Signature and Profile` , 'view' : 'cppas' , 'uaddress' : opt.first , 'canUpload' : true });	})

				.catch((error) => { let status = error.response;

						res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'changeSignatureAndPictureSubmit' : [

			upload.fields([{'name' : 'profilePhoto' , 'maxCount' : 1} , {'name' : 'signature' , 'maxCount' : 1}]) ,

			pConfig.checkFileUpload , pConfig.validate , pConfig.deleteAfterType , pConfig.checkFileSize , pConfig.deleteAfterSize , pConfig.addFileUpload ,

			(req , res , next) => {	let entry = req.user._id , link = `${url}/entry/change-signature-picture`;

					let errors = validationResult(req);

					let errorList = errors.array();

					pConfig.addUploadErrors(req , res , next , errorList);

					pConfig.confirmPhotoAndSignature(req , res , next);

					if (errorList.length != 0) { let $entry = req.body;

															if (req.files && req.body.profilePhoto && req.body.signature) { pConfig.delete(req , errorList); 	}

							return res.render(`${opt.first}/change-signature-picture` , {'title' : `Change ${opt.second} Signature and Profile` , '$entry' : $entry , 'errors' : errorList , 

																																						'view' : 'cppas' , 'uaddress' : opt.first , 'canUpload' : true });	}	
			else {
							axios({'method' : 'put' , 'url' : link , 'data' : req.body})

								.then((response) => { let data = response.data , link = `/user/dashboard`;

										res.redirect(link);	})

								.catch((error) => { let status = error.response;

										res.render('error' , {'title' : 'Error' , 'error' : status });	});	}
			}] ,

		'requestMenu' : (req , res , next) => {	let entry = req.user._id , link = `${url}/entry/detail`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.first}/manage-request` , {'title' : `${opt.second} Dashboard` , 'entries' : data , 'view' : 'ud' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'createRequest' : (req , res , next) => {	let entry = req.user._id , link = `${url}/entry/detail`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.first}/create-request` , {'title' : `${opt.second} Dashboard` , 'entries' : data , 'view' : 'ud' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'paymentMenu' : (req , res , next) => {	let entry = req.user._id , link = `${url}/entry/detail`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.first}/manage-payment` , {'title' : `${opt.second} Dashboard` , 'entries' : data , 'view' : 'ud' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'createPayment' : (req , res , next) => {	let entry = req.user._id , link = `${url}/entry/detail`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.first}/create-payment` , {'title' : `${opt.second} Dashboard` , 'entries' : data , 'view' : 'ud' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'requestList' : (req , res , next) => {	let link = `${url}/user/list`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.first}/request-list` , {'title' : `Request List` , 'entries' : data , 'view' : opt.code , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'paymentList' : (req , res , next) => {	let link = `${url}/user/list`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`admin/payment-list` , {'title' : `${opt.second} Entries` , 'entries' : data , 'view' : opt.code , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : `${opt.second} entries not available.` , 'error' : status 	});		});
		} ,

		'deactivateProfile' : (req , res , next) => { let entry = req.user._id , link = `${url}/entry/deactivate`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.first}/deactivate-profile` , {'title' : `Deactivate User Profile` , '$entry' : data , 'view' : 'udp' , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'deactivateProfileSubmit' : (req , res , next) => { let entry = req.user._id , link = `${url}/entry/deactivate`;

				axios({'method' : 'delete' , 'url' : link , 'data' : req.body})

					.then((response) => { let data = response.data , link = `/user/profile-view`;

							res.redirect(link);	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'reactivateProfile' : (req , res , next) => { let entry = req.user._id , link = `${url}/entry/reactivate`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data;

							res.render(`${opt.first}/reactivate-profile` , {'title' : `Reactivate ${opt.second} Profile` , '$entry' : data , 'view' : 'urp' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'reactivateProfileSubmit' : (req , res , next) => { let entry = req.user._id , link = `${url}/entry/reactivate`;

				axios({'method' : 'delete' , 'url' : link , 'data' : req.body})

					.then((response) => { let data = response.data , link = `/user/profile-view`;

							res.redirect(link);	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'updateProfile' : (req , res , next) => { let entry = req.user._id , link = `${url}/entry/update`;

				axios({'method' : 'get' , 'url' : link})

					.then((response) => { let data = response.data , level = data.Level , country = data.Country , user = data.User;

						res.render(`${opt.first}/update-profile` , {'title' : `Update ${opt.second} Profile` , '$entry' : user , 'countries' : country , 'levels' : level ,

																								'view' : 'up' , 'uaddress' : opt.first , 'canUpload' : false });	})

					.catch((error) => { let status = error.response;

							res.render('error' , {'title' : 'Error' , 'error' : status 	});	});
		} ,

		'updateProfileSubmit' : [

			body('firstName'						,		'First Name should be provided and cannot be empty.')					.isLength({ 'min' : 2 })
																																																															.withMessage(`First Name cannot be less than 3 character in length.`)
																																																		.isLength({ 'max' : 20})
																																																															.withMessage(`First Name cannot be greater than 20 characters in length.`) ,
			body('lastName'							,		'Last Name should be provided and cannot be empty.')					.isLength({ 'min' : 2 })
																																																															.withMessage(`Last Name cannot be less than 3 character in length.`)
																																																		.isLength({ 'max' : 20})
																																																															.withMessage(`Last Name cannot be greater than 20 characters in length.`) ,
			body('emailAddress'					,		'Email Address should be provided and cannot be empty.')			.isLength({ 'min' : 7 })
																																																															.withMessage(`Last Name cannot be less than 8 character in length.`)
																																																		.isLength({ 'max' : 50})
																																																															.withMessage(`Last Name cannot be greater than 20 characters in length.`) ,
			body('country'							,		'Country should be provided and cannot be empty.')						.isLength({ 'min' : 1 })

																																																		.isLength({ 'max' : 50})
																																																														.withMessage(`Country cannot be greater than 50 characters in length.`) ,
			body('level'								, 	'Level of User should be provided and cannot be empty.')			.isLength({ 'min' : 1 })

																																																		.isLength({ 'max' : 50})
																																																														.withMessage(`Level of User cannot be greater than 150 characters in length.`) ,
			body('about')																	.isLength({ 'min' : 0 })

																										.isLength({ 'max' : 300})
																																						.withMessage(`About User cannot be greater than 300 characters in length.`) ,
			body('jambRegistrationNumber')								.isLength({ 'min' : 0 })

																										.isLength({ 'max' : 30 })
																																						.withMessage('Jamb Registration Number cannot be greater than 30 characters in length.') ,
			body('*').trim() ,
				
			(req , res , next) => { let entry = req.user._id , link = `${url}/entry/update`;

			$entry =  new $Model(req.body);

			let errors = validationResult(req);

			let errorList = errors.array();

							if (errorList.length !== 0) {

				axios({'method' : 'get' , 'url' : link})

				.then((response) => {	let data = response.data , country = data.Country , level = data.Level , user = data.User;

						res.render(`${opt.first}/update-profile` , {'title' : `Update User Profile` , 'countries' : country , 'levels' : level , '$entry' : user , 

																								'errors' : errorList , 'view' : 'up' , 'uaddress' : opt.first , 'canUpload' : false });	})

						.catch((err) => {	status = err.response;
																											res.render('error' , {'title' : 'Error' , 'error' : status})	});		}
				else {
								axios({  'method': 'put' ,
																						'url' : link ,
																																'data' : req.body })
						.then((response) => {	data = response.data;
																													req.flash('info', 'Entry successfully updated.');
																																																							res.redirect(`/user/profile-view`);		})
								.catch((err) => { let	errors = [];
																												if (err.response.status == 400) {
			return axios({'method' : 'get' , 'url' : link})

				.then((response) => {	let data = response.data , country = data.Country , level = data.Level , user = data.User;

															errHandler.formAdd(err , errors);

			return res.render(`${opt.first}/update-profile` , {'title' : `Update User Profile` , 'countries' : country , 'levels' : level , '$entry' : user ,

																									'errors' : errors , 'view' : 'up' , 'uaddress' : opt.first , 'canUpload' : false });	})

									.catch((err) => {	status = err.response;
																															res.render('error' , {'title' : 'Error' , 'error' : status})	});		}
																		status = err.response;
																															res.render(`error` , {'title' : 'Error' , 'error' : status 	});		});		}
		 }]	, 

		'forgotPassword' : (req , res , next) => {
																								res.render('user/forgot-password', { 'title' : 'Forgot your Password?' , 'view' : 'pr' , 'canUpload' : false });
		} ,

		'forgotPasswordSubmit' : [

			body('emailAddress')

				.custom((value , {req}) => { let emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

				if (!value) { throw new Error('A valid email address is required and should be provided.');	}

				if (value.length < 8) { throw new Error('Email Address cannot be less than 8 characters in length.'); }

				if (value.length > 50) { throw new Error('Email Address cannot be greater than 50 characters in length.'); }

				if (!emailRegex.test(value)) { throw new Error('A valid email address is required and should be provided.'); }

				if (value) { let parts = value.split('@');

					if (parts[0].length > 32) { throw new Error('A valid email address is required and should be provided.');	}	

					let domainParts = parts[1].split('.');

					if (domainParts.some((part) => { return part.length > 32 })) { throw new Error('A valid email address is required and should be provided.'); }	}

						return true; }) ,

			body('*').trim() ,
			
			(req , res , next) => { let entry = req.user._id , link = `${url}/forgot-password`;

			let errors = validationResult(req);

			let errorList = errors.array();

							if (errorList.length !== 0) {

				axios({'method' : 'get' , 'url' : link})

				.then((response) => {	let data = response.data , user = data.User;

						res.render(`${opt.first}/forgot-password` , {'title' : `Forgot your Password?` , '$entry' : user , 'errors' : errorList , 'view' : 'pr' , 'canUpload' : false });	})

						.catch((err) => {	status = err.response;
																											res.render('error' , {'title' : 'Error' , 'error' : status})	});		}
				else {
								axios({  'method': 'put' ,
																						'url' : `${link}` ,
																																'data' : req.body })
						.then((response) => {	data = response.data;
																													res.redirect(`/`);		})
							.catch((err) => { status = err.response;
																												res.render(`error` , {'title' : 'Error' , 'error' : status 	});		});			}
		 }]	, 

	'resetPassword' : (req, res, next) => { let token = req.params.token;

		 User.findOne({ 'resetPasswordToken' : token , resetPasswordExpires : { $gt : Date.now() } } , (err , user) => {
		
					if (!user) {	req.flash('error', 'Password reset token is invalid or has expired.');
				
												return res.redirect('/test/forgot');	}
				
				res.render('admin/change-password' , { 'title' : 'Choose New Password' , 'canUpload' : false } );		});
	} ,

'resetPasswordSubmit' : (req , res , next) => {

	async.waterfall([
			
			(done) => {

			User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {

				if (!user) {
					
					req.flash('error', 'Password reset token is invalid or has expired.');

					return res.redirect('back');	}

				user.password = req.body.password;

				user.resetPasswordToken = undefined;
				
				user.resetPasswordExpires = undefined;

				user.save(function(err) {
				
					req.logIn(user, function(err) {
				
						done(err, user);
				
					});
				
				});
			
			});
		
		},
		
		(user, done) => {

			return mailer.successfulReset(req , res , next , user , done);

		}
	] , function(err) {
		
		res.redirect('/');
	});

	} ,

	}

}