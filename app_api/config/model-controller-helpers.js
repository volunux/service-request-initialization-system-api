module.exports = {

	'setStatus' : function(field) {

			let newField = ('' + field).toLowerCase().replace(/\s+/g , '')

			return newField == 'fulfilled' || newField == 'update' || newField == 'rejected' || newField == 'review' 

						|| newField == 'transferred' || newField == 'pending' ? `${newField.charAt(0).toUpperCase()}${newField.slice(1).toLowerCase()}` : undefined;
	} ,

	'setTransfer' : function(field) {

			let newField = String(field).replace(/\s+/g , ' ').split(' ').map((name) => {

					return name == 'and' ? name : name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();		})

				return newField.join(' ')
	} ,

	'capitalize' : function(field) {

		return field ? `${field.charAt(0).toUpperCase()}${field.slice(1)}` : '';
	
	} ,

	'turnCapitalize' : function (val) {

	if (typeof val !== 'string') {	val = ''; }
	
		return val.split(' ')

							.map((n) => {	return n.charAt(0).toUpperCase() + n.substring(1).toLowerCase();	}).join(' ');
	} ,

	'uniqueAndCast' : function (err , doc , next) {

		if (err.name == 'CastError') {

			var validationError = new mongoose.Error.ValidationError(null);
				
				validationError.addError('field', new mongoose.Error.ValidatorError({ 'message' : 'Please provide a valid id or value and try again.' })); 
		
						return next(validationError);		}

		else if (err.code === 11000 && err.name === 'MongoError') {
													
						return next(new Error('All fields parameters must be unique and try again.'));		 }
						
		else if (err.code == 2) {
		
				var validationError = new mongoose.Error.ValidationError(null);
					
					validationError.addError('field', new mongoose.Error.ValidatorError({ 'message' : 'An error has occured. Please try again.' })); 
			
						return next(validationError);		}
		else {
						return next(err)		}
	} ,

	'slugOptions' : {

		'separator' : '' , 'symbols' : false , 'uric' : false , 'lang' : 'en' , 'truncate' : 120 , 'backwardCompatible' : true ,

		'custom' : {

			'and' : '' , 'usd' : '' , 'the' : '' , 'then' : '' , 'them' : '' , 'they' : '' ,

			'is' : '' , 'am' : '', 'i' : '' , 'we' : '' , 'what' : '' , 'amp' : '' ,

			'or' : '' , '$' : '' , 'x2f' : '' , 'x27' : '' , 'x5c' : '' , 'quot' : '' , 'lt' : '' , 'gt' : '' , '_' : '' , '-' : ''		} 
	} ,

	'fileSchema' : {

		'filename' : {	'type' : String	} ,

		'path' : String , 'mimetype' : String , 'encoding' :  String ,
		
		'Location' : String , 'Key' : String , 'location' : String ,

		'key' : String , 'size' : Number 

	} , 

	'createIdentity' : { 

		'_id' : false

	} ,

	'schemaOptions' : {

		'toObject' : { 'virtuals' : true 	} ,

		'toJSON' : { 'virtuals' : true 	} ,

		'collation' : {	'locale' : 'en_US' , 'strength' : 2	} ,
						
		'getters' : true , 'id' : false , 'selectedPopulatedPaths' : false ,

		'timestamps' : { 'createdAt' : 'createdAt' , 'updatedAt' : 'updatedAt' } ,

		'collation' : { 'locale' : 'en_US' , 'strength' : 2 } 

	}

}