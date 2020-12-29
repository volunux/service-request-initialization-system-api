var express = require('express') , router = express.Router(); 

const cUser = require('../config/confirm-user');

const mongoose = require('mongoose');

const $Model = mongoose.model('Upload');

const opt = {

	'first' : 'Upload' ,

	'second' : 'Upload' ,

	'third' : 'upload' ,

	'fourth' : 'upload' ,

	'fifth' : 'Upload' ,

	'$Model' : $Model ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

const entry = require('../controllers/upload');

const general = require('../controllers/general')(opt);

const general2 = require('../controllers/general-two')(opt);


	
router.post('/'						,														general2.entryAddSubmit);

router.get('/entries'			, cUser.roleType([...opt.superPrivilege]) , general2.entries(`_id num entrySlug status createdAt`));






router
			.route('/entry/many/delete')

			.get( cUser.roleType([...opt.superPrivilege]) ,

						cUser.isOkAdmin)

			.patch( cUser.roleType([...opt.superPrivilege]) , 

						entry.entryDeleteMany('Upload'));


router
			.route('/delete/entry/all/')

			.get(	cUser.roleType(['superAdministrator']) ,

						general.entryDeleteAll)

			.delete( cUser.roleType(['superAdministrator']) , 

						general.entryDeleteAllSubmit);

module.exports = router;