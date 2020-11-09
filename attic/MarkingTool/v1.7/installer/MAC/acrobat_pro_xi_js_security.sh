#!/bin/bash

# Set up JavaScript security privileges for Acrobat XI
/usr/libexec/PlistBuddy -c "Set 11:JSPrefs:EnableJS:1 true" ~/Library/Preferences/com.adobe.Acrobat.Pro.plist
/usr/libexec/PlistBuddy -c "Set 11:JSPrefs:EnableMenuItems:1 true" ~/Library/Preferences/com.adobe.Acrobat.Pro.plist
/usr/libexec/PlistBuddy -c "Set 11:JSPrefs:EnableGlobalSecurity:1 true" ~/Library/Preferences/com.adobe.Acrobat.Pro.plist

# Kill the plist caching to force a reload of the plist file for Acrobat
sudo killall cfprefsd