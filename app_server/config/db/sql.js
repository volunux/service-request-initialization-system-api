let mysql = require('mysql');

const conn = mysql.createConnection({

	'host' : 'localhost' ,

	'user' : 'root' ,

	'password' : '' ,

	'database' : 'classicmodels'

});

conn.connect((err) => {

		if (err) {	console.log('An error has occured trying to establish connection to database');	}

		console.log('Connection Established to the database');

});

global.db = conn;