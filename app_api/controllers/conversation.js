const mongoose = require('mongoose');

module.exports = (opt) => {

	const $Model = opt.$Model;

	const response = require('../config/response');

	const modelCtrl = require('../helpers/model-ctrl');

	return {

		'entryDetail' : (selectFields) => { return (req , res , next) => { let entry = req.params.entry;

				if (req.params && req.params.entry) {

						$Model.findOne({'_id' : entry})

						.lean({})

						.hint({'_id' : 1})

						.populate({'path' : 'author' , 'select' : 'firstName lastName -_id'})

						.populate({'path' : 'entryHandler' , 'select' : 'firstName lastName -_id'})

						.populate({'path' : 'stage' , 'select' : 'name -_id'})

						.select(selectFields)

						.exec((err , entryResult) => {
																						if (err) {	return response.errResponse(res , 400 , err);	}

																		if (!entryResult) {	return response.response(res , 404 , {'message' : `${opt.second} entry does not exists in the record or is not available.`});	}

																												return response.response(res , 200 , entryResult);	}); }
					
					else {	return response.response(res , 404 , {'message' : `No ${opt.second} id provided. Please provide a valid ${opt.second} id.`});		}
		} } ,

	}

}