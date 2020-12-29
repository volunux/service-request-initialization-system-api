var router = require('express').Router() , cUser = require('../config/confirm-user') , mongoose = require('mongoose');

const $Model = mongoose.model('User');

const opt = {

	'first' : 'User' ,

	'second' : 'User' ,

	'third' : 'user' ,

	'fourth' : 'user' ,

	'fifth' : 'User' ,

	'$Model' : $Model ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

};

const verifyer = require('../controllers/verifyer')(opt);

router.get('/confirm-admin' 	, 

						cUser.confirmAdmin([...opt.superPrivilege]));


router.get('/emailaddress/:entry' 	, 

						cUser.roleType([...opt.superPrivilege]) ,

						verifyer.verifyEmail);


router.get('/username/:entry' 	, 

						cUser.roleType([...opt.superPrivilege]) ,

						verifyer.verifyUsername);


router.get('/user/:entry/profile' 	, 

						cUser.roleType([...opt.superPrivilege]) ,

						verifyer.entryExists);



module.exports = router;