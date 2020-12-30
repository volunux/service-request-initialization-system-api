var path = require('path') , fs = require('fs');

module.exports = (file) => {

																	var ext =  path.extname(file.originalname) , possible = 'abcdefghijklmnopqrstuvwxyz0123456789' , imgUrl = '' , fileName = '';

																	for(var i = 0 ; i < 6 ; i += 1) {	imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));		}

																	fileName = imgUrl + ext;

																	return fileName;				
}