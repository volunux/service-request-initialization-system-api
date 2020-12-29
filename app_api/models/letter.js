var mongoose = require('mongoose') ,	Schema = mongoose.Schema , shortid = require('shortid');


const FKHelper = require('../helpers/foreign-key-helper') , modelCtrl = require('../helpers/model-ctrl');

const fileSchema = new Schema(modelCtrl.fileSchema , modelCtrl.createIdentity);


module.exports = function(ModelType , ModelTypeL) {

var letterSchema = new Schema({

'main_body' : {
	
'type' : String , 'trim' : true ,

'required' : [true , `${ModelType} body should be provided and cannot be empty.`] ,

'minlength' : [9 , `${ModelType} body cannot be less than 10 characters in length.`]	,

'maxlength' : [4000 , `${ModelType} body cannot be greater than 4000 characters in length.`] ,

} ,

'photos' : [fileSchema] ,

'entrySlug' :  {

'type' : String ,

'required' : [true , `Entry slug for ${ModelType} should be provided and cannot be empty.`] ,

'maxlength' : [120 , `Entry slug cannot be greater than 120 characters in length.`] ,

'validate' : { 'validator' : (v) => {

	return FKHelper.secondaryKey(mongoose.model(ModelType) , v );		} ,

'message' : `Entry slug reference doesn't exists in the record or is not available.`	}	

} ,

'num' : {

'type' : Number , 'immutable' : true , 'default' : () => parseInt(Date.now() + Math.random() * 100000000) ,

'maxlength' : [200 , 'Number of Letter cannot be greater than 200 characters in length.'] ,	

} ,

'author' : {

'type' : Schema.Types.ObjectId , 'ref' : 'User' ,

'required' : [true , 'User ID should be provided and cannot be empty.'] ,

'validate' : {	'validator' : (v) => {
	
	return FKHelper.primaryKey(mongoose.model('User') , v );	} ,

'message' : `User ID reference doesn't exists in the record or is not available.`	}	

} ,

'shortCode' : {

'type' : String ,

'minlength' : [1 , 'Short Code of Letter cannot be less than 1 character in length.'] ,

'maxlength' : [30 , 'Short Code of Letter cannot be greater than 30 characters in length.'] 

} 

} ,	modelCtrl.schemaOptions);

letterSchema.pre('save', function (next) {

	this.shortCode = shortid.generate();
		
		return next();		});


mongoose.set('runValidators' , true);

	return mongoose.model('Letter' , letterSchema , 'letters');

}