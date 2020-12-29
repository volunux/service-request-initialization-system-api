var express = require('express') , router = express.Router(); 

const cUser = require('../config/confirm-user');

const mongoose = require('mongoose');

const $Model = mongoose.model('RequestCredential');

const opt = {

	'first' : 'Upload' ,

	'second' : 'Request Credential' ,

	'third' : 'request-credential' ,

	'fourth' : 'requestCredential' ,

	'fifth' : 'RequestCredential' ,

	'$Model' : $Model ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

const entry = require('../controllers/request-credential');

const general = require('../controllers/general')(opt);

const general2 = require('../controllers/general-two')(opt);


router.get('/entries'			, cUser.roleType([...opt.superPrivilege]) , general2.entries(`_id num requestUsername requestPassword status createdAt`));

router.post('/create'																		,										entry.createCredential);





router
			.route('/entry/many/delete')

			.get( cUser.roleType([...opt.superPrivilege]) ,

						cUser.isOkAdmin)

			.patch( cUser.roleType([...opt.superPrivilege]) , 

						general.entryDeleteMany('Request Credential'));


router
			.route('/delete/entry/all/')

			.get(	cUser.roleType(['superAdministrator']) ,

						general.entryDeleteAll)

			.delete( cUser.roleType(['superAdministrator']) , 

						general.entryDeleteAllSubmit);

module.exports = router;
