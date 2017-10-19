var express = require('express');
var router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var ObjectId = require('mongodb').ObjectID;
var notebook = {};
/* GET home page. */
router.get('/', function(req, res, next) {
  // This if is required cos in logout flow I have req.user undefined and I cant query db.
  if(req.user){
    req.db.collection('usernotecollection').find({"name": req.user.displayName}).toArray(function(err, results){
    console.log("Earlier")
    console.log(results);
    //If my database not got this user. I create a dummmy user and insert to db.
    if(results.length == 0){
        results =  {
        "name": String(req.user.displayName),
        "description": "",
        "joiningDate": String(new Date()),
        "notebooks": [],
        "flashcards": []
      }
      console.log("Later");
      console.log(results);
      req.db.collection('usernotecollection').insert(results);
      console.log('User ' + req.user.displayName + 'created successfuly');
    }
    res.render('index', {
      user: req.user,
      data: results,
      title:'Kaizen'
    });
    });
  }
  else{
    res.render('index',{user:req.user});
  }
});

//This function needs serious refactoring
router.get('/home', ensureLoggedIn('/login'), function(req, res, next) {
  req.db.collection('usernotecollection').find({"name": req.user.displayName},  { notebooks: 1}).toArray(function(err, results){

    if(req.query.notebook){
      notebook = req.query.notebook;
      var notes = getObjects(results, 'notebookname', req.query.notebook)[0].notes;
      res.render('home', {
        user: req.user,
        notebooks: results[0].notebooks,
        items: notes   //this has to be removed
      });
    }else{
      notebook = results[0].notebooks[0].notebookname;
      res.render('home', {
        user: req.user,
        notebooks: results[0].notebooks,
        items: results[0].notebooks[0].notes   //this has to be removed
      });
    }
  });
});

//get all the notebooks of the user     //username is picked from req.user.displayName
router.get('/user/notebook', function(req, res, next){
    req.db.collection('usernotecollection').find({"name": req.user.displayName},  { notebooks: 1}).toArray(function(err, results){
    res.send(results[0].notebooks);
  });
});

//add a notebook for a specific user
router.post('/user/notebook', function(req, res, next){
  req.db.collection('usernotecollection').updateOne({"name": req.user.displayName}, {$push:{ "notebooks": req.body }}, function (err, documents) {
        res.send({ error: err, affected: documents });
    });
});

//adding notes to a notebook
router.post('/user/notebook/:nbkName/notes', function(req, res, next){
  console.log(req.notebook);
  req.db.collection('usernotecollection').updateOne({ "name": req.user.displayName, "notebooks.notebookname": notebook},
      { "$push":
          {"notebooks.$.notes": req.body}
      }, function (err, documents) {
        res.send({ error: err, affected: documents });
    });
});

//right now this is basically deleting all notes
//For all update/deleting of notes, we will be now modifying the entire bunch of notes for the notebookname
router.put('/user/notebook/notes/:noteName', function(req, res, next){
  //extract all notes for give particular notebook

  //Query to get all notes for a particular user
  req.db.collection('usernotecollection').find({
      "name": req.user.displayName,
    }, { "notebooks.notebookname":  notebook,'notebooks.notes':1, '_id': 0}).toArray(function (err, results) {
        //res.send(getObjects(results, 'notebookname', 'notebook1')[0].notes);
        var allNotes = getObjects(results, 'notebookname', notebook)[0].notes;
        for(var i=0; i<allNotes.length; i++){
            if(allNotes[i].name == req.params.noteName){
              allNotes[i].content = req.body.content;
              allNotes[i].text = req.body.text;
            }
        }
        //Now again make a call to the db and push back all the notes to the particular notebook
        req.db.collection('usernotecollection').updateOne({ "name": req.user.displayName, "notebooks.notebookname": notebook},
            {
              "$set":
                {"notebooks.$.notes": allNotes}
            }, function (err, documents) {
              res.send({ error: err, affected: documents });
          });
  });
});

//U can test any query here and view results in the browser
router.get('/test', function(req, res, next){

    req.db.collection('usernotecollection').find({
        "name": req.user.displayName,
      }, { "notebooks.notebookname": "notebook1",'notebooks.notes':1, '_id': 0}).toArray(function (err, results) {
          res.send(getObjects(results, 'notebookname', 'notebook1')[0].notes);
    });
});

router.post('/user/:userId/notebook/:nbkName/notes/:noteName', function(req, res, next){
  req.db.collection('usernotecollection').remove({ "name": req.user.displayName,
   "notebooks.notebookname": req.params.nbkName, "notebooks.notebookname.notes.name": req.params.noteName},
    function (err, documents) {
        res.send({ error: err, affected: documents });
    });
});

//___________________Notes________________________

router.get('/user/:userId/notebook/:nbkName/notes', function(req, res, next){
  req.db.collection('usernotecollection').find({
    "name": req.user.displayName,
    }, { "notebooks.notebookname": "notebook1",'notebooks.notes':1, '_id': 0}).toArray(function (err, results) {
        res.send(getObjects(results, 'notebookname', 'notebook1')[0].notes);
  });
});

router.post('/saveNote', function(req, res, next){
  console.log(req.body.data);
  res.render('notebook', {
    user: req.user
  });
});

module.exports = router;

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

// function sort_date(a, b) {
//     return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
// }
