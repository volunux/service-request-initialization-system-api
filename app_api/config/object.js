var key = '' , params = '' , aws = require('aws-sdk') , s3 = '' , Upload = require('../models/upload') , photoS3 = require('../../app_server/config/buckets/s3/photoS3') , config = require('./response');

aws.config.update(photoS3);

s3 = new aws.S3();

module.exports = {

	'objectDeleteServer' : (objPath) => {

		var pathKey = objPath.split('/') , key = pathKey.pop() , params = {'Bucket' : process.env.object_bucket , 'Key' : key };

			s3.deleteObject(params , (err , deleted) => {

				if (err) { console.log(err) }
				
					else {	Upload.deleteOne({'Key' : key}).exec((err , result) => {

										if (err) { console.log(err); }

											return 'Object successfully deleted.';	});	}	}); 
	} ,

	'deleteMany' : (documents) => { let itemKeys = [] , keysDelete = [];

		documents.forEach((item) => {	itemKeys.push({'Key' : item.key.split('\\').pop() });	});

			params = {'Bucket' : process.env.object_bucket , 'Delete' : {'Objects' : itemKeys	} };

				s3.deleteObjects(params , (err , deleted) => {
					
						if (err) {	console.log(err) }      
					
							else {	Upload.deleteMany({'Key' : {'$in' : itemKeys } })

												.exec((err , result) => {					

														if (err) {	console.log(err);	}

														if (result) {	return 'Objects successfully deleted.';		}		});	 }	}); 
	} ,

	'deleteManyUpload' : (documents) => { let itemKeys = [] , keysDelete = [];

		if (documents.length > 0) {

		itemKeys = documents.map((x) => {

			return {'Key' : x}});

			params = {'Bucket' : process.env.object_bucket , 'Delete' : {'Objects' : documents	} };

				s3.deleteObjects(params , (err , deleted) => {
					
						if (err) {	console.log(err) }      
					
							else { return 'Objects successfully deleted.'			 }	}); }
	} ,

		'objectDeleteClient' : (req , res , next , key) => { let params = {'Bucket' : process.env.object_bucket , 'Key' : key };

			s3.deleteObject(params , (err , deleted) => { if (err) { console.log(err); }

				else {	Upload.deleteOne({'Key' : key})
																								.exec((err , result) => { if (err) { console.log(err);	}

						return config.response(res , 200 , {'message' : 'Object successfully deleted.'})	});		}		}); 
		} 


}