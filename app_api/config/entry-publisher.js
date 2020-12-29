let config = require('./response') , async = require('async') , mongoose = require('mongoose') , User = mongoose.model('User');

module.exports = {

		'isOk' : (req , res , next) => {	return	config.response(res , 200 , {'message' : `Operation is permitted to students only.`});	} ,

	'entryPublisher' : (req , res , next) => {

					req.body.author = req.user._id;
																				
						return	next();		} ,

	'entryStage' : (req , res , next) => {	let stage = req.body.stage , role = req.user.role;

			if (stage != '2' && stage != '3' && stage != '4' && stage != '5' && stage != '6') {

					return config.response(res , 400 , {'message' : `You need to provide a valid stage before request can be processed.`});	}

			if (stage == '2' && (role != 'staff' && role != 'moderator' && role != 'administrator' && role != 'superAdministrator')) {

					return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (stage == '3' && (role != 'bursar' && role != 'moderator' && role != 'administrator' && role != 'superAdministrator')) {

					return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (stage == '4' && (role != 'student' && role != 'moderator' && role != 'administrator' && role != 'superAdministrator')) {

					return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (stage == '5' && (role != 'hod' && role != 'dean' && role != 'moderator' && role != 'administrator' && role != 'superAdministrator')) {

					return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (stage == '6' && (role != 'bursar' && role != 'moderator' && role != 'administrator' && role != 'superAdministrator')) {

					return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (stage == '6' && !req.body.status) {

					return config.response(res , 403 , {'message' : `You need to provide a valid status before request can be processed.`});	}

					return next();

			} ,

		'queryByRole' : (req , res , next) => {

				if (req.user.role == 'dean') { req.body.queryByRole = { 'faculty' : req.user.faculty }; }

				else if (req.user.role == 'hod') { req.body.queryByRole = { 'department' : req.user.department	};}

				else if (req.user.role == 'student') { req.body.queryByRole = { 'author' : req.user._id	}; }

				else { req.body.queryByRole = {}; }

 				return next();
		} ,

		'queryByUnit' : (req , res , next) => {

			if (req.user.unit == 'Course Registration') { req.body.queryByUnit = { 'unit' : 'Course Registration'};	} 

			else if (req.user.role == 'moderator' || req.user.role == 'administrator' || req.user.role == 'superAdministrator') { req.body.queryByUnit = {};	}
			
			else if (req.user.role == 'student') { req.body.queryByUnit = { 'author' : req.user._id	}; }

			return next();

		} ,

		'queryByType' : (queryType) => {

				return (req , res , next) => {

			if ((req.user.role == 'moderator' || req.user.role == 'administrator' || req.user.role == 'superAdministrator') && queryType == 'Department') { 

				req.body.queryByType = {'paymentType' : 'Department' };	}

			else if ((req.user.role == 'moderator' || req.user.role == 'administrator' || req.user.role == 'superAdministrator') && queryType == 'Faculty') { 

				req.body.queryByType = {'paymentType' : 'Faculty' };	}
			
			else if (req.user.role == 'student' && queryType == 'Department') {

			 req.body.queryByType = { 'author' : req.user._id , 'paymentType' : 'Department' }; }

			else if (req.user.role == 'student' && queryType == 'Faculty') {

			 req.body.queryByType = { 'author' : req.user._id , 'paymentType' : 'Faculty'	};	}

			return next();

		} } ,

		'queryPaymentByUnit' : (queryType) => {

				return (req , res , next) => {

			if (req.user.role == 'hod' && queryType == 'Department') { 

				req.body.queryByType = {'paymentType' : 'Department' , 'department' : req.user.department };	}

			if (req.user.role == 'dean' && queryType == 'Department') { 

				req.body.queryByType = {'paymentType' : 'Department' };	}

			if (req.user.role == 'hod' && queryType == 'Faculty') { 

				req.body.queryByType = {'paymentType' : 'Faculty' , 'department' : req.user.department };	}

			if (req.user.role == 'dean' && queryType == 'Faculty') { 

				req.body.queryByType = {'paymentType' : 'Faculty' };	}

			return next();

		} },

		'setEntryType' : (req , res , next) => {

				if (req.body.unit == 'Internet Credential') {		req.body.requestType = 'CSIF';	}

				else if (req.body.unit == 'Internet Password') { req.body.requestType = 'CSIP'; }

				else if (req.body.unit == 'Course Registration') {	req.body.requestType = 'CR';	}

				else if (req.body.unit == 'Academic Session Result') { req.body.requestType = 'ASR'; }

				else if (req.body.unit == 'School Email') { req.body.requestType = 'REPSP'; } 

				else if (req.body.unit == 'Science and Technology Education') { req.body.requestType = 'STE'; } 

				return next();
		} ,

		'setDepartment' : (req , res , next) => {

				req.body.department = req.user.department;

				return next();
		} ,

		'setFaculty' : (req , res , next) => {

				req.body.faculty = req.user.faculty;

				return next();
		} ,

		'removeFields' : (...fields) => {

			return (req , res , next) => {

					for (var field of fields) {

							if (req['body'][field]) {

									delete req['body'][field];	}		}	

							return next(); } } ,

		'removeEmptyFilters' : (req , res , next) => {

			for (let searchEntry in req.body) {

				if (!req.body[searchEntry]) {

					delete req.body[searchEntry];	}	}

				return next();	
		} ,

		'setAccountRole' : (req , res , next) => {

				req.body.role = 'student';

				return next();				
		} ,

		'checkAllFields' : (req , res , next) => {

		if (!req.body.emailAddress || !req.body.password || !req.body.username) {	return config.response(res , 400 , {'message' : 'All fields are required.'});		}

				return next();
		} ,

		'checkUsernameandEmail' : (req , res , next) => {

									async.parallel({
																		'emailUser' : (callback) => {
																																				User.findOne({'emailAddress' : req.body.emailAddress} , {'emailAddress' : 1})
																																																																												.exec(callback);		} ,

																		'usernameUser' : (callback) => {
																																				User.findOne({'username' : req.body.username} , {'username' : 1})
																																																																					.exec(callback);	}
					} , (err , result) => {	
																			if (err) {			return config.errResponse(res , 400 , err);		}
													
													if (result.emailUser) {			return config.response(res , 409 , {'message' : 'E-mail Address already exist in the record.'});		}
											
												if (result.usernameUser) {		return config.response(res , 409 , {'message' : 'Username already exist in the record.'});	}

												if (!result.emailUser && !result.usernameUser) {	return next();	}

														});
		}

}