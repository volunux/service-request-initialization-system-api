const { body , validationResult , sanitizeBody } = require('express-validator');

var User = require('../../../app_api/models/models').User , kEncryptor = require('../../../app_api/config/kEncryptor') ,

axios = require('axios') , errors = '',  country = '' , clientErr = require('../helpers/compiledError');

module.exports = function(opt) {

	const url = require('../../config/url')[opt.fourth];

		return {

		'register' : (req , res , next) => { let link = `${url}/signup`;

				if (req.cookies.sid && req.cookies.s_id) { return res.redirect('/');	}

				axios({ 'method': 'get' , 'url' : link })

				.then((response) => { let data = response.data , department = data.Department , faculty = data.Faculty , level = data.Level , country = data.Country

						res.render('index/register' , {'title' : 'Sign up for an Account' , 'departments' : department , 'faculties' : faculty , 'levels' : level , 'countries' : country })		})

					.catch((err) => {		status = err.response;
																											res.render('error' , {'title' : 'Error' , 'error' : status 	});		});
		} ,

	'registerSubmit' : [ 

			body('firstName'		,		'First Name should be provided and cannot be empty.')		.isLength({ 'min' : 3 })
																																																							.withMessage('First Name cannot be less than 4 characters in length.')
																																											.isLength({ 'max' : 20})
																																																							.withMessage('First Name cannot be greater than 20 characters in length.') ,
			body('lastName'			,		'Last Name should be provided and cannot be empty.')		.isLength({ 'min' : 3 })
																																																							.withMessage('Last Name cannot be less than 4 characters in length.')
																																											.isLength({ 'max' : 20})
																																																							.withMessage('Last Name cannot be greater than 20 characters in length.') ,
			body('username'			,		'Username should be provided and cannot be empty.')			.isLength({ 'min' : 3 })
																																																							.withMessage('Username cannot be less than 4 characters in length.')
																																											.isLength({ 'max' : 20 })
																																																							.withMessage('Username cannot be greater than 20 characters in length.') ,
			body('emailAddress'	, 	'Email Address should be provided and cannot be empty')	.isLength({ 'min' : 7 })
																																																							.withMessage('Email Address cannot be less than 8 characters in length.')
																																											.isLength({ 'max' : 30})
																																																							.withMessage('Email Address cannot be greater than 30 characters in length.')
																																											.isEmail()
																																																							.withMessage('Email Address should be in valid format.')
																																											.normalizeEmail().escape() ,

			body('password'			,		'Password should be provided and cannot be empty.')			.isLength({ 'min' : 7 })
																																																							.withMessage('Password cannot be less than 8 characters in length.')
																																											.isLength({ 'max' : 35})
																																																							.withMessage('Password cannot be greater than 35 characters in length.') ,
			body('country'			,		'Country should be provided and cannot be empty.')			.isLength({ 'min' : 1 })

																																											.isLength({ 'max' : 50})
																																																							.withMessage(`Country cannot be greater than 50 characters in length.`) ,
			body('department'		,		'Department should be provided and cannot be empty.')		.isLength({ 'min' : 1 })

																																											.isLength({ 'max' : 150})
																																																								.withMessage(`Department cannot be greater than 150 characters in length.`) ,
			body('faculty'			,		'Faculty should be provided and cannot be empty.')			.isLength({ 'min' : 1 })

																																											.isLength({ 'max' : 150})
																																																								.withMessage(`Faculty cannot be greater than 150 characters in length.`) ,
			body('level'				, 	'Level should be provided and cannot be empty.')				.isLength({ 'min' : 1 })

																																											.isLength({ 'max' : 50})
																																																								.withMessage(`Level cannot be greater than 50 characters in length.`) ,
			body('about'				, 	'About User should be provided and cannot be empty.')		.isLength({ 'min' : 9 })
																																																								.withMessage('About User cannot be less than 10 characters in length.')
																																											.isLength({ 'max' : 300 }) 
																																																								.withMessage('About User cannot be greater than 300 characters in length.') ,
			sanitizeBody('*').trim() ,

				(req , res , next) => {	let $entry = new User(req.body);

				let errors = validationResult(req);

				let errorList = errors.array();

				console.log(errorList);

				if (errorList.length != 0) { let link = `${url}/signup`;

					axios({ 'method': 'get' , 'url' : link })

					.then((response) => { let	data = response.data , department = data.Department , faculty = data.Faculty , level = data.Level , country = data.Country

							res.render('index/register' , { 'title': 'Sign up for an account' , 'departments' : department , 'faculties' : faculty , 'levels' : level , 

																							'countries' : country , '$entry' : $entry , 'errors' : errorList });		})		}
					else { let link = `${url}/signup`;

									axios({ 'method': 'post' ,
																					  	'url' : link ,
														  															 	'data' : req.body 	})
						.then((response) => {	data = response.data;
																												kEncryptor.setCookie(res , data);
																																													
																												req.flash('info', 'You have successfully signed up and welcome.');
																												
																												res.redirect('/');	})
						.catch((err) => { let  errors = [];
																								if (err.response.status == 400 || err.response.statusText == 'Bad Request') { let link = `${url}/signup`;
																									
				return axios({ 'method': 'get' , 'url' : link })

					.then((response) => { let data = response.data , department = data.Department , faculty = data.Faculty , level = data.Level , country = data.Country;

																										clientErr.formAdd(err , errors);

							res.render('index/register' , {'title' : 'Sign up for an Account' , 'departments' : department , 'faculties' : faculty , 'levels' : level , 

																							'countries' : country , 'errors' : errors });		})

					.catch((err) => {	let status = err.response;
																												res.render('error' , {'title' : 'Error' , 'error' : status 	});		});		}		
																						
																							if (err.response.status == 409) { let link = `${url}/signup`;

			return axios({ 'method': 'get' , 'url' : link })

				.then((response) => { let data = response.data , department = data.Department , faculty = data.Faculty , level = data.Level , country = data.Country; errors.push(err.response.data);

					 res.render('index/register' , {'title' : 'Sign up for an Account' , 'departments' : department , 'faculties' : faculty , 'levels' : level , 

																					'countries' : country , 'errors' : errors })		})

				.catch((err) => {	let status = err.response;
																											res.render('error' , {'title' : 'Error' , 'error' : status 	});		});		}
									let status = err.response;
																							res.render('error' , {'title' : 'Error' , 'error' : status 		});		});		}
		}] , 

		'login' : (req , res , next) => {

				if (req.cookies.sid && req.cookies.s_id) {	return res.redirect('/');		}

					res.render('index/login' , { 'title': 'Sign in to your account' , 'rmethod' : 'POST' });
		} ,

		'loginSubmit' : [

				body('emailAddress'			, 	'Email Address should be provided and cannot be empty')				.isLength({ 'min' : 7 })
																																																													.withMessage('Email Address cannot be less than 8 characters in length.')
																																																	.isLength({ 'max' : 50})
																																																													.withMessage('Email Address cannot be greater than 50 characters in length.')
																																																	.isEmail()
																																																													.withMessage('Email Address should be in valid format.')
																																																			
																																																	.trim().normalizeEmail().escape() ,

				body('password'					,		'Password should be provided and cannot be empty.')						.isLength({ 'min' : 7 })
																																																													.withMessage('Password cannot be less than 8 characters in length.')
																																																	.isLength({ 'max' : 50})
																																																													.withMessage('Password cannot be greater than 35 characters in length.') ,
				sanitizeBody('*').trim() ,

				(req , res , next) => {	let $entry = new User(req.body) , link = url;

				let errors = validationResult(req);

				let errorList = errors.array();

					if (errorList.length != 0) {
																				res.render('index/login' , { 'title': 'Sign in to your account' , 'errors' : errorList , '$entry' : $entry , 'rmethod' : 'POST' });		}
  					else {
										axios({  	'method': 'post' ,
																								  'url' : `${link}/signin` ,
												  															 											'data' : req.body 	})
						.then((response) => {	data = response.data;
																												kEncryptor.setCookie(res , data);
																											
																												req.flash('info', 'You have successfully signed in.');

																												res.redirect('/user/dashboard')		})

						.catch((err) => {		status = err.response , errors = [];

							if (err.response.status == 400 || err.response.statusText == 'Bad Request') {	errors = errors.push(status.data);

																		return res.render('index/login' , { 'title': 'Sign in to your account' , 'errors' : errors });		}
								
							if (status.status == 401) {	errors.push(status.data);
																																			
																		return res.render('index/login' , {'title' : 'Sign in to your account' , 'errors' : errors })		}

								if (status.status == 403) {	errors = errors.push(status.data)
																																			
															return res.render('error' , {'title' : 'Error' , 'errors' : errors 	})		}

																			res.render('error' , {'title' : 'Error' , 'error' : status 		}); });			}
	}] ,

	'logout' : (req , res , next) => {

			if (req.cookies.sid && req.cookies.s_id) {
					
					res.clearCookie('sid');
					
					res.clearCookie('s_id');	}
										    
					req.flash('info', 'You have successfully signed out.');

					res.redirect('/');
	} 

}

}