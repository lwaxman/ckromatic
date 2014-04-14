//link to photo
//read 10 colours, display only the most vivid

function getSaturations(palette){

	var Color = net.brehaut.Color;
	var satObject;
	var satObjects = [];

	for(var satCount = 0; satCount<12; satCount++){ //5

		var colour = palette[satCount]; 

		var readColour = Color(colour);
		var saturation = readColour.getSaturation();

		satObject = {colour:colour, saturation:saturation}; 
		satObjects[satCount] = satObject;

		satObjects.sort(function(obj1, obj2){
			return obj1.saturation - obj2.saturation;
		});
		satObjects.reverse();
	}
	return getLuminances(satObjects);
}


function getLuminances(palette){

	var Color = net.brehaut.Color
	var lumObject;
	var lumObjects = [];

	for(var lumCount = 0; lumCount<5; lumCount++){

		var colour = palette[lumCount].colour; 

		var readColour = Color(colour);
		var luminance = readColour.getLightness();

		lumObject = {colour:colour, luminance:luminance}; 
		lumObjects[lumCount] = lumObject;

		lumObjects.sort(function(obj1, obj2){
			return obj1.luminance - obj2.luminance;
		});
		lumObjects.reverse();
	}
	return lumObjects;
}


function drawWedge(palette, imageCount, dayNum, url, pageLink){
	//imageCount for each image 


	var segHeight = 40; 
	var innerRad = 150;
	var outerRad = innerRad+segHeight;
	var startAng;
	var endAng;
	var sliceAngle = 50/10;

	var clrObject;
	var clrObjects = [];

	var fullImage;

	for(var clrCount = 0; clrCount<5; clrCount++){ //5

		clrObjects = getSaturations(palette);

		var thisColour = clrObjects[clrCount].colour;

		//convert angles to radians for use in d3.svg.arc()
		startAng = Math.radians( (dayNum*51.43) + (imageCount*sliceAngle));
		endAng = Math.radians( (((dayNum*51.43)-0.5)+sliceAngle) + (imageCount*sliceAngle) ); //-0.5 to have 0.5˚ gap between them.

		//create arc svg
		var arc = d3.svg.arc()
			.innerRadius(innerRad)
			.outerRadius(outerRad)
			.startAngle(startAng)
			.endAngle(endAng);	

		d3.select('#chart').append("path")
			.attr("d", arc) //add arc svg to chart
			.attr("id", "imageSVG")
			.attr("fill", function(d){
				return "rgb("+thisColour[0]+","+thisColour[1]+","+thisColour[2]+")";
			})
			.on("click", function(){
				window.location = pageLink;
			})
			.on("mouseover", function(){ 
				fullImage = url;
				var sansProxy = fullImage.replace("./proxy.php?src=", "");
				console.log(sansProxy);
				var sansSize = sansProxy.replace("_s", "");
				d3.select("#pictureBox")
					.attr("class", "fade")
					.style("background-image", "url("+ sansSize +")")
					.style("background-position", "center")
					.style("opacity", "1");
				$("#text").css("opacity", "0");
				// d3.select(".text")
				// 	.attr("class", "fade")
				// 	.style("opacity", "0");
			})
			.on("mouseout", function(){
				d3.select("#pictureBox")
					.style("opacity", "0");
				$("#text").css("opacity", "1");
			})
			.attr("transform", "translate(350,350) rotate(-94.5)"); //-94.5 to get day 1 to start at 0˚
		//inrease radii
		innerRad+=segHeight;
		outerRad+=segHeight;
	}
	// console.log(clrObjects);

}


function getPalette(urls, pageURLs, dayNum){
	for(var urlCount=0; urlCount<urls.length; urlCount++){		
	
		// var palette;	
		var img = new Image;
		img.onload = function(){
			var colourThief = new ColorThief();
			var palette = colourThief.getPalette(img, 13);
			drawWedge(palette, urlCount, dayNum, urls[urlCount-1], pageURLs[urlCount-1]);
		};
		img.src = urls[urlCount];
	}
}


function visualizeDay(photosData, dayNum) {
	var imgURLs = [];
	var pageURLs = [];
	// populate imgURLs
	for(index=0; index<photosData.length; index++){
		var photoData = photosData[index];
		var imgURL = "./proxy.php?src=https://farm"
					+ photoData.farm 
					+ ".staticflickr.com/"
					+ photoData.server 
					+ "/"
					+ photoData.id 
					+ "_"
					+ photoData.secret 
					+ "_s.jpg";
		var pageURL = "https://www.flickr.com/photos/"+photoData.owner +"/"+ photoData.id +"/";
		imgURLs.push(imgURL);
		pageURLs.push(pageURL);
		getPalette(imgURLs, pageURLs, dayNum);
	}
}


function loadFile(url, fileIndex) {
	d3.json(url, function(data) {
		// console.log("File Loaded", url, data);
		visualizeDay(data.photos.photo, fileIndex); //path to each individual photo
	});	
}


function loadData()
{
	var days = [];

	days[0] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=e33074ace6154eb96a87b3cee46a906c&date=2014-04-12&per_page=10&format=json&nojsoncallback=1&api_sig=42891f1a4d293cec58bdfa970ecf175e";
	days[1] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=e33074ace6154eb96a87b3cee46a906c&date=2014-04-11&per_page=10&format=json&nojsoncallback=1&api_sig=aaf3857df0763a57c32c3ea8c933f7ce";
	days[2] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=e33074ace6154eb96a87b3cee46a906c&date=2014-04-10&per_page=10&format=json&nojsoncallback=1&api_sig=23e377dd2c7b311a288cea03c4fd6e24";
	days[3] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=e33074ace6154eb96a87b3cee46a906c&date=2014-04-09&per_page=10&format=json&nojsoncallback=1&api_sig=073046b29fb27af019168b0a74721c88";
	days[4] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=e33074ace6154eb96a87b3cee46a906c&date=2014-04-08&per_page=10&format=json&nojsoncallback=1&api_sig=5e07c99f1018a6295e5ce5023da02f9b";
	days[5] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=e33074ace6154eb96a87b3cee46a906c&date=2014-04-07&per_page=10&format=json&nojsoncallback=1&api_sig=98241a345cee0ba4c3aa722d038b836c";
	days[6] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=e33074ace6154eb96a87b3cee46a906c&date=2014-04-06&per_page=10&format=json&nojsoncallback=1&api_sig=2d534de826d44293b26a1a0af11fa499";

	var index=0;
	for(index=0; index<7; index++){
		loadFile(days[index], index);
	}
}


$(document).ready( loadData );


//converts degrees to radians
//from http://nickthecoder.wordpress.com/2012/04/15/radian-and-degree-conversion-in-javascript/
Math.radians = function(degrees){
	return degrees * (Math.PI/180);
}