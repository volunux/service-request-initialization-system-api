module.exports = {
    
	'secretAccessKey': process.env.aremiuser_secretkey ,

	'accessKeyId': process.env.aremiuser_accesskey ,

	'httpOptions' : {

			'timeout' : 86400000 ,

			'connectTimeout' : 12000
	}
    
}