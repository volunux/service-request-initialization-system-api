var mongoose = require('mongoose') ,	Schema = mongoose.Schema , slug = require('mongoose-slug-updater') , shortid = require('shortid');


const FKHelper = require('../../helpers/foreign-key-helper') , modelCtrl = require('../../helpers/model-ctrl');


module.exports = function(ModelType , ModelTypeL , collectionName , modelCompiled) {

var replySchema = new Schema({

'author' : {

'type' : Schema.Types.ObjectId , 'ref' : 'User' , 'permanent' : true , 'immutable' : true ,

'required' : [true , 'User ID should be provided and cannot be empty.'] ,

'validate' : {	'validator' : (v) => {
	
	return FKHelper.primaryKey(mongoose.model('User') , v );	} ,

'message' : `User ID reference doesn't exists in the record or is not available.`	}		} ,

'entryHandler' : {

'type' : Schema.Types.ObjectId , 'ref' : 'User' , 'permanent' : true , 'immutable' : true ,

'validate' : {	'validator' : (v) => {

	return FKHelper.primaryKey(mongoose.model('User') , v );	} ,

'message' : `User ID reference doesn't exists in the record or is not available.`	}		} ,

'text' : {	'type' : String ,	

'required' : [true , `Comment text should be provided and cannot be empty.`] ,

'minlength' : [9 , 'Comment text cannot be less than 10 characters in length.']	,
											
'maxlength' : [500 , `Comment text cannot be greater than 500 characters in length.`] 

} ,	

'commentAuthorName' : {	'type' : String ,	'permanent' : true , 'immutable' : true ,

'maxlength' : [150 , `Comment Author Name cannot be greater than 150 characters in length.`] 	} ,	

'entrySlug' :  {

'type' : String , 'permanent' : true , 'immutable' : true ,
				
'required' : [true , `Entry slug for ${ModelType} should be provided and cannot be empty.`] ,

'maxlength' : [120 , `Entry slug cannot be greater than 120 characters in length.`] ,

'validate' : { 'validator' : (v) => {

	return FKHelper.secondaryKey(mongoose.model(ModelType) , v );		} ,

'message' : `Entry slug reference doesn't exists in the record or is not available.`	}		} ,

'commentSlug' :  {

'type' : String , 'permanent' : true , 'immutable' : true ,

'required' : [true , `Comment slug for ${ModelType} should be provided and cannot be empty.`] ,

'maxlength' : [120 , `Comment slug cannot be greater than 120 characters in length.`] ,

'validate' : { 'validator' : (v) => {
	
	return FKHelper.secondaryKey1(mongoose.model(`${ModelType}.Comment`) , v );		} ,

'message' : `Entry slug reference doesn't exists in the record or is not available.`	}		} ,

'secondaryKey' : { 'type' : String , 'immutable' : true , 'permanent' : true } ,

'slug' : {

'type' : String , 'slug' : 'secondaryKey' , 'slugpaddingSize' : 1 ,

'unique' : 'Url for entry should be unique.' ,

 'lowercase' : true , 'permanent' : true , 'immutable' : true }

} , modelCtrl.schemaOptions);



replySchema.virtual('entry' , {

		'ref' : ModelType ,

		'localField' : 'entrySlug' ,

		'foreignField' : 'slug' ,

		'justOne' : true

});

replySchema.virtual('comment' , {

		'ref' : `${ModelType}.Comment` ,

		'localField' : 'commentSlug' ,

		'foreignField' : 'slug' ,

		'justOne' : true

});


replySchema.pre('save', function (next) {

	this.secondaryKey = shortid.generate();
		
	return next();		});

replySchema.post('findOne' , modelCtrl.uniqueAndCast);

replySchema.post('find' , modelCtrl.uniqueAndCast);

replySchema.post('findOneAndUpdate' , modelCtrl.uniqueAndCast);

replySchema.plugin(slug , modelCtrl.slugOptions);



replySchema.index({'entrySlug' : 1});

replySchema.index({'slug' : 1 });


mongoose.set('runValidators' , true);

if (modelCompiled) {	return mongoose.model(`${ModelType}.Reply` , replySchema , `${collectionName}.replies`);	}

}