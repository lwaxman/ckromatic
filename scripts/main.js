
function visualizeDay(photosData) {
	var imgURLs = []
	
	for(index=0; index<photosData.length; index++){
		var photoData = photosData[index];
		var imgURL = "http://www.lauriewaxman.com/datadesigncode/realtime/proxy.php?src=https://farm"
					+ photoData.farm 
					+ ".staticflickr.com/"
					+ photoData.server 
					+ "/"
					+ photoData.id 
					+ "_"
					+ photoData.secret 
					+ "_s.jpg";

		imgURLs.push(imgURL);
	}

	
}

function loadFile(url, angle) {
	d3.json(url, function(data) {
		console.log("File Loaded", url, data);
		visualizeDay(data.photos.photo, angle); //path to each individual photo
	});	
}


function loadData()
{
	var days = [];

	days[0] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=af3ac3bb7df2e70aa56921478847b6c2&per_page=10&format=json&nojsoncallback=1&api_sig=06333dfbfc223cdb20aac0ed6ae9f61d"; 
	days[1] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=af3ac3bb7df2e70aa56921478847b6c2&date=2014-04-09&per_page=10&format=json&nojsoncallback=1&api_sig=d9d45744ba22870f4bb45d1957b3f1c6";
	days[2] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=af3ac3bb7df2e70aa56921478847b6c2&date=2014-04-08&per_page=10&format=json&nojsoncallback=1&api_sig=db8ce82987ce5f558009fb5095d60c77";
	days[3] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=af3ac3bb7df2e70aa56921478847b6c2&date=2014-04-07&per_page=10&format=json&nojsoncallback=1&api_sig=08c106286e9a5aeb081f1e98272a9591";
	days[4] = "https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=af3ac3bb7df2e70aa56921478847b6c2&date=2014-04-06&per_page=10&format=json&nojsoncallback=1&api_sig=afd8e495190a967aa3a3279642ceeb36";

	var index=0;
	for(index=0; index<5; index++){
		loadFile(days[index], index * 360 / days.length);
	}
}





$(document).ready( loadData );



//converts degrees to radians
//from http://nickthecoder.wordpress.com/2012/04/15/radian-and-degree-conversion-in-javascript/
Math.radians = function(degrees){
	return degrees * (Math.PI/180);
}

