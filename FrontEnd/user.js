			function checkStatus(username){
		 		
		 		$.ajax({
	        		type: "GET",
	        		url: "http://localhost:3000/users/amfollowing",
	        		data: {
	        				UsernameToFollow: username
	        		},
	        		success:function(data) {
	        			var followerbutton = document.getElementById("followerbutton");
	        			if (data==1){
	        				followerbutton.innerHTML = "Unfollow";
	        			}
	        			else{
	        				followerbutton.innerHTML = "Follow";
	        			}
	        			$(followerbutton).on("click", function (ev) {
	        				ev.preventDefault();
	        				if (this.innerHTML == "Follow"){
	        					followUser(this, username);
	        				}
	        				else{
	        					unfollowUser(this, username);
	        				}
	        			});
	        		},
	        		xhrFields: {withCredentials: true},
	        		error:function(){
	            		console.log("ERROR");
	        		}
				});

			 }

			function followUser(followbutton, username){
				$.ajax({
	        		type: "GET",
	        		url: "http://localhost:3000/users/followuser",
	        		data: {
							UsernameToFollow: username
	        		},
	        		success:function(data) {
	        			if (data.toLowerCase() == "success"){
	        				followbutton.innerHTML = "Unfollow";
	        			}
	        			else{
	        				alert(data);
	        			}
	        		},
	        		xhrFields: {withCredentials: true},
	        		error:function(){
	            		console.log("ERROR");
	        		}
				});
			}

			function unfollowUser(followbutton, username){
				$.ajax({
	        		type: "GET",
	        		url: "http://localhost:3000/users/unfollowuser",
	        		data: {
							UsernameToFollow: username
	        		},
	        		success:function(data) {
	        			if (data.toLowerCase() == "success"){
	        				followbutton.innerHTML = "Follow";
	        			}
	        			else{
	        				alert(data);
	        			}

	        		},
	        		xhrFields: {withCredentials: true},
	        		error:function(){
	            		console.log("ERROR");
	        		}
				});
			}


			function start (username){
				$.ajax({
	        		type: "GET",
	        		url: "http://localhost:3000/photo/picsofoneperson",
	        		data: {
	        				Username: username
	        		},
	        		success:function(data) {
	        			for (var i = 0; i < data.length; i++){
	        				getPhotoAndLikes(data[i]);
	        			}
	        			getInfo(username);
	        		},
	        		xhrFields: {withCredentials: true},
	        		error:function(){
	            		console.log("ERROR");
	        		}
				});
			}

			function getQueryVariable(variable) {
				var query = window.location.search.substring(1);
				var vars = query.split("&");
				for (var i=0;i<vars.length;i++) {
					var pair = vars[i].split("=");
					if(pair[0] == variable){
						return pair[1];
					}
				}
				return(false);
			}

			function getInfo (username){
				var getinfo = document.getElementById("getinfo")
				$.ajax({
					type: "GET",
					url: "http://localhost:3000/users/getinfo",
					data: {

						Username: username
					},
					success:function(data){
						var usernamespan = document.createElement("p");
						username.innerHTML = "Username: " + data.Username;
						getinfo.appendChild(usernamespan);

						var profpic = document.createElement("img");
						profpic.src = data.ProfilePic;
						profpic.width = 50; 
						getinfo.appendChild(profpic);

						var followers = document.createElement("p");
						followers.innerHTML = "Followers: " + data.Followers.toString();
						getinfo.appendChild(followers);

						var following = document.createElement("p");
						following.innerHTML = "Following: " + data.Following.toString();
						getinfo.appendChild(following);

						var hr = document.createElement("hr");
						getinfo.appendChild(hr);

					},
					xhrFields: {withCredentials: true},
					error: function(){
						console.log("ERROR");
					}
				});
			}



