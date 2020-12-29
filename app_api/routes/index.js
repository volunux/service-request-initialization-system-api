var router = require('express').Router() , queryType = require('../config/query-type') , mongoose = require('mongoose');

const $Model = mongoose.model('User');

const opt = {

	'first' : 'User' ,

	'second' : 'User' ,

	'third' : 'user' ,

	'fourth' : 'user' ,

	'fifth' : 'User' ,

	'$Model' : $Model ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'otherPrivilege' : ['staff' , 'lecturer' , 'hod' , 'dean' , 'bursar']

};

const entryCtrl = require('../controllers/user')(opt);

router
			.route('/forgot-password')

			.get(queryType.isOkay)

			.put(entryCtrl.entryforgotPasswordSubmit);


router.get('/reset/:token' , entryCtrl.resetPassword);

router.post('/reset/:token' , entryCtrl.resetPasswordSubmit);





module.exports = router;