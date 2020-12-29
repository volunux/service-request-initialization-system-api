var mongoose = require('mongoose') ,	Schema = mongoose.Schema , slug = require('mongoose-slug-updater') , shortid = require('shortid');

const { v4 : uuidv4 } = require('uuid');


const FKHelper = require('../helpers/foreign-key-helper') , modelCtrl = require('../helpers/model-ctrl');

const fileSchema = new Schema(modelCtrl.fileSchema , modelCtrl.createIdentity);


module.exports = function(ModelType , ModelTypeL) {

let requestSchema = new Schema({

'message' : {

'type' : String , 'trim' : true ,	'lowercase' : false , 'set' : modelCtrl.capitalize , 'immutable' : true ,

'required' : [true , 'Message body should be provided and cannot be empty.'] ,

'minlength' : [9 , 'Message body cannot be less than 10 characters in length.']	,

'maxlength' : [500 , 'Message body cannot be greater than 500 characters in length.'] ,

} ,

'requestUsername' : {

'type' : String , 'trim' : true ,	'lowercase' : false ,

'minlength' : [4 , 'Username cannot be less than 5 characters in length.']	,

'maxlength' : [100 , 'Username cannot be greater than 100 characters in length.'] ,

} ,

'requestPassword' : {

'type' : String ,

'minlength' : [4 , 'Password cannot be less than 5 characters in length.']	,

'maxlength' : [100 , 'Password cannot be greater than 100 characters in length.'] ,

} ,

'documents' : [fileSchema] ,

'requestType' : {

'type' : String , 'ref' : 'RequestType' ,

'required' : [true , 'Request Type ID should be provided and cannot be empty.'] ,

'minlength' : [1 , 'Request Type ID cannot be less than 1 characters in length.']	,

'maxlength' : [200 , 'Request Type ID cannot be greater than 200 characters in length.'] ,

'validate' : {	'validator' : (v) => {
	
	return FKHelper.primaryKey(mongoose.model('RequestType') , v );	} ,

'message' : `Request Type ID reference doesn't exists in the record or is not available.`	}	

} ,

'applicationNumber' : {

'type' : String , 'immutable' : true , 'default' : () => uuidv4() ,

'maxlength' : [200 , 'Application Number cannot be greater than 200 characters in length.'] ,

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

'entryHandler' : {

'type' : Schema.Types.ObjectId , 'ref' : 'User' ,

'validate' : {	'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('User') , v );		} ,

'message' : `User ID reference doesn't exists in the record or is not available.`	}	

} ,

'unit' : {

'type' : String , 'ref' : 'Unit' ,

'required' : [true , 'Unit ID should be provided and cannot be empty.'] ,

'minlength' : [1 , 'Unit ID cannot be less than 1 characters in length.']	,

'maxlength' : [150 , 'Unit ID cannot be greater than 150 characters in length.'] ,

'validate' : {	'validator' : (v) => {
	
	return FKHelper.primaryKey(mongoose.model('Unit') , v );		} ,

'message' : `Unit ID reference doesn't exists in the record or is not available.`	}	

} ,

'status' : {

'type' : String ,

'enum' : {	'values' : ['Fulfilled' , 'Review' , 'Pending' , 'Update' , 'Rejected' , 'Transferred'] ,

'message' : 'Status should be provided and cannot be empty.'} , 'default' : 'Pending'		

} ,

'secondaryKey' : { 'type' : String , 'immutable' : true } ,

'slug' : {

'type' : String , 'slug' : 'secondaryKey' , 'slugpaddingSize' : 1 ,

'unique' : `Url for entry should be unique.` ,

'lowercase' : true , 'permanent' : true , 'immutable' : true }

} ,	modelCtrl.schemaOptions);

requestSchema.virtual('timeline' , {

		'ref' : `${ModelType}.Comment` ,

		'localField' : 'slug' , 

		'foreignField' : 'entrySlug' ,

		'count' : false
});

mongoose.Schema.Types.Boolean.cast(v => {
	
	if (v === '' || v === false) {	return false;	}

			return v;		});

requestSchema.pre('save', function (next) {

	this.secondaryKey = shortid.generate();
		
		return next();		});


requestSchema.statics.findComment = function(slug) {
		
		return this.model(`${ModelType}.Comment`).findOne({'entry_slug' : slug });
}

requestSchema.statics.findComments = function(slug) {
		
		return this.model(`${ModelType}.Comment`).find({'entry_slug' : slug })
}

requestSchema.statics.findReply = function(slug) {
		
		return this.model(`${ModelType}.Reply`).findOne({'entry_slug' : slug });
}

requestSchema.statics.findReplies = function(slug) {
		
		return this.model(`${ModelType}.Reply`).find({'entry_slug' : slug });
}

requestSchema.statics.deleteComments = function(slug) {
		
		return this.model(`${ModelType}.Comment`).deleteMany({'entry_slug' : slug });
}

requestSchema.statics.deleteReplies = function(slug) {
		
		return this.model(`${ModelType}.Reply`).deleteMany({'entry_slug' : slug });
}



requestSchema.post('save' , modelCtrl.uniqueAndCast);

requestSchema.post('update' , modelCtrl.uniqueAndCast);

requestSchema.post('findOneAndUpdate' , modelCtrl.uniqueAndCast);

requestSchema.post('insertMany' , modelCtrl.uniqueAndCast);

requestSchema.post('findOne' , modelCtrl.uniqueAndCast);

requestSchema.post('find' , modelCtrl.uniqueAndCast);

requestSchema.plugin(slug , modelCtrl.slugOptions);



requestSchema.index({'applicationNumber' : 1 , 'requestType' : 1 });

requestSchema.index({'author' : 1 , 'applicationNumber' : 1});

requestSchema.index({'author' : 1 , 'unit' : 1});

requestSchema.index({'unit' : 1});

requestSchema.index({'author' : 1 , 'requestType' : 1});

requestSchema.index({'requestType' : 1});

requestSchema.index({'requestType' : 1 , 'status' : 1});


mongoose.set('runValidators' , true);

	return mongoose.model(ModelType , requestSchema , ModelTypeL);

}