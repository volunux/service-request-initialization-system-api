const { body } = require('express-validator');

var sanitize = require('mongo-sanitize');

module.exports = {

	'sanitizeBody' :  [ 	

				body('*') ,
				
				(req , res , next) => {	

						return next();

	}] , 

	'cleanBody' : (req , res , next) => {

			sanitize(req.body);

			return next();
	}

}