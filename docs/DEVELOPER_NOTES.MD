# Introduction

The marking tool is predominantly a JavaScript plug-in for Adobe Acrobat. It is used as a full offline solution to open a PDF document, add custom annotations to the PDF (which represent typical marks from teachers) and then to finalise the document by adding up the full list of marks at the end and generate a marking sheet page.

From a development point of view, there are three main aspects to the tool:
* The actual JavaScript plugin to Acrobat
* The Windows installer
* The Mac installer (No longer in active use)

## Acrobat JavaScript Plugin

Acrobat has multiple extension mechanisms, including a JavaScript plugin system. The marking tool is built as a folder-level JavaScript plugin

For some background on Acrobat JavaScript, have a look at these links:
* https://acrobatusers.com/tutorials/javascript_console/
* https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/AcrobatDC_js_api_reference.pdf
* https://community.adobe.com/t5/acrobat/executing-folder-level-javascrips-in-acrobat-pro-dc/td-p/10214266?page=1 
* https://www.pdfscripting.com/public/Installing_Automation_Tools.cfm

The tool consists of 2 JavaScript files that are loaded at runtime. These JavaScript files enable a marking toolbar to become available to the end user.

Firstly, you should ensure that JavaScript is enabled in Acrobat:
* In Acrobat DC Pro - 
    * Edit > Preferences > JavaScript
    * Ensure that "Enable Acrobat JavaScript" is ticked
    * Ensure that "Enable interactive console" is ticked
    * Ensure that "Enable menu items JavaScript execution privileges" is ticked

To ensure the Tool is accessible and the JavaScript runs correctly, the 2 JS files (config.js and unisa_func.js) needs to be stored in the "Javascripts" folder. Take note that the location of this folder depends on how you installed Acrobat. On my current machine the location is: 
* C:\Program Files (x86)\Adobe\Acrobat DC\Acrobat\Javascripts

Also note that the above folder is likely protected, so you will need to copy the file as an administrator. I've found that the best approach is to open a command prompt using administrative privileges and then copy the files using the old-school DOS copy command:
 * copy config.js "C:\Program Files (x86)\Adobe\Acrobat DC\Acrobat\Javascripts\config.js"
 * copy unisa_func.js "C:\Program Files (x86)\Adobe\Acrobat DC\Acrobat\Javascripts\unisa_func.js"

All javascript files that are stored in this location will be automatically loaded whenever a PDF file is opened.

Once the above steps have been taken, JS files will load and execute automatically on Acrobat Startup. 

To view the interactive console: Ctrl-J
To execute JS code in the debugger, highlight the code and press Ctrl-Enter

If you are installing the applicattion manually, you then also need to ensure that the image assets are stored in the folder, as defined in the config.js file.
 - The source resource files are stored at: [REPO_ROOT]]\src\MarkingTool\v1.8\res
 - The files should be copied to: C:\Program Files\UNISA

Getting the toolbar to load is quite finicky:
 - The PDF should NOT be protected
 - Acrobat should be loaded with an open document
 - Acrobat should NOT load the file for editing, just select "Open With"

If all goes well, you should see a new section titled "Add On Tools" in the Tools page. If you select this option, the marking toolbar will appear.

If things don't go well, you will see the error in the JavaScript Console. Usually this is an error related to the plugin not being able to find the document. The error is: "TypeError: aNewDoc is undefined"

Another note: Based on the code I'm seeing, I suspect the plugin would only work if ONLY one document is open at a time.

The toolbar references icons that need to be placed in a specific location on the machine

## Windows Installer

The installer is built using NSIS (Nullsoft Scriptable Install System)

Basically it does the following:
* Creates a suitable folder for storing assets (Program Files/UNISA)
* Copy the icons to the installation file
* Copies the Javascript files into the Acrobat JavaScripts folder
* Creates an uninstaller and stores with the rest of the assets
* Makes a few windows registry entries

Instead of variables, the current install script uses a set of registers, there are referenced as $0, $1 etc.
The purpose of each of the registers are as follows:
$0 - Store the name of the Adobe Acrobat registry entry (Looks broken though)
$1 - Referenced, but never initialised
$2 - Store the name of the Adobe Acrobat registry entry - This time by direct reference
$3 - Location where JS file must be stored
$4
$5 - Store the value of the Acrobat version
$6

## Mac Installer

At present, the solution is only deployed to Windows users, so the Mac installer has not been tested for some time.

## Issues identified during upgrade to v1.8

* Didn't see any details of the previous development team's work.
* There was some spurious characters in unisa_func.js line 63 - Caused a syntax issue
* The installer expected to find a JS file called "configuration.js", which is obviously config.js
* After fixing the file name installer compiles, but fails with message: "Adobe Acrobat 10 or higher not found"
* Looks like the way that the tool tries to find out if Acrobat is installed is broken - It just happens to no fail
    * We should rather loop through all Adobe registry entries looking for one titled "Adobe Acrobat"
* Scratch that - The Acrobat registry code is very bad - Will just rewrite it all
* Also note: The installer will need to be run as administrator
