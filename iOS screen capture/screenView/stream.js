

                var canvas;
                var video;
                var ctx;
                var length;
                var videoLength;
                var ratio;


                function start(){
                    console.log("Starting..");
                    window.delay = 1;
                    window.frameRequest = requestAnimationFrame(printToCanvas);
                    window.streamInterval = setInterval(function(){
                    //     var video = document.getElementById('video');
                    //     var currentSecond = Math.floor(new Date().getTime() / 1000 - 0.75) - delay - 1;
                    //     video.src = 'files/' + currentSecond + ".mp4";
                    // }, delay*1000);
                    var image = document.getElementById('image');
                        var currentSecond = Math.floor(new Date().getTime() / 1000 - 0.75) - delay - 1;
                        // debugger;
                        console.log('currentSecond============'+currentSecond)
                        image.src = 'files/' + currentSecond + ".jpg";
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

                var CaptureClicksEvent = function (event){
                        var x = event.pageX/ratio;
                        var y = event.pageY/ratio;

                        var py_url = "http://localhost:5000/api/tap?x_coord="+x+"&y_coord="+y+"&device_id=1f93c2d49904";

                        $.ajax({url: py_url, 
                        type: 'GET',
                        success: function(result)
                        {
                            console.log("x1 "+x +' y1 '+y); 

                        }});
                        removeCaptureClicks();  


                }

                function removeCaptureClicks(){

                    $("#screen").off("click");
                     //alert("Removed");
                    //canvas.removeEventListener('click',CaptureClicksEvent);
                }

                function printToCanvas(){
                 video = document.getElementById('image');
                    canvas = document.getElementById('screen');
                     ctx = canvas.getContext('2d');

                     videoLength = Math.max(video.videoWidth, video.videoHeight);
                     length = Math.min(window.innerWidth, window.innerHeight);
                     ratio = length/videoLength;
                // if (ratio != NaN && ratio != 0 && ratio != Infinity && video.currentTime != 0){
                //         ctx.canvas.width  = window.innerWidth/ratio;
                //         ctx.canvas.height = window.innerHeight/ratio;

                    ctx.drawImage(video, 0,0, 
                                            video.videoWidth, 
                                            video.videoHeight);

                    // ctx.drawImage(video, 0,0, 
                    //                         window.innerWidth, 
                    //                         window.innerHeight);


                }


                   requestAnimationFrame(printToCanvas);
                // }

                requestAnimationFrame(printToCanvas);

                //function onCLICK()
                //{
                //    alert("Clicked");
                    //canvas.addEventListener('click',CaptureClicksEvent);
                    $(document).on("click","#screen",function(e) {
                                CaptureClicksEvent(e);
                    });       
                             
