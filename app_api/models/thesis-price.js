var mongoose = require('mongoose') , Schema = mongoose.Schema , shortid = require('shortid');


const FKHelper = require('../helpers/foreign-key-helper') , modelCtrl = require('../helpers/model-ctrl');


var thesisPriceSchema = new Schema({

'price' : {

'type' : Number ,

'required' : [true , 'Price of Thesis should be provided and cannot be empty.'] ,	

'max' : [5000 , 'Price of Thesis cannot exceed 5000.'] ,

'min' : [500 , 'Price of Thesis cannot be less than 500.'] 

} ,

'num' : {

'type' : Number , 'immutable' : true , 'default' : () => parseInt(Date.now() + Math.random() * 100000000) ,

'maxlength' : [200 , 'Number of Thesis cannot be greater than 200 characters in length.'] ,	

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


} ,	modelCtrl.schemaOptions);



module.exports = mongoose.model('ThesisPrice' , thesisPriceSchema);