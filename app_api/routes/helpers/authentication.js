var router = require('express').Router() , authentication = require('../../controllers/helpers/authentication') , queryType = require('../../config/query-type');


router.get('/signup'										,					authentication.signup);

router.post('/signup'										, 			queryType.setNewAccountRoleAndStatus , 	authentication.signupSubmit);


router.post('/signin'										, 				authentication.signin);

router.get('/signout'										,					authentication.signout);


module.exports = router;