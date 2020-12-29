const router = require('express').Router() , mongoose = require('mongoose');

const cUser = require('../config/confirm-user') , queryType = require('../config/query-type') , searchQuery = require('../config/search-query') , createEntry = require('../config/create-entry');

const $Model = mongoose.model('Request');

const Unit = mongoose.model('Unit');

const Upload = mongoose.model('Upload');

const opt = {

	'first' : 'EmailPassword' ,

	'second' : 'Email Password' ,

	'third' : 'email-password' ,

	'fourth' : 'emailPassword' ,

	'comment' : 'Request.Comment' ,

	'reply' : 'Request.Reply' ,

	'$Model' : $Model ,

	'Unit' : Unit ,

	'Upload' : Upload ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

const general = require('../controllers/general')(opt);

const entryCtrl = require('../controllers/email-password')(opt);

router.get('/entries' , 

						cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) ,

						queryType.queryByUnit('Email Password' , ['Email Password'] , opt.normalPrivilege , opt.superPrivilege , opt.second) ,

						searchQuery.finalRequestSearchQueryFilter ,

						searchQuery.searchByRequestType('Email Password' , ['Email Password'] , opt.normalPrivilege , opt.superPrivilege , opt.second , 'REPSP') ,

						searchQuery.searchByStatus('Email Password' , ['Email Password'] , opt.normalPrivilege , opt.superPrivilege , opt.second , 'REPSP') ,

						searchQuery.searchByAppNumber('Email Password' , ['Email Password'] , opt.normalPrivilege , opt.superPrivilege , opt.second , 'REPSP') ,

						searchQuery.finalRequestQuery ,

						general.entries);


router
			.get('/add'					, 		cUser.roleType(opt.normalPrivilege) , cUser.isOk);

router
			.post('/create'						, 

						cUser.roleType(opt.normalPrivilege) ,

						queryType.setEntryType('REPSP' , 'Email Password') ,

						queryType.removeFields(['requestUsername' , 'requestPassword' ]) ,

						createEntry.$checkRequestLimit ,

						general.entryAdd);


router
			.route('/entry/:entry')

			.get( cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Email Password'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryDetail('Email Password'))

			.put( cUser.roleType(['staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Email Password'] , ['staff' , ...opt.superPrivilege] , true , ['staff']) ,

						queryType.removeFields(['requestUsername']) ,

						entryCtrl.entryUpdate);



router.route('/entry/:entry/review')

			.put( cUser.roleType(['staff' , ...opt.superPrivilege]) ,

						cUser.userUnit(['Email Password'] , ['staff' , ...opt.superPrivilege] , true , ['staff']) ,

						queryType.removeFields(['requestUsername' , 'requestPassword']) ,

						general.entryReview);



router.get('/entry/:entry/timeline' , 

 						cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Email Password'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryTimeline);




router.route('/entry/:entry/transfer')

			.get( cUser.roleType(['staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Email Password'] , ['staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryTransfer)

			.put(	cUser.roleType(['staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Email Password'] , ['staff' , ...opt.superPrivilege] , true , ['staff']) ,

						queryType.setEntryType2(queryType.generalEntryTypes().acronym , queryType.generalEntryTypes().title) ,

						queryType.removeFields('requestUsername' , 'requestPassword') ,

						general.entryTransferSubmit);




router.route('/entry/:entry/comment/')

			.get(	cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Email Password'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryAddComment)

			.post( cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Email Password'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryAddCommentSubmit);



router.route('/entry/:entry/comment/:comment/reply')
	
			.get(	cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Email Password'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryAddReplytoComment)

			.post(cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) ,

						cUser.userUnit(['Email Password'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryAddReplytoCommentSubmit);

router
			.route('/entry/:entry/delete')

			.get( cUser.roleType([...opt.superPrivilege]) , 

						general.entryExists)

			.delete( cUser.roleType([...opt.superPrivilege]) , 

						general.entryDeleteSubmit);



router
			.route('/entry/many/delete')

			.get( cUser.roleType([...opt.superPrivilege , 'staff']) ,

						cUser.isOkAdmin)

			.patch( cUser.roleType([...opt.superPrivilege , 'staff']) , 

						general.entryDeleteMany('Email Password'));

router
			.route('/delete/entry/all/')

			.get(	cUser.roleType(['superAdministrator']) ,

						general.entryDeleteAll)

			.delete( cUser.roleType(['superAdministrator']) , 

						general.entryDeleteAllSubmit);

module.exports = router;