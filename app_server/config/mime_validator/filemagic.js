var fs = require('fs');

fs.readFile('C:\\Users\\YUSEBOBO\\Desktop\\books\\android\\Android Programming, The Big Nerd Ranch Guide (2nd Edition).pdf' , function(err , stat) {

			console.log(stat.toString('hex' , 0 , 4));
});


console.log();