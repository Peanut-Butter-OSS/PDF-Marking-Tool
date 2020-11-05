# Marking Tool Feature Backlog

## Input (Dump ideas here)
- TODO - Add unpolished improvement idead here

## Elaborated (Define features here)

### IMP-1 - Configured location for marked and unmarked files
The current implementation of the marking tool allows any file from anywhere to be opened and marked. This places the responsibility on the end-user to open the correct files and also to save marked files in the correct location. This solution works well with Unisa's back-end workflow, but other universities may have different workflows. As a result it is suggested that the application features a configurable location where unmarked and marked assignments are picked up from.

For example, all unmarked files would be stored be stored at C:/users/joe/Documents/MarkingTool/Unmarked and marked files may be stored in C:/users/joe/Documents/MarkingTool/Marked.
NOTE: The configured location can be updated by the end-user

By standardising on the location in the marking tool itself, it becomes possible to track which files are awaiting marking in the tool itself, instead of relying on an external tool that is University-specific.

Additionally, this change would allow the use of commodity file-synchronisation solutions like OneDrive, DropBox and GoogleDrive with the marking tool

Realisation Notes
 - Prerequisites: 
   - None
 - Technical considerations
   - Determine how to do user-controlled configurations. This may be done as a seperate installer, or an Acrobat plugin
   - Use glob.js
 - Priority (1=Very High, 5=Very Low)
   - TODO 

### IMP-2 - Move PDF file to the location for marked files as part of the finalise process
The current PDF marking solution includes the ability to ""Finalise" a file. This finalisation process adds up all the assigned marked and created an extra page at the end of the PDF. This page (the marking summary) contains information about the assigned marks.

If IMP-1 is implemented, the finalisation process should automatically move a file to the location for marked files. 

It may also be useful to rename the marked file by appending the text "MARKED" to the file name

Realisation Notes
 - Prerequisites: 
   - IMP-1
 - Technical considerations
   - Should be a small change in the current finalisation function
   - We should just double-check that we can actually move the file while it is open
 - Priority (1=Very High, 5=Very Low)
   - TODO 

### IMP-3 - Open next unmarked file
The current solution requires a user to open unmarked files using the default OS functionality, or via the "File > Open" menu in Acrobat.

If IMP-1 is implemented, the tool can be streamlined further by adding an "Open next unmarked file" option. This option (potentially a customised menu item) will automatically open the next PDF file that is stored in the unmarked files location.

Realisation Notes
 - Prerequisites: 
   - IMP-1
 - Technical considerations
   - This will likely require a C++ plugin, not simply a JAvascript plugin and could potentially be difficult to achieve
 - Priority (1=Very High, 5=Very Low)
   - TODO 

### IMP-4 - Configure details of marker
The current marking solution does not maintain any details of the marker. This is appropriate in the case of Unisa, since their solution includes a back-end workflow system that tracks which files were delivered to which markers. However, to make the solution more independent of a specific implementation, it would be useful to incorporate the details of the marker into the tool itself.

Acrobat already maintains information about the licenced user, but there are scenarios where multiple markers may share the same computer. In those cases it would be useful to maintain the name and surname (and possibly a unique identifier) of the marker. This information would be maintained in a configurable field, much like the unmakred and marked locations.

NOTE: The configured information can be updated by the end-user

Realisation Notes
 - Prerequisites: 
   - None
 - Technical considerations
   - Determine how to do user-controlled configurations. This may be done as a seperate installer, or an Acrobat plugin
 - Priority (1=Very High, 5=Very Low)
   - TODO 
   
### IMP-5 - Add marker details to the marking summary sheet
If IMP-4 is implemented, the logical next step would be to include the marker details into the marking summary sheet, which is created when an assignment is finalised.

Realisation Notes
 - Prerequisites: 
   - IMP-4
 - Technical considerations
   - Simple change to the finalisation function
   - Store details in glob.js
 - Priority (1=Very High, 5=Very Low)
   - TODO 
   
### IMP-6 - O365 Power Automate flows for moving files between sharepoint and OneDrive of individual markers
The current implementation of the marking tool relies heavily on a back-end workfloe implemented at Unisa. This workflow copies files up and down between the server and workstations of individual markers. While the solution works well, it is Unisa-specific.

To create the posibility for decoupling, the file folders should be configurable in the marking tool itself (see IMP-1). Once this is implemented a range of commodity file synchronisation tools can be used to copy files from the local workstation to a server location. the most likely candidate would be Microsoft OneDrive.

Assuming OneDrive is used to copy files between the marker's workstation and the server, all that remains is to create an automated workflow that distributes files to individual markers. Power Automate (part of the Office 365 family) will be an ideal too fot this solution.

Realisation Notes
 - Prerequisites: 
   - IMP-1
 - Technical considerations
   - Will require an institution with a deployment of SharePoint and O365
 - Priority (1=Very High, 5=Very Low)
   - TODO 
   
### IMP-7 - Marking tool menu
Add a standard menu item for the marking tool. This will be present irrespective of whether any document is currently open. Must be under the "Edit" menu

Default sub-items in menu:
 - About - Basic modal showing information about the marking tool version, etc
 - Config - Configs regarding folder locations etc.
 - Help - Link to online help

Additional menu items to be specified as separate backlog items

### IMP-8 - New Menu Item :: Enable Marking Tools
This menu option will do what currently happens on startup of the tool, i.e. it:
 - Verifies that just a single document is open
 - Adds the marking tools to the "Add-On Tools" toolbar

By making this available as a menu option, usability (especially for new users) would be drastically increased. If enabling the marking tool fail for any reason, this would also give us a logical place to present such information to the user (for example, a modal after the menu item was selected)

Without this capability we have the following scenario which consistently happens with new users:
 - User opens Acrobat without a document,
 - Because no document is available, the marking tool does not initialize
 - User then opens a PDF (for example, by choosing File > Open)
 - In this scenario the tool give the user no indication of why the marking tools are not available

### IMP-9 - Reusable Comments
There should be a way for a marker to "store" a comment for reuse later. There are multiple ways to achieve this goal, but at present it is suggested that:

 - A new custom tool is added to "create saved comment". This should provide a dialog similar to the NWU commenting tool (i.e. user can capture or select a category and then capture some comment text)
 - The existing comment mark tool should be enhanced to allow the user to either capture a new comment, or select a category and comment from a dropdown
 
 Tech considerations / experiments:
 - Read XML file from within Acrobat
 - Write XML file from within Acrobat
 - Read config file from within Acrobat (To get location of XMLs)

### IMP-10 - Replacement Rubric functionality
The current rubric and commenting tool is based on an Adobe AIR application and an accompanying XFA form. Both of these technologies are outdated and cumbersome. It would be more appropriate to build a more user friedly solution for marking rubrics and assignment-specific comments.

The NWU commenting tool has a useful approach based on a small visual-basic app that is distributed with the marking tool. The Visual basic app allows a user to define a rubric, which is then stored as a CSV file. This CSV file is then accessible from within the "Comment Mark tool" allowing the marker to seleced a category and score

A similar solution should be considered for the marking tool as a built-in capability

An alternative approach may be to store rubric data ad XMP metadata inside the document itself

Tech considerations / experiments:
 - Read XML file from within Acrobat
 - Write XML file from within Acrobat
 - Read config file from within Acrobat (To get location of XMLs)

Selected for release 2.0

### IMP-11 - Improve Layout of Results Page
The current results page looks a bit plain and can do with improved styling and structure

### IMP-12 - Multiple colours for mark annotations
The current solution uses only a single colour for annotations. The NWU solution added the ability for a lecturer to pick from a few colours

### IMP-13 - Remember the assigned points for a mark
The "Add a tick" tool allows a user to speciufy the value of a single tick mark. However, there are some major usability drawbacks:
- Each time the tool is selected, the value must be specified
- There are no visual cues to a user about what value was selected after the fact.

One improvement would be to remember the value of a tick mark, so that the user would not have to reselect it each time. this was implemented in the NWU marking tool, so we can simply have a look at their implementation 

### IMP-14 - Show the number of marks assigned to the variable score tick
Related to IMP-13, it would be valuable if each tick mark hs a small subscript that indicates the number of points it is worth

### IMP-15 - Remember total possible marks if I reclick the Count option
Currently, each time the user clicks on the "Count Marks" tool they would need to re-specify the total. 

It would improve usability if the value was pre-populated if the tool is aused a second time

### IMP-16 - Deselect tool must be available when the "Mark" and "Comment mark" tools are selected
The "deselect tool" tool is useful to enable users to be able to delete or move existing annotations. However, it is not currently enabled when the "Mark" or "Comment Mark" tools are selected

See registered issue #4

Selected for release 2.0

### IMP-17 - Marking Tool Website
Currently there is not documentation available for the tool, except for the outdated functional spect from many years ago. To improve users' ability to help themselves, but also to serve as a marketing medium, an initial landing page should be created for the marking tool whould highlights its features and user base.

To make this simple, it should be built as a static Jekyll site and deployed to GitHub pages.

Updated Decision: Greg to assist with content, but implementation will be on the Learning Curve Website and will be done by Learning Curve team

### IMP-18 - User guide videos
To assist external users, it would be valuable to create one or two short YouTube videos that explain the use of the tool. These videos can be referenced on the tool website

### IMP-19 - Rename installation folder from UNISA to PDF_Marking_Tool
The existing installation folder is confusing for UNISA users and users at other universities. By renaming it, it'll make it simpler for users to know where to search for asset files (and the uninstaller)

Selected for release 2.0

### IMP-20 - Rename config.js to marking-tool-config.js
The config JS file has a very generic name which could cause confusion. A simple solution is to simply rename it to "marking-tool-config"

Note: We still need a config.js file, because it ensures that it is run first, but config.js can simply reference marking-tool-config.js

Selected for release 2.0

### IMP-21 - Rename unisa_func.js to marking-tool-func.js
The unisa_func JS file has a very generic name which could cause confusion. A simple solution is to simply rename it to "marking-tool-func"

Selected for release 2.0

### IMP-22 - Pre-generate Results page based on Rubric data
(This option is only available if Rubric information can be embedded as XMP metadata)
During initialisation, it would be very valuable if the Results page can be pre-rendered (or possible even attached server side), based on rubric metadata.

This will provide the marker with an immediate "scoring sheet" for the assignment

### IMP-23 - Add tools for switching between the Results page and the current position in the document
If IMP-22 is implemented, it would be useful to add two new buttons to the toolbar. 

Button 1 would take the user to the top of the results page (and in the background it will store the document position when the button was clicked)

Button 2 would take the use back to the stored position from Button 1.

When combined, these two buttons would then enable a user to easily/quickly flip between the assignment content and the marking sheet. 

### IMP-24 - Break unisa_func.js inso separate logical modules
The unisa_func.js file is large and contains a number of disparate methods. This makes it difficult to understand and maintain. To improve maintainability, the file should be split into logical modules, for example:
 - marking_tool_annotations.js (containing all logic for drawing annotations)
 - commenting_tool.js (containing logic related to the commenting tool)
 - rubric_tool.js (containing login related to the rubric capability)

Note: the above are just suggestions; once the code has been analysed in depth, a final design decision can be made

### IMP-25 - Replace deprecated event object
The unifa_func.js file makes a large number of references to the deprecated event object. This should probably be replaced to avoid future issues.

### IMP-26 - Sidecar XML file containing results
When finalising the document, write a separate XML file containing the marking data



## Implemented (Once a feature is implemented, move it here)
