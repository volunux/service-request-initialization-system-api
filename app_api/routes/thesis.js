const router = require('express').Router() , mongoose = require('mongoose') , requestType = require('../config/requestType');

const cUser = require('../config/confirm-user') , queryType = require('../config/query-type') , searchQuery = require('../config/search-query') , createEntry = require('../config/create-entry');

const $Model = mongoose.model('Thesis');

const Department = mongoose.model('Department');

const Faculty = mongoose.model('Faculty');

const Upload = mongoose.model('Upload');

const opt = {

	'first' : 'Thesis' ,

	'second' : 'Thesis' ,

	'third' : 'thesis' ,

	'fourth' : 'thesis' ,

	'comment' : 'Thesis.Comment' ,

	'reply' : 'Thesis.Reply' ,

	'$Model' : $Model ,

	'Department' : Department ,

	'Faculty' : Faculty ,

	'Upload' : Upload ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['moderator' , 'administrator' , 'superAdministrator'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

const general = require('../controllers/general')(opt);

const entryCtrl = require('../controllers/thesis')(opt);

router.get('/entries' , 

						cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) ,

						queryType.queryByUnit('Thesis' , ['Thesis'] , opt.normalPrivilege , opt.superPrivilege , opt.second) ,

						searchQuery.finalRequestSearchQueryFilter ,

						searchQuery.searchByRequestType('Thesis' , ['Thesis'] , opt.normalPrivilege , opt.superPrivilege , opt.second , 'CR') ,

						searchQuery.searchByStatus('Thesis' , ['Thesis'] , opt.normalPrivilege , opt.superPrivilege , opt.second , 'CR') ,

						searchQuery.searchByAppNumber('Thesis' , ['Thesis'] , opt.normalPrivilege , opt.superPrivilege , opt.second , 'CR') ,

						searchQuery.finalRequestQuery ,

						general.entries);


router
			.get('/add'					,		cUser.roleType([...opt.normalPrivilege , 'staff' , 'bursar' , 'lecturer' , ...opt.leastPrivilege , ...opt.superPrivilege]) , entryCtrl.entryAdd);

router
			.post('/create'	, 

						cUser.roleType([...opt.normalPrivilege , 'staff' , 'bursar' , 'lecturer' , ...opt.leastPrivilege , ...opt.superPrivilege]) ,

						queryType.setEntryType('CR' , 'Thesis') ,

						queryType.removeFields(['requestUsername' , 'requestPassword' ]) ,

/*						createEntry.$checkRequestLimit ,*/

						general.entryAdd);


router
			.route('/entry/:entry')

			.get( cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Thesis'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryDetail('Thesis'))

			.put( cUser.roleType(['staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Thesis'] , ['staff' , ...opt.superPrivilege] , true , ['staff']) ,

						queryType.removeFields(['requestUsername' , 'requestPassword']) ,

						entryCtrl.entryUpdate);



router.route('/entry/:entry/review')

			.put( cUser.roleType(['staff' , ...opt.superPrivilege]) ,

						cUser.userUnit(['Thesis'] , ['staff' , ...opt.superPrivilege] , true , ['staff']) ,

						queryType.removeFields(['requestUsername' , 'requestPassword']) ,

						general.entryReview);



router.get('/entry/:entry/timeline' , 

 						cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Thesis'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryTimeline);




router.route('/entry/:entry/transfer')

			.get( cUser.roleType(['staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Thesis'] , ['staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryTransfer)

			.put(	cUser.roleType(['staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Thesis'] , ['staff' , ...opt.superPrivilege] , true , ['staff']) ,

						queryType.setEntryType2(queryType.generalEntryTypes().acronym , queryType.generalEntryTypes().title) ,

						queryType.removeFields('requestUsername' , 'requestPassword') ,

						general.entryTransferSubmit);




router.route('/entry/:entry/comment/')

			.get(	cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Thesis'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryAddComment)

			.post( cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Thesis'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryAddCommentSubmit);



router.route('/entry/:entry/comment/:comment/reply')
	
			.get(	cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) , 

						cUser.userUnit(['Thesis'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

						general.entryAddReplytoComment)

			.post(cUser.roleType([...opt.normalPrivilege , 'staff' , ...opt.superPrivilege]) ,

						cUser.userUnit(['Thesis'] , [...opt.normalPrivilege , 'staff' , ...opt.superPrivilege] , true , ['staff']) ,

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

						general.entryDeleteMany('Thesis'));

router
			.route('/delete/entry/all/')

			.get(	cUser.roleType(['superAdministrator']) ,

						general.entryDeleteAll)

			.delete( cUser.roleType(['superAdministrator']) , 

						general.entryDeleteAllSubmit);


module.exports = router;