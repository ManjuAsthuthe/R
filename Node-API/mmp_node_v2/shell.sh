#!/usr/bin/env bash

# example of using arguments to a script


triggerTest()
{
echo “entered into trigger test”
echo $1
echo $2
echo $3
echo $4
export ANDROID_HOME="/Users/s/Library/Android/sdk"
#cd /usr/bin/java 
java -jar /Users/s/TestAppium-0.0.1-SNAPSHOT-jar-with-dependencies $1 $2 $3 $4

echo “\n DONE”
}

"$@"
