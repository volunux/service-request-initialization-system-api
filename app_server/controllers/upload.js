const { body , sanitizeBody , validationResult } = require('express-validator');

axios = require('axios') , url = '' , data = '' , uConfig = require('../config/upload');

module.exports = {

	'uploadPhoto' : (req , res , next) => {

			axios({   'method': 'post' ,
																		'url' : uConfig.reqOptions.url ,
																																			'data' : req.files[0]   })

					.then((response) => { var data = response.data.location;
																																							res.send({'link' : data});       
					})
						.catch((err) => {
																			res.json({'error' : 'An Error has occured.'})
						})
			}


}