const Joi = require('@hapi/joi');

module.exports = {

	'InternetCredential' : Joi.object({

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
		'status' : Joi
										.string() 

										.min(1)

										.max(15)

										.required()

										.label('Status')

										.messages({
																		'any' : {
																							'required' : 'should be provided and cannot be empty.'
																		} ,

																		'string' : {
																									'min' : 'cannot be less than 1 character in length.' ,

																									'max' : 'cannot be greater than 15 characters in length.' ,

																									'base' : 'should only be of type String.'	}		}) 	
})

}; 

// console.log(JSON.stringify(courseRegistration.validate({'firstName' : '' , 'lastName' : '' , 'studentMatricNumber' : '' , 'jambRegistrationNumber' : '' , 'studentIdentificationNumber' : ''})));