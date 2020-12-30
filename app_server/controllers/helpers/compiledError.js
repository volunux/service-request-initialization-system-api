module.exports = {

	'formAdd' : (err , errors) => {	var listErrors = err.response.data;

			for (var error in listErrors) {	errors.push(listErrors[error]);	}
	
	} ,

	'formAdd2' : (err , errors) => { let message = err.response.data.message;

			errors.push({'message' : message })
	
	}

}