var mongoose = require('mongoose') ,	Schema = mongoose.Schema;

const FKHelper = require('../helpers/foreign-key-helper') , modelCtrl = require('../helpers/model-ctrl');

var unitSchema = new Schema({

'_id' : { 'type' : String } ,

'name' : {

'type' : String ,

'required' : [true , 'Name of Unit should be provided and cannot be empty.'] ,	

'minlength' : [1 , 'Name of Unit cannot be less than 1 character in length.'] ,

'maxlength' : [150 , 'Name of Unit cannot be greater than 150 characters in length.'] 

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

'maxlength' : [200 , 'Number of Unit cannot be greater than 200 characters in length.'] ,	

} ,

'shortCode' : {

'type' : String ,

'required' : [true , 'Short Code of Unit should be provided and cannot be empty.'] ,	

'minlength' : [1 , 'Short Code of Unit cannot be less than 1 character in length.'] ,

'maxlength' : [15 , 'Short Code of Unit cannot be greater than 15 characters in length.'] 

} ,

'secondaryKey' : {

'type' : mongoose.Types.ObjectId , 'default' : () => new mongoose.Types.ObjectId() ,

'required' : [true , 'Secondary Key of Unit should be provided and cannot be empty.'] ,	

'minlength' : [1 , 'Secondary Key of Unit cannot be less than 1 character in length.'] ,

'maxlength' : [30 , 'Secondary Key of Unit Type cannot be greater than 30 characters in length.'] 

} 

} ,	modelCtrl.schemaOptions);

mongoose.set('runValidators' , true);

module.exports = mongoose.model('Unit' , unitSchema , 'units');