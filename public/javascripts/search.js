$(function() {
$("#searchbutton").click(function() {
    //console.log("here");
    $("#ajax-content").empty().append("<div id='loading'><img src='images/loading.gif' alt='Loading' /></div>");
    // $("#nav li a").removeClass('current');
    // $(this).addClass('current');
    var val = {"searchkey":$('#searcharea').val()};
    $.ajax({
        url: '/search/'+$('#searcharea').val(),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(val),
      }).done(function(data) {
            // $("#ajax-content").append(JSON.stringify(data));
            // console.log(data);
            $("#ajax-content").html(data);
      });
    });

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

    //$("#ajax-content").empty().append("<div id='loading'><img src='images/loading.gif' alt='Loading' /></div>");
    $.ajax({ url: '/features',success: function(returnedData) {
            $("#ajax-content").html(returnedData);
    }
    });
});
