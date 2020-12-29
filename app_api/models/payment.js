var mongoose = require('mongoose') ,	Schema = mongoose.Schema , slug = require('mongoose-slug-updater');


const FKHelper = require('../helpers/foreign-key-helper') , modelCtrl = require('../helpers/model-ctrl');

module.exports = function(ModelType , ModelTypeL) {

var paymentSchema = new Schema({

'fullName' : {

'type' : String , 'trim' : true ,	'lowercase' : false , 'set' : modelCtrl.turnCapitalize , 'default' : 'Yusuf Musa Yusuf' ,

'required' : [true , 'Full Name of User should be provided and cannot be empty.'] ,

'minlength' : [3 , 'Full Name of User cannot be less than 4 characters in length.'] ,

'maxlength' : [40 , 'Full Name of User cannot be greater than 40 characters in length.']

} ,

'emailAddress' : {

'type' : String , 'trim' : true ,	'lowercase' : true ,

'required' : [true , 'Email Address of User should be provided and cannot be empty.'] ,

'minlength' : [3 , 'Email Address of User cannot be less than 4 characters in length.'] ,

'maxlength' : [40 , 'Email Address of User cannot be greater than 40 characters in length.']

} ,

'phoneNumber' : {

'type' : String , 'trim' : true ,	'lowercase' : true ,

'required' : [true , 'Phone Number of User should be provided and cannot be empty.'] ,

'minlength' : [10 , 'Phone Number of User cannot be less than 10 characters in length.'] ,

'maxlength' : [15 , 'Phone Number of User cannot be greater than 15 characters in length.']

} ,

'amount' : {

'type' : String , 'trim' : true ,	'lowercase' : true ,

'required' : [true , 'Amount paid by User should be provided and cannot be empty.'] ,

'minlength' : [3 , 'Amount paid by User cannot be less than 4 characters in length.'] ,

'maxlength' : [11 , 'Amount paid by User cannot be greater than 11 characters in length.']

} ,

'department' : {

'type' : String ,	'ref' : 'Department' , 

'required' : [true , 'Department ID should be provided and cannot be empty.'] ,

'maxlength' : [150 , 'Department ID cannot be greater than 150 characters in length.'] ,

'validate' : { 'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('Department') , v );		} ,

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

'paymentReference' : {

'type' : String , 'trim' : true ,	'lowercase' : false ,

'required' : [true , 'Payment Reference of Transaction should be provided and cannot be empty.'] ,

'minlength' : [3 , 'Payment Reference of Transaction cannot be less than 4 characters in length.'] ,

'maxlength' : [28 , 'Payment Reference of Transaction cannot be greater than 28 characters in length.']

} ,

'paymentType' : {

'type' : String , 'trim' : true ,	'lowercase' : true ,

'required' : [true , 'Payment Type should be provided and cannot be empty.'] ,

'minlength' : [1 , 'Payment Type cannot be less than 2 characters in length.'] ,

'maxlength' : [15 , 'Payment Type cannot be greater than 15 characters in length.']

} ,

'description' : {

'type' : String , 'trim' : true ,	'lowercase' : false , 'set' : modelCtrl.turnCapitalize ,

'required' : [true , 'Description of Payment should be provided and cannot be empty.'] ,

'minlength' : [3 , 'Description of Payment cannot be less than 4 characters in length.'] ,

'maxlength' : [100 , 'Description of Payment cannot be greater than 100 characters in length.']

} ,

'num' : {

'type' : Number , 'immutable' : true , 'default' : () => parseInt(Date.now() + Math.random() * 100000000) ,

'maxlength' : [200 , 'Number of General Request cannot be greater than 200 characters in length.'] ,	

} ,

'author' : {

'type' : Schema.Types.ObjectId , 'ref' : 'User' ,

'required' : [true , 'User ID should be provided and cannot be empty.'] ,

'validate' : {	'validator' : (v) => {
	
	return FKHelper.primaryKey(mongoose.model('User') , v );	} ,

'message' : `User ID reference doesn't exists in the record or is not available.`	}	

} ,

'paidOn' : { 'type' : String , 'required': true } ,

'status' : { 'type' : String , 'default' : 'success' ,

'enum' : { 'values' : ['success' , 'failed'] , 'message' : 'Status is required.'} } ,

'refunded' : { 'type' : Boolean } ,

'secondaryNumber' : { 'type' : String , 'required': false } ,

} ,	modelCtrl.schemaOptions);


mongoose.Schema.Types.Boolean.cast(v => {
	
	if (v === '' || v === false) {
		
			return false;
	}
			return v;
});


paymentSchema.post('save' , modelCtrl.uniqueAndCast);

paymentSchema.post('update' , modelCtrl.uniqueAndCast);

paymentSchema.post('findOneAndUpdate' , modelCtrl.uniqueAndCast);

paymentSchema.post('insertMany' , modelCtrl.uniqueAndCast);

paymentSchema.post('findOne' , modelCtrl.uniqueAndCast);

paymentSchema.post('find' , modelCtrl.uniqueAndCast);


paymentSchema.index({'paymentReference' : 1});

paymentSchema.index({'paymentReference' : 1 , 'department' : 1});

paymentSchema.index({'paymentReference' : 1 , 'faculty' : 1});

paymentSchema.index({'createdAt' : 1});

paymentSchema.index({'author' : 1 , 'paymentType' : 1});

paymentSchema.index({'author' : 1 , 'paymentReference' : 1});

paymentSchema.index({'paymentType' : 1});

paymentSchema.index({'paymentType' : 1 , 'department' : 1});

paymentSchema.index({'paymentType' : 1 , 'faculty' : 1});

paymentSchema.index({'department' : 1});

paymentSchema.index({'faculty' : 1});


paymentSchema.plugin(slug , modelCtrl.slugOptions);

mongoose.set('runValidators' , true);

	return mongoose.model(ModelType , paymentSchema , ModelTypeL);

}