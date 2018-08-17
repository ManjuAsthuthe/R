function start(){
	console.log("Starting..");
	window.delay = 1;
	window.frameRequest = requestAnimationFrame(printToCanvas);
	window.streamInterval = setInterval(function(){
		var video = document.getElementById('video');
		var currentSecond = Math.floor(new Date().getTime() / 1000 - 0.75) - delay - 1;
	    video.src = 'files/' + currentSecond + ".mp4";
	}, delay*1000);
	document.getElementById("play").innerHTML = "&#9632;";
}

function stop(){
	console.log("Stopping..");
	clearInterval(window.streamInterval);
	delete window.streamInterval;
	cancelAnimationFrame(window.frameRequest);
	document.getElementById("play").innerHTML = "&#8227;";
	document.getElementById("screen").width = document.getElementById("screen").width;
}

function toggle(){
	if (window.streamInterval)
		stop();
	else
		start();
}


function printToCanvas(){
	var video = document.getElementById('video');
	var canvas = document.getElementById('screen');
    canvas.width=1080;
    canvas.height=1920;
	//var canvas = document.getElementById('myCanvas'),
	var ctx = canvas.getContext('2d');
	elemLeft = canvas.offsetLeft;
    elemTop = canvas.offsetTop;
    
	var videoLength = Math.max(video.videoWidth, video.videoHeight);
	var length = Math.min(window.innerWidth, window.innerHeight);
	var ratio = length/videoLength;
    console.log(ratio)
	console.log("videoWidth===="+video.videoWidth+"VideoHeight"+video.videoHeight);	
	if (ratio != NaN && ratio != 0 && ratio != Infinity && video.currentTime != 0){
		ctx.canvas.width  = window.innerWidth/ratio;
  		ctx.canvas.height = window.innerHeight/ratio;
		ctx.drawImage(video, 0, 
							0, 
							video.videoWidth, 
							video.videoHeight);
		//elemLeft = (window.innerWidth - video.videoWidth*ratio)/2/ratio;
    	//elemTop = (window.innerHeight - video.videoHeight*ratio)/2/ratio;
		//console.log("videoWidth===="+video.videoWidth+"VideoHeight"+video.videoHeight);
	}
	
	canvas.addEventListener('click', function(event) {
    var x = event.pageX * 2.8;
    var y = event.pageY * 2.8;
        console.log(x +' '+y);
//    var py_url = "http://localhost:8000/script.py?x_cord="+x+"&y_cord="+y;
//    $.ajax({url: py_url, 
//    	data: {'name': py_url},
//    	type: 'GET',
//    	success: function(result){
//        
//    }});
    // $.post({
    //         url: py_url,
    //         data: {x_val: x, y_val: y},
    //         success: function(response){
    //                 console.log(response);
    //             }
    //    });
}, false);
	window.frameRequest = requestAnimationFrame(printToCanvas);
}




