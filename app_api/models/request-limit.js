var mongoose = require('mongoose') ,	Schema = mongoose.Schema; 

const FKHelper = require('../helpers/foreign-key-helper') , modelCtrl = require('../helpers/model-ctrl');

var requestTypeSchema = new Schema({

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

'maxlength' : [200 , 'Number of General Request cannot be greater than 200 characters in length.'] ,	

} ,

'numberRemaining' : {

'type' : Number , 'default' : 0 ,

'max' : [3 , 'Request Limit cannot exceed 0 or 3.']		}

} ,	modelCtrl.schemaOptions);

mongoose.set('runValidators' , true);

module.exports = mongoose.model('RequestLimit' , requestTypeSchema , 'requestlimit');