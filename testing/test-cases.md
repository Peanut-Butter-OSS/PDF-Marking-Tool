# Test Cases

## Plugin

### IMP-7 Marking Tool Menu
1. Menu while marking tools are disabled (PASSED)
2. Menu while marking tools are enabled (PASSED)
3. About popup (PASSED)

### IMP-8 Enable/Disable Marking Tools
1. Successful activation (Tools are added)
2. Successful deactivation (Tools are removed)
3. Attempt to enable while multiple documents are open (PASSED)
4. Attempt to enable if no document is open (PASSED)
5. Enable if already enabled (Use JS console) (PASSED)
6. Disable is already disabled (Use JS console) (PASSED)
7. Enable if icon files cannot be found
8. Test document opened over HTTP(S)

### IMP-1 Configured Location for MArked and unmarked files
TODO

### IMP-4 Configure details of marker
TODO

### IMP-10 Replacement rubric functionality
1. Select valid rubric
2. Try to select rubric while no active document is open (Expect failure alert)
3. Try to select rubric while multiple documents are open (Expect failure alert)
4. Try to select a rubric if the current active document already has a rubric (Expect failure alert)
5. Try to select a rubric if the current active document has already been finalised (Expect failure alert)
6. Try to select invalid rubric - No rubricId
7. Try to select invalid rubric - No rubricName
8. Try to select invalid rubric - No rubricVersion
9. Try to select invalid rubric - No courseCode
10. Try to select invalid rubric - No assignmentId
11. Try to select invalid rubric - No totalMarks
12. Try to select invalid rubric - No sections specified




13. Open PDF in read mode, Acrobat current closed
14. Open PDF in read mode, Acrobat already open
15. Open PDF in edit mode
16. Open a document with a Rubric
17. Open a document without a rubric
18. Open a document that has already been finalised
19. Open a document at an HTTP path
20. Icons accidentally deleted from resources folder
21. 

## Windows Installer

1. Windows 10
   1. No Acrobat or Reader installed
   2. Reader Only, no Acrobat
   3. Acrobat and Reader
   4. Different version of Acrobat (not DC)
   5. Non-admin user