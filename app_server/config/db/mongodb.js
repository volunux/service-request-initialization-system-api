const mongoose = require('mongoose') , config = require('./db');

mongoose.promise = global.promise;

mongoose.connect(config.url , { 'useNewUrlParser' : true , 'useCreateIndex' : true , 'useFindAndModify' : false , 'useUnifiedTopology' : true });

mongoose.connection.on('connected' , () => {
																									console.log('App establish connection to the database');
});

mongoose.connection.on('error' , () => {
																									console.log('App encounter error connecting to database');
});

mongoose.connection.on('disconnected' , () => {
																									console.log('App successfully disconnected from database');
});

process.once('SIGUSR2' , () => {
																		config.gracefulShutdown('nodemon restart' , () => {
																																															process.kill(process.pid , 'process kill');
																					});
});

process.on('SIGINT' , () => {
																		config.gracefulShutdown('node restarts' , () => {
																																															process.exit(0);
																					});
});

process.on('SIGTERM' , () => {
																		config.gracefulShutdown('heroku node restarts' , () => {
																																															process.exit(0);
																					});
});