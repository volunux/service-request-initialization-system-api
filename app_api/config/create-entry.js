var mongoose = require('mongoose') , $RequestLimit = require('../models/models').RequestLimit , config = require('./response');

module.exports = {

	'$checkRequestLimit' : (req , res , next) => {

			$RequestLimit.findOne({'author' : req.body.author})

										.lean({})

										.select('numberRemaining')

										.exec((err , entryResult) => {

						if (err) {	return config.errResponse(res , 400, err);	}

	if (entryResult && entryResult.numberRemaining >= 3) {	return config.response(res , 403 , {'message' : `Request which is set at limit 3 have been reached and user cannot send any request until afte 1 week.`}	);	}

			$RequestLimit.updateOne({'author' : req.body.author} , 

															{'$inc' : {'numberRemaining' : 1}} , {'upsert' : true , 'runValidators' : false})

															.exec((err , entryResult1) => {

													if (err) {	return config.errResponse(res , 400, err);	}

											if (!(entryResult1.nModified > 0 || entryResult1.n > 0 )) {	return config.response(res , 404 , {'message' : `Request Limit entry does not exists in the record or is not available.`});	}		

							return next();	});		});
		} ,

}