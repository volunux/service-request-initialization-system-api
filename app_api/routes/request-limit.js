const router = require('express').Router();

const cUser = require('../config/confirm-user');

const sQuery = require('../config/search-query');

const mongoose = require('mongoose');

const $Model = mongoose.model('RequestLimit');

const opt = {

	'first' : 'RequestLimit' ,

	'second' : 'Request Limit' ,

	'third' : 'request-limit' ,

	'fourth' : 'requestLimit' ,

	'fifth' : 'RequestLimit' ,

	'$Model' : $Model ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

const entryCtrl = require('../controllers/request-limit')(opt);

const general = require('../controllers/general')(opt);

const general2 = require('../controllers/general-two')(opt);


router.get('/entries'											, sQuery.finalSearchQueryFilter2 , general2.entries('author numberRemaining status num createdAt _id'));

router.get('/entry/:entry/exists'					,	entryCtrl.entryExists);



router.post('/create'											, entryCtrl.entryAddSubmit);	


router
			.get('/add'					, cUser.isOkAdmin);


router.route('/entry/:entry/detail')

			.get(	entryCtrl.entryDetail);



router.route('/entry/:entry/update')

			.get(	entryCtrl.entryUpdate)

			.put(	entryCtrl.entryUpdateSubmit);




router
			.route('/entry/many/delete')

			.get(	cUser.isOkAdmin)

			.patch(	general.entryDeleteMany('Request Limit'));


router
			.route('/delete/entry/all/')

			.get(	cUser.roleType(['superAdministrator']) ,

						general.entryDeleteAll)

			.delete( cUser.roleType(['superAdministrator']) , 

						general.entryDeleteAll);


module.exports = router;