$(function() {

    var quillModule =  {
      modules: {
        toolbar: [
        ]
      },
      placeholder: 'Compose an epic...',
          theme: 'snow'
    };

    viewNote = function(content) {
      var quill = new Quill('#editor', quillModule);
      quill.disable();
      quill.setContents(content);
      $(".viewModel").addClass("is-active");
    };

    cancelModel = function() {
      $(".viewModel").removeClass("is-active");
    };
});
