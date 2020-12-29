const Joi = require('@hapi/joi');

module.exports = {

	'courseRegistration' : Joi.object({

		'text' : Joi
								.string() 

								.min(10)

								.max(500)

								.required()

								.label('Comment Text')

								.messages({
																'any' : {
																					'required' : 'should be provided and cannot be empty.'
																} ,

																'string' : {
																							'min' : 'cannot be less than 10 characters in length.' ,

																							'max' : 'cannot be greater than 500 characters in length.' ,

																							'base' : 'should only be of type String.'	}		}) ,
		'unit' : Joi
								.string() 

								.min(1)

								.max(200)

								.required()

								.label('Unit')

								.messages({
														'any' : {
																			'required' : 'should be provided and cannot be empty.'
														} ,

														'string' : {
																					'min' : 'cannot be less than 1 character in length.' ,

																					'max' : 'cannot be greater than 200 characters in length.' ,

																					'base' : 'should only be of type String.'	}		}) ,
		'requestType' : Joi
												.string() 

												.min(1)

												.max(200)

												.required()

												.label('Request Type')

												.messages({
																		'any' : {
																							'required' : 'should be provided and cannot be empty.'
																		} ,

																		'string' : {
																									'min' : 'cannot be less than 1 character in length.' ,

																									'max' : 'cannot be greater than 200 characters in length.' ,

																									'base' : 'should only be of type String.'	}		}) ,

})

}; 

// console.log(JSON.stringify(courseRegistration.validate({'firstName' : '' , 'lastName' : '' , 'studentMatricNumber' : '' , 'jambRegistrationNumber' : '' , 'studentIdentificationNumber' : ''})));