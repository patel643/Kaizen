

var express = require('express');
var router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var ObjectId = require('mongodb').ObjectID;
var notebook = {};
var flashcards = {};


/*explore page*/
router.get('/features',function(req,res,next){
  res.render('featureDetails.hbs',{layout:false});
  console.log("explore page loaded");
  });


router.post('/search/:searchkey',function(req,res,next){
  var key = new RegExp(req.params.searchkey);
  console.log("searching for " + key);

  var allResults = [];
  //GET notes which are public notes
  req.db.collection('usernotecollection').aggregate(
  [
  {"$unwind":"$notebooks"},
  {"$unwind":"$notebooks.notes"},
  //{"$match":{"notebooks.notes.name":{'$regex':key},"$and":[{"notebooks.notes.access":"public"}]}},
  {"$match":{"notebooks.notes.name":{'$regex':key},"notebooks.notes.text":{'$regex':key},"notebooks.notes.access":/public/}},
  {"$project":{
     "name":1,
     "notebooks.notebookname":1,
     "notebooks.notes.name":1,
     "notebooks.notes.text":1
 }
 } ],
  function(err, results) {
      //console.log(results);
      allResults = results;
      if(!req.user){
        console.log('not logged in sending right now');
        //res.send(allResults);
        res.render('searchlist.hbs',{layout:false,notes: allResults});
        console.log("searchlist loaded");
      }
    }
 );

 //If User is logged in get the private notes as well
 if(req.user){
   var dispN = new RegExp(req.user.displayName);
   var  newresults= req.db.collection('usernotecollection').aggregate(
   [
   {"$unwind":"$notebooks"},
   {"$unwind":"$notebooks.notes"},
   {"$match":{"name":{'$regex':dispN},"notebooks.notes.name":{'$regex':key},"notebooks.notes.text":{'$regex':key},"notebooks.notes.access":/private/}},
   {"$project":{
      "name":1,
      "notebooks.notebookname":1,
      "notebooks.notes.name":1,
      "notebooks.notes.text":1
    }
   }],
   function(err, results) {
        allResults.push.apply(allResults,results);
        console.log('logged in sending later');
        //res.send(allResults);
        console.log(JSON.stringify(results));
        console.log("-----------");
        console.log(JSON.stringify(allResults));
        res.render('searchlist.hbs',{layout:false,notes: allResults});
        console.log("searchlist loaded");
      });
 }
});

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
      var flashcards = getObjects(results, 'notebookname', req.query.notebook)[0].flashcards;
      res.render('home', {
        user: req.user,
        notebooks: results[0].notebooks,
        notes: notes,
        flashcards: flashcards   //this has to be removed
      });
    }else{
      //console.log(results);
      var noteBookResult = results[0];
      notebook = (results[0].notebooks.length > 0) ? results[0].notebooks[0].notebookname : "";
      var  notebooks = (noteBookResult.notebooks.length > 0) ? noteBookResult.notebooks : [];
      var notes = (noteBookResult.notebooks.length > 0) ? noteBookResult.notebooks[0].notes : [];
      var flashcards = (noteBookResult.notebooks.length > 0) ? noteBookResult.notebooks[0].flashcards : [];
      res.render('home', {
        user: req.user,
        notebooks: notebooks,
        notes: notes,
        flashcards: flashcards    //this has to be removed
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
router.post('/user/notebook/notes', function(req, res, next){
  console.log(req.notebook);
  req.db.collection('usernotecollection').updateOne({ "name": req.user.displayName, "notebooks.notebookname": notebook},
      { "$push":
          {"notebooks.$.notes": req.body}
      }, function (err, documents) {
        res.send({ error: err, affected: documents });
    });
});

//adding flashcards to a notebook
router.post('/user/notebook/flashcards', function(req, res, next){
  console.log(req.notebook);
  req.db.collection('usernotecollection').updateOne({ "name": req.user.displayName, "notebooks.notebookname": notebook},
      { "$push":
          {"notebooks.$.flashcards": req.body}
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


//Editing a flashCard
router.put('/user/notebook/flashcards/:flashName', function(req, res, next){
  //extract all notes for give particular notebook
  //Query to get all notes for a particular user
  req.db.collection('usernotecollection').find({
      "name": req.user.displayName,
    }, { "notebooks.notebookname":  notebook,'notebooks.flashcards':1, '_id': 0}).toArray(function (err, results) {
        //res.send(getObjects(results, 'notebookname', 'notebook1')[0].notes);
        var allFlashCards = getObjects(results, 'notebookname', notebook)[0].flashcards;
        for(var i=0; i<allFlashCards.length; i++){
            if(allFlashCards[i].front == req.params.flashName){
              allFlashCards[i].back = req.body.back;
            }
        }
        //Now again make a call to the db and push back all the notes to the particular notebook
        req.db.collection('usernotecollection').updateOne({ "name": req.user.displayName, "notebooks.notebookname": notebook},
            {
              "$set":
                {"notebooks.$.flashcards": allFlashCards}
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

router.delete('/user/notebook/notes/:noteName', function(req, res, next){
  req.db.collection('usernotecollection').find({
      "name": req.user.displayName,
    }, { "notebooks.notebookname": notebook,'notebooks.notes':1, '_id': 0}).toArray(function (err, results) {
        var allNotes = getObjects(results, 'notebookname', notebook)[0].notes;
        findAndRemove(allNotes, 'name', req.params.noteName);
        req.db.collection('usernotecollection').updateOne({ "name": req.user.displayName, "notebooks.notebookname": notebook},
            {
              "$set":
                {"notebooks.$.notes": allNotes}
            }, function (err, documents) {
              res.send({ error: err, affected: documents });
          });
      });
});


//Deleting A FlashCard
router.delete('/user/notebook/flashcards/:flashName', function(req, res, next){
  req.db.collection('usernotecollection').find({
      "name": req.user.displayName,
    }, { "notebooks.notebookname": notebook,'notebooks.flashcards':1, '_id': 0}).toArray(function (err, results) {
        var allFlashCards = getObjects(results, 'notebookname', notebook)[0].flashcards;
        findAndRemove(allFlashCards, 'front', req.params.flashName);
        req.db.collection('usernotecollection').updateOne({ "name": req.user.displayName, "notebooks.notebookname": notebook},
            {
              "$set":
                {"notebooks.$.flashcards": allFlashCards}
            }, function (err, documents) {
              res.send({ error: err, affected: documents });
          });
  });
});





//This function needs serious refactoring
router.get('/flashcards', ensureLoggedIn('/login'), function(req, res, next) {
  req.db.collection('usernotecollection').find({"name": req.user.displayName},  { notebooks: 1}).toArray(function(err, results){
    if(req.query.notebook){
      notebook = req.query.notebook;
      var flashcards = getObjects(results, 'notebookname', req.query.notebook)[0].flashcards;
      res.render('flashcards', {
        user: req.user,
        notebooks: results[0].notebooks,
        flashcards: flashcards   //this has to be removed
      });
    }else{
      //console.log(results);
      var noteBookResult = results[0];
      notebook = (results[0].notebooks.length > 0) ? results[0].notebooks[0].notebookname : "";
      var  notebooks = (noteBookResult.notebooks.length > 0) ? noteBookResult.notebooks : [];
      var flashcards = (noteBookResult.notebooks.length > 0) ? noteBookResult.notebooks[0].flashcards : [];
      res.render('flashcards', {
        user: req.user,
        notebooks: notebooks,
        flashcards: flashcards    //this has to be removed
      });
    }
  });
});



//
// router.post('/user/:userId/notebook/:nbkName/notes/:noteName', function(req, res, next){
//   req.db.collection('usernotecollection').remove({ "name": req.user.displayName,
//    "notebooks.notebookname": req.params.nbkName, "notebooks.notebookname.notes.name": req.params.noteName},
//     function (err, documents) {
//         res.send({ error: err, affected: documents });
//     });
// });

//___________________Notes________________________

// router.get('/user/:userId/notebook/:nbkName/notes', function(req, res, next){
//   req.db.collection('usernotecollection').find({
//     "name": req.user.displayName,
//     }, { "notebooks.notebookname": "notebook1",'notebooks.notes':1, '_id': 0}).toArray(function (err, results) {
//         res.send(getObjects(results, 'notebookname', 'notebook1')[0].notes);
//   });
// });
var arr=[];
router.get('/reminders',ensureLoggedIn('/login'), function(req, res, next) {
  var user=req.user.displayName;

   var remindata = req.db.collection('usernotecollection').find({"name":user});
   remindata.each(function (err, doc) {

    if (doc != null) {
        console.dir(doc);
        arr=[];
        /*console.log(doc.notebooks.length);
        for(var i=0;i<doc.notebooks.length;i++)
        {
          var temp=[doc.notebooks[i].frequency,doc.notebooks[i].multiplier];
          arr.push(temp);
        }*/
      //  console.dir(JSON.stringify(doc.notebooks.notes));
      console.log(doc.notebooks.length);
        for(var i=0;i<doc.notebooks.length;i++)
        {
          console.log(doc.notebooks[i].notebookname);
          console.log(doc.notebooks[i].notes.length);
          for(var j=0;j<doc.notebooks[i].notes.length;j++){

            //  console.log(new Date(doc.notebooks[i].notes[j].createdDate).getFullYear());
              var cdate=new Date(doc.notebooks[i].notes[j].createdDate)
              var cdate2=new Date(doc.notebooks[i].notes[j].createdDate);
              var cdate6=new Date(doc.notebooks[i].notes[j].createdDate);
              var cdate10=new Date(doc.notebooks[i].notes[j].createdDate);
              var cdate30=new Date(doc.notebooks[i].notes[j].createdDate);
              var cdate60=new Date(doc.notebooks[i].notes[j].createdDate);

              cdate2.setDate(cdate2.getDate()+2);
              cdate6.setDate(cdate6.getDate()+6);
              cdate10.setDate(cdate10.getDate()+10);
              cdate30.setDate(cdate30.getDate()+30);
              cdate60.setDate(cdate60.getDate()+60);
              var cdated2=cdate2.getDate();
              var cdated6=cdate6.getDate();
              var cdated10=cdate10.getDate();
              var cdated30=cdate30.getDate();
              var cdated60=cdate60.getDate();
              var cdatem=cdate.getMonth()+1;
              var cdatey=cdate.getFullYear();;
              cdate2=cdated2+'/'+cdatem+'/'+cdatey;
              cdate6=cdated6+'/'+cdatem+'/'+cdatey;
              cdate10=cdated10+'/'+cdatem+'/'+cdatey;
              cdate30=cdated30+'/'+cdatem+'/'+cdatey;
              cdate60=cdated60+'/'+cdatem+'/'+cdatey;


              console.log("cdate"+cdate2+cdate6+cdate10+cdate30+cdate60);

              //rmove these next few lines
              /*cdate=new Date();
              var cdated=cdate.getDate();
              var cdatem=cdate.getMonth();
              var cdatey=cdate.getFullYear();
              var cdate=cdated+'/'+cdatem+'/'+cdatey;*/
              //

              var tdate=(new Date());
              var tdated=tdate.getDate();
              var tdatem=tdate.getMonth()+1;
              var tdatey=tdate.getFullYear();
              tdate=tdated+'/'+tdatem+'/'+tdatey;
              console.log("tdate"+tdate);
              if(cdate2 == tdate || cdate6 == tdate || cdate10 == tdate || cdate30 == tdate || cdate60 == tdate){
                var temp=[doc.notebooks[i].notebookname,": "+doc.notebooks[i].notes[j].name];
                arr.push(temp);
              }


          }

        }
    }
});
  res.render('reminders',{user: req.user.displayName, arr:arr});
})



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

//Generic Function to delete any property's valuie in a Json Array.
function findAndRemove(array, property, value) {
  array.forEach(function(result, index) {
    if(result[property] === value) {
      array.splice(index, 1);
    }
  });
}
