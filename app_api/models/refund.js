var mongoose = require('mongoose') ,	Schema = mongoose.Schema , slug = require('mongoose-slug-updater') , shortid = require('shortid');

const { v4 : uuidv4 } = require('uuid');


const FKHelper = require('../helpers/foreign-key-helper') , modelCtrl = require('../helpers/model-ctrl');

const fileSchema = new Schema(modelCtrl.fileSchema , modelCtrl.createIdentity);


var refundSchema = new Schema({

'message' : {

'type' : String , 'trim' : true ,	'lowercase' : false , 'set' : modelCtrl.capitalize , 'immutable' : true ,

'required' : [true , 'Message body should be provided and cannot be empty.'] ,

'minlength' : [9 , 'Message body cannot be less than 10 characters in length.']	,

'maxlength' : [500 , 'Message body cannot be greater than 500 characters in length.'] ,

} ,

'documents' : [fileSchema] ,

'letter' : {

'type' : Schema.Types.ObjectId , 'ref' : 'Letter' ,

'validate' : { 'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('Letter') , v );	} ,

'message' : `Letter ID reference doesn't exists in the record or is not available.`	}		} ,

'applicationNumber' : {

'type' : String , 'immutable' : true , 'default' : () => uuidv4() ,

'maxlength' : [200 , 'Application Number cannot be greater than 200 characters in length.'] ,

} ,

'num' : {

'type' : Number , 'immutable' : true , 'default' : () => parseInt(Date.now() + Math.random() * 100000000) ,

'maxlength' : [200 , 'Number of Refund cannot be greater than 200 characters in length.'] ,	

} ,

'author' : {

'type' : Schema.Types.ObjectId , 'ref' : 'User' ,

'required' : [true , 'User ID should be provided and cannot be empty.'] ,

'validate' : {	'validator' : (v) => {
	
	return FKHelper.primaryKey(mongoose.model('User') , v );	} ,

'message' : `User ID reference doesn't exists in the record or is not available.`	}	

} ,

'entryHandler' : {

'type' : Schema.Types.ObjectId , 'ref' : 'User' ,

'validate' : { 'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('User') , v );	} ,

'message' : `User ID reference doesn't exists in the record or is not available.`	}	

} ,

'department' : {

'type' : String ,	'ref' : 'Department' , 

'required' : [true , 'Department ID should be provided and cannot be empty.'] ,

'maxlength' : [150 , 'Department ID cannot be greater than 150 characters in length.'] ,

'validate' : { 'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('Department') , v );	} ,

'message' : `Department ID reference doesn't exists in the record or is not available.`	}		} ,

'faculty' : {	

'type' : String ,	'ref' : 'Faculty' , 

'required' : [true , 'Faculty ID should be provided and cannot be empty.'] ,

'maxlength' : [150 , 'Faculty ID cannot be greater than 150 characters in length.'] ,

'validate' : { 'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('Faculty') , v );		} ,

'message' : `Faculty ID reference doesn't exists in the record or is not available.`	}		} ,

'stage' : {

'type' : String , 'ref' : 'Refund.Stage' ,

'required' : [false , 'Stage ID should be provided and cannot be empty.'] ,

'maxlength' : [30 , 'Stage ID cannot be greater than 30 characters in length.'] ,

'validate' : {	'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('Refund.Stage') , v );	} ,

'message' : `Stage ID reference doesn't exists in the record or is not available.`	}		} ,

'status' : {

'type' : String ,

'enum' : {	'values' : ['Fulfilled' , 'Review' , 'Pending' , 'Update' , 'Rejected' , 'Transferred'] ,

'message' : 'Status should be provided and cannot be empty.'} , 'default' : 'Pending'	} ,

'signature' : [{

'type' : Schema.Types.ObjectId , 'ref' : 'User' , 

'validate' : {	'validator' : (v) => {
	
	return FKHelper.primaryKey(mongoose.model('User') , v );	} ,

'message' : `User ID reference doesn't exists in the record or is not available.`	}		}]	,

'applicationType' : { 'type' : String , 'default' : 'Refund' , 'immutable' : true } ,

'secondaryKey' : { 'type' : String , 'immutable' : true } ,

'slug' : {

'type' : String , 'slug' : 'secondaryKey' , 'slugpaddingSize' : 1 ,

'unique' : `Url for entry should be unique.` ,

'lowercase' : true , 'permanent' : true , 'immutable' : true }

} ,	modelCtrl.schemaOptions);

refundSchema.virtual('timeline' , {

		'ref' : 'Refund.Comment' ,

		'localField' : 'slug' , 

		'foreignField' : 'entrySlug' ,

		'count' : false
});

mongoose.Schema.Types.Boolean.cast(v => {
	
	if (v === '' || v === false) {
		
			return false;
	}
			return v;
});

refundSchema.pre('save', function (next) {

	this.secondaryKey = shortid.generate();
		
		return next();		});


refundSchema.post('save' , modelCtrl.uniqueAndCast);

refundSchema.post('update' , modelCtrl.uniqueAndCast);

refundSchema.post('findOneAndUpdate' , modelCtrl.uniqueAndCast);

refundSchema.post('insertMany' , modelCtrl.uniqueAndCast);

refundSchema.post('findOne' , modelCtrl.uniqueAndCast);

refundSchema.post('find' , modelCtrl.uniqueAndCast);

refundSchema.plugin(slug , modelCtrl.slugOptions);



refundSchema.index({'author' : 1});

refundSchema.index({'applicationNumber' : 1});

refundSchema.index({'author' : 1 , 'faculty' : 1});

refundSchema.index({'author' : 1 , 'department' : 1});

refundSchema.index({'faculty' : 1});

refundSchema.index({'department' : 1});

refundSchema.index({'author' : 1 , 'stage' : 1});

refundSchema.index({'author' : 1 , 'status' : 1});

refundSchema.index({'status' : 1});


mongoose.set('runValidators' , true);


module.exports = mongoose.model('Refund' , refundSchema , 'refunds');