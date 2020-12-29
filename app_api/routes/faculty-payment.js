const router = require('express').Router() , mongoose = require('mongoose');

const cUser = require('../config/confirm-user') , searchQuery = require('../config/search-query') , queryType = require('../config/query-type');

const $Model = mongoose.model('Payment');


const opt = {

	'first' : 'FacultyPayment' ,

	'second' : 'Faculty Payment' ,

	'third' : 'faculty-payment' ,

	'fourth' : 'facultyPayment' ,

	'$Model' : $Model ,

	'paymentType' : 'faculty' ,

	'normalPrivilege' : ['facultyPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'otherPrivilege' : ['hod' , 'dean' , 'staff'] ,

	'otherPrivilege2' : ['staff' , 'hod' , 'dean' ] ,

	'leastPrivilege' : ['staff' , 'hod' , 'dean'] ,

};

const entryCtrl = require('../controllers/faculty-department-payment')(opt);

const general = require('../controllers/general')(opt);

const general2 = require('../controllers/general-two')(opt);

router.get('/entries' , 

						cUser.roleType(['student' , ...opt.normalPrivilege , ...opt.otherPrivilege , ...opt.superPrivilege]) ,

						queryType.queryByType('Faculty' , ['student' , ...opt.normalPrivilege] , [...opt.superPrivilege] , opt.otherPrivilege2) ,

						searchQuery.finalPaymentSearchQueryFilter ,

						searchQuery.searchFactPaymentByReference('Faculty' , ['student' , ...opt.normalPrivilege] , [...opt.superPrivilege] , opt.otherPrivilege2) ,

						searchQuery.searchFactPaymentByStatus('Faculty' , ['student' , ...opt.normalPrivilege] , [...opt.superPrivilege] , opt.otherPrivilege2) ,

						searchQuery.searchFactPaymentByDepartment('Faculty' , ['student' , ...opt.normalPrivilege] , [...opt.superPrivilege] , opt.otherPrivilege2) ,

						searchQuery.finalPaymentQuery ,

						queryType.removeEmptyFilters ,

						general2.entries('paymentReference amount fullName department paidOn status _id'));


router.get('/entries/refunded' ,

						cUser.roleType([...opt.normalPrivilege , ...opt.superPrivilege]) ,

						queryType.queryByTypeRefund('Faculty' , [...opt.normalPrivilege , ...opt.superPrivilege]) ,

						queryType.queryPaymentByUnitRefund('Faculty') ,

						queryType.removeEmptyFilters ,

						general2.entries('paymentReference amount fullName department paidOn status _id'));

router
			.get('/add'					, 		cUser.roleType(['student' , ...opt.normalPrivilege]) , entryCtrl.checkPayment);


router
			.route('/entry/:entry')

			.get(cUser.roleType(['student' , ...opt.normalPrivilege , ...opt.otherPrivilege , ...opt.superPrivilege]) , 

						entryCtrl.entryDetail)

			.put( cUser.roleType(['staff' , ...opt.superPrivilege]) , 

						cUser.isOwner4($Model , opt.second , opt.fourth , opt.normalPrivilege , opt.leastPrivilege) , 

						entryCtrl.entryUpdate);


router
			.route('/entry/:entry/refund')

			.put( cUser.roleType([...opt.normalPrivilege , ...opt.superPrivilege]) , 

						cUser.isOwner5($Model , opt.second , opt.fourth , opt.normalPrivilege , opt.leastPrivilege) , 

						entryCtrl.entryUpdateRefund);





router
			.route('/entry/many/delete')

			.get(	cUser.isOkAdmin)

			.patch(	general.entryDeleteMany('Faculty Fee'));


router
			.route('/delete/entry/all/')

			.get(	cUser.roleType(['superAdministrator']) ,

						general.entryDeleteAll)

			.delete( cUser.roleType(['superAdministrator']) , 

						general.entryDeleteAllSubmit);


module.exports = router;