var router = require('express').Router();

const opt = {

		'first' : 'user' ,

		'second' : 'User' ,

		'third' : 'User Account' ,

		'fourth' : 'admin' ,

		'fifth' : 'user' ,

		'code' : 'user'
};

const testCtrl = require('../controllers/test')(opt);


router.get('/entries' , testCtrl.entries);


router.get('/user/:entry/detail' , testCtrl.entryDetail);


router.get('/user/:entry/update' , testCtrl.entryUpdate);

router.post('/user/:entry/update' , testCtrl.entryUpdateSubmit);


router.get('/user/:entry/delete' , testCtrl.entryDelete);

router.post('/user/:entry/delete' , testCtrl.entryDeleteSubmit);




router.get('/request-list' , testCtrl.requestList);

router.get('/payment-list' , testCtrl.paymentList);



router.get('/update-request' , testCtrl.updateRequest);

router.post('/update-request' , testCtrl.updateRequest);



router.get('/create-account' , testCtrl.entryAdd);

router.post('/create-account' , testCtrl.entryAddSubmit);



router.get('/delete-all' , testCtrl.deleteAllUser);

router.post('/delete-all' , testCtrl.deleteAllUserSubmit);


module.exports = router;