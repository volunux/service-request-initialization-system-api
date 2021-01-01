var mongoose = require('mongoose') ,	Schema = mongoose.Schema , modelCtrl = require('../helpers/model-ctrl') , objectId = mongoose.Types.ObjectId;


var uploadSchema = new Schema({

'Key' : {

'type' : String , 'maxlength' : 200 , 'required' : true , 'minlength' : 1	} ,

'entryId' :  { 'type' : String ,

'maxlength' : [150 , `Entry Id cannot be greater than 150 characters in length.`]	} ,

'status' : {

'type' : String , 'required' : false , 'default' : 'Active' ,

'enum' : ['Active' , 'Hidden']	

} ,

'num' : {

'type' : Number , 'immutable' : true , 'default' : () => parseInt(Date.now() + Math.random() * 100000000) ,

'maxlength' : [200 , 'Number of Upload cannot be greater than 200 characters in length.'] ,	

} ,

} , modelCtrl.schemaOptions);


module.exports = mongoose.model('Upload' , uploadSchema);