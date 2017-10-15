var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  req.db.collection('usernotecollection').find().toArray(function(err, results){
  console.log(results);
  res.render('index', {
    user: req.user,
    data: results
  });
});
});
module.exports = router;
