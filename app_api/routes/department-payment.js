const router = require('express').Router() , mongoose = require('mongoose');

const cUser = require('../config/confirm-user') , searchQuery = require('../config/search-query') , queryType = require('../config/query-type');

const $Model = mongoose.model('Payment');


const opt = {

	'first' : 'DepartmentPayment' ,

	'second' : 'Department Payment' ,

	'third' : 'department-payment' ,

	'fourth' : 'departmentPayment' ,

	'$Model' : $Model ,

	'paymentType' : 'department' ,

	'normalPrivilege' : ['departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'otherPrivilege' : ['hod' , 'dean' , 'staff'] ,

	'otherPrivilege2' : ['staff' , 'hod' , 'dean' ] ,

	'leastPrivilege' : ['staff' , 'hod' , 'dean'] ,

};


const entryCtrl2 = require('../controllers/faculty-department-payment')(opt);

const general = require('../controllers/general')(opt);

const general2 = require('../controllers/general-two')(opt);

router.get('/entries' , 

						cUser.roleType(['student' , ...opt.normalPrivilege , ...opt.otherPrivilege , ...opt.superPrivilege]) ,

						queryType.queryByType('Department' , ['student' , ...opt.normalPrivilege] , [...opt.superPrivilege] , opt.otherPrivilege2) ,

						searchQuery.finalPaymentSearchQueryFilter ,

						searchQuery.searchDeptPaymentByReference('Department' , ['student' , ...opt.normalPrivilege] , [...opt.superPrivilege] , opt.otherPrivilege2) ,

						searchQuery.searchDeptPaymentByStatus('Department' , ['student' , ...opt.normalPrivilege] , [...opt.superPrivilege] , opt.otherPrivilege2) ,

						searchQuery.searchDeptPaymentByDepartment('Department' , ['student' , ...opt.normalPrivilege] , [...opt.superPrivilege] , opt.otherPrivilege2) ,

						searchQuery.finalPaymentQuery ,

						queryType.removeEmptyFilters ,

						general2.entries('paymentReference amount fullName department paidOn num status _id'));


router.get('/entries/refunded' ,

						cUser.roleType([...opt.normalPrivilege , ...opt.superPrivilege]) ,

						queryType.queryByTypeRefund('Department' , [...opt.normalPrivilege , ...opt.superPrivilege]) ,

						queryType.queryPaymentByUnitRefund('Department') ,

						queryType.removeEmptyFilters ,

						general2.entries('paymentReference amount fullName department paidOn num status _id'));

router
			.get('/add'					, 		cUser.roleType(['student' , ...opt.normalPrivilege]) , entryCtrl2.checkPayment);


router
			.route('/entry/:entry')

			.get(cUser.roleType(['student' , ...opt.normalPrivilege , ...opt.otherPrivilege , ...opt.superPrivilege]) , 

						entryCtrl2.entryDetail)

			.put( cUser.roleType(['staff' , ...opt.superPrivilege]) , 

						cUser.isOwner4($Model , opt.second , opt.fourth , opt.normalPrivilege , opt.leastPrivilege) , 

						entryCtrl2.entryUpdate);


router
			.route('/entry/:entry/refund')

			.put( cUser.roleType([...opt.normalPrivilege , ...opt.superPrivilege]) , 

						cUser.isOwner5($Model , opt.second , opt.fourth , opt.normalPrivilege , opt.leastPrivilege) , 

						entryCtrl2.entryUpdateRefund);




router
			.route('/entry/many/delete')

			.get(	cUser.isOkAdmin)

			.patch(	general.entryDeleteMany('Department Fee'));


router
			.route('/delete/entry/all/')

			.get(	cUser.roleType(['superAdministrator']) ,

						general.entryDeleteAll)

			.delete( cUser.roleType(['superAdministrator']) , 

						general.entryDeleteAllSubmit);


module.exports = router;