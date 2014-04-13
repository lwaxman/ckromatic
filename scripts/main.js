//link to photo
//read 10 colours, display only the most vivid

function drawWedge(palette, imageCount, dayNum){

	// console.log(index);
	// console.log(imageCount);

	//imageCount for each image 
	var startPos = 0;

	var segHeight = 40; 
	var innerRad = 150;
	var outerRad = innerRad+segHeight;
	var startAng;
	var endAng;
	var sliceAngle = 50/10;

	var Color = net.brehaut.Color;
	// var readColour; //colour to get saturation from
	// var saturation; //saturation

	// var colour; //colour to draw from
	var clrObject;
	var clrObjects = [];
	var satObject;
	var satObjects = [];
	var lumObject;
	var lumObjects = [];

	for(var satCount = 0; satCount<9; satCount++){ //5

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

	for(var lumCount = 0; lumCount<5; lumCount++){

		var colour = satObjects[lumCount].colour; 

		var readColour = Color(colour);
		var luminance = readColour.getValue();

		lumObject = {colour:colour, luminance:luminance}; 
		lumObjects[lumCount] = lumObject;

		lumObjects.sort(function(obj1, obj2){
			return obj1.luminance - obj2.luminance;
		});
		// lumObjects.reverse();
	}

	for(var clrCount = 0; clrCount<5; clrCount++){ //5

		var thisColour = lumObjects[clrCount].colour;

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
			.attr("fill", function(d){
		        return "rgb("+thisColour[0]+","+thisColour[1]+","+thisColour[2]+")";
		    })
		    .attr("stroke-width", "5")
		    .attr("transform", "translate(350,350) rotate(-94.5)");
			// .attr("transform", "translate(600,400)");

		//inrease radii
		innerRad+=segHeight;
		outerRad+=segHeight;
		startPos+=60;		
	}
	console.log(clrObjects);
}


function getPalette(urls, dayNum){
	for(var urlCount=0; urlCount<urls.length; urlCount++){		
	
		// var palette;	
		var img = new Image;
		img.onload = function(){
			var colourThief = new ColorThief();
			var palette = colourThief.getPalette(img, 10);
			drawWedge(palette, urlCount, dayNum);
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
		console.log("File Loaded", url, data);
		visualizeDay(data.photos.photo, fileIndex); //path to each individual photo
	});	
}


function loadData()
{
	var days = [];

	days[0] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=c3423054cb5cdeff0d768eeb5fd3ab91&date=2014-04-11&per_page=10&format=json&nojsoncallback=1&auth_token=72157643863957655-7d200500d5d46313&api_sig=2e3277d867dc35e3f3fa25398a4c5000";
	days[1] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=c3423054cb5cdeff0d768eeb5fd3ab91&date=2014-04-10&per_page=10&format=json&nojsoncallback=1&auth_token=72157643863957655-7d200500d5d46313&api_sig=867be10645e7daf20de059bb2b4b0e69";
	days[2] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=c3423054cb5cdeff0d768eeb5fd3ab91&date=2014-04-09&per_page=10&format=json&nojsoncallback=1&auth_token=72157643863957655-7d200500d5d46313&api_sig=258bd983bd7ecd5a4cd57bfd1cee2d0a";
	days[3] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=c3423054cb5cdeff0d768eeb5fd3ab91&date=2014-04-08&per_page=10&format=json&nojsoncallback=1&auth_token=72157643863957655-7d200500d5d46313&api_sig=a47cf57b0d0d2b6dfecd220c895d386c";
	days[4] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=c3423054cb5cdeff0d768eeb5fd3ab91&date=2014-04-07&per_page=10&format=json&nojsoncallback=1&auth_token=72157643863957655-7d200500d5d46313&api_sig=32cd4c1142ad287b353638ae8978caec";
	days[5] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=c3423054cb5cdeff0d768eeb5fd3ab91&date=2014-04-06&per_page=10&format=json&nojsoncallback=1&auth_token=72157643863957655-7d200500d5d46313&api_sig=25ad112ca768b2423b772b6091b43485";
	days[6] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=c3423054cb5cdeff0d768eeb5fd3ab91&date=2014-04-05&per_page=10&format=json&nojsoncallback=1&auth_token=72157643863957655-7d200500d5d46313&api_sig=35aec115ae5af05ba0f9eb5b83b52404";

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