$('.like').on('click' , (e) => {
	
	e.preventDefault();
	e.stopPropagation();
	
		var photo = $(this).data('class');

		var path = window.location.href.split('/').pop();

			$.post('/api/photo/d/' + path + '/vote').done((data) => {
						
						$('.vote').text(data.vote);
																									});
});

$('#btn-delete').on('click' , function(e) {

	e.preventDefault();
	e.stopPropagation();

		var $this = $(this);
	
		var remove = confirm('Are you sure you want to remove this entry?');

		var path = window.location.href.split('/').pop();
			
			if (remove) {
										var imgId = $(this).data('id');
										
										$.ajax({
															'url' : '/api/photo/' + path ,

															'type' : 'DELETE'

								}).done((result) => {
																			if (result) {
																		
																			$this.removeClass('btn-danger').addClass('btnsuccess');
																		
																			$this.find('i').removeClass('fatimes').
																		
																			addClass('fa-check');
																		
																			$this.append('<span> Deleted!</span>');
														}
					});
}
});

function $clearEvent($el) {

		$el.stopPropagation();
		$el.preventDefault();
}