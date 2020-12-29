module.exports = {

	'courseRegistration' : (req , res , next) => {

			req.body.requestType = 'CR';

			req.body.unit = 'Course Registration';

			return next();
	} ,

	'internetCredential' : (req , res , next) => {

			req.body.requestType = 'CSIF';

			req.body.unit = 'Internet Facility';

			return next();
	} ,

	'internetPassword' : (req , res , next) => {

			req.body.requestType = 'CSIP';

			req.body.unit = 'Internet Password';

			return next();
	} ,

	'emailPassword' : (req , res , next) => {

			req.body.requestType = 'REPSP';

			req.body.unit = 'Email Password';

			return next();
	} ,

	'schoolResult' : (req , res , next) => {

			req.body.requestType = 'ASR';

			req.body.unit = 'Academic Session Result';

			return next();
	} ,

	'canPass' : (req , res , next) => {

			req.body.canPass = 'true';

			return next();
	}
}