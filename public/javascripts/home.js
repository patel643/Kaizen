$(function(){
  //  $(".modal").addClass("is-active");
    //Initialize Quill editor

    //a function needs to be implemented the arguments will be the noteID

    $('.notebook').click(function(){
      var notebookName = $(this).text();
      var url = "/user/59e3a593734d1d62dcbe79c3/notebook/notebook1/notes";
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

    note = function(note, name) { //now has global scope.
      $('#noteName').val(name);
      console.log(name);
      quill.setText(note);
      $(".notemodel").addClass("is-active");
    };

    $("#addNotebook").click(function(){
      $(".notebookmodel").addClass("is-active");
    });

    $("#addNote").click(function(){
      $(".notemodel").addClass("is-active");

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
            $(".notebookmode2").removeClass("is-active");
            location.reload();
        });
    });

    $("#saveNote").click(function(){
      var note =  { "name": $('#noteName').val(),
                    "content": quill.getText(),
                    "access": "public",
                    "createdDate": "2011-08-02T06:01:15.941Z",
                    "updatedDate": "2011-08-02T06:01:15.941Z" };
      $.ajax({
        url: '/user/59e3a593734d1d62dcbe79c3/notebook/notebook1/notes',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(note)
      }).done(function() {
          $(".notebookmodel").removeClass("is-active");
          location.reload();
      });
    });

  $(".modal-close").click(function() {
    $(".notebookmodel").removeClass("is-active");
    $(".notemodel").removeClass("is-active");
  });

  $(".cancelModel").click(function() {
    $(".notebookmodel").removeClass("is-active");
    $(".notemodel").removeClass("is-active");
  });
});
