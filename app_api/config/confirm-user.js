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

		'roleType' : (allowed) => { const isAllowed = (role) => { return allowed.indexOf(role) > -1;	}

			return (req , res , next) => { if (req.user && isAllowed(req.user.role)) {	return next();	} 

																	else {	return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});		}	}
		} ,

		'isUserPending' : (req , res , next) => {

			if (req.user && req.user.status && ['banned' , 'inactive' , 'pending'].indexOf(req.user.role) > 0	) {

					return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}); }

				return next();
		} ,

		'isOk' : (req , res , next) => {	return	config.response(res , 200 , {'message' : `Operation is permitted to students only.`});

		} ,

		'isOkAdmin' : (req , res , next) => {
													
													return config.response(res , 200 , {'message' : `Operation is permitted to Administrators , Moderators , and other higher privileges only.`});
		} ,

		'confirmAdmin' : (allowed) => { const isAllowed = (role) => { return allowed.indexOf(role) > -1;	}

			return (req , res , next) => { if (req.user && isAllowed(req.user.role)) {	return config.response(res , 200 , {'message' : `Operation is permitted to Administrators and Moderators only.`});	} 

																	else {	return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});		}	}
		} ,

		'isOwner' : (Model , ModelName , urlParam , unit) => { return (req , res , next) => { let entry = req.params['entry'];

				Model.findOne({'slug' : entry})
																				.lean({})

																				.select('requestType author department faculty unit -_id')

																				.exec((err , entryResult) => {

				if (req.user.unit != unit && req.user.role != 'student') {

						return config.response(res , 404, {'message' : `${ModelName} entry does not exists in the record or is not available.`}	);	}

				if (err) {

						return config.errResponse(res , 400 , err);	}

				if (!entryResult) {

						return config.response(res , 404 , {'message' : `${ModelName} entry does not exists in the record or is not available.`}	);	}

				if (entryResult.author != req.user._id && req.user.role == 'student') {

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.department != req.user.department && req.user.role == 'hod') {

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.faculty != req.user.faculty && req.user.role == 'dean') {

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.unit != req.user.unit && req.user.unit != null) {

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}
																							
						return next();	});	}
		} ,

		'isOwnerRf' : (Model , ModelName , urlParam , unit) => { return (req , res , next) => { let entry = req.params['entry'];

				Model.findOne({'slug' : entry})
																				.lean({})

																				.select('requestType author department faculty unit -_id')

																				.exec((err , entryResult) => {
				if (err) {

						return config.errResponse(res , 400 , err);	}

				if (!entryResult) {

						return config.response(res , 404 , {'message' : `${ModelName} entry does not exists in the record or is not available.`}	);	}

				if (entryResult.author != req.user._id && req.user.role == 'student') {

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.department != req.user.department && req.user.role == 'hod') {

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.faculty != req.user.faculty && req.user.role == 'dean') {

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}
																							
						return next();	});	}
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

	'isOwner4' : (Model , ModelName , normalPrivilege , leastPrivilege) => { return (req , res , next) => { let entry = req.params['entry'];

				Model.findOne({'_id' : entry})
																			.lean({})

																			.select('author department faculty')

																			.exec((err , entryResult) => {

								if (err) {	return config.errResponse(res , 400 , err);	}

				if (!entryResult) {	return config.response(res , 404 , {'message' : `${ModelName} entry does not exists in the record or is not available.`}	);	}

			if (entryResult.author != req.user._id && (req.user.role == normalPrivilege.indexOf(req.user.role) > -1)) {

				return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (entryResult.department != req.user.department && leastPrivilege.indexOf(req.user.role) == 1) {

				return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (entryResult.faculty != req.user.faculty && leastPrivilege.indexOf(req.user.role) > 1) {	

				return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}
																						
						return next();	})	}
	} ,

		'isOwner5' : (Model , ModelName , urlParam , normalPrivilege) => { return (req , res , next) => { let entry = req.params['entry'];

			Model.findOne({'_id' : entry})
																		.lean({})

																		.select('paymentType refunded')

																		.exec((err , entryResult) => {

			if (err) {					return config.errResponse(res , 400 , err);	}

			if (!entryResult) {	return config.response(res , 404 , {'message' : `${ModelName} entry does not exists in the record or is not available.`}	);	}

			if (entryResult.paymentType == 'department' && req.user.role != 'departmentPresident') { return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (entryResult.paymentType == 'faculty' && req.user.role != 'facultyPresident') { return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

			if (entryResult.refunded) {	return response.response(res , 200 , {'message' : `${ModelName} entry cannot be refunded more than once.` });	}	

				return next();	});	}
		} ,

	'isOwnerOfProfile' : (Model , ModelName , urlParam) => { return (req , res , next) => { let dataUrl = req.params['entry'];

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

		'userUnit' : (units , roles , isNotSpecial , leastPrivilege) => { return (req , res , next) => {

			if (units.indexOf(req.user.unit) < 0 && leastPrivilege.indexOf(req.user.role) > -1 && isNotSpecial) { return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	} 

			if (roles.indexOf(req.user.role) < 0) { return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});		} 

			else { return next(); }

		} 	} ,	

		'$isOwner' : (req , res , next , entryResult , entryType , toHappen , normalPrivilege , superPrivilege , callback , leastPrivilege) => {

			let author = typeof entryResult.author == 'string' ? entryResult.author : entryResult.author instanceof Object && entryResult.author._id ? entryResult.author._id : "5fb2d2f175f95a570adfa1d6";

				if (req.user.unit != entryResult.unit && normalPrivilege.indexOf(req.user.role) < 0 && superPrivilege.indexOf(req.user.role) < 0) { if (toHappen) toHappen.run = false;

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}	);	}

				if (author != req.user._id && normalPrivilege.indexOf(req.user.role) > -1) { if (toHappen) toHappen.run = false;

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.department != req.user.department && (leastPrivilege.indexOf(req.user.role) + 1) == 1) { if (toHappen) toHappen.run = false;

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.faculty != req.user.faculty &&  (leastPrivilege.indexOf(req.user.role) + 1) == 2) { if (toHappen) toHappen.run = false;

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.unit != req.user.unit && req.user.unit != null && superPrivilege.indexOf(req.user.role) < 0) { if (toHappen) toHappen.run = false;

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (callback && !toHappen) { return callback(req , res , next , entryResult); }
		} ,

		'$isOwnerUpdate' : (req , res , next , entryResult , entryType , toHappen , normalPrivilege , superPrivilege , callback , leastPrivilege) => {

			let author = typeof entryResult.author == 'string' ? entryResult.author : entryResult.author instanceof Object && entryResult.author._id ? entryResult.author._id : "5fb2d2f175f95a570adfa1d6";

				if (req.user.unit != entryResult.unit && normalPrivilege.indexOf(req.user.role) < 0 && superPrivilege.indexOf(req.user.role) < 0) { if (toHappen) toHappen.run = false;

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`}	);	}

				if (author != req.user._id && normalPrivilege.indexOf(req.user.role) > -1) { if (toHappen) toHappen.run = false;

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.department != req.user.department && (leastPrivilege.indexOf(req.user.role) + 1) == 1) { if (toHappen) toHappen.run = false;

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.faculty != req.user.faculty && (leastPrivilege.indexOf(req.user.role) + 1) == 2) { if (toHappen) toHappen.run = false;

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.unit != req.user.unit && req.user.unit != null && superPrivilege.indexOf(req.user.role) < 0) { if (toHappen) toHappen.run = false;

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (callback && !toHappen) { return callback(req , res , next , entryResult); }
		} ,

		'$isOwnerRf' : (req , res , next , entryResult , entryType , toHappen , normalPrivilege , superPrivilege , callback , leastPrivilege) => {

			let author = typeof entryResult.author == 'string' ? entryResult.author : entryResult.author instanceof Object && entryResult.author._id ? entryResult.author._id : "5fb2d2f175f95a570adfa1d6";

				if (author != req.user._id && normalPrivilege.indexOf(req.user.role) > -1) { if (toHappen) toHappen.run = false;

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.department != req.user.department && (leastPrivilege.indexOf(req.user.role) + 1) == 1) { if (toHappen) toHappen.run = false;

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.faculty != req.user.faculty && (leastPrivilege.indexOf(req.user.role) + 1) == 2) { if (toHappen) toHappen.run = false;

						return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (callback && !toHappen) { return callback(req , res , next , entryResult); }
		} ,

		'$isOwnerPayment' : (req , res , next , entryResult , entryType , toHappen , normalPrivilege , callback , leastPrivilege) => {

			let author = typeof entryResult.author == 'string' ? entryResult.author : entryResult.author instanceof Object && entryResult.author._id ? entryResult.author._id : "5fb2d2f175f95a570adfa1d6";

		if (author != req.user._id && normalPrivilege.indexOf(req.user.role) > -1 && normalPrivilege.indexOf(req.user.role) < 1) {	

			return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

		if (entryResult.department != req.user.department && normalPrivilege.indexOf(req.user.role) > 0 && normalPrivilege.indexOf(req.user.role) < 2) {	

			return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

		if (entryResult.faculty != req.user.faculty && normalPrivilege.indexOf(req.user.role) > 1) {

			return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

		if (entryResult.department != req.user.department && (leastPrivilege.indexOf(req.user.role) + 1) == 1) {	

			/*return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});*/	}

		if (entryResult.department != req.user.department && (leastPrivilege.indexOf(req.user.role) + 1) == 2) {	

			return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

		if (entryResult.faculty != req.user.faculty && (leastPrivilege.indexOf(req.user.role) + 1) == 3) {

			return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}
																						
				if (callback) { return callback(req , res , next , entryResult); }
		} ,

		'$isOwnerPayment2' : (req , res , next , entryResult , callback) => {

				if (err) {					return config.errResponse(res , 400 , err);		}

				if (!entryResult) {	return config.response(res , 404 , {'message' : `${ModelName} entry does not exists in the record or is not available.`}	);	}

				if (entryResult.paymentType == 'department' && (req.user.role != 'departmentPresident')) {	return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (entryResult.paymentType == 'faculty' && (req.user.role != 'facultyPresident')) {	return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (callback) { return callback(req , res , next , entryResult); }
		} ,

		'$isOwnerGeneral' : (req , res , next , entryResult , callback) => {

			if (entryResult.author._id != req.user._id && req.user.role == 'student') { return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	}

				if (callback) { return callback(req , res , next , entryResult); }
		} ,

		'successReponse' : (req , res , next , entryResult) => {
					
				return config.response(res , 200 , entryResult);
		} ,

		'errorResponse' : (req , res , next , err) => {

				return config.errResponse(res , 400 , err);
		} ,
	
}