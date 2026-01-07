#!/bin/bash  
HOME_DIRECTORY=$(pwd)
echo $HOME_DIRECTORY
echo $PATH
export SIKULI_HOME=$HOME_DIRECTORY$/Sikuli/sikuli-java.jar
echo $SIKULI_HOME
java -cp $SIKULI_HOME -jar mac-adapter-0.1.jar