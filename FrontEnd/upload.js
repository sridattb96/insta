		var inputfiletoload = document.getElementById("inputFileToLoad");
			$(inputfiletoload).on("change", function () {
				var filesSelected = document.getElementById("inputFileToLoad").files;
				if (filesSelected.length > 0)	{
					var fileToLoad = filesSelected[0];
					var fileReader = new FileReader();

					// fileToLoad.name is the NAME of the file

					$(fileReader).on("load", function(fileLoadedEvent) {
						var srcData = fileLoadedEvent.target.result; // <--- data: base64
						alert("Image uploaded");
						console.log(srcData);

						var img = document.getElementById('photo-url');
						img.src = srcData;

						// srcData is uploaded to the backend
					});
					fileReader.readAsDataURL(fileToLoad);
				}
			});
