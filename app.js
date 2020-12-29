require('dotenv').config();

const createError = require('http-errors');

const cors = require('cors') , compression = require('compression') , helmet = require('helmet') , passport = require('passport') , session = require('express-session') , flash = require('express-flash');

const express = require('express');

const path = require('path');

const cookieParser = require('cookie-parser');

const logger = require('morgan');

const serverRouter = require('./app_server/routes/routes');

const apiRouter = require('./app_api/routes/route');

require('./app_server/config/db/mongodb');

require('./app_api/config/passport');


const app = express();

app.set('x-powered-by' , false);
app.use(compression());
app.use(helmet());

app.use(session({	'saveUninitialized' : true ,
								
									'resave' : true ,

										'secret' : 'config.sidSecret'	}));

app.use(flash());
									app.use(cors());



app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(express.json());

app.use(express.urlencoded({ 'extended' : true }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', (req, res, next) => {
																			res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
																																																					res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type,Etag, Accept');
next();
});

app.use((req , res , next) => {	res.locals.moment = require('moment-timezone');

																res.locals.currentYear = (new Date()).getFullYear();

																if (req.cookies.sid !== undefined && req.cookies.s_id !== undefined) {

																		res.locals.isLoggedIn = true;

																		res.locals.uIdentity = req.cookies.s_id;		}

																		if (res.locals.isLoggedIn && req.cookies.s_id) {

																				function findUser(voters) {

																						return voters.find((voter) => res.locals.uIdentity == voter);		}

																						res.locals.findUser = findUser;			}

																		return next();		});


apiRouter(app);

app.use((req , res , next) => {

	next(createError(404));

});

app.use((err , req , res , next) => {

	res.locals.message = err.message;

	res.locals.error = req.app.get('env') === 'development' ? err : {};

	console.log(err);

	res.status(err.status || 500);

	res.render('error');
});

module.exports = app;
