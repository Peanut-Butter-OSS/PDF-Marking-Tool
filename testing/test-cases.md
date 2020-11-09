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

### IMP-1 Configured Location for MArked and unmarked files
TODO

### IMP-4 Configure details of marker
TODO

### IMP-10 Replacement rubric functionality
TODO


6. Open PDF in read mode, Acrobat current closed
7. Open PDF in read mode, Acrobat already open
8. Open PDF in edit mode
9. Open a document with a Rubric
10. Open a document without a rubric
11. Open a document that has already been finalised
12. Open a document at an HTTP path
13. Icons accidentally deleted from resources folder
14. 

## Windows Installer

1. Windows 10
   1. No Acrobat or Reader installed
   2. Reader Only, no Acrobat
   3. Acrobat and Reader
   4. Different version of Acrobat (not DC)
   5. Non-admin user