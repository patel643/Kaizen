$(function(){
  //  $(".modal").addClass("is-active");
    //Initialize Quill editor

    //a function needs to be implemented the arguments will be the noteID

    $('.notebook').click(function(){
      var notebookName = $(this).text();
      var url = "/user/59e29fd5444470d14194012a/notebook/notebook1/notes";
      $.get(url)
      .done(function( data ) {
        var dat = { items : data};
        var theTemplateScript = $("#address-template").html();
        var theTemplate = Handlebars.compile(theTemplateScript);
        var theCompiledHtml = theTemplate(dat);
        $('.content-placeholder').html(theCompiledHtml);
      });
    });

    var quill = new Quill('#editor', {
      theme: 'snow'
    });

    var n_quill = new Quill('#n_editor', {
      theme: 'snow'
    });

    note = function(note, name) { //now has global scope.
      $('#noteName').val(name);
      console.log(name);
      quill.setText(note);
      $(".notemodel").addClass("is-active");
    };

    deleteNote = function(noteName) {
      $.ajax({
        url: '/user/notebook/notebook1/notes/noteName',
        type: 'PUT',
        contentType: 'application/json'
      }).done(function() {
          $(".notebookmodel").removeClass("is-active");
          location.reload();
      });
    }

    $("#addNotebook").click(function(){
      $(".notebookmodel").addClass("is-active");
    });

    $("#addNote").click(function(){
      $(".n_notemodel").addClass("is-active");
      $("#n_noteName").val('');

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
          url: '/user/notebook',
          type: 'POST',
          dataType: 'json',
          contentType: 'application/json',
          data: JSON.stringify(notebook)
        }).done(function() {
            $(".notebookmode2").removeClass("is-active");
            location.reload();
        });
    });

    $("#saveNote").click(function(){
      var note =  { "name": $('#n_noteName').val(),
                    "content": n_quill.getText(),
                    "access": "public",
                    "createdDate": "2011-08-02T06:01:15.941Z",
                    "updatedDate": "2011-08-02T06:01:15.941Z" };
      $.ajax({
        url: '/user/notebook/notebook1/notes',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(note)
      }).done(function() {
          $(".notebookmodel").removeClass("is-active");
          location.reload();
      });
    });

    $("#editNote").click(function(){
      var content = quill.getText();
      $.ajax({
        url: '/user/notebook/notebook1/notes/'+$('#noteName').val(),
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({content: content})
      }).done(function() {
          $(".notebookmodel").removeClass("is-active");
          location.reload();
      });
    });




  $(".modal-close").click(function() {
    $(".notebookmodel").removeClass("is-active");
    $(".notemodel").removeClass("is-active");
    $(".n_notemodel").removeClass("is-active");
  });

  $(".cancelModel").click(function() {
    $(".notebookmodel").removeClass("is-active");
    $(".notemodel").removeClass("is-active");
    $(".n_notemodel").removeClass("is-active");
  });
});
