const jwt = require('jsonwebtoken') , config = require('./response');

module.exports = {

		'auth' : (req , res , next) => { const token = req.headers.authorization.split(' ')[1];

				if(!token) { return config.response(res , 401 , 'Access Denied');	}

					jwt.verify(token , process.env.JWT_SECRET , (err , decoded) => {
						
							if (err) { return config.response(res , 401 , 'Invalid Token'); }
						
								else { const verified = decoded;

												req.user = verified;

												console.log(req.user);
												
												return next();	}		});
		} ,

		'confirmUserStatus' : (req , res , next) => {

			if (req.user.status == 'pending') {

				return config.response(res , 200 , {'message' : `Account status is in pending state and a user cannot perform any important tasks function until the account is fully approved.`}); }

				return next();
		} ,

		'authCook' : (req , res , next) => { const token = req.cookies.sid;

				if(!token) { return config.response(res , 401 , 'Access Denied');	}

					jwt.verify(token , process.env.JWT_SECRET , (err , decoded) => {
						
							if (err) { return config.response(res , 401 , 'Invalid Token'); }
						
								else { const verified = decoded;

												req.user = verified;
												
												return next();	}		});	
		} ,

		'fAuth' : (req , res , next) => { const token = req.cookies.sid || req.cookies.s_id;

				if(!token) {	return res.redirect('/signin');	}

						return next();
		} ,

};