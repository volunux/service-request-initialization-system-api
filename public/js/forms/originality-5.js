var $$files = [{	'key' : '' , 'photo' : { 'url' : '' , 'size' : false , 'type' : false } } , {	'key' : '' , 'photo' : { 'url' : '' , 'size' : false , 'type' : false } } ,

{	'key' : '' , 'photo' : { 'url' : '' , 'size' : false , 'type' : false } } , {	'key' : '' , 'photo' : { 'url' : '' , 'size' : false , 'type' : false } }];

var countFiles = 4;

function createFileGroup(opt) {

	return {

	'elem' : opt[0] ,

	'group' : opt[1] ,

	'add' : opt[2] ,

	'del' : opt[3] ,

	'can' : opt[4] ,

	'progress' : opt[5] ,

	'uploadError' : opt[6] ,

	'uploadError1' : opt[7] ,

	'text' : opt[8] ,

	'message' : opt[9] ,

	'percent' : opt[10]
}

}

var $file1 = createFileGroup(['photo-1' , 'file-upload-1' , 'btn-add-file-1' , 'btn-del-file-1' ,

								'btn-can-file-1' , 'file-upload-progress-1' , 'file-upload-error-1' , 'file-upload-error-11' ,

								'file-upload-text-1' , 'file-upload-message-1' , 'file-percent-1']);


var $file2 = createFileGroup(['photo-2' , 'file-upload-2' , 'btn-add-file-2' , 'btn-del-file-2' ,

								'btn-can-file-2' , 'file-upload-progress-2' , 'file-upload-error-2' , 'file-upload-error-22' ,

								'file-upload-text-2' , 'file-upload-message-2' , 'file-percent-2']);


var $file3 = createFileGroup(['photo-3' , 'file-upload-3' , 'btn-add-file-3' , 'btn-del-file-3' ,

								'btn-can-file-3' , 'file-upload-progress-3' , 'file-upload-error-3' , 'file-upload-error-33' ,

								'file-upload-text-3' , 'file-upload-message-3' , 'file-percent-3']);


var $file4 = createFileGroup(['photo-4' , 'file-upload-4' , 'btn-add-file-4' , 'btn-del-file-4' ,

								'btn-can-file-4' , 'file-upload-progress-4' , 'file-upload-error-4' , 'file-upload-error-44' ,

								'file-upload-text-4' , 'file-upload-message-4' , 'file-percent-4']);

var $_$$$files = [$file1.elem , $file2.elem , $file3.elem , $file4.elem];

var $rmethod = document.getElementById('rmethod').value;

var $uaddress = document.getElementById('ulink').value;

var objectKey = '';

var $fileSize = 500 * 1024;

var ajaxCall = '';

var $formProcess = document.getElementById('btn-submit');

var $body = '' , $data = {};

if (window.attachEvent) { 

		window.attachEvent('onload' , function () {

							$pageLoad($file1 , $$files[0]);
							$pageLoad($file2 , $$files[1]);
							$pageLoad($file3 , $$files[2]);
							$pageLoad($file4 , $$files[3]);			}); }

else if (window.addEventListener) {

		window.addEventListener('load' , function () {

							$pageLoad($file1 , $$files[0]);
							$pageLoad($file2 , $$files[1]);
							$pageLoad($file3 , $$files[2]);
							$pageLoad($file4 , $$files[3]);			} , false);	}

else {

	document.addEventListener('load' , function () {

							$pageLoad($file1 , $$files[0]);
							$pageLoad($file2 , $$files[1]);
							$pageLoad($file3 , $$files[2]);
							$pageLoad($file4 , $$files[3]);			} , false);}


function $pageLoad(opts , $$file) { 

	var $uploadBtn = document.getElementById(opts.add) , $removeBtn = document.getElementById(opts.del) , $inputFile = document.getElementById(opts.elem) , parentt = $inputFile.parentNode;

	var button = document.createElement('button');

	button.className ='btn-upload';

	button.textContent = 'Upload';
	
	parentt.insertBefore(button , $inputFile.nextSibling);

	$inputFile.style.display = 'none';

	button.addEventListener('click' , function(e) {

			e.stopPropagation();

			e.preventDefault();

			$inputFile.click();
	});

	// parentt.removeChild($inputFile);

	$formPost(opts.add);

	$$button = document.createElement('a');

	$inputFile.onchange = function(e) {

		var $el = e.target.files[0];

			$checkImageSize($el , opts , $$file);

			$checkImageType($el , opts , $$file);

			$validateSignature($el , opts , $$file);	};

	$uploadBtn.onclick = function(e) {

			$clearEvent(e);

			$clearText(opts.message , opts.uploadError , opts.uploadError1 , opts.progress);

			var data = {

						'photo' : document.getElementById(opts.elem).files[0] ,
			}

		if (!data.photo && $rmethod == 'POST') {
												
			$setText(opts.uploadError , 'Photo should be provided and cannot be empty.' , 'block');
	
					return false;
		}

			$checkImageSize(data.photo , opts , $$file);

			$checkImageType(data.photo , opts , $$file);

var $getHash = new XMLHttpRequest();

$getHash.open('POST' , '/api/uploader/sign/photo/' + data.photo.name + '/');

$getHash.setRequestHeader('Content-Type' , 'application/json;charset=UTF-8');

$getHash.onload = function(res) { $$file.key = JSON.parse(res.target.responseText).data.fields.key;

		if (res.target.status == 200) {

		$setElement(opts.elem , true);

		$setButton(opts.add , true , 'disabled' , 'btn-primary');

		$showButton(opts.can , 'inline');

		$setText(opts.message , 'Photo is uploading. Please be patient and wait. % uploaded : ' , 'inline' );

		return $uploadImage(JSON.parse(res.target.responseText) , data , opts , $$file);		}

		$clearText(opts.message , opts.uploadError , opts.uploadError1 , opts.progress);

		$setText(opts.uploadError , 'Error has occured. Please try again.' , 'block');
}		

var $photoInfo = {	'filename' : data.photo.name ,

										'contentType' : data.photo.type 	};

$photoInfo = JSON.stringify($photoInfo);

$getHash.send($photoInfo);

};		

 $removeBtn.onclick = function(e) {

			$clearEvent(e);

			$clearText(opts.message , opts.uploadError , opts.uploadError1 , opts.progress);

			$clearText(opts.percent , opts.text);

			$setText(opts.message , 'Photo is getting deleted. Please be patient and wait.' , 'block');

			$setButton(opts.del , true , 'disabled' , 'btn-primary');

			$removeImage($$file.key , opts);
 };


var cancelBtn = document.getElementById(opts.can);

cancelBtn.onclick = function(e) {

			$clearEvent(e);

			$setElement(opts.can , true);

			$xhrUpload.abort();

			$showButton(opts.can , 'none');

			$setElement(opts.can , false);

			$setButton(opts.add , false , 'btn-primary' , 'disabled');

			$clearText(opts.message , opts.uploadError , opts.uploadError1 , opts.progress);

			$clearText(opts.percent , opts.text);

			$setElement(opts.elem , false);
};


};



/** Form Handling Section below **/ 

			var entryForm = document.querySelector('form');

	$formProcess.onclick = function(e) {

				var ulErrors = document.querySelector('ul.errors') , pMessage = document.getElementById('form-heading');

				if (pMessage && pMessage.nextSibling) {	pMessage.nextSibling.innerHTML = ''; }

				if (ulErrors) {	ulErrors.innerHTML = '';	}

				$clearEvent(e);

				var ulErrors = document.querySelector('.form-errors');	

				ulErrors.innerHTML = '';

				var $$sFiles = $$files.map((file , i) => {

					var $_$file = document.getElementById($_$$$files[i]);

					var fileType = $_$file.files[0] ? $_$file.files[0].type : 'file';

					var fileSize = $_$file.files[0] ? $_$file.files[0].size : '2';

						return {	'location' : file.photo.url , 'mimetype' : fileType , 'size' : fileSize , 'encoding' : fileType }	});

				var compFiles = document.getElementById('compfiles');

				var $compFiles = JSON.stringify($$sFiles);

				compFiles.value = $compFiles;

			var main_body = document.getElementById('message');

				console.log(compFiles.value);

				console.log(typeof $compFiles);

				console.log(main_body.value);

			if (main_body && main_body.value.length < 10) {

				var h33 = document.querySelector('#request-form h3') , parentt = h33.parentNode , ull = document.createElement('ul') , lii = document.querySelector('li') ,

				pp = document.createElement('p') , bb = document.createElement('b');

				bb.textContent = 'Errors found after trying to process the form. These include : -';

				pp.appendChild(bb);

				ull.className = 'errors';

				lii.textContent = 'Message body should be provided and cannot be less than 10 characters.';

				ull.appendChild(lii);

				parentt.insertBefore(pp , h33.nextSibling);

				parentt.insertBefore(ull , pp.nextSibling);

				return false;

							}

/*				if(!$body) {

				var $valMessages = document.getElementById('ajax');

				$valMessages.style.display = 'block';

				$valMsg = document.createElement('li');

				$valMsg.textContent = 'Error processing the form. Please read the form guidelines and fill in the form as required.';

				$valMessages.appendChild($valMsg);

				$clearEvent(e);
							
							return false;   }*/

				$setButton('btn-submit' , true , 'disabled' , 'btn-primary');

				entryForm.submit();
																																													
			}; 


function $showButton(ref , display) {

	var $el = document.getElementById(ref);
	
			$el.style.display = display;						}



function $formPost(elem) {

			if ($rmethod == 'POST') {

			$setButton(elem , true , 'disabled' , 'btn-primary');		}		}



function $setButton(ref , attr , add = '' , remove = '') {

var $el = document.getElementById(ref);

		$el.disabled = attr;

		$arr = $el.className.split(' ');
 
		if ($arr.indexOf(add) == -1) {
		
				$el.className += ' ' + add;		}

var $remove = remove;

var $rm = new RegExp($remove, 'g');

			$el.className = $el.className.replace($rm , '');		}



function $setElement(ref , attr) {

var $el = document.getElementById(ref);
			
			$el.disabled = attr;		}


function $clearText(ref , ref1 = 'ref1' , ref2 = 'ref2' , ref3 = 'ref3') {

		var $el = document.getElementById(ref);

		var $el1 = document.getElementById(ref1);

		var $el2 = document.getElementById(ref2);

		var $el3 = document.getElementById(ref3);

		if ($el) {

				$el.style.display = 'none';

				$el.textContent = '';
		}

		if ($el1) {

				$el1.style.display = 'none';

				$el1.textContent = '';
		}

		if ($el2) {

				$el2.style.display = 'none';

				$el2.textContent = '';
		}

		if ($el3) {

				$el3.style.display = 'none';

				$el3.textContent = '';
		}
}

function $setText(ref , text , display , ref2 , ref3) {

var $el = document.getElementById(ref);
		
		$el.style.display = display;

		$el.textContent = text;
}

function $clearEvent($el) {

		$el.stopPropagation();

		$el.preventDefault();
}

function getTypeFromMagicNumber(signature) {

	switch (signature) {
	   
	    case '89504E47':
		return 'image/png'

	    case '47494638':
		return 'image/gif'

	    case '25504446':
		return 'application/pdf'

	    case 'FFD8FFDB':
	    case 'FFD8FFE0':
	    case 'FFD8FFE1':
 			case "FFD8FFE2":
    	case "FFD8FFE3":
    	case "FFD8FFE8":
		return 'image/jpeg'

	    case '504B0304':
		return 'application/zip'

	    default:
		return 'Unknown filetype'
	}
}


function $checkImageSize($myFile , opts , $$$$file) {

	if ($myFile) {
									if ($myFile.size > $fileSize) {
											
											$clearText(opts.message , opts.uploadError , opts.progress);

											$setButton(opts.add , true , 'disabled' , 'btn-primary');

											$setText(opts.uploadError , 'File is too large and will not be uploaded.' , 'block');

											$$$$file.photo.size = true

																					return false;		}
								
								$clearText(opts.message , opts.uploadError , opts.progress);

								$setButton(opts.add , false , 'btn-primary' , 'disabled');

								$$$$file.photo.size = false
			} else {

								$clearText(opts.message , opts.uploadError , opts.progress);

								$setButton(opts.add , true , 'disabled' , 'btn-primary');	}
	 }



function $checkImageType(file , opts , $$$$file) {

	if (file) {

			if (file.type.indexOf('image') == -1) {

		$clearText(opts.message , opts.progress);
	
		$setButton(opts.add , true , 'disabled' , 'btn-primary');
	
		$setText(opts.uploadError1 , 'Only Photo or Image is allowed to be uploaded in this field.' , 'block');
	
		$$$$file.photo.type = true;

								return false;		}

					if (!$$$$file.photo.size) {

							$clearText(opts.message , opts.uploadError , opts.uploadError1 , opts.progress);

							$setButton(opts.add , false , 'btn-primary' , 'disabled');	}

						else {
												$clearText(opts.message , opts.uploadError1 , opts.progress);

												$setButton(opts.add , true , 'disabled' , 'btn-primary');			}	}	
			else {
							$clearText(opts.message , opts.uploadError , opts.uploadError1 , opts.progress);		}
}




function $validateSignature(file , opts , $$$file) {

        const filereader = new FileReader()

        filereader.onloadend = function(evt) {

            if (evt.target.readyState === FileReader.DONE) {

                const uint = new Uint8Array(evt.target.result);

                let bytes = [];

                uint.forEach((byte) => {	bytes.push(byte.toString(16))	});

                const hex = bytes.join('').toUpperCase();

								var signatureType = getTypeFromMagicNumber(hex);

			if (signatureType.indexOf('image') == -1) {

		$clearText(opts.message , opts.progress);

		$clearText(opts.message , opts.uploadError , opts.uploadError1 , opts.progress);
	
		$setButton(opts.add , true , 'disabled' , 'btn-primary');
	
		$setText(opts.uploadError1 , 'Only Photo or Image is allowed to be uploaded in this field.' , 'block');
	
		$$$file.photo.type = true;

								return false;		}	  }		}

				if (file)	{

        const blob = file.slice(0, 4);

        filereader.readAsArrayBuffer(blob);		}		
}



function $uploadImage(signedUrl , data , opts , $$$file) {

	$$$file.photo.url = `${signedUrl.data.url}/${signedUrl.data.fields.key}`;

	var $myFormData = new FormData();

	for (var key in signedUrl.data.fields) {

			$myFormData.append(key , signedUrl.data.fields[key]);
	}

	$myFormData.append('file' , data.photo);

$xhrUpload = new XMLHttpRequest();

$xhrUpload.upload.onprogress = function(evt) {
												
if (evt.lengthComputable) {
	
	var percentComplete = evt.loaded / evt.total;
	
			percentComplete = parseInt(percentComplete * 100);
	
	var progress = Math.round(percentComplete);

			$setText(opts.percent , `${progress}`  , 'inline-block');		}
};

$xhrUpload.upload.onload = function(res) {

};

$xhrUpload.upload.onerror = function(evt) {

			$setElement(opts.elem , false);
	
			$setButton(opts.add , false , 'btn-primary' , 'disabled');
	
			$showButton(opts.can , 'none');
	
			$clearText(opts.message , opts.percent , opts.text , opts.progress);
	
			$setText(opts.uploadError , 'An error has occured. Please try again.' , 'block');
};

$xhrUpload.upload.onabort = function(evt) {

		$setElement(opts.elem , false);

		$setButton(opts.add , false , 'btn-primary' , 'disabled');

		$clearText(opts.message , opts.percent , opts.text , opts.progress);

		$setText(opts.message , 'Photo upload cancelled. You can now upload another photo.' , 'inline');

};

$xhrUpload.upload.ontimeout = function(evt) {

	/*My mark*/

		$setElement(opts.elem , false);
	
		$setButton(opts.add , false , 'btn-primary' , 'disabled');
	
		$showButton(opts.can , 'none');
	
		$clearText(opts.message , opts.percent , opts.text , opts.progress);
	
		$setText(opts.uploadError , 'File upload has has timed-out. Please try again.' , 'block');
};

$xhrUpload.onload = function(res) {

if (res.target.readyState == 4 && res.target.status == 201) {

			$showButton(opts.add , 'none');
			
			$setButton(opts.del , false , 'btn-primary' , 'disabled');
			
			$showButton(opts.del , 'inline');
			
			$clearText(opts.message , opts.percent , opts.text , opts.progress);
			
			$setText(opts.text , 'Photo successfully uploaded.' , 'block');
			
			$showButton(opts.can , 'none');
			
			$setElement(opts.can , false);

if ($rmethod == 'POST') {

		$setButton('btn-submit' , false , 'btn-submit' , 'disabled');			}

		var $subUpload = new XMLHttpRequest();

		$subUpload.open('POST' , '/api/upload/');

		$subBody = {	'Key' : $$$file.key 	};

		$subUpload.setRequestHeader('Content-Type' , 'application/json;charset=UTF-8');

		$subBody = JSON.stringify($subBody);

		$subUpload.send($subBody);

		$subUpload.onload = function(res) {

				return true; } 		

			return false;		}
};

$xhrUpload.open('POST' , signedUrl.data.url);

$xhrUpload.send($myFormData);

    };



function $removeImage(key , opts) {

	var $xhrRemove = new XMLHttpRequest();

	$xhrRemove.onload = function(res) {

			if (res.target.status == 200) {

				if ($rmethod == 'POST') {

						$setButton('btn-submit' , true , 'disabled' , 'btn-primary');		}

						$setElement(opts.elem , false);
						
						$setButton(opts.add , false , 'btn-primary' , 'disabled');

						$showButton(opts.del , 'none');
						
						$showButton(opts.add , 'inline');
						
						$setText(opts.message , 'Photo successfully deleted. You can now upload another photo.' , 'inline');

						return false;		}

				if (true) {

						$clearText(opts.message , opts.uploadError , opts.progress);
						
						$setButton(opts.del , false , 'btn-primary' , 'disabled');
						
						$setText(opts.uploadError , 'An error has occured. Please try again.' , 'block');

						return false;		}
	};

	$xhrRemove.ontimeout = function(e) {

						$clearText(opts.message , opts.text , opts.uploadError , opts.progress);
					
						$setButton(opts.del , false , 'btn-primary' , 'disabled');
					
						$setText(opts.uploadError , 'An error has occured while removing image. Please try again.' , 'block');
	};

	$xhrRemove.open('DELETE' , '/api/photo/o/' + key);

	$xhrRemove.timeout = 6000;

	$xhrRemove.send();

}


