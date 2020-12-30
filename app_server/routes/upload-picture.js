let router = require('express').Router() , multer = require('multer') , path = require('path') , fs = require('fs') , pConfig = require('../config/photo');

var $fileName = (file) => {

																	var ext =  path.extname(file.originalname) , possible = 'abcdefghijklmnopqrstuvwxyz0123456789' , imgUrl = '' , fileName = '';

																	for(var i = 0 ; i < 6 ; i += 1) {	imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));		}

																	fileName = imgUrl + ext;

																	return fileName;				
};

var storage = multer.diskStorage({
	 																		'destination' : function (req, file, cb) {
																																									var photoPath = String('./public/photos/');
																																																																cb(null, photoPath);		
																												  } ,

								'filename' : function (req , file , cb) {
																													fileName = $fileName(file);
	    																																									cb(null, fileName)			}
	  		});

upload = multer({'storage' : storage});

router.get('/upload-picture' , (req , res , next) => {

		res.render('upload-picture' );
});

var uploads = upload.fields([{'name' : 'photo1' , 'maxCount' : 6} , {'name' : 'photo' , 'maxCount' : 2}])

router.post('/upload-picture' , uploads , 

pConfig.localValidate , pConfig.deleteAfterType , pConfig.localcheckFileSize , pConfig.deleteAfterSize , pConfig.addFileUpload ,

 (req , res , next) => {

 	if (!req.body.name) {


 			pConfig.delete(req);
 	}


		res.send('Post upload Picture');
}	);

module.exports = router;