var router = require('express').Router() , objectCtrl = require('../controllers/object');


router.post('/sign/photo/:filename/'										,														objectCtrl.signPhoto);


router.delete('/photo/:entry'														,														objectCtrl.photoDelete);



module.exports = router;