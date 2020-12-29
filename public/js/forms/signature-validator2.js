
let filesRead = [];
let numFiles = 0;

function treatResult() {
	filesRead.map(e=>{
	        const uint = new Uint8Array(e.fileStart);
                let bytes = [];
                uint.forEach((byte)=>bytes.push(byte.toString(16)));
                e.magicNumber = bytes.join('').toUpperCase();
		e.typeFromMagicNumber = getTypeFromMagicNumber(e.magicNumber);
	});
	let list = filesRead.map(e=>
		'<li>Name: ' + e.name + ' ||| MimeType: ' + e.type + ' ||| Magic Number: ' + 
		    e.magicNumber + ' ||| Type from mn: ' + e.typeFromMagicNumber + '</li>').join('');
	document.getElementById('list').innerHTML = list;
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
		return 'image/jpeg'
	    case '504B0304':
		return 'application/zip'
	    default:
		return 'Unknown filetype'
	}
}

function treatFile(file) {
        var reader = new FileReader();
        const blob = file.slice(0, 4);
	reader.readAsArrayBuffer(blob);
	reader.onprogress = function(event) {
	    filesRead.push({name: file.name, type : file.type, fileStart: event.target.result});
	    reader.abort();
	    if (filesRead.length == numFiles) 
    		treatResult();
	};
}

function handleFileSelect(evt) {
	var file = evt.target.files[0];
    	treatFile(file);
}

document.getElementById('photo-1').addEventListener('change', handleFileSelect, false);