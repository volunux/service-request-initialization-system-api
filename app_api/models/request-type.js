var mongoose = require('mongoose') ,	Schema = mongoose.Schema , shortid = require('shortid');

const FKHelper = require('../helpers/foreign-key-helper') , modelCtrl = require('../helpers/model-ctrl');

var requestTypeSchema = new Schema({

'_id' : { 'type' : String } ,

'name' : {

'type' : String ,

'required' : [true , 'Name of Request Type should be provided and cannot be empty.'] ,	

'minlength' : [1 , 'Name of Request Type cannot be less than 1 character in length.'] ,

'maxlength' : [65 , 'Name of Request Type cannot be greater than 65 characters in length.'] 

} ,

'description' : {

'type' : String ,

'required' : [true , 'Description of Request Type should be provided and cannot be empty.'] ,	

'minlength' : [1 , 'Description of Request Type cannot be less than 1 character in length.'] ,

'maxlength' : [200 , 'Description of Request Type cannot be greater than 200 characters in length.'] 

} ,

'author' : {

'type' : Schema.Types.ObjectId , 'ref' : 'User' ,

'required' : [true , 'User ID should be provided and cannot be empty.'] ,

'validate' : {	'validator' : (v) => {
	
	return FKHelper.primaryKey(mongoose.model('User') , v );	} ,

'message' : `User ID reference doesn't exists in the record or is not available.`	}	

} ,

'status' : {

'type' : String , 'required' : false , 'default' : 'Active' ,

'enum' : ['Active' , 'Hidden']	

} ,

'num' : {

'type' : Number , 'immutable' : true , 'default' : () => parseInt(Date.now() + Math.random() * 100000000) ,

'maxlength' : [200 , 'Number of Request Type cannot be greater than 200 characters in length.'] ,	

} ,

'shortCode' : {

'type' : String ,

'required' : [true , 'Short Code of Request Type should be provided and cannot be empty.'] ,

'minlength' : [1 , 'Short Code of Request Type cannot be less than 1 character in length.'] ,

'maxlength' : [15 , 'Short Code of Request Type cannot be greater than 15 characters in length.'] 

} ,

'secondaryKey' : {

'type' : mongoose.Types.ObjectId , 'default' : () => new mongoose.Types.ObjectId() ,

'required' : [true , 'Secondary Key of Request Type should be provided and cannot be empty.'] ,	

'minlength' : [1 , 'Secondary Key of Request Type cannot be less than 1 character in length.'] ,

'maxlength' : [30 , 'Secondary Key of Request Type cannot be greater than 30 characters in length.'] 

} 

} ,	modelCtrl.schemaOptions);

requestTypeSchema.pre('save', function (next) {

	this.shortCode = shortid.generate();
		
		return next();		});

mongoose.set('runValidators' , true);

module.exports = mongoose.model('RequestType' , requestTypeSchema , 'requesttypes');