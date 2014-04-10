	
	// for each imgURL
		// create img
		// load url into img
			// get palette from color theif
			// visualize palette wedge (pallete)

function drawWedge(palette, imageCount, dayNum){

	console.log(index);
	console.log(imageCount);

	//imageCount for each image 
	var startPos = 0;

	var segHeight = 50;
	var innerRad = 150;
	var outerRad = innerRad+segHeight;
	var startAng;
	var endAng;
	var sliceAngle = 51/10;

	for(var clrCount = 0; clrCount<5; clrCount++){
		colour = palette[clrCount]; 
		// lastXPos += 20;
		

		console.log(colour);

		//convert angles to radians for use in d3.svg.arc()
		startAng = Math.radians( (dayNum*51) + (imageCount*sliceAngle));
		endAng = Math.radians( (((dayNum*51)-0.5)+sliceAngle) + (imageCount*sliceAngle) ); //-0.5 to have 0.5˚ gap between them.

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

	days[0] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=af3ac3bb7df2e70aa56921478847b6c2&per_page=10&format=json&nojsoncallback=1&api_sig=06333dfbfc223cdb20aac0ed6ae9f61d"; 
	days[1] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=af3ac3bb7df2e70aa56921478847b6c2&date=2014-04-08&per_page=10&format=json&nojsoncallback=1&api_sig=db8ce82987ce5f558009fb5095d60c77";
	days[2] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=af3ac3bb7df2e70aa56921478847b6c2&date=2014-04-07&per_page=10&format=json&nojsoncallback=1&api_sig=08c106286e9a5aeb081f1e98272a9591";
	days[3] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=af3ac3bb7df2e70aa56921478847b6c2&date=2014-04-06&per_page=10&format=json&nojsoncallback=1&api_sig=afd8e495190a967aa3a3279642ceeb36";
	days[4] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=af3ac3bb7df2e70aa56921478847b6c2&date=2014-04-05&per_page=10&format=json&nojsoncallback=1&api_sig=fe154fea3840815f525bdbae2fbe508f";

	var index=0;
	for(index=0; index<5; index++){
		loadFile(days[index], index);
	}
}


$(document).ready( loadData );


//converts degrees to radians
//from http://nickthecoder.wordpress.com/2012/04/15/radian-and-degree-conversion-in-javascript/
Math.radians = function(degrees){
	return degrees * (Math.PI/180);
}