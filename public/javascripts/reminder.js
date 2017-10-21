
$(function(){
var user=0;

$.ajax({
	type:"POST",
	async: false,
	url: '/remind',
	success: function(d1){
		user=d1;
		console.log(user);
	}

});

});
