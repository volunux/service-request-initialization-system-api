const router = require('express').Router();

const cUser = require('../config/confirm-user');

const searchQuery = require('../config/search-query');

const queryType = require('../config/query-type');

const mongoose = require('mongoose');

$Model = mongoose.model('Refund.Reply');

const opt = {

	'first' : 'Reply' ,

	'second' : 'Reply' ,

	'third' : 'reply' ,

	'fourth' : 'reply' ,

	'fifth' : 'Reply' ,

	'$Model' : $Model ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

const entryCtrl = require('../controllers/conversation')(opt);

const general = require('../controllers/general')(opt);

const general2 = require('../controllers/general-two')(opt);


router.get('/entries' , searchQuery.commentSearch ,

						general2.entries('unit updatedAt status slug entrySlug num _id'));

router
			.route('/entry/:entry/detail')

			.get(	queryType.checkMongoNumber ,

						entryCtrl.entryDetail('text updatedAt commentSlug author status num _id'));



router
			.route('/entry/:entry/update')

			.get(	queryType.checkMongoNumber ,

						general2.entryUpdate2('text status _id'))

			.put(	queryType.checkMongoNumber ,

						queryType.removeFields(['status']) ,

						general2.entryUpdateSubmit2);


router
			.route('/entry/:entry/delete')

			.get(	queryType.checkMongoNumber ,

						general2.entryDelete2('text status num entrySlug _id'))

			.delete( queryType.checkMongoNumber ,

						general2.entryDeleteSubmit2);





router
			.route('/entry/many/delete')

			.get(	cUser.isOkAdmin)

			.patch(	general.entryDeleteMany('Reply'));


router
			.route('/delete/entry/all/')

			.get(	cUser.roleType(['superAdministrator']) ,

						general.entryDeleteAll)

			.delete( cUser.roleType(['superAdministrator']) , 

						general.entryDeleteAllSubmit);


module.exports = router;