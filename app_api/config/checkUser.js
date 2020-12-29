var config = require('./response');

module.exports = {

	'isUser' : function(dbModel , prop , urlParam) {	dataUrl = req.params.art;

			dbModel.findOne({'slug' : dataUrl})
																				.exec((err , dataResult) => {
																																			if (err) {
																																									return config.compiledError(res , 400 , err);		}

													if (dataResult.author._id != req.user._id || req.user.role != 'administrator' || req.user.role != 'staff' || req.user.role != 'moderator' || req.user.role != 'superAdministrator') {

																																				return config.response(res , 403 , 'An Unauthorized and forbidden access.');	}
																												next();		})
	} ,

	'permit' : (...allowed) => {
																const isAllowed = (role) => {		return allowed.indexOf(role) > -1;	}

																return (req , res , next) => {
																															 if (req.user && isAllowed(req.user.role)) {	return next(); 		 }   

																														else {	return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access.`});		 }	}
							} ,

	'roleType' : (...allowed) => { const isAllowed = (role) => { return allowed.indexOf(role) > -1;	}

		return (req , res , next) => { if (req.user && isAllowed(req.user.role)) {	return next();	} 

																else {	return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});		 }	}
	} ,

	'isOk' : (req , res , next) => {
												
												return	config.response(res , 200 , {'message' : `Operation is permitted to students only.`});
	} ,

	'isOkAdmin' : (req , res , next) => {
												
												return	config.response(res , 200 , {'message' : `Operation is permitted to Administrators and Moderators only.`});
	} ,

	'isOwner' : function(Model , ModelName , urlParam) {

			return function(req , res , next) { let dataUrl = req.params['entry'];

				Model.findOne({'slug' : dataUrl})
																					.lean({})

																					.select('author department faculty unit applicationType -_id')

																					.exec((err , entryResult) => {

				if (err) {					return config.errResponse(res , 400 , err);		}

				if (!entryResult) {	return config.response(res , 404 , {'message' : `${ModelName} entry does not exists in the record or is not available.`}	);		}

					if (entryResult.author != req.user._id && (req.user.role == 'student')) {		return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (entryResult.department != req.user.department && req.user.role == 'hod') {	return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

					if (entryResult.faculty != req.user.faculty && req.user.role == 'dean') {		return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

	if (req.user.unit != null && entryResult.unit != req.user.unit && !(entryResult.applicationType)) {	return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}
																						
																																												return next();		})	}
	} ,

	'isOwner2' : function(Model , ModelName , urlParam) {

			return function(req , res , next) { let dataUrl = req.params[urlParam];

				Model.findOne({'slug' : dataUrl})
																						.lean({})

																						.exec((err , entryResult) => {
				
				if (err) {					return config.errResponse(res , 400 , err);		}

				if (!entryResult) {	return config.response(res , 404 , {'message' : `${ModelName} entry does not exists in the record or is not available.`}	);		}

				if (entryResult.author != req.user._id && (req.user.role == 'student')) {	return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}
																						
																																												return next();		})	}
	} ,

	'isOwner3' : function(Model , ModelName , urlParam) {

			return function(req , res , next) { let dataUrl = req.params[urlParam];

				Model.findOne({'slug' : dataUrl})
																						.lean({})

																						.exec((err , entryResult) => {

				if (err) {					return config.errResponse(res , 400 , err);		}

				if (!entryResult) {	return config.response(res , 404 , {'message' : `${ModelName} entry does not exists in the record or is not available.`}	);		}

				if (entryResult.author != req.user._id && (req.user.role == 'student')) {				return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (entryResult.department != req.user.department && req.user.role == 'hod') {		return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (entryResult.faculty != req.user.faculty && req.user.role == 'dean') {					return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

											if (req.user.unit != null && entryResult.unit != req.user.unit) {	return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}
																						
																																												return next();		})	}
	} ,

	'isOwner4' : function(Model , ModelName , urlParam) {

			return function(req , res , next) { let dataUrl = req.params['entry'];

				Model.findOne({'_id' : dataUrl})
																					.lean({})

																					.exec((err , entryResult) => {

				if (err) {					return config.errResponse(res , 400 , err);		}

				if (!entryResult) {	return config.response(res , 404 , {'message' : `${ModelName} entry does not exists in the record or is not available.`}	);		}

					if (entryResult.author != req.user._id && (req.user.role == 'student')) {		return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (entryResult.department != req.user.department && req.user.role == 'hod') {	return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

					if (entryResult.faculty != req.user.faculty && req.user.role == 'dean') {		return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}
																						
					return next();		})	}
	} ,

	'isOwnerOfProfile' : function(Model , ModelName , urlParam) {

			return function(req , res , next) { let dataUrl = req.params['entry'];

				Model.findOne({'_id' : dataUrl})
																					.lean({})

																					.select('_id')

																					.exec((err , entryResult) => {

				if (err) {					return config.errResponse(res , 400 , err);		}

				if (!entryResult) {	return config.response(res , 404 , {'message' : `${ModelName} entry does not exists in the record or is not available.`}	);		}
				
				if (entryResult._id != req.user._id && req.user.role != 'administrator' && req.user.role != 'staff' && req.user.role != 'moderator' && req.user.role != 'superAdministrator') {		

														return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}
																						
														return next();		})	}
	} ,

	'isOwnerOfProfile2' : function(Model , ModelName , urlParam) {

			return function(req , res , next) { let dataUrl = req.params['entry'];

				Model.findOne({'_id' : dataUrl})
																					.lean({})

																					.select('_id')

																					.exec((err , entryResult) => {

				if (err) {					return config.errResponse(res , 400 , err);		}

				if (!entryResult) {	return config.response(res , 404 , {'message' : `${ModelName} entry does not exists in the record or is not available.`}	);		}
				
				if (entryResult._id != req.user._id) {	return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}
																						
														return next();		})	}
	} ,

		'checkUserUnit' : (req , res , next) => {

			if (req.user.unit == 'Course Registration') { return next();	} 

			if (req.user.unit == 'Internet Credential') { return next();	} 

			if (req.user.unit == 'Internet Password') { return next();	} 

			if (req.user.unit == 'Email Password') { return next();	} 

			if (req.user.role == 'student' || req.user.role == 'moderator' || req.user.role == 'administrator' || req.user.role == 'superAdministrator') { return next(); }

			else {	return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

		}
}