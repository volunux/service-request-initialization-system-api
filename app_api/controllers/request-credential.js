var RequestCredential = require('../models/models').RequestCredential , response = require('../config/response');

module.exports = {

	'createCredential' : (req , res) => {

		let genRequestUsername = req.body.requestUsername ? req.body.requestUsername.toLowerCase().replace(/\s+/g , '') : 'david';

	let arr = [10 , 100 , 1000 , 10000 , 100000];

		function generateCredential() {

		let newUsername = genRequestUsername + Math.floor(Math.random() * (arr[Math.floor(Math.random() * arr.length)] + 1));

		let newPassword = Math.random().toString(36).substr(2, 9);

			return RequestCredential
															.findOne({'requestUsername' : newUsername})
															
															.lean({})

															.select(`_id`)

															.hint({'_id' : 1})

															.exec((err , entryResult) => {

																								if (err) {	return response.errResponse(res , 400 , err);		}

																								if (entryResult) { return generateCredential() }

																				let newCredential = new RequestCredential({'requestUsername' : newUsername , 'requestPassword' : newPassword , 'active' : false , 'author' : req.body.author});

																		return newCredential.save((err , entryResult1) => {
																							
																								if (err) {	return response.errResponse(res , 400 , err);		}

																								return response.response(res , 200 , entryResult1)		}) })	}	
						return generateCredential();

		} ,

	'createUniqueNumbe' : (req , res , next) => {

			const createID = () => {
	
						return Array(16)
	
						.fill(0)
	
						.map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97))
	
						.join('') + 
	
						Date.now().toString(24);
			}

	}
}
