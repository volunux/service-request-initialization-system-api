let credentials = document.getElementById('generateCredentials')

credentials.onclick = function(e) {

	e.stopPropagation();

	e.preventDefault();

let newPassword = Math.random().toString(36).substr(2, 9);

let requestPassword = document.getElementById('requestPassword');

	requestPassword.value = newPassword;

}
