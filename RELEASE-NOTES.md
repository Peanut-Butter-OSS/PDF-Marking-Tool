# RELEASE NOTES

## v2.0.1
Date Released: 2021-01-11
Developer: Greg Fullard

#### Issue #22 Marking Tool About menu overrides the default Acrobat about
When calling the Acrobat About menu item, it shows the marking tool about information. Seems like the marking tool About menu uses the same name as the built-in Acrobat About menu. Renamed out menu item and corresponding function.

## v2.0.0
Date Released: 2020-11-30
Developer: Greg Fullard

### Changes

#### IMP-4 - Configure details of marker (Add to results page)
As part of the new configuration dialog (accessed from the new menu - see IMP-7) the user is able to configure their Name. This name will be incorporated in the results page when marks are counted (see IMP-5)

#### IMP-5 - Add marker details to the marking summary sheet
The marking results page was changed significantly to improve the layout. As one of these improvements included the addition of the marker name into the results page.

#### IMP-7 - Marking tool menu
The previous version of the marking tool did not include an Acrobat menu item. Additionally, the tools were only added to the "Add-On Tools" toolbar under specific conditions. These two facts combined made it almost impossible for novice users to know whether the marking tool is even running. 

To improve usability, a marking tool menu item (under the Edit menu) was introduced. This menu section now includes menu items for setting configurations, viewing the "About" information of the marking tool and verifying the current status of the tool. There are also additional menu items available related to Rubrics (to be explained in IMP-10)

These new menu items load under all circumstances and provide the user with a clear inficiation of whether the marking tools are ready for use, and if not, why.

#### IMP-10 - Replacement Rubric functionality
v1.x of the marking tool relied on a complex combination of an separate XFA form and a further Adobe AIR application that was used to assemble and use a marking rubric. Both of those technologies (XFA and AIR) are on an end-of-life roadmap and needed to be replaced.

The whole Rubric marking feature was rebuilt from the ground up, based on a JSON-based rubric data structure. This allows course lecturers to assemble a rubric using a simple JSON file, which is then imported into an assignment using the "Select Rubric" menu option that is available in the new marking tool menu.

Once the rubric is imported, users can now also leverage the new "Rubric Mark" tool, which allows them to easily select the criterion and level from a ser of linked dropdown menus. Based on these selections, the rubric automatically applies a default mark and corresponding comment to the assignment (defaults can be overridden)

The results page was also rewritted from scratch to better reflect the data strcutures of the rubric (when used)

#### IMP-13 - Remember the assigned points for a mark
When clicking the Add a tick" tool, a dialog is provided for the user to capture the value of a tick mark. In v1.x, the user has to repeatedly enter this value each time the tool was selected.

v2.0 added a solution to simply remember what the user previously captured and prepopulate the field if this value is available

#### IMP-15 - Remember total possible marks if I reclick the Count option
When clicking the "Count Marks" tool, a dialog is provided for the user to capture the assignment total (i.e. the "out of" value). In v1.x, the user has to repeatedly enter this value each time the button was clicked.

v2.0 added a solution to simply remember what the user previously captured and prepopulate the field if this value is available

#### IMP-19 - Rename installation folder from UNISA to PdfMarkingTool
Due to the dependency on Adobe AIR and a separate XFA form, v1.x of the marking tool had to be installed in 2 separate locations: The JS files were added in the Acrobat "Javascripts" folder, whole all other assets were added into a custom "UNISA" folder under "Program Files".

There are 2 concerns with naming the folder "UNISA":
 1. Unisa lecturers have many other tools installed on their machine and the name does not clearly highlight that this folder is associated with the marking tool
 2. When the mrking tool is installed by other institutions, the name "UNISA" makes no sense

Due to IMP-10, we were able to move all files into the "Javascripts" folder, but placing the assets into a subfolder titled "PdfMarkingTool"

#### IMP-24 - Break unisa_func.js (marking-tool-func.js) into separate logical modules
The main Javascript file in v1.x was called "unisa_func.js". The file included most of the JavaScript functionality and was difficult to manage (About 3000 lines of code). As part of the upgrade to v2.0, the single js file was broken down into a set of logically grouped files.

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

