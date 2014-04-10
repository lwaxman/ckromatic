

 function() {

		$("#titleOne").lettering();

				// days[5] = "";
		// days[6] = "";

		

		//it is using finding all canvases every time, 
		//so it is only getting data from the first canvases, and then failing... ??

		// d3.json(dayBack0, function(data) {
		// 	visualizeData(data.photos.photo, 0); 
		// });
		// d3.json(dayBack1, function(data) {
		// 	visualizeData(data.photos.photo, 60); 
		// });
		// d3.json(dayBack2, function(data) {
		// 	visualizeData(data.photos.photo, 120); 
		// });
		// d3.json(dayBack3, function(data) {
		// 	visualizeData(data.photos.photo, 180); 
		// });
		// d3.json(dayBack4, function(data) {
		// 	visualizeData(data.photos.photo, 240); 
		// });
		// d3.json(dayBack5, function(data) {
		// 	visualizeData(data.photos.photo, 300); 
		// });

		
		function visualizeData(data, startPos, canvasName){

			//converts degrees to radians
			//from http://nickthecoder.wordpress.com/2012/04/15/radian-and-degree-conversion-in-javascript/
			Math.radians = function(degrees){
				return degrees * (Math.PI/180);
			}

			//variables to hold all necessary data from json
			var farm;
			var server_id;
			var id;
			var o_secret; 
			var img_URL;
			var imageURLS = new Array();
			var count = 0;

			//create as many divs as data, 
			//and save all urls to array
			d3.select("body").selectAll("div")//canvas
				.data(data)
				.enter()
				.append("div")//canvas
				.attr("width", "100")
				.attr("height", "100")
				.attr("class", "image")
				.each(function(d){
					farm = d['farm'];
					server_id = d['server'];
					id = d['id'];
					o_secret = d['secret'];
					img_URL = "http://www.lauriewaxman.com/datadesigncode/realtime/proxy.php?src=https://farm"+ farm +".staticflickr.com/"+ server_id +"/"+ id +"_"+ o_secret +"_s.jpg";
					imageURLS[count] = img_URL;
					count++;
				});

			//save all images to array
			var imageList = document.getElementsByClassName("image");

			//runs through images, 
			var imageCount = 0;
			for (imageCount=0; imageCount<imageList.length; imageCount++){
			
				//READ THIS!!! http://tobyho.com/2011/11/02/callbacks-in-loops/
				!function inner(imageCount){
					
					var thisImageURL = imageURLS[imageCount];//get current image url
					
					var img = new Image; //creates new image

					//runs image through Color Thief
					img.onload = function(){

						var colourThief = new ColorThief();
						var palette = colourThief.getPalette(img,5);
						var colour;
						var lastXPos = 0;
						var lastYPos = 0;
					
						//variables for drawing the annuli
						var segHeight = 50;
						var innerRad = 150;
						var outerRad = innerRad+segHeight;
						var startAng;
						var endAng;
						var sliceAngle = 36/imageList.length;
					
						// count = imageList.length;
						
						//run through canvases to get
						for(var j=0; j<imageList.length; j++){

							//get j-th colour from palette
							colour = palette[j]; 
							lastXPos += 20;
							

							console.log(colour);

							//convert angles to radians for use in d3.svg.arc()
							startAng = Math.radians( startPos + (imageCount*sliceAngle));
							endAng = Math.radians( ((startPos-0.5)+sliceAngle) + (imageCount*sliceAngle) ); //-0.5 to have 0.5˚ gap between them.

							//create arc svg
							var arc = d3.svg.arc()
								.innerRadius(innerRad)
								.outerRadius(outerRad)
								.startAngle(startAng)
								.endAngle(endAng);	

							d3.select('#chart').append("path")
								.attr("d", arc) //add arc svg to chart
								.attr("fill", function(d){
							        return "rgb("+colour[0]+","+colour[1]+","+colour[2]+")";
							    })
							    .attr("stroke-width", "5")
								.attr("transform", "translate(600,400)");

							//inrease radii
							innerRad+=segHeight;
							outerRad+=segHeight;

						}//end Color Thief loop

					};//end image.onload

					//source url of the image, accessed from onload
					img.src = "" + thisImageURL + "";

				}(imageCount); //end inner loop

			}//end run through canvases

		}//end visualizeData()

		function drawArcs(){

			
		}

	});//end document.ready

