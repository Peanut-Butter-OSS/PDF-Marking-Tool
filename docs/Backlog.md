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
   
## Implemented (Once a feature is implemented, move it here)
