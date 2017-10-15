var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  if(res.locals.login){

    req.db.collection('usernotecollection').find({"name": req.user.displayName}).toArray(function(err, results){
    console.log(results);
    res.render('index', {
      user: req.user,
      data: results,
      title:'Keizen'
    });
    });
  }
  else{
    res.render('index',{user:req.user});
  }



});


module.exports = router;
