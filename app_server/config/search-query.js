module.exports = {
	
	'queryType' : (req , res , next) => {

				req.query[req.query.queryType] = req.query.query_value;

				if (req.query.page) {

						req.query.page = req.query.page; }

						delete req.query.query_value;

						delete req.query.queryType;

			return next();

		}

}