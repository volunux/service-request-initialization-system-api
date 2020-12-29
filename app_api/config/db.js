var mongoose = require('mongoose');

module.exports = {

	'url' : 'mongodb://localhost/history' ,

	'gracefulShutdown' : (msg , callback) => {
																							mongoose.connection.close(() => {
																																									console.log('Mongoose disconnected through ' + msg);
																																																																				callback();
																										});
				},

	'response' : 	(res , status , body) => {
																							res.status(status);
																																		res.json({'status' : body});
	},

	'sessionSecret' : 'aSecret',

	'id' : mongoose.Types.ObjectId

}

// mongodb+srv://yusuf:12345@cluster0-fzsp2.mongodb.net/test?retryWrites=true&w=majority