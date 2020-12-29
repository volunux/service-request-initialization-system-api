let config = require('./response') , async = require('async') , mongoose = require('mongoose') , User = mongoose.model('User');

module.exports = {

		'entryPublisher' : (req , res , next) => {	req.body.author = req.user._id;
	
			return	next();		} ,

		'isRefund' : (req , res , next) => {

				req.params['isRefund'] = true;

					return next();
		} ,

		'isOkay' : (req , res , next) => {	return config.response(res , 200 , {'message' : `Operation is permitted to all users.`});

		} ,

		'entryAddStringId' : (req , res , next) => {

			if ((req.body && req.body.name) && !req.body._id) req.body._id = req.body.name;

			return next();

		} ,

		'checkMongoNumber' : (req , res , next) => { let entry = req.params.entry , validateEntry = mongoose.Types.ObjectId;

			if (validateEntry.isValid(req.params.entry)) { return next(); }

			else { req.params['entry'] = new mongoose.Types.ObjectId();
	
							return next(); }
		} ,

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

		'queryByRoleRefunded' : (req , res , next) => {

				if (req.user.role == 'dean') { req.body.queryByRole = { 'faculty' : req.user.faculty , 'refunded' : true }; }

				else if (req.user.role == 'hod') { req.body.queryByRole = { 'department' : req.user.department , 'refunded' : true };}

				else if (req.user.role == 'student') { req.body.queryByRole = { 'author' : req.user._id , 'refunded' : true }; }

				else { req.body.queryByRole = {}; }

 				return next();
		} ,

		'queryByUnit' : (unit , units , normalPrivilege , superPrivilege , modelName) => { return (req , res , next) => {

				if (normalPrivilege.indexOf(req.user.role) > -1) { req.body.queryByUnit = { 'author' : req.user._id	, 'unit' : unit }; }
				
				else if (superPrivilege.indexOf(req.user.role) > -1) { req.body.queryByUnit = { 'unit' : unit };	}

				else if (units.indexOf(req.user.unit) > -1) { req.body.queryByUnit = { 'unit' : unit };	}

				else if (!units.indexOf(req.user.unit) > -1) {	return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});	} 


				return next();	}

		} ,

		'searchQueryType' : (requestType , unit) => { return (req , res , next) => {

			if (req.query && req.query.requestType) {	req.query.requestType = requestType;	}	

				return next();	} 

		} ,


		'setEntryType' : (entryType , unit) => { return (req , res , next) => {

				req.body.requestType = entryType;

				req.body.unit = unit;

				return next();	} 
		} ,

		'setEntryType2' : (entryTypes , units) => { return (req , res , next) => { let unit = req.body.unit;

				switch (unit) {

						case units[0]:
							req.body.requestType = entryTypes[0];
							break;

						case units[1]:
							req.body.requestType = entryTypes[1];
							break;

						case units[2]:
							req.body.requestType = entryTypes[2];
							break;

						case units[3]:
							req.body.requestType = entryTypes[3];
							break;

						case units[4]:
							req.body.requestType = entryTypes[4];
							break;

						case units[5]:
							req.body.requestType = entryTypes[5];
							break;

						default:
							req.body.requestType = null;	}
	
				return next();	} 
		} ,

		'generalEntryTypes' : (req , res , next) => { 

				return {'acronym' : ['CSIF' , 'STD' , 'REPSP' , 'RPIF' , 'CR' , 'SASR'] ,

								'title' : ['Internet Credential' , 'Student' , 'Email Password' , 'Internet Password' , 'Course Registration' , 'Academic Session Result'] 	}
		} ,

		'canPass' : (req , res , next) => {

				req.body.canPass = 'true';

				return next();
		} ,

		'removeFields' : (...fields) => { return (req , res , next) => {

				for (var field of fields) {

					if (req['body'][field]) {	delete req['body'][field];	}		}	

						return next(); } 
		} ,

		'queryByType' : (queryType , normalPrivilege , superPrivilege , otherPrivilege) => {

				return (req , res , next) => {

			if ((otherPrivilege.indexOf(req.user.role) > -1 && otherPrivilege.indexOf(req.user.role) <= 1) && queryType == 'Department') {

				req.body.queryByType = {'paymentType' : 'department' };	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) && queryType == 'Department') {

				req.body.queryByType = {'paymentType' : 'department' };	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Department') {

				req.body.queryByType = {'paymentType' : 'department' , 'faculty' : req.user.faculty };	}

			else if ((superPrivilege.indexOf(req.user.role) > -1) &&  queryType == 'Faculty') {

				req.body.queryByType = {'paymentType' : 'faculty' };	}

			else if ((otherPrivilege.indexOf(req.user.role) > 1) && queryType == 'Faculty') {

				req.body.queryByType = {'paymentType' : 'faculty' , 'faculty' : req.user.faculty };	}
			
			else if (normalPrivilege.indexOf(req.user.role) > -1 && normalPrivilege.indexOf(req.user.role) < 1 && queryType == 'Department') {

				req.body.queryByType = { 'author' : req.user._id , 'paymentType' : 'department' }; }

			else if (normalPrivilege.indexOf(req.user.role) > -1 && normalPrivilege.indexOf(req.user.role) < 1 && queryType == 'Faculty') {

				req.body.queryByType = { 'author' : req.user._id , 'paymentType' : 'faculty' };	}

			else if ((normalPrivilege.indexOf(req.user.role) > 0) && normalPrivilege.indexOf(req.user.role) < 2 && queryType == 'Department') {

				req.body.queryByType = {'author' : req.user._id , 'paymentType' : 'department' , };	}

			else if (normalPrivilege.indexOf(req.user.role) > 1 && queryType == 'Department') {

				req.body.queryByType = {'author' : req.user._id , 'paymentType' : 'department' };	}

			else if ((normalPrivilege.indexOf(req.user.role) > 1) && queryType == 'Faculty') {

				req.body.queryByType = {'author' : req.user._id , 'paymentType' : 'faculty' };	}

			else if ((otherPrivilege.indexOf(req.user.role) < 2 && superPrivilege.indexOf(req.user.role) < 0) && queryType == 'Faculty') {

				return config.response(res , 403 , {'message' : `An Unauthorized and forbidden access, operation will not be allowed.`});		}

			return next();

		} } ,

		'queryPaymentByUnit' : (queryType) => {

				return (req , res , next) => {

			if (req.user.role == 'hod' && queryType == 'Department') { req.body.queryByType = {'paymentType' : 'department' , 'department' : req.user.department};	}

			if (req.user.role == 'dean' && queryType == 'Department') { req.body.queryByType = {'paymentType' : 'department' , 'faculty' : req.user.faculty};	}

			if (req.user.role == 'hod' && queryType == 'Faculty') { req.body.queryByType = {'paymentType' : 'faculty' , 'department' : req.user.department };	}

			if (req.user.role == 'dean' && queryType == 'Faculty') { req.body.queryByType = {'paymentType' : 'faculty' , 'faculty' : req.user.faculty };	}

			return next();	} 

		} ,

		'setRequestType' : (req , res , next) => {

				if (req.body.unit == 'Internet Credential') {		req.body.requestType = 'CSIF';	}

				else if (req.body.unit == 'Internet Password') { req.body.requestType = 'RPIF'; }

				else if (req.body.unit == 'Course Registration') {	req.body.requestType = 'CR';	}

				else if (req.body.unit == 'Email Password') { req.body.requestType = 'REPSP'; } 

				else if (req.body.unit == 'Academic Session Result') { req.body.requestType = 'SASR'; }

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

							return next(); } 
		} ,

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

		'setNewAccountRoleAndStatus' : (req , res , next) => {

				req.body.role = 'student';

				req.body.status = 'pending';

				return next();				
		} ,

		'checkAllFields' : (req , res , next) => {

		if (!req.body.emailAddress || !req.body.password || !req.body.username) {	return config.response(res , 400 , {'message' : 'All fields are required.'});		}

				return next();
		} ,

		'checkUsernameAndEmail' : (req , res , next) => {

									async.parallel({
																		'emailUser' : (callback) => {
																																				User.findOne({'emailAddress' : req.body.emailAddress} , {'emailAddress' : 1})
																																																																												.exec(callback);	} ,

																		'usernameUser' : (callback) => {
																																				User.findOne({'username' : req.body.username} , {'username' : 1})
																																																																					.exec(callback);	}
					} , (err , result) => {	
																			if (err) {			return config.errResponse(res , 400 , err);		}
													
													if (result.emailUser) {			return config.response(res , 409 , {'message' : 'E-mail Address already exist in the record.'});	}
											
												if (result.usernameUser) {		return config.response(res , 409 , {'message' : 'Username already exist in the record.'});	}

												if (!result.emailUser && !result.usernameUser) {	return next();	}		});
		} ,

		'queryByTypeRefund' : (queryType , roles) => { return (req , res , next) => {

			if (req.user.role == 'departmentPresident' && queryType == 'Department') {	req.body.queryByType = { 'paymentType' : 'department' , 'department' : req.user.department , 'refunded' : true  }; }

			else if (req.user.role == 'facultyPresident' && queryType == 'Faculty') {	req.body.queryByType = { 'paymentType' : 'faculty' , 'faculty' : req.user.faculty , 'refunded' : true  }; }

			else if ((roles.indexOf(req.user.role) > -1) && queryType == 'Department') { req.body.queryByType = {'paymentType' : 'department' , 'refunded' : true };	}

			else if ((roles.indexOf(req.user.role) > -1) && queryType == 'Faculty') { req.body.queryByType = {'paymentType' : 'faculty' , 'refunded' : true  };	}
			
			else if (req.user.role == 'student' && queryType == 'Department') {	req.body.queryByType = { 'author' : req.user._id , 'paymentType' : 'department' , 'refunded' : true  }; }

			else if (req.user.role == 'student' && queryType == 'Faculty') { req.body.queryByType = { 'author' : req.user._id , 'paymentType' : 'faculty' , 'refunded' : true };	}

			return next();	} 

		} ,

		'queryPaymentByUnitRefund' : (queryType) => { return (req , res , next) => {

			if (req.user.role == 'hod' && queryType == 'Department') { 

				req.body.queryByType = {'paymentType' : 'department' , 'department' : req.user.department , 'refunded' : true };	}

			if (req.user.role == 'dean' && queryType == 'Department') { 

				req.body.queryByType = {'paymentType' : 'department' ,  'faculty' : req.user.faculty , 'refunded' : true };	}

			if (req.user.role == 'hod' && queryType == 'Faculty') { 

				req.body.queryByType = {'paymentType' : 'faculty' , 'department' : req.user.department , 'refunded' : true };	}

			if (req.user.role == 'dean' && queryType == 'Faculty') { 

				req.body.queryByType = {'paymentType' : 'faculty' , 'faculty' : req.user.faculty , 'refunded' : true };	}

			return next();	} 

		} ,

}