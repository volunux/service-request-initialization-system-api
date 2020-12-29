var mongoose = require('mongoose') ,	Schema = mongoose.Schema , slug = require('mongoose-slug-updater') , shortid = require('shortid');


const FKHelper = require('../../helpers/foreign-key-helper') , modelCtrl = require('../../helpers/model-ctrl');


module.exports = function(ModelType , ModelTypeL , collectionName , modelCompiled) {

var commentSchema = new Schema({
																
'author' : {

'type' : Schema.Types.ObjectId , 'ref' : 'User' , 'permanent' : true , 'immutable' : true ,

'required' : [true , `User ID for ${ModelTypeL} should be provided and cannot be empty.`] ,

'validate' : { 'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('User') , v );	} ,

'message' : `User ID reference doesn't exists in the record or is not available.`		}		} ,

'entryHandler' : {

'type' : Schema.Types.ObjectId , 'ref' : 'User' , 'permanent' : true , 'immutable' : true ,

'validate' : {	'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('User') , v );	} ,

'message' : `User ID reference doesn't exists in the record or is not available.`	}		} ,
				
'text' : {	'type' : String ,	

'required' : [true , `Comment text should be provided and cannot be empty.`] ,

'minlength' : [9 , 'Comment text cannot be less than 10 characters in length.']	,
											
'maxlength' : [500 , `Comment text cannot be greater than 500 characters in length.`] 	} ,	

'stage' : {

'type' : String , 'ref' : `${ModelType}.Stage` , 'permanent' : true , 'immutable' : true ,

'validate' : { 'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model(`${ModelType}.Stage`) , v );	} ,

'message' : `Stage ID reference doesn't exists in the record or is not available.`	}		} ,

'unit' : {

'type' : String , 'ref' : 'Unit' , 'permanent' : true , 'immutable' : true ,

'validate' : { 'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('Unit') , v );	} ,

'message' : `Unit ID reference doesn't exists in the record or is not available.`	}		} ,

'transferredTo' : {

'type' : String , 'ref' : 'Unit' , 'permanent' : true , 'immutable' : true ,

'validate' : { 'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('Unit') , v );	} ,

'message' : `Unit ID reference doesn't exists in the record or is not available.`	}		} ,

'entrySlug' :  {

'type' : String , 'permanent' : true , 'immutable' : true ,

'required' : [true , `Entry slug for ${ModelTypeL} should be provided and cannot be empty.`] ,

'maxlength' : [120 , `Entry slug cannot be greater than 120 characters in length.`] ,

'validate' : { 'validator' : (v) => {

	return FKHelper.secondaryKey(mongoose.model(ModelType) , v );		} ,

'message' : `Entry slug reference doesn't exists in the record or is not available.`	}		} ,

'status' : {

'type' : String , 

'enum' : { 'values' : ['Fulfilled' , 'Review' , 'Pending' , 'Update' , 'Rejected' , 'Transferred'] ,

'message' : 'Status is required.'} , 'default' : 'Pending'	} ,

'num' : {

'type' : Number , 'immutable' : true , 'default' : () => parseInt(Date.now() + Math.random() * 100000000) ,

'maxlength' : [200 , 'Number of Country cannot be greater than 200 characters in length.'] ,	

} ,

'secondaryKey' : { 'type' : String , 'immutable' : true } ,

'slug' : {

'type' : String , 'slug' : 'secondaryKey' , 'slugpaddingSize' : 1 ,

'unique' : `Url for entry should be unique.` ,

'lowercase' : true , 'permanent' : true , 'immutable' : true }

	} , modelCtrl.schemaOptions);


commentSchema.virtual('entry' , {

		'ref' : `${ModelType}` ,

		'localField' : 'entrySlug' ,

		'foreignField' : 'slug' ,

		'justOne' : true

});

commentSchema.virtual('replies' , {

		'ref' : `${ModelType}.Reply` ,

		'localField' : 'slug' ,

		'foreignField' : 'commentSlug' ,

		'justOne' : false

});

commentSchema.pre('save', function (next) {

	this.secondaryKey = shortid.generate();
		
		return next();		});

commentSchema.post('findOne' , modelCtrl.uniqueAndCast);

commentSchema.post('find' , modelCtrl.uniqueAndCast);

commentSchema.post('findOneAndUpdate' , modelCtrl.uniqueAndCast);

commentSchema.plugin(slug , modelCtrl.slugOptions);



commentSchema.index({'status' : 1});

commentSchema.index({'unit' : 1 });

commentSchema.index({'slug' : 1 });

commentSchema.index({'stage' : 1 });

commentSchema.index({'unit' : 1 , 'status' : 1});


mongoose.set('runValidators' , true);

if (modelCompiled) {	return mongoose.model(`${ModelType}.Comment` , commentSchema , `${collectionName}.comments`);	}

};