var multer = require('multer') , fs = require('fs') , path = require('path');

const { v4: uuidv4 } = require('uuid');

let fileName = '';


module.exports = {

		'getFileExtension' : (file) => {
																	
																	var ext =  path.extname(file)
																																	return ext;
		} ,

		'renameFile' : (file) => {
																	var ext =  path.extname(file);

																	fileName = uuidv4() + ext;



																	return fileName;				
		}

}

																	console.log(typeof uuidv4());