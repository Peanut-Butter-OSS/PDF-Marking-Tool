#!/bin/bash
# Script to check for existence of Acrobat 10.0 or Higher

ADOBE_ACROBAT_MIN_VERSION=10
ADOBE_ACROBAT_DIR=~/Library/Application\ Support/Adobe/Acrobat/ 

if [ -d "$ADOBE_ACROBAT_DIR" ]
then
    echo "Acrobat found!"
    FOUND=false
    VERSION=$ADOBE_ACROBAT_MIN_VERSION
    FOLDER_SIZE="$(ls -1 "$ADOBE_ACROBAT_DIR" | wc -l)"
    for i in {1..$FOLDER_SIZE}; do
    	if [ -d "$ADOBE_ACROBAT_DIR$VERSION.0" ]
    	then
		if [ $VERSION -ge $ADOBE_ACROBAT_MIN_VERSION ] 
                then
		   echo "adobe acrobat correct version found!"
		   FOUND=true                 
                fi		
    	fi
        let VERSION++
    done

    if [ $FOUND == "true" ]
    then
       echo "Success!!!"
       $(exit 1)
    else
       echo "Failure!!!"
       $(exit 0)
    fi
else
    # adobe acrobat or correct version not found on machine
    $(exit 0)
fi
