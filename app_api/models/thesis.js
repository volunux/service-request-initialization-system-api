var mongoose = require('mongoose') , Schema = mongoose.Schema;

const FKHelper = require('../helpers/foreign-key-helper') , modelCtrl = require('../helpers/model-ctrl');

const fileSchema = new Schema(modelCtrl.fileSchema , modelCtrl.createIdentity);


var thesisSchema = new Schema({

	'authorName' : {

'type' : String ,

'required' : [true , 'Author Name of Thesis should be provided and cannot be empty.'] ,	

'minlength' : [1 , 'Author Name of Thesis cannot be less than 1 character in length.'] ,

'maxlength' : [200 , 'Author Name of Thesis cannot be greater than 200 characters in length.'] 

} ,

'title' : {

'type' : String ,

'required' : [true , 'Title of Thesis should be provided and cannot be empty.'] ,	

'minlength' : [1 , 'Title of Thesis cannot be less than 1 character in length.'] ,

'maxlength' : [200 , 'Title of Thesis cannot be greater than 200 characters in length.'] 

} ,

'datePublished' : {

'type' : String ,

'required' : [true , 'Publication Date of Thesis should be provided and cannot be empty.'] ,	

} ,

'faculty' : {	
							
'type' : String ,	'ref' : 'Faculty' ,

'required' : [true , 'Faculty ID for Department should be provided and cannot be empty.'] ,

'maxlength' : [150 , 'Faculty cannot be greater than 150 characters in length.'] ,

'minlength' : [1 , 'Faculty cannot be less than 1 character in length.'] ,

'validate' : {

	'validator' : (v) => {

		return FKHelper.primaryKey(mongoose.model('Faculty') , v );	} ,

'message' : `Faculty ID reference doesn't exists in the record or is not available.`

}	} ,

'department' : {	
							
'type' : String ,	'ref' : 'Department' ,

'required' : [true , 'Department ID for Department should be provided and cannot be empty.'] ,

'maxlength' : [150 , 'Department cannot be greater than 150 characters in length.'] ,

'minlength' : [1 , 'Department cannot be less than 1 character in length.'] ,

'validate' : {

	'validator' : (v) => {

		return FKHelper.primaryKey(mongoose.model('Department') , v );	} ,

'message' : `Department ID reference doesn't exists in the record or is not available.`

}	} ,

'authorName' : String , 

'num' : {

'type' : Number , 'immutable' : true , 'default' : () => parseInt(Date.now() + Math.random() * 100000000) ,

'maxlength' : [200 , 'Number of Thesis cannot be greater than 200 characters in length.'] ,	

} ,

'description' : {
	
'type' : String , 'trim' : true ,

'required' : [true , `Description of Thesis should be provided and cannot be empty.`] ,

'minlength' : [9 , `Description of Thesis cannot be less than 10 characters in length.`]	,

'maxlength' : [4000 , `Description of Thesis cannot be greater than 4000 characters in length.`] ,

} ,

'author' : {

'type' : Schema.Types.ObjectId , 'ref' : 'User' ,

'required' : [true , 'User ID should be provided and cannot be empty.'] ,

'validate' : {

'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('User') , v );	} ,

	'message' : `User ID reference doesn't exists in the record or is not available.`	}		} ,

'status' : {

'type' : String , 'required' : false , 'default' : 'Active' ,

'enum' : ['Active' , 'Hidden']	

} ,

'document' : fileSchema ,

} ,	modelCtrl.schemaOptions);



module.exports = mongoose.model('Thesis' , thesisSchema);