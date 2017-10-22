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

    editFlashCard = function(flashcard) {
      $('#e_flashFront').val(flashcard.front);
      $('#e_flashBack').val(flashcard.back);
      $(".e_flashmodel").addClass("is-active");
    };

    deleteNote = function(noteName) {
      $.ajax({
        url: '/user/notebook/notes/'+noteName,
        type: 'DELETE'
        }).done(function() {
          location.reload();
      });
    }

    deleteFlashCard = function(flashcard) {
      $.ajax({
        url: '/user/notebook/flashcards/'+flashcard.front,
        type: 'DELETE'
        }).done(function(){
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

    $("#addFlashcard").click(function(){
      $(".n_flashmodel").addClass("is-active");
      $("#n_flashFront").val('');
      $("#n_flashBack").val('');
    });

    $("#editFlashcard").click(function(){
      $(".e_flashmodel").addClass("is-active");
    });

    $("#saveNoteBook").click(function(){
      var notebook = {
             "access": $('#access').val(),
             "notebookname": $('#notebookname').val().trim(),
             //"description": $('#description').val(),

             "notes": [],
             "flashcards":[]
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

    $("#saveFlashCard").click(function(){
      var flashCard = {"front": $('#n_flashFront').val().trim(),
                       "back": $('#n_flashBack').val().trim(),
                       "createdDate": new Date()
                      };
      $.ajax({
        url: '/user/notebook/flashcards',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(flashCard)
      }).done(function(){
        $(".n_notemodel").removeClass("is-active");
        location.reload();
      });
    });

    $("#saveNote").click(function(){
      var note =  { "name": $('#n_noteName').val().trim(),
                    "text": n_quill.getText(),
                    "content": n_quill.getContents(),
                    "access": "public",
                    "createdDate": new Date(),
                  "revisionCount": 2,};
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

    $("#eFlashCard").click(function(){
      var flashCard = {"back": $('#e_flashBack').val().trim()};
      $.ajax({
        url: '/user/notebook/flashcards/'+$('#e_flashFront').val(),
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(flashCard)
      }).done(function() {
          $(".e_flashmodel").removeClass("is-active");
          location.reload();
      });
    });


  $(".modal-close").click(function() {
    $(".notebookmodel").removeClass("is-active");
    $(".notemodel").removeClass("is-active");
    $(".n_notemodel").removeClass("is-active");
    $(".n_flashmodel").removeClass("is-active");
    $(".e_flashmodel").removeClass("is-active");
  });

  $(".cancelModel").click(function() {
    $(".notebookmodel").removeClass("is-active");
    $(".notemodel").removeClass("is-active");
    $(".n_notemodel").removeClass("is-active");
    $(".n_flashmodel").removeClass("is-active");
    $(".e_flashmodel").removeClass("is-active");
  });
});
