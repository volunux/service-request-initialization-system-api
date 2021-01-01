const courseRegistration = require('./course-registration');

const internetCredential = require('./internet-credential');

const internetPassword = require('./internet-password');

const emailPassword = require('./email-password');

const schoolResult = require('./school-result');

const requestCredential = require('./request-credential');

const requestLimit = require('./request-limit');

const refund = require('./refund');

const payment = require('./payment');

const thesis = require('./thesis');

const departmentPayment = require('./department-payment');

const facultyPayment = require('./faculty-payment');

const department = require('./department');

const faculty = require('./faculty');

const unit = require('./unit');

const requestType = require('./request-type');

const refundStage = require('./refund-stage');

const level = require('./level');

const country = require('./country');

const comment = require('./comment');

const reply = require('./reply');

const refundComment = require('./refund-comment');

const refundReply = require('./refund-reply');

const upload = require('./upload');

const objectAccess = require('./object');

const authentication = require('./helpers/authentication');

const user = require('./user');

const admin = require('./admin');

const verifyer = require('./authenticate');

const s3 = require('./s3');

const statistics = require('./statistics') , obj = {};

const indexRoute = require('./index') , vAuth = require('../config/verifyAuthentication') , kEncryptor = require('../config/kEncryptor') , entryPublisher = require('../config/entry-publisher') ,

createError = require('http-errors') , config = require('../config/response') , sanitizer = require('../models/sanitizers/sanitizer');

const cUser = require('../config/confirm-user') , privileges = require('../config/privileges');

module.exports = (app) => {

		app.use('/api' 								, authentication );

		app.use('/api' 								, indexRoute );

		app.use('/api' 									,					vAuth.auth , entryPublisher.entryPublisher);

		app.use('/api/course-registration' 			, courseRegistration );

		app.use('/api/internet-credential' 			, internetCredential );

		app.use('/api/internet-password' 				, internetPassword );

		app.use('/api/email-password' 					, emailPassword );
		
		app.use('/api/school-result' 						, schoolResult );
		
		app.use('/api/request-credential' 			, requestCredential );

		app.use('/api/refund' 									, refund );
		
		app.use('/api/payment' 									, payment );

		app.use('/api/thesis' 									, thesis );

		app.use('/api/department-payment' 			, departmentPayment );

		app.use('/api/faculty-payment' 					, facultyPayment );

		app.use('/api/department' 							, cUser.roleType([...privileges.superPrivilege]) , department );

		app.use('/api/faculty' 									, cUser.roleType([...privileges.superPrivilege]) , faculty );

		app.use('/api/unit' 										, cUser.roleType([...privileges.superPrivilege]) , unit );

		app.use('/api/request-type' 						, cUser.roleType([...privileges.superPrivilege]) , requestType );
	
		app.use('/api/request-limit' 						, cUser.roleType([...privileges.superPrivilege]) , requestLimit );

		app.use('/api/refund-stage' 						, cUser.roleType([...privileges.superPrivilege]) , refundStage );
		
		app.use('/api/level' 										, cUser.roleType([...privileges.superPrivilege]) , level );

		app.use('/api/country' 									, cUser.roleType([...privileges.superPrivilege]) , country );

		app.use('/api/comment' 									, cUser.roleType([...privileges.superPrivilege]) , comment );

		app.use('/api/reply' 										, cUser.roleType([...privileges.superPrivilege]) , reply );

		app.use('/api/refund-comment' 					, cUser.roleType([...privileges.superPrivilege]) , refundComment );

		app.use('/api/refund-reply' 						, cUser.roleType([...privileges.superPrivilege]) , refundReply );

		app.use('/api/upload' 									, upload );

		app.use('/api/o' 							, objectAccess );

		app.use('/api/s3'							,			s3);


		app.use('/api/user' 					, user );

		app.use('/api/admin' 					, cUser.roleType(['administrator' , 'superAdministrator']) , admin );

		app.use('/api/authenticate' 	, verifyer );

		app.use('/api/statistics' 		, statistics );

		app.use('/api' , (req , res , next) => {

					next(createError(404));
		});


		app.use('/api' , (err , req , res , next) => {

			console.log(err);

				config.response(res , 404 , {'message' : 'An error has occured. The API url doesn\'t exist'});
		});
}