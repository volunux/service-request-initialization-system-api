var router = require('express').Router();

const opt = {

		'first' : 'user' ,

		'second' : 'User' ,

		'third' : 'User Account' ,

		'fourth' : 'admin' ,

		'fifth' : 'user' ,

		'sixth' : 'admin' ,

		'code' : 'user' ,

		'roles' : ['student' , 'lecturer' , 'hod' , 'dean' , 'staff' , 'bursar' , 'moderator' , 'administrator' , 'superAdministrator'] ,

		'statuses' : ['active' , 'banned' , 'deactivated' , 'inactive' , 'pending']
};

const entryCtrl = require('../controllers/admin')(opt);

const searchQuery = require('../config/search-query');

router.get('/' , entryCtrl.index);

router.get('/manage' , entryCtrl.dashboard);


router.get('/manage/user/entries' , searchQuery.queryType , entryCtrl.entries);

router.get('/manage/request' , entryCtrl.manageRequest);

router.get('/manage/payment' , entryCtrl.managePayment);

router.get('/manage/others' ,  entryCtrl.manageOthers);



router.get('/user/:entry/detail' , entryCtrl.entryDetail);


router.get('/user/:entry/update' , entryCtrl.entryUpdate);

router.post('/user/:entry/update' , entryCtrl.entryUpdateSubmit);


router.get('/user/:entry/delete' , entryCtrl.entryDelete);

router.post('/user/:entry/delete' , entryCtrl.entryDeleteSubmit);




router.get('/request-list' , entryCtrl.requestList);

router.get('/payment-list' , entryCtrl.paymentList);



router.get('/update-request' , entryCtrl.updateRequest);

router.post('/update-request' , entryCtrl.updateRequest);



router.get('/user/create-account' , entryCtrl.entryAdd);

router.post('/user/create-account' , entryCtrl.entryAddSubmit);



router.get('/user/deactivate-profile' , entryCtrl.deactivateProfile);

router.post('/user/deactivate-profile' , entryCtrl.deactivateProfileSubmit);



router.get('/user/reactivate-profile' , entryCtrl.reactivateProfile);

router.post('/user/reactivate-profile' , entryCtrl.reactivateProfileSubmit);



router.get('/delete-all' , entryCtrl.deleteAllUser);

router.post('/delete-all' , entryCtrl.deleteAllUserSubmit);


module.exports = router;