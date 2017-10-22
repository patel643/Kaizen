$(function() {
$("#searchbutton").click(function() {
    console.log("here");

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

//$("#ajax-content").empty().append("<div id='loading'><img src='images/loading.gif' alt='Loading' /></div>");
$.ajax({ url: '/features',success: function(returnedData) {
        $("#ajax-content").html(returnedData);
}
});
});
