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

    $("#addNotebook").click(function(){
      $(".modal").addClass("is-active");
    });
    //This is dummy call needs to be removed ASAP
    // $("#addNotebook").click(function(){
    //   var notebook = {
    //         "access": "public",
    //         "notebookname": "notebookUlalala",
    //         "notes": []
    //   };
    //
    //   $.ajax({
    //     url: '/user/59e3a593734d1d62dcbe79c3/notebook',
    //     type: 'POST',
    //     dataType: 'json',
    //     contentType: 'application/json',
    //     data: JSON.stringify(notebook)
    //   });
    //
    // });

    $("#saveNoteBook").click(function(){
      var notebook = {
             "access": $('#access').val(),
             "notebookname": $('#notebookname').val(),
             //"description": $('#description').val(),
             "frequency": $('#frequency').val(),
             "multiplier":$('#multiplier').val(),
             "notes": []
       };
       $.ajax({
          url: '/user/59e3a593734d1d62dcbe79c3/notebook',
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(notebook)
        }).done(function() {
            $(".modal").removeClass("is-active");
            location.reload();
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
