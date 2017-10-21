$(function() {
$("#searchbutton").click(function() {
    console.log("here");

    $("#ajax-content").empty().append("<div id='loading'><img src='images/loading.gif' alt='Loading' /></div>");
    // $("#nav li a").removeClass('current');
    // $(this).addClass('current');
    var val ="value"; //$('#searcharea').val().trim();
    $.ajax({
        url: '/search/'+$('#searcharea').val(),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({"searchkey":val}),
      }).done(function() {
          // location.reload();
      });
    });

//$("#ajax-content").empty().append("<div id='loading'><img src='images/loading.gif' alt='Loading' /></div>");
$.ajax({ url: '/features',success: function(returnedData) {
        $("#ajax-content").html(returnedData);
}
});
});
