var router = require('express').Router() , mongoose = require('mongoose') , requestType = require('../config/requestType');

const checkUser = require('../config/confirm-user') , queryType = require('../config/query-type') , searchQuery = require('../config/search-query') , createEntry = require('../config/create-entry');

const $Model = mongoose.model('Refund');

const Letter = mongoose.model('Letter');

const Unit = mongoose.model('Unit');

const Upload = mongoose.model('Upload');


const opt = {

	'first' : 'Refund' ,

	'second' : 'Refund' ,

	'third' : 'refund' ,

	'fourth' : 'refund' ,

	'comment' : 'Refund.Comment' ,

	'reply' : 'Refund.Reply' ,

	'$Model' : $Model ,

	'Unit' : Unit ,

	'Upload' : Upload ,

	'Letter' : Letter ,

	'normalPrivilege' : ['student' , 'departmentPresident' , 'facultyPresident'] ,

	'superPrivilege' : ['staff' , 'moderator' , 'administrator' , 'superAdministrator'] ,

	'otherPrivilege' : ['hod' , 'dean' , 'bursar'] ,

	'leastPrivilege' : ['hod' , 'dean']

};

const general = require('../controllers/general')(opt);

const refund = require('../controllers/refund')(opt); 

router.get('/entries' 	, 

						checkUser.roleType([...opt.normalPrivilege , ...opt.otherPrivilege , ...opt.superPrivilege]) ,

						searchQuery.finalRefundSearchQueryFilter , 

						queryType.queryByRole ,

						searchQuery.searchRefundByAppNumber ,

						searchQuery.searchRefundByStatus ,

						searchQuery.searchRefundByFaculty ,

						searchQuery.searchRefundByDepartment ,

						searchQuery.searchRefundByStage ,

						searchQuery.finalRefundQuery ,

						refund.entries);



router .get('/add'		, 		checkUser.roleType(opt.normalPrivilege) 	, checkUser.isOk);

router .post('/create'			, 		checkUser.roleType(opt.normalPrivilege) 	, 

							queryType.setDepartment ,

							queryType.setFaculty , 

/*							createEntry.$checkRequestLimit ,*/

							general.entryAdd);



router
			.route('/entry/:entry')

			.get( checkUser.roleType([...opt.normalPrivilege , ...opt.otherPrivilege , ...opt.superPrivilege]) ,

						refund.entryDetail)

			.put( checkUser.roleType([...opt.normalPrivilege , ...opt.otherPrivilege , ...opt.superPrivilege]) ,

						queryType.entryStage ,

						refund.entryUpdate);


router.route('/entry/:entry/letter')

			.get( checkUser.roleType([...opt.normalPrivilege , ...opt.otherPrivilege , ...opt.superPrivilege]) ,

						refund.entryLetter);


router.route('/entry/:entry/review')

			.put( checkUser.roleType([...opt.superPrivilege]) ,

						refund.entryReview);





router.get('/entry/:entry/timeline' , 

						checkUser.roleType([...opt.normalPrivilege , ...opt.otherPrivilege , ...opt.superPrivilege]) ,

						queryType.isRefund ,

						general.entryTimeline);


router
			.route('/entry/:entry/comment/')

			.get( checkUser.roleType([...opt.normalPrivilege , ...opt.otherPrivilege , ...opt.superPrivilege]) ,

						queryType.isRefund ,

						requestType.canPass ,

						general.entryAddComment)

			.post( checkUser.roleType([...opt.normalPrivilege , ...opt.otherPrivilege , ...opt.superPrivilege]) ,

						queryType.isRefund ,

						requestType.canPass ,

						general.entryAddCommentSubmit);


router
			.route('/entry/:entry/comment/:comment/reply')

			.get( checkUser.roleType([...opt.normalPrivilege , ...opt.otherPrivilege , ...opt.superPrivilege]) ,

						queryType.isRefund ,

						requestType.canPass ,

						general.entryAddReplytoComment)

			.post( checkUser.roleType([...opt.normalPrivilege , ...opt.otherPrivilege , ...opt.superPrivilege]) ,

						queryType.isRefund ,

						requestType.canPass ,

						general.entryAddReplytoCommentSubmit);


router
			.route('/entry/many/delete')

			.get( checkUser.roleType([...opt.superPrivilege , 'staff']) ,

						checkUser.isOkAdmin)

			.patch( checkUser.roleType([...opt.superPrivilege , 'staff']) , 

						general.entryDeleteMany('Refund'));

router
			.route('/entries/all/delete')

			.get( checkUser.roleType(['superAdministrator']) ,

						general.entryDeleteAll)

			.delete( checkUser.roleType(['superAdministrator']) ,

						general.entryDeleteAllSubmit);

module.exports = router;