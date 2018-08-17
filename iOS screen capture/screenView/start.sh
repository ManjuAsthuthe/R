#!/bin/bash

#	Cleanups
function clean_up {
	echo bye
	kill -9 $SERVER_PID || true\
	adb -s $1 shell  rm -r /sdcard/screenrecord-data/ || true
	exit
}
trap clean_up SIGHUP SIGINT SIGTERM

#	Vars
duration=1
bitrate=$(expr 2 \* 1000 \* 1000) # default is 4Mbps, but lower bitrate == higher FPS

#	Make directory
adb -s $1 shell mkdir /sdcard/screenrecord-data/ || true
rm -r ./files || true
mkdir ./files || true

#	Start Python static server
python -m SimpleHTTPServer 9090 &
SERVER_PID=$!

#	Loop
while [ 1 ]
do
	expired3=$expired2
	expired2=$expired
	expired=$previous
	previous=$now
	now=$(date +%s)
	adb -s $1 shell screenrecord --bit-rate=$bitrate /sdcard/screenrecord-data/$now.mp4 &
	RECORD_PID=$!
echo recording---------------------------------------------
	sleep $duration
	kill $RECORD_PID
	adb -s $1 pull /sdcard/screenrecord-data/$previous.mp4 ./files || true &
	adb -s $1 shell rm /sdcard/screenrecord-data/$expired.mp4 || true &
	rm -f /sdcard/screenrecord-data/$expired3.mp4 || true &
done
