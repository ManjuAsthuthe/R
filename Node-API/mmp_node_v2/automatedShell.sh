

triggerAndroidAutomatedTestTest()
{
echo “entered into trigger test”
echo $1
echo $2
echo $3

#cd /usr/bin/java 
export ANDROID_HOME="/Users/s/Library/Android/sdk"
cd $1
#Set important variables for execution
export JAVA_HOME="/Library/Java/Home"
echo $(pwd)
bundle install
adb -s $2 install $3
sleep 10

calabash-android run $3 ADB_DEVICE_ARG= $2 --format html --out reports_$(date +%Y-%m-%dT%H:%M:%S).html
#sleep 10
echo “\n DONE”
}


triggerIOSAutomatedTestTest()
{
echo “entered into trigger test”
echo $1
echo $2
echo $3
cd $1

}

"$@"
