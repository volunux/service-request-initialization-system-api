var router = require('express').Router() , cUser = require('../config/confirm-user') , mongoose = require('mongoose');

let queryType = require('../config/query-type') , searchQuery = require('../config/search-query');

const $Model = mongoose.model('User');

const Unit = mongoose.model('Unit');

const Country = mongoose.model('Country');

const Department = mongoose.model('Department');

const Faculty = mongoose.model('Faculty');

const Level = mongoose.model('Level');

const Upload = mongoose.model('Upload');

const opt = {

	'first' : 'User' ,

	'second' : 'User' ,

	'third' : 'user' ,

	'fourth' : 'user' ,

	'fifth' : 'User' ,

	'$Model' : $Model ,

	'Country' : Country ,

	'Department' : Department ,

	'Faculty' : Faculty ,

	'Unit' : Unit ,

	'Upload' : Upload ,

	'Level' : Level ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

const admin = require('../controllers/admin')(opt);

const general = require('../controllers/general')(opt);

router.get('/confirm-admin' 	, 

						cUser.confirmAdmin([...opt.superPrivilege]));


router.get('/user/:entry/profile' 	, 

						cUser.roleType([...opt.superPrivilege]) ,

						queryType.checkMongoNumber ,

						admin.entryExists);


router.get('/user/entries' 	, 

						cUser.roleType([...opt.superPrivilege]) ,

						searchQuery.userSearch ,

						admin.entries({}));



router.get('/user/account-request' 	, 

						cUser.roleType([...opt.superPrivilege]) ,

						searchQuery.userSearch2 ,

						admin.entries({'status' : 'pending'}) );


router.get('/user/account-request/entry/:entry/detail' 	, 

						cUser.roleType([...opt.superPrivilege]) ,

						queryType.checkMongoNumber ,

						admin.entryRequestDetail)

			.put( cUser.roleType([...opt.superPrivilege]) , 

						queryType.checkMongoNumber ,

						queryType.removeFields(['password' , 'hash' , 'salt' , 'username' , 'emailAddress']) ,

						admin.entryRequestUpdate);




router
			.route('/user/entry/:entry/detail')

			.get( cUser.roleType([...opt.superPrivilege]) , 

						queryType.checkMongoNumber ,

						admin.entryDetail);

router
			.route('/user/entry/:entry/update')

			.get( cUser.roleType([...opt.superPrivilege]) , 

						queryType.checkMongoNumber ,

						admin.entryUpdate)

			.put( cUser.roleType([...opt.superPrivilege]) , 

						queryType.checkMongoNumber ,

						queryType.removeFields(['password' , 'hash' , 'salt' , 'username' , 'emailAddress']) ,

						admin.entryUpdateSubmit);

router
			.route('/user/entry/:entry/delete')

			.get( cUser.roleType('superAdministrator') ,

						queryType.checkMongoNumber , 

						admin.entryDelete)

			.delete( cUser.roleType('superAdministrator') , 

						queryType.checkMongoNumber ,

						admin.entryDeleteSubmit);


router
			.get('/user/add'					, 		cUser.roleType([...opt.superPrivilege]) , admin.entryAdd);

router
			.post('/user/add'					, 

						queryType.checkAllFields ,

						queryType.checkUsernameAndEmail ,

						cUser.roleType([...opt.superPrivilege]) ,

						admin.entryAddSubmit);


router
			.route('/user/:entry/deactivate')

			.get(admin.entryDeactivate)

			.put(admin.entryDeactivateSubmit);


router
			.route('/user/:entry/reactivate')

			.get(admin.entryReactivate)

			.put(admin.entryReactivateSubmit);




router
			.route('/user/entry/many/delete')

			.get(	cUser.isOkAdmin)

			.patch(	general.entryDeleteMany('User'));


router
			.route('/user/delete/entry/all/')

			.get(	cUser.roleType(['superAdministrator']) ,

						general.entryDeleteAll)

			.delete( cUser.roleType(['superAdministrator']) , 

						general.entryDeleteAllSubmit);


module.exports = router;