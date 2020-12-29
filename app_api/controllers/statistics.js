const mongoose = require('mongoose');

module.exports = (opt) => {

	const $Model = opt.$Model;

	var thems = {

	'User' : $Model.User ,

	'Level' : $Model.Level ,
	
	'Department' : $Model.Department ,

	'Faculty' : $Model.Faculty ,

	'Unit' : $Model.Unit ,

	'Upload' : $Model.Upload ,

	'Letter' : $Model.Letter ,

	'RequestType' : $Model.RequestType ,

	'RequestLimit' : $Model.RequestLimit ,

	'RequestCredential' : $Model.RequestCredential ,

	'GeneralRequestComment' : $Model.CourseRegistrationComment ,

	'GeneralRequestReply' : $Model.CourseRegistrationReply ,

	'GeneralRequest' : $Model.GeneralRequest ,

	'Country' : $Model.Country ,

	'RefundStage' : $Model.RefundStage ,

	'Refund' : $Model.Refund ,

	'RefundComment' : $Model.RefundComment ,

	'RefundReply' : $Model.RefundReply ,

	'Payment' : $Model.Payment

}

	const response = require('../config/response') , async = require('async');

	const modelCtrl = require('../helpers/model-ctrl');

	return {

		'entriesRequest' : (req , res , next) => {		
		
			async.parallel({
												'CourseRegistration' : (callback) => {
																																thems.GeneralRequest.countDocuments({'requestType' : 'CR'})
																																																													.hint({'_id' : 1})

																																																													.select('_id')

																																																													.exec(callback);	} ,
												'InternetCredential' : (callback) => {
																																thems.GeneralRequest.countDocuments({'requestType' : 'CSIF'})
																																																														.hint({'_id' : 1})

																																																														.select('_id')

																																																														.exec(callback);	} ,
												'InternetPassword' : (callback) => {
																																thems.GeneralRequest.countDocuments({'requestType' : 'RPIF'})
																																																														.hint({'_id' : 1})

																																																														.select('_id')

																																																														.exec(callback);	} ,
												'SchoolResult' : (callback) => {
																																thems.GeneralRequest.countDocuments({'requestType' : 'SASR'})
																																																															.hint({'_id' : 1})

																																																															.select('_id')

																																																															.exec(callback);	} ,
												'EmailPassword' : (callback) => {
																																thems.GeneralRequest.countDocuments({'requestType' : 'REPSP'})
																																																															.hint({'_id' : 1})

																																																															.select('_id')

																																																															.exec(callback);	} ,
												'Refund' : (callback) => {
																																thems.Refund.countDocuments({})
																																																.hint({'_id' : 1})

																																																.select('_id')

																																																.exec(callback);	} ,

																																																														},
			(err , result) => {	
																					if (err) {	return response.errResponse(res , 400 , err);	}

																			if (!result) {	return response.response(res , 404 , {'message' : 'Data cannot be retrieved.'});	}
								
																											return response.response(res , 200 , result);		});
		} , 

		'entriesComment' : (req , res , next) => {		
		
			async.parallel({
												'GeneralRequest' : (callback) => {
																														thems.GeneralRequestComment.countDocuments({})
																																																				.hint({'_id' : 1})

																																																				.select('_id')

																																																				.exec(callback);	} ,
																'Refund' : (callback) => {
																														thems.RefundComment.countDocuments({})
																																																.hint({'_id' : 1})

																																																.select('_id')

																																																.exec(callback);	}  },
			(err , result) => {	
																					if (err) {	return response.errResponse(res , 400 , err);	}

																			if (!result) {	return response.response(res , 404 , {'message' : 'Data cannot be retrieved.'});	}
								
																											return response.response(res , 200 , result);		});
		} , 

		'entriesReply' : (req , res , next) => {		
		
			async.parallel({
												'GeneralRequest' : (callback) => {
																														thems.GeneralRequestReply.countDocuments({})
																																																				.hint({'_id' : 1})

																																																				.select('_id')

																																																				.exec(callback);	} ,
																'Refund' : (callback) => {
																														thems.RefundReply.countDocuments({})
																																																.hint({'_id' : 1})

																																																.select('_id')

																																																.exec(callback);	}  },
			(err , result) => {	
																					if (err) {	return response.errResponse(res , 400 , err);	}

																			if (!result) {	return response.response(res , 404 , {'message' : 'Data cannot be retrieved.'});	}
								
																											return response.response(res , 200 , result);		});
		} ,

		'entriesCommentAndReply' : (req , res , next) => {		
		
			async.parallel({
												'GeneralRequestComment' : (callback) => {
																																	thems.GeneralRequestComment.countDocuments({})
																																																							.hint({'_id' : 1})

																																																							.select('_id')

																																																							.exec(callback);	} ,
																'RefundComment' : (callback) => {
																																	thems.RefundComment.countDocuments({})
																																																			.hint({'_id' : 1})

																																																			.select('_id')

																																																			.exec(callback);	} ,
												'GeneralRequestReply' : (callback) => {
																																thems.GeneralRequestReply.countDocuments({})
																																																					.hint({'_id' : 1})

																																																					.select('_id')

																																																					.exec(callback);	} ,
														'RefundReply' : (callback) => {
																														thems.RefundReply.countDocuments({})
																																															.hint({'_id' : 1})

																																															.select('_id')

																																															.exec(callback);	}  },
			(err , result) => {	
																					if (err) {	return response.errResponse(res , 400 , err);	}

																			if (!result) {	return response.response(res , 404 , {'message' : 'Data cannot be retrieved.'});	}
								
																											return response.response(res , 200 , result);		});
		} , 

		'entriesPayment' : (req , res , next) => {		
		
			async.parallel({
												'Department' : (callback) => {
																												thems.Payment.countDocuments({'paymentType' : 'department'})
																																																									.hint({'_id' : 1})

																																																									.select('_id')

																																																									.exec(callback);	} ,
												'Faculty' : (callback) => {
																												thems.Payment.countDocuments({'paymentType' : 'faculty'})
																																																							.hint({'_id' : 1})

																																																							.select('_id')

																																																							.exec(callback);	}  },
			(err , result) => {	
																					if (err) {	return response.errResponse(res , 400 , err);	}

																			if (!result) {	return response.response(res , 404 , {'message' : 'Data cannot be retrieved.'});	}
								
																											return response.response(res , 200 , result);		});
		} , 

		'entriesUser' : (req , res , next) => {		
		
			async.parallel({
												'Student' : (callback) => {
																												thems.User.countDocuments({'role' : 'student'})
																																																			.hint({'_id' : 1})

																																																			.select('_id')

																																																			.exec(callback);	} ,
												'DepartmentPresident' : (callback) => {
																																thems.User.countDocuments({'role' : 'departmentPresident'})
																																																													.hint({'_id' : 1})

																																																													.select('_id')

																																																													.exec(callback);	}  ,
												'FacultyPresident' : (callback) => {
																															thems.User.countDocuments({'role' : 'facultyPresident'})
																																																										.hint({'_id' : 1})

																																																										.select('_id')

																																																										.exec(callback);	} ,
												'Lecturer' : (callback) => {
																											thems.User.countDocuments({'role' : 'lecturer'})
																																																							.hint({'_id' : 1})

																																																							.select('_id')

																																																							.exec(callback);	} ,
												'HeadOfDepartment' : (callback) => {
																															thems.User.countDocuments({'role' : 'hod'})
																																																				.hint({'_id' : 1})

																																																				.select('_id')

																																																				.exec(callback);	} ,
												'DeanOfFaculty' : (callback) => {
																													thems.User.countDocuments({'role' : 'dean'})
																																																			.hint({'_id' : 1})

																																																			.select('_id')

																																																			.exec(callback);	} , 
												'Bursar' : (callback) => {
																									thems.User.countDocuments({'role' : 'bursar'})
																																															.hint({'_id' : 1})

																																															.select('_id')

																																															.exec(callback);	} ,
												'Staff' : (callback) => {
																									thems.User.countDocuments({'role' : 'staff'})
																																															.hint({'_id' : 1})

																																															.select('_id')

																																															.exec(callback);	}  ,
												'Moderator' : (callback) => {
																											thems.User.countDocuments({'role' : 'moderator'})
																																																			.hint({'_id' : 1})

																																																			.select('_id')

																																																			.exec(callback);	} ,
												'Administrator' : (callback) => {
																													thems.User.countDocuments({'role' : 'administrator'})
																																																							.hint({'_id' : 1})

																																																							.select('_id')

																																																							.exec(callback);	} ,
												'SuperAdministrator' : (callback) => {
																																thems.User.countDocuments({'role' : 'superAdministrator'})
																																																												.hint({'_id' : 1})

																																																												.select('_id')

																																																												.exec(callback);	} },
			(err , result) => {	
																					if (err) {	return response.errResponse(res , 400 , err);	}

																			if (!result) {	return response.response(res , 404 , {'message' : 'Data cannot be retrieved.'});	}
								
																											return response.response(res , 200 , result);		});
		} , 

		'entriesOthers' : (req , res , next) => {		
		
			async.parallel({
																'Level' : (callback) => {
																																thems.Level.countDocuments({})
																																															.hint({'_id' : 1})

																																															.select('_id')

																																															.exec(callback);	} ,
																'Department' : (callback) => {
																																thems.Department.countDocuments({})
																																																	.hint({'_id' : 1})

																																																	.select('_id')

																																																	.exec(callback);	}  ,
																'Faculty' : (callback) => {
																																thems.Faculty.countDocuments({})
																																																.hint({'_id' : 1})

																																																.select('_id')

																																																.exec(callback);	} ,
																		'Unit' : (callback) => {
																																thems.Unit.countDocuments({})
																																														.hint({'_id' : 1})

																																														.select('_id')

																																														.exec(callback);	} ,
																	'Upload' : (callback) => {
																																thems.Upload.countDocuments({})
																																															.hint({'_id' : 1})

																																															.select('_id')

																																															.exec(callback);	} ,
																	'Letter' : (callback) => {
																																thems.Letter.countDocuments({})
																																																.hint({'_id' : 1})

																																																.select('_id')

																																																.exec(callback);	} , 
															'RequestType' : (callback) => {
																																thems.RequestType.countDocuments({})
																																																		.hint({'_id' : 1})

																																																		.select('_id')

																																																		.exec(callback);	} ,
												'RequestCredential' : (callback) => {
																																thems.RequestCredential.countDocuments({})
																																																					.hint({'_id' : 1})

																																																					.select('_id')

																																																					.exec(callback);	}  ,
															'RequestLimit' : (callback) => {
																																thems.RequestLimit.countDocuments({})
																																																		.hint({'_id' : 1})

																																																		.select('_id')

																																																		.exec(callback);	} ,
																	'Country' : (callback) => {
																																thems.Country.countDocuments({})
																																																.hint({'_id' : 1})

																																																.select('_id')

																																																.exec(callback);	} ,
																'RefundStage' : (callback) => {
																																	thems.RefundStage.countDocuments({})
																																																			.hint({'_id' : 1})

																																																			.select('_id')

																																																			.exec(callback);	} },
			(err , result) => {	
																					if (err) {	return response.errResponse(res , 400 , err);	}

																			if (!result) {	return response.response(res , 404 , {'message' : 'Data cannot be retrieved.'});	}
								
																											return response.response(res , 200 , result);		});
		} , 


	}

}