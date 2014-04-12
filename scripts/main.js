//link to photo
//

function drawWedge(palette, imageCount, dayNum){

	console.log(index);
	console.log(imageCount);

	//imageCount for each image 
	var startPos = 0;

	var segHeight = 40;
	var innerRad = 150;
	var outerRad = innerRad+segHeight;
	var startAng;
	var endAng;
	var sliceAngle = 50/10;

	for(var clrCount = 0; clrCount<5; clrCount++){
		colour = palette[clrCount]; 
		// lastXPos += 20;
		

		console.log(colour);

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
		        return "rgb("+colour[0]+","+colour[1]+","+colour[2]+")";
		    })
		    .attr("stroke-width", "5")
		    .attr("transform", "translate(350,350) rotate(-94.5)");
			// .attr("transform", "translate(600,400)");

		//inrease radii
		innerRad+=segHeight;
		outerRad+=segHeight;
		startPos+=60;		
	}
}


function getPalette(urls, dayNum){
	for(var urlCount=0; urlCount<urls.length; urlCount++){		
	
		// var palette;	
		var img = new Image;
		img.onload = function(){
			var colourThief = new ColorThief();
			var palette = colourThief.getPalette(img, 5);
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

	days[0] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=8a5f0b3e222015eb6b8efbbe47f5cc4e&per_page=10&format=json&nojsoncallback=1&auth_token=72157643823247705-175f9f914237f833&api_sig=f53bebedcb2b138d729240a30d677f31"; 
	days[1] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=8a5f0b3e222015eb6b8efbbe47f5cc4e&date=2014-04-10&per_page=10&format=json&nojsoncallback=1&auth_token=72157643823247705-175f9f914237f833&api_sig=1e6bddaec141f6c00bff315d4d293428";
	days[2] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=8a5f0b3e222015eb6b8efbbe47f5cc4e&date=2014-04-09&per_page=10&format=json&nojsoncallback=1&auth_token=72157643823247705-175f9f914237f833&api_sig=20421823ffdb267c9cd3f7c401f01251";
	days[3] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=8a5f0b3e222015eb6b8efbbe47f5cc4e&date=2014-04-08&per_page=10&format=json&nojsoncallback=1&auth_token=72157643823247705-175f9f914237f833&api_sig=f4c01a06da77143e42690a26dd432da3";
	days[4] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=8a5f0b3e222015eb6b8efbbe47f5cc4e&date=2014-04-07&per_page=10&format=json&nojsoncallback=1&auth_token=72157643823247705-175f9f914237f833&api_sig=168925be588132b49babef90a6569492";
	days[5] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=8a5f0b3e222015eb6b8efbbe47f5cc4e&date=2014-04-06&per_page=10&format=json&nojsoncallback=1&auth_token=72157643823247705-175f9f914237f833&api_sig=2df71576e0eb0c19381991d08d5860bd";
	days[6] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=8a5f0b3e222015eb6b8efbbe47f5cc4e&date=2014-04-05&per_page=10&format=json&nojsoncallback=1&auth_token=72157643823247705-175f9f914237f833&api_sig=60bd988d73aaa65a0e654055dbb71916";

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