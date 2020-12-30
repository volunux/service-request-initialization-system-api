
const generalRouter = require('./general');

const userRouter = require('./user');

const systemRouter = require('./admin');

const s3 = require('./s3');

const axios = require('axios');

const vAuth = require('../../app_api/config/verifyAuthentication');

const kEncryptor = require('../../app_api/config/kEncryptor');

module.exports = (app) => {

	app.use('/'	, 						vAuth.fAuth		,				vAuth.authCook , vAuth.confirmUserStatus);

	app.use('/' , (req , res ,  next) => {
																					if (req.cookies.sid && req.cookies.s_id) { let finalCookies = req.cookies.sid;

																							axios.defaults.headers.common = {

																							'Authorization' : `Bearer ${finalCookies}` 	}

																							axios.defaults.withCredentials = true;
																									  																	return next();	}

																					if (!(req.cookies.sid && req.cookies.s_id)) {

																							axios.defaults.headers.common = { 

																							'Authorization' : 0	}

																							axios.defaults.withCredentials = true;
																									  																	return next();	}			
	});


	app.use('/user' 												,			userRouter);

	app.use('/s3'											 			,			s3);

	app.use('/system/admin' 									, 		systemRouter);



}