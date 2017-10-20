$(function(){
    var quillModule =  {
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['code-block']
        ]
      },
      placeholder: 'Compose an epic...',
          theme: 'snow'
    };

    var n_quill = new Quill('#n_editor', quillModule);
    var quill = new Quill('#editor', quillModule);

    note = function(note) { //now has global scope.
      $('#noteName').val(note.name);
      quill.setContents(note.content);
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
      console.log(n_quill.getContents());
      var note =  { "name": $('#n_noteName').val(),
                    "text": n_quill.getText(),
                    "content": n_quill.getContents(),
                    "access": "public",
                    "createdDate": "2011-08-02T06:01:15.941Z",
                    "updatedDate": "2011-08-02T06:01:15.941Z" };
      $.ajax({
        url: '/user/notebook/notes',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(note)
      }).done(function() {
          $(".notebookmodel").removeClass("is-active");
          location.reload();
      });
    });

    $("#editNote").click(function(){
      var text = quill.getText();
      var content = quill.getContents();
      $.ajax({
        url: '/user/notebook/notes/'+$('#noteName').val(),
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({text: text, content:content})
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
