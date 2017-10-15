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

  $("#addNotebook").click(function(){
    $(".modal").addClass("is-active");
  });

  $(".modal-close").click(function() {
    $(".modal").removeClass("is-active");
  });
});
