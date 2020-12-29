var $objectInfo = {

		'key' : '' , 

		'photo' : {

				'url' : '' ,

				'size' : false ,

				'type' : false } 

};

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


var $rmethod = document.getElementById('rmethod').value;

var $formFillGuide = document.getElementById('showFormGuide');

var objectKey = '';

var $fileSize = 500 * 1024;

var ajaxCall = '';

var $formProcess = document.getElementById('btn-submit');

var $body = '' , $data = {};

$formFillGuide.onclick = function() {

	var $guidelines = document.getElementById('guidelines');

	if ($guidelines.style.display == 'none') {
			
				$guidelines.style.display = 'block';	} 

	else {
					$guidelines.style.display = 'none';	}		};

if (window.attachEvent) { 

		window.attachEvent('onload' , function () {

							$pageLoad($file1);
							$pageLoad($file2);
							$pageLoad($file3);
							$pageLoad($file4);			}); }

else if (window.addEventListener) {

		window.addEventListener('load' , function () {

							$pageLoad($file1);
							$pageLoad($file2);
							$pageLoad($file3);
							$pageLoad($file4);			} , false);	}

else {

	document.addEventListener('load' , function () {

							$pageLoad($file1);
							$pageLoad($file2);
							$pageLoad($file3);
							$pageLoad($file4);			} , false);}


function $pageLoad(opts) { 

	var $uploadBtn = document.getElementById(opts.add) , $removeBtn = document.getElementById(opts.del) , $inputFile = document.getElementById(opts.elem);

	$formPost(opts.add);

	$inputFile.onchange = function(e) {

		var $el = e.target.files[0];

			$checkImageSize($el);

			$checkImageType($el);		};

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

			$checkImageSize(data.photo);

			$checkImageType(data.photo);

var $getHash = new XMLHttpRequest();

$getHash.open('POST' , '/api/uploader/sign/photo/' + data.photo.name + '/');

$getHash.setRequestHeader('Content-Type' , 'application/json;charset=UTF-8');

$getHash.onload = function(res) { $objectInfo.key = JSON.parse(res.target.responseText).data.fields.key;

		if (res.target.status == 200) {

		$setElement(opts.elem , true);

		$setButton(opts.add , true , 'disabled' , 'btn-primary');

		$showButton(opts.can , 'inline');

		$setText(opts.message , 'Photo is uploading. Please be patient and wait. % uploaded : ' , 'inline' );

		return $uploadImage(JSON.parse(res.target.responseText) , data);		}

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

			$removeImage($objectInfo.key);
 };


function $checkImageSize($myFile) {

	if ($myFile) {
									if ($myFile.size > $fileSize) {
											
											$clearText(opts.message , opts.uploadError , opts.progress);

											$setButton(opts.add , true , 'disabled' , 'btn-primary');

											$setText(opts.uploadError , 'File is too large and will not be uploaded.' , 'block');

											$objectInfo.photo.size = true

																					return false;		}
								
								$clearText(opts.message , opts.uploadError , opts.progress);

								$setButton(opts.add , false , 'btn-primary' , 'disabled');

								$objectInfo.photo.size = false
			} else {

								$clearText(opts.message , opts.uploadError , opts.progress);

								$setButton(opts.add , true , 'disabled' , 'btn-primary');	}
	 }

function $checkImageType(file) {

	if (file) {

			if (file.type.indexOf('image') == -1) {

		$clearText(opts.message , opts.progress);
	
		$setButton(opts.add , true , 'disabled' , 'btn-primary');
	
		$setText(opts.uploadError1 , 'Only Photo or Image is allowed to be uploaded in this field.' , 'block');
	
		$objectInfo.photo.type = true;

								return false;		}

					if (!$objectInfo.photo.size) {

							$clearText(opts.message , opts.uploadError , opts.uploadError1 , opts.progress);

							$setButton(opts.add , false , 'btn-primary' , 'disabled');	}

						else {
												$clearText(opts.message , opts.uploadError1 , opts.progress);

												$setButton(opts.add , true , 'disabled' , 'btn-primary');			}	}	
			else {
							$clearText(opts.message , opts.uploadError , opts.uploadError1 , opts.progress);		}
}


function $uploadImage(signedUrl , data) {

	$objectInfo.photo.url = `${signedUrl.data.url}/${signedUrl.data.fields.key}`;

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

		$setButton('btn-submit' , false , 'btn-primary' , 'disabled');			}

		var $subUpload = new XMLHttpRequest();

		$subUpload.open('POST' , '/api/upload/');

		$subBody = {	'Key' : $objectInfo.key 	};

		$subUpload.setRequestHeader('Content-Type' , 'application/json;charset=UTF-8');

		$subBody = JSON.stringify($subBody);

		$subUpload.send($subBody);

		$subUpload.onload = function(res) {

				console.log(res);		} 		

			return false;		}
};

$xhrUpload.open('POST' , signedUrl.data.url);

$xhrUpload.send($myFormData);

    };

function $removeImage(key) {

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


const uploads = [];

    const fileSelector = document.getElementById('photo-1')

    fileSelector.addEventListener('change', (event) => {

        const file = event.target.files[0];

        const filereader = new FileReader()

        filereader.onloadend = function(evt) {

            if (evt.target.readyState === FileReader.DONE) {

                const uint = new Uint8Array(evt.target.result);

                let bytes = [];

                uint.forEach((byte) => {	bytes.push(byte.toString(16))	});

                const hex = bytes.join('').toUpperCase();

                uploads.push({
                    filename: file.name,
                    filetype: file.type ? file.type : 'Unknown/Extension missing',
                    hex: hex
                });

                render();
            }
        }

        const blob = file.slice(0, 4);

        filereader.readAsArrayBuffer(blob);
    });

    const render = () => {
        const container = document.getElementById('list')
        const uploadedFiles = uploads.map((file) => {
            return `<div>
                    <strong>${file.filename}</strong><br>
                    Filetype from file object: ${file.filetype}<br>
                    Hex: <em>${file.hex}</em>
                    </div>`
        })
        container.innerHTML = uploadedFiles.join('')
    }

/** Form Handling Section below **/ 


	$formProcess.onclick = function(e) {

				$clearEvent(e);

				$clearText('ajax');

				var $myData = {	'message' : document.getElementById('text').value };

				$myData.photo_detail = {};

				if ($myData.photo) {

					var $photo_detail = {'location' : $objectInfo.photo.url , 'mimetype' : $myData.photo.type , 'size' : $myData.photo.size , 'encoding' : $myData.photo.type};

					$myData.photo_detail = $photo_detail;	}

				if ($rmethod == 'PUT') {

					function formValidity() {

								 $body = Boolean( $myData.message && $myData.date && $myData.century && $myData.about && $myData.message.length < 150 && $myData.date.length < 15	);  	}		}

				if ($rmethod == 'POST') {

					function formValidity() {

							 $body = Boolean( $myData.message && $myData.date && $myData.century && $myData.continent && $myData.message.length < 150 && $myData.date.length < 15 	);		}			}

			formValidity();

				if(!$body) {

				var $valMessages = document.getElementById('ajax');

				$valMessages.style.display = 'block';

				$valMsg = document.createElement('li');

				$valMsg.textContent = 'Error processing the form. Please read the form guidelines and fill in the form as required.';

				$valMessages.appendChild($valMsg);

				$clearEvent(e);
							
							return false;   }

				$setButton('btn-submit' , true , 'disabled' , 'btn-primary');
				
				$setText(opts.message , 'Form is processing. Please be patient and wait.' , 'inline');
																																													
				delete $myData.photo;

				if ($rmethod == 'PUT') {

						$updateUrl = document.getElementById('update').value;

						$links = $link + '/' + $updateUrl;

				}

$xhrForm = new XMLHttpRequest();

$xhrForm.open($rmethod , '/api/' + $links);

$xhrForm.setRequestHeader('Content-Type' , 'application/json');

$myData = JSON.stringify($myData);

$xhrForm.onload = function(res) {

	if (res.target.status == 200 || res.target.status == 201) {

			setTimeout(() =>  window.location = `/user/entry/${$link}` , 3000);

			return false;
	}


	if (res.target.status == 400) {

			errors = [];

			$valErrors = JSON.parse(res.target.responseText);

			if ($valErrors) {

			for (errMsg in $valErrors) {

					errors.push($valErrors[errMsg]['message']);			}

				if (errors) {

			for(var item in errors) {

		var $valMessages = document.getElementById('ajax');

				$valMessages.style.display = 'block';

				$valMsg = document.createElement('li');

				$valMsg.textContent = errors[item];

				$valMessages.appendChild($valMsg);			}		}

				$clearText(opts.message , opts.text , opts.uploadError , opts.progress);

				$setButton('btn-submit' , false , 'btn-primary' , 'disabled');

				$setText(opts.message , 'Error processing form. Please read the guidelines above.' , 'inline');	

				return false;		}		}

				$clearText(opts.message , opts.text , opts.uploadError , opts.progress);

				$setButton('btn-submit' , false , 'btn-primary' , 'disabled');

				$setText(opts.message , 'Error processing form. Please read the guidelines above.' , 'inline');	
};

$xhrForm.send($myData);				}; 



function $showButton(ref , display) {

	var $el = document.getElementById(ref);
	
			$el.style.display = display;						}



function $formPost(elem) {

			if ($rmethod == 'POST') {

			$setButton('btn-submit' , true , 'disabled' , 'btn-primary');

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