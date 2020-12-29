module.exports = {

		'primaryKey' : ($Model , id) => {

	return new Promise((resolve , reject) => {

		$Model.findOne({'_id': id }).collation({ 'locale' : 'en_US' , 'strength' : 2})

			.lean({})

			.select('_id')

			.exec((err , result) => {

					if (result) {			return resolve(true);		}

								else {			return resolve(false);	} 		});		});
	} ,

		'secondaryKey' : ($Model , slug) => {

	return new Promise((resolve , reject) => {

		$Model.findOne({'slug' : slug })

			.lean({})

			.select('_id')

			.exec((err , result) => {

					if (result) {			return resolve(true);		}

								else {			return resolve(false);	} 		});		});
	} ,

		'secondaryKey1' : ($Model , slug) => {

	return new Promise((resolve , reject) => {

		$Model.findOne({'slug': slug })

			.lean({})

			.select('_id')

			.exec((err , result) => {
			
					if (result) {			return resolve(true);		}

								else {			return resolve(false);	} 		});		});
	}
}