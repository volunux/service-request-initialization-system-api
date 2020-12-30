const router = require('express').Router();

const opt = {

		'first' : 'course-registration' ,

		'second' : 'Course Registration' ,

		'third' : 'Request review of your semester Course Registration' ,

		'fourth' : 'courseRegistration' ,

		'code' : 'cr'
};

const courseRegistration = require('../controllers/general')(opt);

router.route('/course-registration/entry/:entry/timeline')

			.get(courseRegistration.entryTimeline);


router.route('/course-registration/entry/:entry/review')

			.get(courseRegistration.entryReview);


router.route('/course-registration/entry/:entry/comment/add')

			.get(courseRegistration.entryCommentAdd)

			.post(courseRegistration.entryCommentAddSubmit);


router.route('/course-registration/entry/:entry/comment/:comment/reply/add')

			.get(courseRegistration.entryReplyAdd)

			.post(courseRegistration.entryReplyAddSubmit);


router.route('/course-registration/entry/:entry/transfer')

			.get(courseRegistration.entryTransfer)

			.post(courseRegistration.entryTransferSubmit);

module.exports = router;