var mongoose = require('mongoose');

module.exports = {

		'sessionSecret' : 'aSecret' ,

		'id' : mongoose.Types.ObjectId ,

		'buildBreadcrumb' : (req , res , next) => {

					zu = ''

					var pathU = req.url.split('/');

					var lastU = pathU[pathU.length - 1];

					if (lastU == '') {

						pathU.pop(); }

						var myPath = pathU.map((path , i) => {

						if (path == '') {

							zu = '';

							return {

					 			 'label' : 'Home' ,			

						 		 'url' : '/'	    }	}

						var label1 = `${path[0].toUpperCase()}${path.slice(1)}`;

						var path1 =  `${zu}/${path}`;

						zu = path1;	
						

							return {

								'label' : label1 ,

								'url' : path1	}				

						});		

							res.locals.breadcrumb = myPath;

							return next();

	}

}