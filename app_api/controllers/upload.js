const Upload = require('../models/upload') , config = require('../config/response');

const objectControl = require('../config/object');

module.exports = {

		'entryDeleteMany' : () => { return (req , res , next) => { let entries = req.body.entries && req.body.entries.length ? req.body.entries : [];

				Upload.deleteMany({'num' : {'$in' : entries} })

															.lean({})

															.exec((err , entryResult) => {

																						if (err) {			return config.errResponse(res , 400 , err);		}

										if (!entryResult.deletedCount > 0) {		return config.response(res , 404 , {'message' : `${opt.second} entries does not exists in the record or is not available.`});		}
																	
													if (entryResult.deletedCount) { objectControl.deleteManyUpload(entries);

															return config.response(res , 204 , {'message' : `Entries successfully removed from the record.`});		}		});		} 	

		} ,	
	
}				