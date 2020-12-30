module.exports = {
		
		'secretAccessKey': process.env.posts_photo_secretkey ,

		'accessKeyId': process.env.posts_photo_accesskey ,

		'region' : process.env.posts_region ,

		'Bucket' : process.env.posts_bucket ,

		'httpOptions' : {

				'timeout' : 86400000 ,

				'connectTimeout' : 12000
		}

}