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
	}
	return lumObjects;
}


function drawWedge(palette, imageCount, dayNum, url){
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
		    .on("mouseover", function(){ 
		    	fullImage = url;
		    	var sansProxy = fullImage.replace("./proxy.php?src=", "");
		    	console.log(sansProxy);
				var sansSize = sansProxy.replace("_s", "");
            	d3.select("#pictureBox")
            		.style("background-image", "url("+ sansSize +")")
            		.style("background-position", "center");
	        })
	        .on("mouseout", function(){
	        	d3.select("#pictureBox")
		        	.style("background", "#FFF");
	        })
		    .attr("transform", "translate(350,350) rotate(-94.5)"); //-94.5 to get day 1 to start at 0˚
		//inrease radii
		innerRad+=segHeight;
		outerRad+=segHeight;
	}
	// console.log(clrObjects);

}


function getPalette(urls, dayNum){
	for(var urlCount=0; urlCount<urls.length; urlCount++){		
	
		// var palette;	
		var img = new Image;
		img.onload = function(){
			var colourThief = new ColorThief();
			var palette = colourThief.getPalette(img, 13);
			drawWedge(palette, urlCount, dayNum, urls[urlCount-1]);
		};
		img.src = urls[urlCount];
	}
}


function visualizeDay(photosData, dayNum) {
	var imgURLs = [];
	
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
		imgURLs.push(imgURL);
		getPalette(imgURLs, dayNum);
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

	days[0] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=1d3a58c747c9459a78d136c7d424d97c&date=2014-04-12&per_page=10&format=json&nojsoncallback=1&auth_token=72157643900172085-b11564b1e03b2e6f&api_sig=40a7e5b7a5ca30fdeed207a884fa7b26";
	days[1] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=1d3a58c747c9459a78d136c7d424d97c&date=2014-04-11&per_page=10&format=json&nojsoncallback=1&auth_token=72157643900172085-b11564b1e03b2e6f&api_sig=078f8e652d543eee9986b10a06c10869";
	days[2] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=1d3a58c747c9459a78d136c7d424d97c&date=2014-04-10&per_page=10&format=json&nojsoncallback=1&auth_token=72157643900172085-b11564b1e03b2e6f&api_sig=c5d5f1913c9775d24ea6bd3252291998";
	days[3] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=1d3a58c747c9459a78d136c7d424d97c&date=2014-04-09&per_page=10&format=json&nojsoncallback=1&auth_token=72157643900172085-b11564b1e03b2e6f&api_sig=3bb8e0fcfe4db49c06ebe6ac6e2fb7eb";
	days[4] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=1d3a58c747c9459a78d136c7d424d97c&date=2014-04-08&per_page=10&format=json&nojsoncallback=1&auth_token=72157643900172085-b11564b1e03b2e6f&api_sig=c55527ab49fc3bae5f516af1f6c19949";
	days[5] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=1d3a58c747c9459a78d136c7d424d97c&date=2014-04-07&per_page=10&format=json&nojsoncallback=1&auth_token=72157643900172085-b11564b1e03b2e6f&api_sig=f4122f9941ba86be80d472366cf680b4";
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