var router = require('express').Router() , mongoose = require('mongoose') , cUser = require('../config/confirm-user');

const $Model = mongoose.model('Payment');

const opt = {

	'$Model' : $Model ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] 

};


const payment = require('../controllers/payment')(opt);


router
			.get('/add'					, 		cUser.roleType([...opt.normalPrivilege]) , cUser.isOk);


router
			.post('/initialize-transaction'					, 		cUser.roleType([...opt.normalPrivilege]) , payment.initializeTransaction);

router
			.get('/verify-transaction'					, 		cUser.roleType([...opt.normalPrivilege]) , payment.verifyTransaction);

router
			.post('/refund-transaction'					, 		cUser.roleType([...opt.superPrivilege]) , payment.refundTransaction);



router
			.post('/create'						, 

						cUser.roleType([...opt.normalPrivilege]) ,

						payment.entryAdd);

module.exports = router;