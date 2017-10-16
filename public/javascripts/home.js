$(function(){
  //  $(".modal").addClass("is-active");
    //Initialize Quill editor

    //a function needs to be implemented the arguments will be the noteID

    var quill = new Quill('#editor', {
      theme: 'snow'
    });

    note = function(note) { //now has global scope.
      quill.setText(note);
      $(".modal").addClass("is-active");
    };

    //This is dummy call needs to be removed ASAP
    $("#addNotebook").click(function(){
      console.log("called");
      var data = [
        {
            "access": "public",
            "notebookname": "notebook1",
            "notes": [
                {
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
        },
        {
            "access": "public",
            "notebookname": "notebook2",
            "notes": [
                {
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
        }];

      $.ajax({
        url: '/user/59e3a593734d1d62dcbe79c3/notebook',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data)
      });

    });

    $("#saveNote").click(function(){
      var xite = items;
      console.log(xite);
      var text = quill.getText();
      console.log("hohoho");
      console.log(text);
      $(".modal").removeClass("is-active");

      $.ajax({
        url: '/saveNote',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({data: quill.getText()})
      });

    });

  // $("#addNotebook").click(function(){
  //   $(".modal").addClass("is-active");
  // });

  $(".modal-close").click(function() {
    $(".modal").removeClass("is-active");
  });
});
