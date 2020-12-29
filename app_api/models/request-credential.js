var mongoose = require('mongoose') ,	Schema = mongoose.Schema;


const FKHelper = require('../helpers/foreign-key-helper') , modelCtrl = require('../helpers/model-ctrl');


module.exports = function(ModelType , ModelTypeL) {

let requestSchema = new Schema({

'requestUsername' : {

'type' : String , 'trim' : true ,	'lowercase' : false , 'immutable' : true ,

'minlength' : [3 , 'Request Username cannot be less than 4 characters in length.']	,

'maxlength' : [100 , 'Request Username cannot be greater than 100 characters in length.'] ,

} ,

'requestPassword' : {

'type' : String , 'immutable' : true ,

'minlength' : [3 , 'Request Password cannot be less than 4 characters in length.']	,

'maxlength' : [100 , 'Request Password cannot be greater than 100 characters in length.'] ,

} ,

'num' : {

'type' : Number , 'immutable' : true , 'default' : () => parseInt(Date.now() + Math.random() * 100000000) ,

'maxlength' : [200 , 'Number of Request Credential cannot be greater than 200 characters in length.'] ,	

} ,

'active' : { 'type' : Boolean } ,

'author' : {

'type' : Schema.Types.ObjectId , 'ref' : 'User' ,

'required' : [true , 'User ID should be provided and cannot be empty.'] ,

'validate' : {	'validator' : (v) => {
	
	return FKHelper.primaryKey(mongoose.model('User') , v );	} ,

'message' : `User ID reference doesn't exists in the record or is not available.`	}	

} } ,	modelCtrl.schemaOptions);

mongoose.set('runValidators' , true);

	return mongoose.model(ModelType , requestSchema , ModelTypeL);

}