var formProcess = $('button') , links = $('#link').val() , $title = '' , data = {};

  formProcess.click(function(e) {

      $('ul.ajax').empty();

      e.stopPropagation();
      e.preventDefault();

        var data = {

              'name' : $('#name').val() ,

              'defintion' : $('#defintion').val() ,

              'morphology' : $('#morphology').val() ,

              'gloss' : $('#gloss').val() ,

              'alphabet' : $('#alphabet').val() ,

              'continent' : $('#continent').val() ,

              'region' : $('#region').val() ,

              'ethnic_group' : $('#ethnic_group').val() ,

              'gender' : $('#gender').val(),

              'baby' : $('#baby').val() ,

              'specie' : $('#specie').val() ,

              'country' : $('#country').val(),
        };

        function formValidity() {

            $title = Boolean(data.name && data.definition && data.morphology && data.gloss && data.alphabet && data.continent && data.region && data.ethnic_group &&

                              data.gender && data.baby && data.baby && data.specie)

              console.log($title);


                    };

              formValidity();
        
        if(!$title) {
                      $('ul.ajax').css('display' , 'block').append('<li> Error processing the form. Please fill in the required fields.</li>');
                                                                                                                                                  return false;   }

          $.ajax({
                    'type' : 'POST' ,

                    'data' : data ,

                    'url' : `/api/${links}` ,

                    'dataType'  : 'json' , 

                    'success' : (data , status) => {

                        window.location = `/${links}/` + data.status.url

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

  

/*
var editor = $('form');

editor.on('DOMNodeInserted DOMNodeRemoved' , function() {

var editor = document.querySelector(".fr-element");

editor.addEventListener("input" , () => {

document.getElementById('pvalue').value = editor.innerText;    });	

})	

*/
