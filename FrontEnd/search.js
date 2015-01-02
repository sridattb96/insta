			
		function loadSearch(){
			$.ajax({
		          type: "GET",
		          url: "http://localhost:3000/users/search",
		          data: {
		          },
		          success:function(data){
		              var tags = document.getElementById("tags");
		              $(tags).autocomplete({
		                  source: data,
		                  select: function(event, ui){
		                    window.location = "userpage.html?username=" + ui.item.label;
		                  }
		              });
		          },
		          xhrFields: {withCredentials: true},
		          error:function(){
		            console.log("ERROR");
		          }
	      	});
	      	$(function() {
		          var availableTags = ["ActionScript", "AppleScript"];
		          var tags = document.getElementById("tags");
		          $(tags).autocomplete({
		            source: availableTags
		          });
	      	});
	    }