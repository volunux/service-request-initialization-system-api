var mongoose = require('mongoose');

module.exports = {

	'url' : 'mongodb://localhost/sris' ,

	'gracefulShutdown' : (msg , callback) => {
																							mongoose.connection.close(() => {
																																									console.log('Mongoose disconnected through ' + msg);
																																																																				callback();
																										});
				},

	'response' : 	(res , status , body) => {
																							res.status(status);
																																		res.json({'status' : body});
	} ,

	'id' : mongoose.Types.ObjectId

}
