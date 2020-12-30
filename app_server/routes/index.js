const router = require('express').Router() , uploadS3 = require('../config/upload-image');

const opt = {

		'first' : 'user' ,

		'second' : 'User' ,

		'third' : 'User Account' ,

		'fourth' : 'index' ,

		'fifth' : 'user' ,

		'code' : 'user'
};

data = '' , url = '' , authentication = require('../controllers/authentication/authentication')(opt) , indexCtrl = require('../controllers/index')(opt);

router.get('/signup' 																	, 													authentication.register);

router.get('/signin' 																	, 													authentication.login);

router.get('/signout' 																, 													authentication.logout);

router.post('/signin' 																, 													authentication.loginSubmit);

router.post('/signup' 																, 													authentication.registerSubmit);	



router.post('/form' , uploadS3.delete , (req , res , next) => {
		
						res.status(200).json({'message' : 'Image successfully deleted.'});
});

router.post('/delete/objects' , uploadS3.deleteMultiple , (req , res , next) => {
		
						res.status(200).json({'message' : 'Images successfully deleted.'});
});



router.post('/form' , uploadS3.delete , (req , res , next) => {
		
						res.status(200).json({'message' : 'Image successfully deleted.'});
});


router.get('/' , (req , res , next) => {
  
  res.render('index' , { 'title' : 'Fut Minna Support Management System' });

});

router.get('/error' , (req , res , next) => {
  
  res.render('index' , { 'title' : 'Error has occured?' });

})

module.exports = router;
