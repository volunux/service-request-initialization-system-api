var router = require('express').Router();

const opt = {

		'first' : 'user' ,

		'second' : 'User' ,

		'third' : 'User Account' ,

		'fourth' : 'user' ,

		'fifth' : 'user' ,

		'code' : 'user'
};

const userCtrl = require('../controllers/user')(opt);

router.get('/' , userCtrl.index);

router.get('/update-profile' , userCtrl.updateProfile);

router.post('/update-profile' , userCtrl.updateProfileSubmit);



router.get('/manage-request' , userCtrl.requestMenu);

router.get('/create-request' , userCtrl.createRequest);

router.get('/manage-payment' , userCtrl.paymentMenu);

router.get('/create-payment' , userCtrl.createPayment);



router.get('/profile-view' , userCtrl.entryView);

router.get('/dashboard' 		, userCtrl.dashboard);

router.get('/review-profile' , userCtrl.reviewProfile);



router.get('/update-password' , userCtrl.updatePassword);

router.post('/update-password' , userCtrl.updatePasswordSubmit);



router.get('/update-signature-picture' , userCtrl.changeSignatureAndPicture);

router.post('/update-signature-picture' , userCtrl.changeSignatureAndPictureSubmit);



router.get('/deactivate-profile' , userCtrl.deactivateProfile);

router.post('/deactivate-profile' , userCtrl.deactivateProfileSubmit);



router.get('/reactivate-profile' , userCtrl.reactivateProfile);

router.post('/reactivate-profile' , userCtrl.reactivateProfileSubmit);




module.exports = router;