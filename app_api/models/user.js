var mongoose = require('mongoose') , crypto = require('crypto') , jwt = require('jsonwebtoken') , Schema = mongoose.Schema;

const FKHelper = require('../helpers/foreign-key-helper') , modelCtrl = require('../helpers/model-ctrl');

const fileSchema = new Schema(modelCtrl.fileSchema , modelCtrl.createIdentity);

const userSchema = new mongoose.Schema({

'firstName' : {

'type' : String , 'trim' : true ,	'lowercase' : false , 'set' : modelCtrl.turnCapitalize ,

'required' : [true , 'First Name of User should be provided and cannot be empty.'] ,

'minlength' : [2 , 'First Name of User cannot be less than 3 characters in length.'] ,

'maxlength' : [20 , 'First Name of User cannot be greater than 20 characters in length.']

} ,

'lastName' : {

'type' : String , 'trim' : true ,	'lowercase' : false , 'set' : modelCtrl.turnCapitalize ,

'required' : [true , 'Last Name of User should be provided and cannot be empty.'] ,

'minlength' : [2 , 'Last Name of User cannot be less than 3 characters in length.'] ,

'maxlength' : [20 , 'Last Name of User cannot be greater than 20 characters in length.']

} ,

'username' : {

'type' : String , 'trim' : true ,	'lowercase' : false , 'set' : modelCtrl.turnCapitalize , 'unique' : true ,

'required' : [true , 'Username of User should be provided and cannot be empty.'] ,

'minlength' : [3 , 'Username of User cannot be less than 4 characters in length.'] ,

'maxlength' : [20 , 'Userame of User cannot be greater than 20 characters in length.']

} ,

'about' : {

'type' : String , 'trim' : true ,	'lowercase' : false , 'set' : modelCtrl.capitalize , 

'required' : [true , 'About User should be provided and cannot be empty.'] ,

'minlength' : [9 , 'About User cannot be less than 10 characters in length.']	,

'maxlength' : [300 , 'About User cannot be greater than 300 characters in length.'] ,

} ,

'emailAddress' : {

'type' : String , 'trim' : true	, 'lowercase' : false ,

'minlength' : [8, 'Email Address cannot be less than 8 characters in length.'] ,

'maxlength' : [50 , 'Email Address cannot be greater than 50 characters in length.'] ,

} ,

'department' : {	

'type' : String ,	'ref' : 'Department' , 

'required' : [true , 'Department ID should be provided and cannot be empty.'] ,

'maxlength' : [150 , 'Department ID cannot be greater than 150 characters in length.'] ,

'validate' : { 'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('Department') , v );	} ,

'message' : `Department ID reference doesn't exists in the record or is not available.`	}	

} ,

'faculty' : {	

'type' : String ,	'ref' : 'Faculty' , 

'required' : [true , 'Faculty ID should be provided and cannot be empty.'] ,

'maxlength' : [150 , 'Faculty ID cannot be greater than 150 characters in length.'] ,

'validate' : { 'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('Faculty') , v );		} ,

'message' : `Faculty ID reference doesn't exists in the record or is not available.`	}	

} ,

'level' : {	

'type' : String ,	'ref' : 'Level' , 

'maxlength' : [50 , 'Level ID cannot be greater than 50 characters in length.'] ,

'validate' : { 'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('Level') , v );			} ,

'message' : `Level ID reference doesn't exists in the record or is not available.`	}	

} ,

'country' : {

'type' : String , 'ref' : 'Country' ,

'required' : [true , 'Country ID for User should be provided.'] ,

'maxlength' : [50 , 'Country ID cannot be greater than 50 characters in length.'] ,

'validate' : { 'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('Country') , v );		} ,

'message' : `Country ID reference doesn't exist in the record or is not available..`		}	

} ,

'unit' : {

'type' : String , 'ref' : 'Unit' ,

'required' : [false , 'Unit ID should be provided and cannot be empty.'] ,

'maxlength' : [150 , 'Unit ID cannot be greater than 50 characters in length.'] ,

'validate' : {	'validator' : (v) => {
	
	return FKHelper.primaryKey(mongoose.model('Unit') , v );	} ,

'message' : `Unit ID reference doesn't exists in the record or is not available.`	}	

} ,
	
'matriculationNumber' : {

'type' : String , 'trim' : true ,	'lowercase' : false ,

'required' : [false , 'User Matriculation Number should be provided and cannot be empty.'] ,

'maxlength' : [30 , 'User Matriculation Number cannot be greater than 30 characters in length.']

} ,

'jambRegistrationNumber' : {

'type' : String , 'trim' : true ,	'lowercase' : false ,

'required' : [false , 'Jamb Registration Number should be provided and cannot be empty.'] ,

'maxlength' : [30 , 'Jamb Registration Number be greater than 30 characters in length.']

} ,

'identityNumber' : {

'type' : String , 'trim' : true ,	'lowercase' : false ,

'required' : [false , 'User Identification Number should be provided and cannot be empty.'] ,

'maxlength' : [30 , 'User Identification Number cannot be greater than 30 characters in length.']

 } ,

'role' : {

'type': String , 'unique' : false , 'default' : 'student' ,

'required' : [true , 'A role should be provided and cannot be empty.'] ,

'enum' : ['student' , 'departmentPresident' , 'facultyPresident' , 'lecturer' , 'hod' , 'dean' , 'bursar' , 'staff' , 'moderator' , 'administrator' , 'superAdministrator'] ,

} ,

'num' : {

'type' : Number , 'immutable' : true , 'default' : () => parseInt(Date.now() + Math.random() * 100000000) ,

'maxlength' : [200 , 'Number of General Request cannot be greater than 200 characters in length.'] ,	

} ,

'status' : {

'type' : String , 'required' : false , 'default' : 'active' ,

'enum' : ['active' , 'banned' , 'deactivated' , 'inactive' , 'pending']	

} ,

'lastloggedIn' : { 'type' : String , 'required': false , 'default' : Date.now	} ,

'hash' : { 'type' : String , 'select' : false ,

'required' : [true , 'Password required to to generate hash should be provided and cannot be empty.']	} ,

'salt' : { 'type' : String , 'select' : false	,

'required' : [true , 'Password required to to generate salt should be provided and cannot be empty.'] } ,

'profilePhoto' : fileSchema ,

'signature' : fileSchema ,

'resetPasswordToken' : String ,

'resetPasswordExpires' : Date

} , modelCtrl.schemaOptions);


userSchema.methods.setPassword = function (password) {
	
	this.salt = crypto.randomBytes(16).toString('hex');
	
	this.hash = crypto
										.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
																																				.toString('hex');

};

userSchema.methods.validPassword = function (password) {
	
	const hash = crypto
											.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512')
																																					.toString('hex');

														return this.hash === hash 	};

userSchema.methods.generatePasswordReset = function() {

	
}

userSchema.post('save' , modelCtrl.uniqueAndCast);

userSchema.post('update' , modelCtrl.uniqueAndCast);

userSchema.post('findOneAndUpdate' , modelCtrl.uniqueAndCast);

userSchema.post('insertMany' , modelCtrl.uniqueAndCast);

userSchema.post('findOne' , modelCtrl.uniqueAndCast);

userSchema.post('find' , modelCtrl.uniqueAndCast);

userSchema.methods.generateJwt = function () {
	
	const expiry = new Date();

expiry.setDate(expiry.getDate() + 7);

	return jwt.sign({
		
		'_id' : this._id ,

		'email_address' : this.emailAddress ,

		'username' : this.username ,

		'role' : this.role , 

		'department' : this.department ,

		'faculty' : this.faculty ,

		'unit' : this.unit ? this.unit : null ,

		'status' : this.status ,

		'exp' : parseInt(expiry.getTime() / 1000 , 10) /*parseInt(Date.now() / 1000) + 1 * 60* 1 denote minute*/ ,

		} , process.env.JWT_SECRET );
																			};

userSchema.index({'emailAddress' : 1});

userSchema.index({'firstName' : 1 , 'lastName' : 1});

userSchema.index({'department' : 1});

userSchema.index({'faculty' : 1});

userSchema.index({'level' : 1});

userSchema.index({'identityNumber' : 1});

userSchema.index({'role' : 1});

userSchema.index({'status' : 1});

module.exports = mongoose.model('User', userSchema);