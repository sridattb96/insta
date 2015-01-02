

		function createPhoto(imgurl, time, usernameOfPoster, whoUpvoted, isLiked, idofstuff, comments)
		{
			var maindiv = document.getElementById("maindiv");
			var imgelement = document.createElement("img");
			imgelement.src = imgurl;
			imgelement.width = 500;
			imgelement.id = "image-" + idofstuff;
			maindiv.appendChild(imgelement);

			var brelement = document.createElement("br");
			maindiv.appendChild(brelement);

			var posterelement = document.createElement("span");
			posterelement.innerHTML = "Username of Poster: " + usernameOfPoster;
			posterelement.id = "usernameofposter-" + idofstuff;
			maindiv.appendChild(posterelement);

			var brelement2 = document.createElement("br");
			maindiv.appendChild(brelement2);

			var timeelement = document.createElement("span");
			timeelement.innerHTML = "Time of post: " + new Date(time);
			timeelement.id = "timeofpost-" + idofstuff;
			maindiv.appendChild(timeelement);

			var brelement3 = document.createElement("br");
			maindiv.appendChild(brelement3);

//------button------------------
			var buttonelement = document.createElement("button");
			if(isLiked == "0"){
				buttonelement.innerHTML = "Like";
			}
			else{
				buttonelement.innerHTML = "Unlike";
			}
			buttonelement.id = "likebutton-" + idofstuff;
			maindiv.appendChild(buttonelement);

			$(buttonelement).on("click", function(ev) {
				ev.preventDefault();
				var idofstuff = this.id.substring(this.id.indexOf("-") + 1);
				if (this.innerHTML == "Unlike"){
					makeunlike(idofstuff, this);
				}
				else{
					makelike(idofstuff, this);
				}
			});

			var brelement4 = document.createElement("br");
			maindiv.appendChild(brelement4);

			var wholikedspan = document.createElement("span");
			maindiv.appendChild(wholikedspan);
			checkWhoLiked(wholikedspan, idofstuff);

			var brelement5 = document.createElement("br");
			maindiv.appendChild(brelement5);

			var commentelement = document.createElement("div")
			commentelement.id = "CommentElementDiv-" + idofstuff;
			maindiv.appendChild(commentelement);

			for (var i = 0; i < comments.length; i++){
				createComment(commentelement, comments[i]);
			}

			var newcomment = document.createElement("button");
			newcomment.innerHTML = "Comment";
			newcomment.id = idofstuff + "-newcomment";
			maindiv.appendChild(newcomment);

			var commentform = document.createElement("form");
				commentform.id = idofstuff + "-commentform";
				maindiv.appendChild(commentform);

				var inputbox = document.createElement("input");
				inputbox.id = "newcommentinputbox-" + idofstuff;
				inputbox.placeholder = "New Comment Here";
				commentform.appendChild(inputbox);

				var commentformbutton = document.createElement("input");
				commentformbutton.value = "Send";
				commentformbutton.setAttribute("type", "submit");
				commentform.appendChild(commentformbutton);

			$(newcomment).on("click", function (ev){
				ev.preventDefault();
				var idofstuff = this.id.substring(0, this.id.indexOf("-"));
				var submitform = document.getElementById(idofstuff + "-commentform");
				$(submitform).toggle();
			});

			$(commentform).on("submit", function (ev){
				ev.preventDefault();
				var idofstuff = this.id.substring(0, this.id.indexOf("-"));
				var com = document.getElementById("newcommentinputbox-" + idofstuff).value; 
				var d = new Date(); 
				$.ajax({
	        		type: "POST",
	        		url: "http://localhost:3000/photo/newcomment",
	        		data: {
	        				newComment: com,
	        				PhotoId: idofstuff,
	        				Time: d.getTime()
	        		},
	        		success:function(data) {
	        			if (data == "Success"){
		        			var newcomment = {
		        				Content: com,
		        				Username: "You",
		        				Time: d.getTime(), 
		        			}
		        			createComment(document.getElementById( "CommentElementDiv-" + idofstuff) , newcomment);
	        			}
	        			else{
	        				alert("ERROR");
	        			}
	        		},
	        		xhrFields: {withCredentials: true},
	        		error:function(){
	            		console.log("ERROR");
	        		}
				});

					var newhr = document.createElement("hr");
					maindiv.appendChild(newhr);
			});


		}

		function createComment (commentelement, comment){
			var printcomment = document.createElement("span");
			printcomment.innerHTML = comment.Username + " commented: " + comment.Content + " on " + new Date(parseInt(comment.Time));
			commentelement.appendChild(printcomment);
			var brelement = document.createElement("br");
			commentelement.appendChild(brelement);
		}

		function checkWhoLiked(wholikedspan, idofstuff){
			$.ajax({
        		type: "GET",
        		url: "http://localhost:3000/photo/wholiked",
        		data: {
        				PhotoId: idofstuff
        		},
        		success:function(data) {

        			wholikedspan.innerHTML = "Liked by: " + data;
        			wholikedspan.id = "wholikedspan-" + idofstuff;
        		},
        		xhrFields: {withCredentials: true},
        		error:function(){
            		console.log("ERROR");
        		}
			});
		}

		function addYou(str){
			if (str.length > 10)
				str +=", You";
			else{
				str += "You";
			}
			return str;
		}

		function removeYou (str) {
		    var array = str.substring(10).split(',');
			var newstr = "Liked by: "; 
			for (var x = 0; x < array.length; x++) {
			    if(x != 0 && array[x].trim() != "You")  
			       newstr += ", ";
			  	if (array[x].trim() != "You"){
			     	newstr += array[x].trim();
			   	}
			}
			return newstr;
		}


		function makeunlike(idofstuff, button){
			$.ajax({
				type: "POST",
				url: "http://localhost:3000/photo/unvotepicture",
				data: {
					PhotoId: idofstuff
				},
				success:function(data){
					if (data == 'Success'){
						button.innerHTML = "Like";
						var wholikedspan = document.getElementById("wholikedspan-" + idofstuff);
						wholikedspan.innerHTML = removeYou(wholikedspan.innerHTML);
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

		function makelike(idofstuff, button){
			
			$.ajax({
				type: "POST",
				url: "http://localhost:3000/photo/upvotepicture",
				data: {
					PhotoId: idofstuff
				},
				success:function(data){
					if (data == 'Success'){
						button.innerHTML = "Unlike";
						var wholikedspan = document.getElementById("wholikedspan-" + idofstuff);
						wholikedspan.innerHTML = addYou(wholikedspan.innerHTML);
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


		function getPhotoAndLikes(photoid)
		{
				$.ajax({
	        		type: "GET",
	        		url: "http://localhost:3000/photo/getPhoto",
	        		data: {
	        			PhotoId: photoid
	        		},
	        		success:function(lol) {
	        			lol.PhotoContent;
	        			lol.Username;
	        			$.ajax({
			        		type: "GET",
			        		url: "http://localhost:3000/photo/isLiked",
			        		data: {
			        				PhotoId: photoid
			        		},
			        		success:function(data) {
			        			createPhoto(lol.PhotoContent, lol.Time, lol.Username, lol.WhoUpVoted, data, photoid, lol.Comments);
			        		},
			        		xhrFields: {withCredentials: true},
			        		error:function(){
			            		console.log("ERROR");
			        		}
						});
	        		},
	        		xhrFields: {withCredentials: true},
	        		error:function(){
	            		console.log("ERROR");
	        		}
				});
		}