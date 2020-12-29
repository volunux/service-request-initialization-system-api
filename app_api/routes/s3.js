var express = require('express') , router = express.Router() , s3Hasher = require('../config/s3-hash.js');

const { v4 : uuidv4 } = require('uuid');

router.get('/signature' , (req, res) => {
  
  var configs = {

    'bucket' : process.env.posts_bucket ,

    'region' : process.env.posts_region ,

    'keyStart' : '' ,

    'acl' : 'public-read-write' ,

				'secretKey': process.env.aremiuser_secretkey ,

				'accessKey': process.env.aremiuser_accesskey ,
  }

  var s3Hash = s3Hasher.getHash(configs);

  res.json(s3Hash);

});



module.exports = router;