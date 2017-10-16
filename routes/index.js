var express = require('express');
var router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var ObjectId = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', function(req, res, next) {
<<<<<<< HEAD
  console.log(res);
  if(res.locals.login){
  console.log("HUMMMMMMM");
    req.db.collection('usernotecollection').find({"name": "bohooo" }).toArray(function(err, results){
    //  console.log(results);
=======
  console.log(req.user);

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
>>>>>>> e0397c65c79333fac71a43ce2720fef680b4f8f0
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

router.get('/home', ensureLoggedIn('/login'), function(req, res, next) {
  var xite = items["notebooks"];
  console.log(items["notebooks"][0]["notes"]);
  res.render('home', {
    user: req.user,
    items: items["notebooks"][0]["notes"]
  });
});

router.get('/notebook', function(req, res, next) {
  res.render('notebook', {
    user: req.user
  });
});


//get all the notebooks of the user
router.get('/user/:userId/notebook', function(req, res, next){
  console.log(req.params.userId);
    req.db.collection('usernotecollection').find({"_id": ObjectId(req.params.userId)},  { notebooks: 1}).toArray(function(err, results){
  //  console.log(results);
    res.send(results[0].notebooks);
  });
});


//add a notebook for a specific user
router.post('/user/:userId/notebook', function(req, res, next){
  req.db.collection('usernotecollection').updateOne({"_id": ObjectId(req.params.userId)}, {$set:{ "notebooks": req.body }}, function (err, documents) {
        res.send({ error: err, affected: documents });
    });
});


router.post('/saveNote', function(req, res, next){
  console.log(req.body.data);
  res.render('notebook', {
    user: req.user
  });
});




//get all the notebooks of the User
//    GET: /user/UserID/notebook

//add a notebook for a specific user.
//    POST :  /user/userId/notebook


//___________________Notebook_________________________

//get all notes specific to a user and notebook
//  GET:   /user/UserID/notebook/nbk_id/notes

//get a note for a particular user and notebook
//    GET : /user/userId/notebook/nbk_id/notes/note_id

//add a note for a particular user and notebook
//   POST : /user/userId/notebook/nbk_id/notes/note_id

// edit a note for a particular user and notebook
// PUT /user/userId/notebook/nbk_id/notes/note_id

//_____________________FlashCards__________________

//get all flashcards specific to a user and notebook
//  GET:   /user/UserID/flashcards/nbk_id/flash

//get a flashcard for a particular user and notebook
//    GET : /user/userId/notebook/nbk_id/flash/flash_id

//add a flashcard for a particular user and notebook
//   POST : /user/userId/notebook/nbk_id/flash/flash_id

// edit a flashcard for a particular user and notebook
// PUT /user/userId/notebook/nbk_id/flash/flash_id


//_________________Notes + Flash_____________________

// get all the flashcards for a particular notebook and Notes
// GET :  /user/userId/notebook/nbk_id/notes/note_id/flash







//get a





//save a note for a


module.exports = router;




var items ={
	"name": "UserNameKiran",
	"description": "Notes from AI 1 class",
	"joiningDate": "2011-08-02T06:01:15.941Z",
	"notebooks": [{
			"access": "public",
			"notes": [{
					"name": "noteName",
					"content": "These are my personal notes which are broadly intended to cover the basics necessary for data science, machine learning, and artificial intelligence. They have been collected from a variety of different sources, which I include as references when I remember to - so take this as a disclaimer that most of this material is adapted, sometimes directly copied, from elsewhere. Maybe it's better to call this a \"remix\" or \"katamari\" sampled from resources elsewhere. I have tried to give credit where it is due, but sometimes I forget to include all my references, so I will generally just say that I take no credit for any material here. Many of the graphics and illustrations are of my own creation or have been re-created from others, but plenty have also been sourced from elsewhere - again, I have tried to give credit where it is due, but some things slip through.",
					"access": "public",
					"createdDate": "2011-08-02T06:01:15.941Z",
					"updatedDate": "2011-08-02T06:01:15.941Z"
				},
				{
					"name": "noteName2",
					"content": "New Blah and important latest blah",
					"access": "private",
					"createdDate": "2011-08-02T06:01:15.941Z",
					"updatedDate": "2011-08-02T06:01:15.941Z"
				}
			]
		},
		{
			"access": "public",
			"notes": [{
					"name": "noteName",
					"content": "Blah Blah and important blah",
					"access": "public",
					"createdDate": "2011-08-02T06:01:15.941Z",
					"updatedDate": "2011-08-02T06:01:15.941Z"
				},
				{
					"name": "noteName2",
					"content": "New Blah and important latest blah",
					"access": "private",
					"createdDate": "2011-08-02T06:01:15.941Z",
					"updatedDate": "2011-08-02T06:01:15.941Z"
				}
			]
		}
	],
	"flashcards": [{
			"name": "flasCardName",
			"content": "FlashCard to Understand all the Blahs",
			"notebook": "notebookName",
			"createdDate": "2011-08-02T06:01:15.941Z",
			"updatedDate": "2011-08-02T06:01:15.941Z"
		},
		{
			"name": "flasCardName2",
			"content": "FlashCard to Understand all the Blahs and remember them",
			"notebook": "notebookName",
			"createdDate": "2011-08-02T06:01:15.941Z",
			"updatedDate": "2011-08-02T06:01:15.941Z"
		}
	]
} ;
