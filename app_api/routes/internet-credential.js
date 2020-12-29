const router = require('express').Router() , mongoose = require('mongoose');

const cUser = require('../config/confirm-user') , queryType = require('../config/query-type') , searchQuery = require('../config/search-query') , createEntry = require('../config/create-entry');

const $Model = mongoose.model('Request');

const RequestCredential = mongoose.model('RequestCredential');

const Unit = mongoose.model('Unit');

const Upload = mongoose.model('Upload');

const opt = {

	'first' : 'InternetCredential' ,

	'second' : 'Internet Credential' ,

	'third' : 'internet-credential' ,

	'fourth' : 'internetCredential' ,

	'comment' : 'Request.Comment' ,

	'reply' : 'Request.Reply' ,

	'$Model' : $Model ,

	'Unit' : Unit ,

	'Upload' : Upload ,

	'RequestCredential' : RequestCredential ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

const general = require('../controllers/general')(opt);

const entryCtrl = require('../controllers/internet-credential')(opt);

router.get('/entries' , 

						cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) ,

						queryType.queryByUnit('Internet Credential' , ['Internet Credential'] , opt.normalPrivilege , opt.superPrivilege , opt.second) ,

						searchQuery.finalRequestSearchQueryFilter ,

						searchQuery.searchByRequestType('Internet Credential' , ['Internet Credential'] , opt.normalPrivilege , opt.superPrivilege , opt.second , 'CSIF') ,

						searchQuery.searchByStatus('Internet Credential' , ['Internet Credential'] , opt.normalPrivilege , opt.superPrivilege , opt.second , 'CSIF') ,

						searchQuery.searchByAppNumber('Internet Credential' , ['Internet Credential'] , opt.normalPrivilege , opt.superPrivilege , opt.second , 'CSIF') ,

						searchQuery.finalRequestQuery ,

						general.entries);


router
			.get('/add'					, 		cUser.roleType(opt.normalPrivilege) , cUser.isOk);

router
			.post('/create'						, 

						cUser.roleType(opt.normalPrivilege) ,

						queryType.setEntryType('CSIF' , 'Internet Credential') ,

						queryType.removeFields(['requestUsername' , 'requestPassword' ]) ,

						createEntry.$checkRequestLimit ,

						general.entryAdd);


router
			.route('/entry/:entry')

			.get( cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Internet Credential'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryDetail('Internet Credential'))

			.put( cUser.roleType(['staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Internet Credential'] , ['staff' , ...opt.superPrivilege] , true , ['staff']) ,

						entryCtrl.entryUpdate);



router.route('/entry/:entry/review')

			.put( cUser.roleType(['staff' , ...opt.superPrivilege]) ,

						cUser.userUnit(['Internet Credential'] , ['staff' , ...opt.superPrivilege] , true , ['staff']) ,

						queryType.removeFields(['requestUsername' , 'requestPassword']) ,

						general.entryReview);



router.get('/entry/:entry/timeline' , 

 						cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Internet Credential'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryTimeline);




router.route('/entry/:entry/transfer')

			.get( cUser.roleType(['staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Internet Credential'] , ['staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryTransfer)

			.put(	cUser.roleType(['staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Internet Credential'] , ['staff' , ...opt.superPrivilege] , true , ['staff']) ,

						queryType.setEntryType2(queryType.generalEntryTypes().acronym , queryType.generalEntryTypes().title) ,

						queryType.removeFields('requestUsername' , 'requestPassword') ,

						general.entryTransferSubmit);




router.route('/entry/:entry/comment/')

			.get(	cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Internet Credential'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryAddComment)

			.post( cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Internet Credential'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryAddCommentSubmit);



router.route('/entry/:entry/comment/:comment/reply')
	
			.get(	cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Internet Credential'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryAddReplytoComment)

			.post(cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) ,

						cUser.userUnit(['Internet Credential'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

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

						general.entryDeleteMany('Internet Credential'));

router
			.route('/delete/entry/all/')

			.get(	cUser.roleType(['superAdministrator']) ,

						general.entryDeleteAll)

			.delete( cUser.roleType(['superAdministrator']) , 

						general.entryDeleteAllSubmit);


module.exports = router;