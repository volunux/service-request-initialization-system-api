const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');

const User = require('../models/models').User;

passport.use(new LocalStrategy({
																	'usernameField' : 'emailAddress'
														} ,	
																(username , password , done) => {

														User.findOne({ 'emailAddress' : {'$in' : [username] } } , '+salt +hash' , (err , user) => {
																														
																							if (err) { 	return done(err); }

																						if (!user) {	return done(null , false , { 'message' : 'Incorrect email address.'	});	}

										if (!user.validPassword(password)) {	return done(null , false , { 'message' : 'Incorrect password.'	});		}

																													return done(null, user);
																		});			}
																														));