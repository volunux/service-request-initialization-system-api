var router = require('express').Router() , cUser = require('../config/confirm-user') , queryType = require('../config/query-type') , mongoose = require('mongoose');

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

	'otherPrivilege' : ['staff' , 'lecturer' , 'hod' , 'dean' , 'bursar']

};

const entryCtrl = require('../controllers/user')(opt);

router
			.route('/entry/detail')

			.get( cUser.isUserPending ,

			 		cUser.roleType([...opt.normalPrivilege , ...opt.superPrivilege , ...opt.otherPrivilege]) , 

						entryCtrl.entryDetail);


router
			.route('/entry/update')

			.get( cUser.isUserPending ,

						cUser.roleType([...opt.normalPrivilege , ...opt.superPrivilege , ...opt.otherPrivilege]) , 

						entryCtrl.entryUpdate)

			.put( cUser.isUserPending ,

						cUser.roleType([...opt.normalPrivilege , ...opt.superPrivilege , ...opt.otherPrivilege]) , 

						queryType.removeFields(['unit' , 'department' , 'faculty' , 'password' , 'hash' , 'salt' , 'status' , 'role' , 'lastLoggedIn' , 'resetPasswordToken' , 'resetPasswordExpires' ,

																		'username' , 'emailAddress' , 'identityNumber' , 'jambRegistrationNumber' , 'matriculationNumber' , 'num' , 'profilePhoto' , 'signature' , ]) ,

						entryCtrl.entryUpdateSubmit);

router
			.route('/entry/deactivate')

			.get( cUser.isUserPending ,

						cUser.roleType([...opt.normalPrivilege , ...opt.superPrivilege , ...opt.otherPrivilege]) ,  

						entryCtrl.entryDeactivate)

			.put(  cUser.isUserPending ,

						cUser.roleType([...opt.normalPrivilege , ...opt.superPrivilege , ...opt.otherPrivilege]) , 

						entryCtrl.entryDeactivateSubmit);


router
			.route('/entry/reactivate')

			.get( cUser.isUserPending ,

						cUser.roleType([...opt.normalPrivilege , ...opt.superPrivilege , ...opt.otherPrivilege]) , 

						entryCtrl.entryReactivate)

			.put( cUser.isUserPending ,

						cUser.roleType([...opt.normalPrivilege , ...opt.superPrivilege , ...opt.otherPrivilege]) , 

						entryCtrl.entryReactivateSubmit);

router
			.route('/entry/change-password')

			.get( cUser.isUserPending ,

						entryCtrl.entryExists)
			
			.put( cUser.isUserPending ,

						cUser.roleType([...opt.normalPrivilege , ...opt.superPrivilege , ...opt.otherPrivilege]) , 

						entryCtrl.entryUpdatePassword);


router
			.route('/entry/change-signature-picture')

			.get( cUser.isUserPending ,

						cUser.roleType([...opt.normalPrivilege , ...opt.superPrivilege , ...opt.otherPrivilege]) , 

						entryCtrl.entryExists)

			.put( cUser.isUserPending ,

						cUser.roleType([...opt.normalPrivilege , ...opt.superPrivilege , ...opt.otherPrivilege]) , 

						queryType.removeFields(['firstName' , 'lastName' , 'identityNumber' , 'country' , 'level' , 'unit' , 'department' , 'faculty' , 'password' , 'hash' , 

																		'salt' , 'status' , 'role' , 'username' , 'resetPasswordToken' , 'resetPasswordExpires' ,

																		'emailAddress' , 'lastLoggedIn' , 'createdAt' , 'updatedAt' , 'matriculationNumber' , 'jambRegistrationNumber' , 'about']) ,

						entryCtrl.updateProfilePhotoAndSignatureSubmit);


router
			.route('/forgot-password')

			.get((req , res , next) => {

					res.status(200).json({'message' : 'Operation allowed.'})
			})

			.put(entryCtrl.entryforgotPasswordSubmit);


router.get('/reset/:token' , entryCtrl.resetPassword);

router.post('/reset/:token' , entryCtrl.resetPasswordSubmit);





module.exports = router;