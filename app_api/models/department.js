var mongoose = require('mongoose') , Schema = mongoose.Schema;


const FKHelper = require('../helpers/foreign-key-helper') , modelCtrl = require('../helpers/model-ctrl');


var departmentSchema = new Schema({
		
'_id' : { 'type' : String } ,

'name' : {

'type' : String ,

'required' : [true , 'Name of Department should be provided and cannot be empty.'] ,	

'minlength' : [1 , 'Name of Department cannot be less than 1 character in length.'] ,

'maxlength' : [150 , 'Name of Department cannot be greater than 150 characters in length.'] 

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
				
'author' : {

'type' : Schema.Types.ObjectId , 'ref' : 'User' ,

'required' : [true , 'User ID should be provided and cannot be empty.'] ,

'validate' : {	'validator' : (v) => {
	
	return FKHelper.primaryKey(mongoose.model('User') , v );	} ,

'message' : `User ID reference doesn't exists in the record or is not available.`	}	

} ,

'num' : {

'type' : Number , 'immutable' : true , 'default' : () => parseInt(Date.now() + Math.random() * 100000000) ,

'maxlength' : [200 , 'Number of Department cannot be greater than 200 characters in length.'] ,	

} ,

'status' : {

'type' : String , 'required' : false , 'default' : 'Active' ,

'enum' : ['Active' , 'Hidden']	

} ,

'shortCode' : {

'type' : String ,

'required' : [true , 'Short Code of Department should be provided and cannot be empty.'] ,

'minlength' : [1 , 'Short Code of Department cannot be less than 1 character in length.'] ,

'maxlength' : [15 , 'Short Code of Department cannot be greater than 15 characters in length.'] 

} ,

'secondaryKey' : {

'type' : mongoose.Types.ObjectId , 'default' : () => new mongoose.Types.ObjectId() ,

'required' : [true , 'Secondary Key of Department should be provided and cannot be empty.'] ,	

'minlength' : [1 , 'Secondary Key of Department cannot be less than 1 character in length.'] ,

'maxlength' : [30 , 'Secondary Key of Department cannot be greater than 30 characters in length.'] 

} 

} ,	modelCtrl.schemaOptions);

mongoose.set('runValidators' , true);

module.exports = mongoose.model('Department' , departmentSchema , 'departments');