var $formProcess = $('#formSubmit') , $links = $('#link').val() , $title = '' , data = {} , rmethod = $('#rmethod').val() , objectKeys = [] , $body = '';

$.get('/s3/signature' , {})

.done((s3Hash) => {

new FroalaEditor('#editor' , {
			
		'imageUploadToS3' : s3Hash ,

		'imageUploadUrl' : 'https://i.froala.com/upload?i=1' ,

		'imageUploadParams' : {

				'id' : 'me_editor'
		} ,

		'fileMaxSize' : 1024 * 1024 * 100 ,

		'imageMaxSize': 1024 * 500 , 

		'linkAlwaysBlank' : true ,

		'imageMove' : false ,

		'imageDefaultDisplay' : 'block' ,

		'imageDefaultAlign' : 'center' ,

		'imageDefaultWidth' : 200 ,

		'imagePaste' : false ,

		'imagePasteProcess' : true ,

		'imageAllowedTypes' : ['jpeg', 'jpg', 'png'] ,

		'htmlAllowedAttrs' : ['title' , 'class' , 'href' , 'src' , 'alt' , 'style' , 'id'] ,

		'htmlAllowedStyleProps' : ['font-family', 'font-size', 'background', 'color', 'width', 'text-align', 'vertical-align', 'background-color'] ,

		'imageEditButtons' : ['imageAlt' , 'imageLink' , 'imageRemove'] ,

		'imageUploadRemoteUrls' : false ,

		'tabSpaces' : 4 ,

		'indentMargin' : 10 ,

		'imageInsertButtons' : ['imageBack' , '|' , 'imageUpload' , 'imageByURL'] ,

		'imageAddNewLine' : true ,

		'heightMin' : 500 ,
		
		'heightMax' : 300 ,

		'charCounterCount' : true ,

		'charCounterMax' : 6000 ,

		'autofocus' : true ,

		'dragInline' : false ,

		'fileAllowedTypes' : ['application/pdf' , 'appllication/msword'] ,

		'fileUploadParam' : 'aye_name' ,

		'fileUseSelectedText' : true ,

		'attribution' : false ,

		'htmlExecuteScripts' : false ,

		'pastePlain' : true , 

		'tabSpaces' : 4 ,

		'imageResize' : false ,

		'paragraphFormat' : {
		
		'N': 'Normal',
		'H1': 'Heading 1',
		'H2': 'Heading 2',
		'H3': 'Heading 3',
		'H4': 'Heading 4',
		'H5': 'Heading 5',
		'H6': 'Heading 6',
		'PRE': 'Code'
},

	'quickInsertTags' : [] ,

	'linkEditButtons' : ['linkEdit', 'linkRemove'] ,

	'linkInsertButtons' : ['linkBack'] , 

	'linkNoOpener' : true ,

	'linkAlwaysNoFollow' : true ,

	'linkAutoPrefix' : 'https://' ,

	 'quickInsertEnabled' : false ,

	 'useClasses' : true , 

 'toolbarButtons' : {

	'moreText': {
								 'buttons': ['bold', 'italic', 'underline', '', 'subscript', 'superscript', '', '', '', '', '', '', 'clearFormatting']
	} ,

	'moreParagraph': {
											'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', '', 'lineHeight', 'outdent', 'indent', 'quote']
	} ,

	'moreRich': {
									'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', '', '', 'specialCharacters', '', 'insertFile', 'insertHR']
	} ,

	'moreMisc': {
								'buttons': ['undo', 'redo', '', '', '', 'spellChecker', 'selectAll', 'html', 'help'] ,
																																																				'align': 'right' ,
																																																														'buttonsVisible': 2
	}   } ,

	 'toolbarButtonsXS' : {

	'moreText': {
								 'buttons': ['bold', 'italic', 'underline', '', 'subscript', 'superscript', '', '', '', '', '', '', 'clearFormatting']
	} ,

	'moreParagraph': {
											'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', '', 'lineHeight', 'outdent', 'indent', 'quote']
	} ,

	'moreRich': {
									'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', '', '', 'specialCharacters', '', 'insertFile', 'insertHR']
	} ,

	'moreMisc': {
								'buttons': ['undo', 'redo', '', '', '', 'spellChecker', 'selectAll', ] ,
																																													'align': 'right' ,
																																																							'buttonsVisible': 2
	}   } ,

	'events' : {  
								'image.removed' : ($img) => {

											var img = $img[0]['src'];

											$.post('/form' , {
																				'Key' : img
											} , (data) => {

											});
								} ,

								'image.uploaded' : ($img) => {

								} ,

								'image.uploadedToS3' : (link , key , response) => {

												objectKeys.push({'Key' : key});

											$.post('/api/upload/' , {
																								'Key' : key
											} , (data) => {

											});
								} ,

								'image.error' : (err) => {

										if (err.code == 5) {

												var layer = $('.fr-image-progress-bar-layer h3');

												layer.text(err.message);    }

										else if (err.code == 6) {

												var layer = $('.fr-image-progress-bar-layer h3');

												layer.text(err.message);    }

										else if (err.code == 3) {

												var layer = $('.fr-image-progress-bar-layer h3');

												layer.text(err.message);
										}


								} ,

								'image.inserted' : ($img) => {

								} ,

								'image.beforeUpload' : ($img , b , c) => {

								} ,
	}

	})

});



$formProcess.click(function(e) {

			$('ul.errors').empty();

			$clearEvent(e);

			var main_body = document.getElementById('editor');

			var main_body1 = document.querySelector('.fr-element');

			var plain_body = document.getElementById('plain_body');

			plain_body.value = main_body1.textContent;

			setFirstAddress();

			setSecondAddress();

			setThirdAddress();

			setFourthAddress();

			setLetterHeading();

			setLetterBody();

			setAccountDetails();

			main_body.value = $('.fr-element').html();

			var letterForm = document.querySelector('form');
		
				if (plain_body.value.length < 10 ) {

				var ulErrors = document.querySelector('.form-errors');

				ulErrors.innerHTML = '';

				var h33 = document.querySelector('#request-form h3') , parentt = h33.parentNode , ull = document.createElement('ul') , lii = document.querySelector('li') ,

				pp = document.createElement('p') , bb = document.createElement('b');

				bb.textContent = 'Errors found after trying to process the form. These include : -';

				pp.appendChild(bb);

				ull.className = 'errors';

				lii.textContent = 'Main body should be provided and cannot be empty.';

				ull.appendChild(lii);

				parentt.insertBefore(pp , h33.nextSibling);

				return parentt.insertBefore(ull , pp.nextSibling);	}

			letterForm.submit();
	});  



var formFillGuide = $('.showFormGuide');

formFillGuide.click(function() {

	$( "ul.guidelines" ).toggle();

});

function $clearEvent($el) {

		$el.stopPropagation();
		$el.preventDefault();
}

function formValidity() { 


	$body = Boolean((plain_body.value.length < 10))  };


function setFirstAddress() {

	var firstAdd = document.getElementById('first-address');

	if (firstAdd && firstAdd.children) {

			let elem = firstAdd.children;

			for (let i = 0; i < elem.length; i++) {

					elem[i].style['margin-left'] = '550px';	

					elem[i].style['line-height'] ='1.0';	}	}	}

function setSecondAddress() {

	var secondAdd = document.getElementById('second-address');

	if (secondAdd && secondAdd.children) {

			let elem = secondAdd.children;

			for (let i = 0; i < elem.length; i++) {

					elem[i].style['margin-left'] = '0px';	

					elem[i].style['line-height'] ='1.0';	}	}
}

function setThirdAddress() {

	var thirdAdd = document.getElementById('third-address');

	if (thirdAdd && thirdAdd.children) {

			let elem = thirdAdd.children;

			for (let i = 0; i < elem.length; i++) {

					elem[i].style['margin-left'] = '0px';	

					elem[i].style['line-height'] ='1.0';	}	}	}

function setFourthAddress() {

	var fourthAdd = document.getElementById('fourth-address');

	if (fourthAdd && fourthAdd.children) {

			let elem = fourthAdd.children;

			for (let i = 0; i < elem.length; i++) {

					elem[i].style['margin-left'] = '0px';	

					elem[i].style['line-height'] ='1.0';	}	}	}

function setLetterHeading() {

	var letterheading = document.getElementById('letter-heading');

	if (letterheading) {

					letterheading.style['margin-left'] = '0px';

					letterheading.style['line-height'] ='0.8';	}		}

function setLetterBody() {

	var letterBody = document.getElementById('letter-body');

	if (letterBody && letterBody.children) {

			let elem = letterBody.children;

			for (let i = 0; i < elem.length; i++) {

					elem[i].style['margin-left'] = '0px';

					elem[i].style['line-height'] ='1.0';	}	}	}

function setAccountDetails() {

	var acctDetails = document.getElementById('account-details');

	if (acctDetails && acctDetails.children) {

			let elem = acctDetails.children;

			for (let i = 0; i < elem.length; i++) {

					elem[i].style['margin-left'] = '0px';

					elem[i].style['line-height'] ='0.8';	}	}	}




var $pop = $('.fr-element');

//var popup = $pop.popups.get('image.insert');

var layer = $('.fr-image-progress-bar-layer');

layer.find('h3').text('The image is too large');

/*
var editor = $('form');

editor.on('DOMNodeInserted DOMNodeRemoved' , function() {

var editor = document.querySelector(".fr-element");

editor.addEventListener("input" , () => {

document.getElementById('pvalue').value = editor.innerText;    });  

})  

*/
