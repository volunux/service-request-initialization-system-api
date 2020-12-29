const router = require('express').Router();

const cUser = require('../config/confirm-user');

const sQuery = require('../config/search-query');

const mongoose = require('mongoose');

const $Model = mongoose.model('Refund.Stage');


const opt = {

	'first' : 'RefundStage' ,

	'second' : 'Refund Stage' ,

	'third' : 'refund-stage' ,

	'fourth' : 'refundStage' ,

	'$Model' : $Model ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

const general = require('../controllers/general')(opt);

const general2 = require('../controllers/general-two')(opt);


router.get('/entries'											,  sQuery.finalSearchQueryFilter1 , general2.entries(`name shortCode secondaryKey createdAt num -_id`));

router.get('/entry/:entry/exists'					, general2.entryExists);

router.post('/create'											, general2.entryAddSubmit);


router
			.get('/add'					, cUser.isOkAdmin);


router.route('/entry/:entry/detail')

			.get(	general2.entryDetail(`name num shortCode _id`));




router.route('/entry/:entry/update')

			.get(	general2.entryUpdate('name shortCode status num -_id'))

			.put(	general2.entryUpdateSubmit);


router.route('/entry/:entry/delete')

			.get(	general2.entryDelete('name shortCode num -_id'))

			.delete( general2.entryDeleteSubmit);





router
			.route('/entry/many/delete')

			.get(	cUser.isOkAdmin)

			.patch(	general.entryDeleteMany('Refund Stage'));


router
			.route('/delete/entry/all/')

			.get(	cUser.roleType(['superAdministrator']) ,

						general.entryDeleteAll)

			.delete( cUser.roleType(['superAdministrator']) , 

						general.entryDeleteAllSubmit);


module.exports = router;