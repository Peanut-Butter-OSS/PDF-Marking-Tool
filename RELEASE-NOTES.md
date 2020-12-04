# RELEASE NOTES

## v2.0
Date Released: 2020-??-??
Developer: Greg Fullard

### Changes


## v1.8

Date Released: 2020-10-27
Developer: Greg Fullard
  
### Changes   
#### Updated Windows installation to work with Adobe Acrobat DC Pro on Windows 10
The installer script was refactored to work on Acrobat DC Pro on Windows 10. Key changes to make this possible included:
- Configuring the installer to run with administrator privileges
- Updating the way in which the installer verifies the current version of Acrobat
- Refactored and added comments to the installer in an effort to make the code easier to work with in the future

#### Improved the default startup configuration of marker plugin
Edge-case usability of the marking tool was very problematic due to a lack of error handling in the code. The result to an end-user was that the plugin simply wouldn't load and the user would have no clue why not.

I added various error checks in the config script so that the marking tool plugin loads nonetheless, but then provides the user with an indication of any errors that happened during startup. 

#### Resized tool icons
The default icon size used in earlier versions of the tool are larger that what is allowed by the app.addToolButton method of the Acrobat JavaScript API. Icons ware 100x100 pixels, but the documentation states that a maximum of 20x20 is allowed. The tool would intermittently fail to load due to the icons.

I added error handling code to give the end-user a heads-up if this is the case

Initially, I did resize the icons to 20x20, but then the icons were too small to user. Instead, I resized to 50.50 pixels. Even though this is still larger than the allowed size, it seems to work correctly

#### Added Developer Notes
Added a DEVELOPER_NOTES.MD file in the docs folder. This document contains various references and notes that were uncovered while working with the tool.

### Test cases
Earlier versions of the tool did not include any test cases. The following informal test scenarios were identified and tested:

* Installer
  * PASSED: Run installer on Windows 10 machine with neither Reader or Acrobat DC
  * PASSED: Run installer on Windows 10 machine with just Reader installed
  * PASSED: Run installer on Windows 10 machine with Acrobat DC installed
  * PASSED: Attempt to install with normal user (without admin privileges)
* Uninstaller
  * PASSED: Uninstall marking tool
* Plugin
  * PASSED: Open without any PDF document
  * PASSED: Open with PDF document
  * PASSED: Perform marking, count marks, finalise document

## Version 1.7 - February 2015

      Proudly Developed By
   
      KYLE BOWDEN in conjuction with Learning Curve
      kyle247365@gmail.com | +27 84 738 9643
   
      Enhancements:
        - Update installer to set Javascript prefs in Acrobat 11 & Higher
        - Fixed comments rolling off page
        - Added installer for Mac OSX
        - Minor refactors / tweaks

## Version 1.6 - 1.6.1 -  November 2012
  
      Proudly Developed By
   
      KYLE BOWDEN in conjuction with Learning Curve
      kyle247365@gmail.com | +27 84 738 9643
   
      Enhancements:
        - Minor system updates / tweaks
        - Ported application to the Windows 7 32-bit platform
   
## Version 0.1 - 1.5 - October 2009

      Proudly Developed By
 
      THE AESIR DEVELOPMENT SQUAD 
      www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
 
      CREDITS
      Lead Developer    :: War Commander      :: Kyle Bowden
      Business Analyst  :: Field General      :: Willy Gadney
      Test Squad        :: Clean Out Crew     :: Herman Van Wyk & Tina Kanniah
      Dev Support       :: Backup             :: Nelson Baloyi
      LC Designer       :: Artillery          :: Lentswe Morule
      Installer         :: Mobilizer          :: Thabahla Shoko
      Enviro & Food     :: Crew Support       :: Khosi Gwala
      Architect         :: Special Operations :: Luigi D'Amico

