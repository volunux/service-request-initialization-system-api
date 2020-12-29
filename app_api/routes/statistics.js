var router = require('express').Router() , cUser = require('../config/confirm-user');

const $AllModel = require('../models/models');

const opt = {

	'first' : 'User' ,

	'second' : 'User' ,

	'third' : 'user' ,

	'fourth' : 'user' ,

	'fifth' : 'User' ,

	'$Model' : $AllModel ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

const statistics = require('../controllers/statistics')(opt);

router.get('/entries'	, 

						cUser.roleType([...opt.superPrivilege]) ,

						cUser.isOkAdmin);

router.get('/entries/request'	, 

						cUser.roleType([...opt.superPrivilege]) ,

						statistics.entriesRequest);

router.get('/entries/payment'	, 

						cUser.roleType([...opt.superPrivilege]) ,

						statistics.entriesPayment);

router.get('/entries/comment'	, 

						cUser.roleType([...opt.superPrivilege]) ,

						statistics.entriesComment);

router.get('/entries/reply'	, 

						cUser.roleType([...opt.superPrivilege]) ,

						statistics.entriesReply);

router.get('/entries/comment-reply'	, 

						cUser.roleType([...opt.superPrivilege]) ,

						statistics.entriesCommentAndReply);

router.get('/entries/user'	, 

						cUser.roleType([...opt.superPrivilege]) ,

						statistics.entriesUser);

router.get('/entries/internal'	, 

						cUser.roleType([...opt.superPrivilege]) ,

						statistics.entriesOthers);



module.exports = router;