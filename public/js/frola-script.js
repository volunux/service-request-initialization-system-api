/*var data = {'files' : [] };*/

new FroalaEditor('#editor' , {

		'imageUploadURL' : '/upload-photo' ,

		'imageUploadParams' : {

				'id' : 'me_editor'
		} ,

		'fileMaxSize' : 1024 * 1024 * 100 ,

		'imageMaxSize': 1024 * 1024 * 1 , 

		'imageDefaultDisplay' : 'block' ,

		'imageUploadMethod' : 'POST' ,

		'imagePaste' : false ,

		'imagePasteProcess' : true ,

		'imageAllowedTypes' : ['jpeg', 'jpg', 'png'] ,

		'htmlAllowedAttrs' : ['title' , 'href' , 'src' , 'alt'] ,

		'imageEditButtons' : ['imageAlt' , 'imageLink' , 'imageRemove'] ,

		'imageInsertButtons' : ['imageBack' , '|' , 'imageUpload' , 'imageByURL'] ,

		'imageAddNewLine' : true ,

		'heightMin' : 500 ,
		
		'heightMax' : 300 ,

		'charCounterCount' : false ,

		'charCounterMax' : 5000 ,

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

	 'useClasses' : false , 

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
	}		} ,

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
								'image.beforeUpload' : function (a , b , c , d) {

										console.log(a);

										console.log(b);

										console.log(c);

										console.log(d);

								} ,

								'image.removed' : ($img) => {

											var img = $img[0]['src'];

											console.log(img);

											$.post('/form' , {
																				'path' : img
											} , (data) => {

														console.log(data);
											})
								} ,

								'image.uploaded' : ($img) => {

												console.log('Uploaded');

												console.log($img);
								} ,


								'image.error' : (err) => {

									console.log(err);

									alert('Hello World');

										if (err.code == 5) {

												var layer = $('.fr-image-progress-bar-layer');

													layer.find('h3').text(err.message);

										}
								} ,

								'image.inserted' : ($img) => {

									console.log('Image inserted');	

									console.log($img);

								} ,

	}

});					



var $pop = $('#editor');

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
