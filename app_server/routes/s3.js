var express = require('express') , router = express.Router() , FroalaEditor = require('../../../node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js');

const { v4: uuidv4 } = require('uuid');

router.get('/signature' , (req, res) => {

  console.log('Hello World');
  
  var configs = {

    'bucket' : process.env.posts_bucket ,

    'region' : process.env.posts_region ,

    'keyStart' : '' ,

    'acl' : 'public-read-write' ,

				'secretKey': process.env.aremiuser_secretkey ,

				'accessKey': process.env.aremiuser_accesskey ,
  }

  var s3Hash = FroalaEditor.S3.getHash(configs);

  console.log(s3Hash);

  res.json(s3Hash);

});

module.exports = router;