#!/bin/bash

#	Cleanups
function clean_up {
	echo bye
	kill -9 $SERVER_PID || true
		rm -r ./files || true
	exit
}
trap clean_up SIGHUP SIGINT SIGTERM

#	Vars
duration=1

#	Make directory
mkdir ./files || true


#	Start Python static server
python -m SimpleHTTPServer 9090 &
SERVER_PID=$!


#	Loop
while [ 1 ]
do
	now=$(date +%s)
	idevicescreenshot ./files/${now}.jpg
echo “screen shot taken ———————————————————“
 #	sleep $duration
echo “ sleep done —————————“
done

	
	
