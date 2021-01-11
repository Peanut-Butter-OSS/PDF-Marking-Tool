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
12. Try to select invalid rubric - No criteria specified
13. Try to select invalid rubric - Duplicate criteria specified (same criteriaId)
14. Try to select invalid rubric - Duplicate criteria specified (same criteriaName)
15. Try to select invalid rubric - One criteria has no levels
16. Try to select invalid rubric - One criteria has duplicate levels
17. Try to select invalid rubric - One or more levels without levelName
18. Try to select invalid rubric - One or more levels without levelMarks
19. Try to select invalid rubric - One or more levels without levelDefaultComment
20. Add rubric marks
21. Try to add a duplicate rubric mark (for a criterion that is already marked)
22. Remove a rubric before any annotations were added
23. Remove a reubric after annotations were added 




24. Open PDF in read mode, Acrobat current closed
25. Open PDF in read mode, Acrobat already open
26. Open PDF in edit mode
27. Open a document with a Rubric
28. Open a document without a rubric
29. Open a document that has already been finalised
30. Open a document at an HTTP path
31. Icons accidentally deleted from resources folder


### Regression
Manually add non-PMT annotations. Verify all still works

## Windows Installer

1. Windows 10
   1. No Acrobat or Reader installed
   2. Reader Only, no Acrobat
   3. Acrobat and Reader
   4. Different version of Acrobat (not DC)
   5. Non-admin user