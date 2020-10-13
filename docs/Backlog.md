# Marking Tool Feature Backlog

## Input (Dump ideas here)
- Configure details of marker
- When file is finished, add the details of the marker
- O365 Power Automate flows for moving files between sharepoint and OneDrive of individual markers

## Elaborated (Define features here)

### IMP-1 - Configured location for marked and unmarked files
The current implementation of the marking tool allows any file from anywhere to be opened and marked. This places the responsibility on the end-user to open the correct files and also to save marked files in the correct location. This solution works well with Unisa's back-end workflow, but other universities may have different workflows. As a result it is suggested that the application features a configurable location where unmarked and marked assignments are picked up from.

For example, all unmarked files would be stored be stored at C:/users/joe/Documents/MarkingTool/Unmarked and marked files may be stored in C:/users/joe/Documents/MarkingTool/Marked.
NOTE: The configured location can be updated by the end-user

By standardising on the location in the marking tool itself, it becomes possible to track which files are awaiting marking in the tool itself, instead of relying on an external tool that is University-specific.

Additionally, this change would allow the use of commodity file-synchronisation solutions like OneDrive, DropBox and GoogleDrive with the marking tool

Realisation Notes
 - Prerequisites: 
   - TODO
 - Technical considerations
   - TODO
 - Priority (1=Very High, 5=Very Low)
   - TODO 

### IMP-2 - Move PDF file to the location for marked files as part of the finalise process
The current PDF marking solution includes the ability to ""Finalise" a file. This finalisation process adds up all the assigned marked and created an extra page at the end of the PDF. This page (the marking summary) contains information about the assigned marks.

If improvement 1 is implemented, the finalisation process should automatically move a file to the location for marked files. 

It may also be useful to rename the marked file by appending the text "MARKED" to the file name

Realisation Notes
 - Prerequisites: 
   - TODO
 - Technical considerations
   - TODO
 - Priority (1=Very High, 5=Very Low)
   - TODO 

### IMP-3 - Open next unmarked file
The current solution requires a user to open unmarked files using the default OS functionality, or via the "File > Open" menu in Acrobat.

If improvement 1 is implemented, the tool can be streamlined further by adding an "Open next unmarked file" option. This option (potentially a customised menu item) will automatically open the next PDF file that is stored in the unmarked files location.

Realisation Notes
 - Prerequisites: 
   - TODO
 - Technical considerations
   - TODO
 - Priority (1=Very High, 5=Very Low)
   - TODO 

## Implemented (Once a feature is implemented, move it here)
