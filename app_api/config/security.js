let token = '' , config = require('./response');


const expiresIn = 60 * 60 * 24 * 7 * 1000;

const options = {'maxAge' : expiresIn , 'httpOnly' : true };

module.exports = {

	'encryptor' : (req , res , token , uIdentity) => { let $uIdentity = String(uIdentity);

			res.cookie('sid' , token , options);

			res.cookie('s_id' , $uIdentity , options);

			let finalToken = { 'token' : token , 's_id' : $uIdentity };

					res.status(200).json(finalToken);
	} ,

}