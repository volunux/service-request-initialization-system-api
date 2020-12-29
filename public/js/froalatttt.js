/*window.onbeforeunload = function(e) {

          $.ajax({
                    'type' : `POST` ,

                    'data' : {

                        'names' : ['Yusuf']

                    } ,

                    'url' : `/delete/objects` ,

                    'dataType'  : 'json' , 

                    'success' : (data , status) => {

                    } ,

                    'error' : (res , xhr) => {

                    }
          })
};*/

var $formProcess = $('#formSubmit') , $links = $('#link').val() , $title = '' , data = {} , rmethod = $('#rmethod').val() , objectKeys = [] , $body = '';

$.get('/s3/signature' , {})

.done((s3Hash) => {

  console.log(s3Hash);

new FroalaEditor('#editor' , {
      
    'imageUploadToS3' : s3Hash ,

    'imageUploadUrl' : 'https://i.froala.com/upload?i=1' ,

    'imageUploadParams' : {

        'id' : 'me_editor'
    } ,

    'fileMaxSize' : 1024 * 1024 * 100 ,

    'imageMaxSize': 1024 * 500 , 

    'imageMove' : false ,

/*    'imageDefaultDisplay' : 'block' ,

    'imageDefaultAlign' : 'center' ,

    'imageDefaultWidth' : 200 ,
*/
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

                'image.uploadedToS3' : (link , key , response) => {

                        console.log('Uploaded');

                        console.log(link);

                        objectKeys.push({'Key' : key});

                        console.log(key);
                } ,

                'image.error' : (err) => {

                  console.log(err)

                    if (err.code == 5) {

                        var layer = $('.fr-image-progress-bar-layer');

                          layer.find('h3').text(err.message);

                    }
                } ,

                'image.inserted' : ($img) => {

                  console.log($img);

                } ,

                'image.beforeUpload' : ($img , b , c) => {

                    console.log($img);

                    console.log(b);

                    console.log(c)

                } ,

  }

  })

});

$formProcess.click(function(e) {

      $('ul.ajax').empty();

      $clearEvent(e);

      console.log(data);

      $('.fr-element img').removeAttr('style');

        data = {

              'title' : $('#title').val() ,

              'ethnic_group' : $('#ethnic_group').val() ,

              'country' : $('#country').val(),

              'century' : $('#century').val(),

              'continent' : $('#continent').val(),

              'region' : $('#region').val(),

              'main_body' : $('.fr-element').html()       ,

              'photos' : objectKeys
              
        };

              formValidity();
        
                      if(!$body) {
                                    return $('ul.ajax').css('display' , 'block').append('<li> Error processing the form. Please read the form guidelines and fill in the fields with valid values.</li>');    }
              checkFormFields();

          $.ajax({
                    'type' : `${rmethod}` ,

                    'data' : data ,

                    'url' : `/api/${$links}` ,

                    'dataType'  : 'json' , 

                    'success' : (data , status) => {

                        window.location = `/user/entry/${$links}`;

                    } ,

                    'error' : (res , xhr) => {

                          var errors = [];

                          $.each(JSON.parse(res.responseText) , function(i , indi) {

                                        errors.push(indi['message']);
                          });

                          $.each(errors , function(i , v) {

                            $('ul.ajax').css('display' , 'block').append('<li>' + v + '</li>');
                                
                              })
                    }
          })
  }); 



var formFillGuide = $('.showFormGuide');

formFillGuide.click(function() {

  $( "ul.guidelines" ).toggle();

});

function $clearEvent($el) {

    $el.stopPropagation();
    $el.preventDefault();
}

function formValidity() { $body = Boolean(data.title || data.ethnic_group || data.country || data.main_body)  };

function checkFormFields() {

          if (!($('#title').val())) {               return $('ul.ajax').css('display' , 'block').append('<li> Title should be provided and cannot be empty.</li>');                       }

        if ($('#title').val().length > 150) {     return $('ul.ajax').css('display' , 'block').append('<li> Title cannot be greater than 150 characters in length.</li>');              }

        if (!($('#ethnic_group').val())) {        return $('ul.ajax').css('display' , 'block').append('<li> Ethnic Group should be provided and cannot be empty.</li>');                }

        if (!($('#country').val())) {             return $('ul.ajax').css('display' , 'block').append('<li> Country should be provided and cannot be empty.</li>');                     }
        
        if (!($('#editor').val())) {              return $('ul.ajax').css('display' , 'block').append('<li> Main body should be provided and cannot be empty.</li>');                   }

        if ($('#editor').val().length < 220 ) {  return $('ul.ajax').css('display' , 'block').append('<li> Main body should be provided and cannot be empty.</li>');         }

        if ($('#editor').val().length > 6000 ) {  return $('ul.ajax').css('display' , 'block').append('<li> Main body cannot be greater than 6000 characters in length.</li>');         }
}


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
