let credentials = document.getElementById('generateCredentials') , oparsing = JSON.parse;

let proposedCredential = document.getElementById('proposedCredential').value;

credentials.onclick = function(e) {

	e.stopPropagation();

	e.preventDefault();

let getCredentials = new XMLHttpRequest();

let requestUsername = document.getElementById('requestUsername') , requestPassword = document.getElementById('requestPassword');

getCredentials.onload = function(res) {

if (res.target.readyState == 4 && res.target.status == 200) {

	let data = oparsing(res.target.response);

	requestUsername.value = data.requestUsername;

	requestPassword.value = data.requestPassword

		}
};

getCredentials.open('POST' , '/api/request-credential/create');

getCredentials.setRequestHeader('Content-Type' , 'application/json');

let credBody = {'genRequestUsername' : proposedCredential};

credBody = JSON.stringify(credBody);

getCredentials.send(credBody);


}