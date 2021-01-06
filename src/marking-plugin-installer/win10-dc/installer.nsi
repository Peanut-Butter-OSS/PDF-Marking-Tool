!define MUI_FINISHPAGE_NOAUTOCLOSE ;No value

!include LogicLib.nsh
!include MUI2.nsh
!include x64.nsh

!define MUI_ICON "setup.ico"
!define MUI_UNICON "setup.ico"

# Define the user execution level required to install the application.
# Since the acrobat folder is projected, we required Admin privileges. By including
# This command here, the installer will for UAC on the windows environment
!define MULTIUSER_EXECUTIONLEVEL Admin
!include MultiUser.nsh

# Variables used specifically for the marking tool installation

# MARKING_TOOL_VERSION
# Version of the tool and the corresponding installer. Only used in the file name of the installer and uninstaller 
!define MARKING_TOOL_VERSION "v2.0"

# ADOBE_ACROBAT_JAVASCRIPTS_PATH
# Sub-folder inside the Acrobat installation folder where the Javascript files should be stored
!define ADOBE_ACROBAT_JAVASCRIPTS_PATH "\Javascripts"

# JAVASCRIPTS_UNINSTALL_REG_KEY
# Windows registry key that should be used for the uninstaller
!define JAVASCRIPTS_UNINSTALL_REG_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\PdfMarkingTool"

# LICENSE_FILE
# File that contains the licence content
!define LICENSE_FILE "gpl-3.0.txt"

# This function will be called when the uninstaller is nearly finished initializing
Function un.onInit
  # Verifies that the required multi-user execution level has been granted
  !insertmacro MULTIUSER_UNINIT
FunctionEnd

# This function will be called when the installer is nearly finished initializing
# Here we do a number of preliminary checks before the main installer kicks off
Function .onInit
  # Verifies that the required multi-user execution level has been granted
  !insertmacro MULTIUSER_INIT

  Var /GLOBAL ACROBAT_INSTALLED
  Var /GLOBAL ACROBAT_VERSION
  Var /GLOBAL ACROBAT_FULL_KEY
  Var /GLOBAL EXPIRED_TRIAL
  Var /GLOBAL REGISTRY_VIEW

  # Hard Code version and paths
  StrCpy $ACROBAT_INSTALLED "YES"
  StrCpy $ACROBAT_VERSION "DC"
  StrCpy $ACROBAT_FULL_KEY "Software\Adobe\Adobe Acrobat\DC"
  StrCpy $EXPIRED_TRIAL "NO"

  ; call checkForExpiredTrial
  ; ${If} $EXPIRED_TRIAL == "Unknown"
  ;   MessageBox MB_OK 'The host machine contains legacy registry entries for an expired Acrobat trial. However, Acrobat is not installed, cannot continue with installation.'
  ;   Abort   
  ; ${EndIf}  

  # Configure expected installation folder for Acrobat
  Var /GLOBAL ACROBAT_FOLDER
  call deriveAcrobatJsPath

  # Configure expected installation folder for resources
  StrCpy $INSTDIR "$ACROBAT_FOLDER\PdfMarkingTool"

FunctionEnd
 
# This function checks whether Acrobat is installed.
Function checkForAcrobat
  ClearErrors

  # Check for an Adobe Acrobat key underneath the HKCU (HKEY_CURRENT_USER) root key
  # If nothing is found we abort.
  #MessageBox MB_OK "Verifying if any version of Adobe Acrobat is installed on the host machine"
  Var /GLOBAL ACROBAT_KEY
  StrCpy $8 0
  loop:
    EnumRegKey $ACROBAT_KEY HKCU "Software\Adobe" $8
    #MessageBox MB_OK "Key Found (in $REGISTRY_VIEW bit registry):  $ACROBAT_KEY"
    
    # Don't continue searching once we retrieve an empty key 
    StrCmp $ACROBAT_KEY "" done

    ${If} $ACROBAT_KEY == "Adobe Acrobat"
      #MessageBox MB_OK "Adobe Acrobat is installed on host machine"
      StrCpy $ACROBAT_INSTALLED "YES"
      Goto done
    ${EndIf}  
   
    IntOp $8 $8 + 1 
    Goto loop
  done:
FunctionEnd

# This function checks whether Acrobat is installed. If it is, it continues to check which
# version
Function checkForAcrobatVersion
  ClearErrors

  # Verify the version of Acrobat by looping through sub-keys
  # Here, we are only checking for "DC", but in future we simply need to add
  # additional checks
  #MessageBox MB_OK "Checking the actual version of Adobe Acrobat that is installed on the host machine"
  Var /GLOBAL ACROBAT_SUB_KEY
  StrCpy $7 0
  loop:
    EnumRegKey $ACROBAT_SUB_KEY HKCU "Software\Adobe\Adobe Acrobat" $7
    #MessageBox MB_OK "Version found (in $REGISTRY_VIEW bit registry): $ACROBAT_SUB_KEY"

    # Don't continue searching once we retrieve an empty key 
    StrCmp $ACROBAT_SUB_KEY "" done

    ${If} $ACROBAT_SUB_KEY == "DC"
      #MessageBox MB_OK "Adobe Acrobat DC is installed on host machine"
      StrCpy $ACROBAT_VERSION "DC"
      StrCpy $ACROBAT_FULL_KEY "Software\Adobe\Adobe Acrobat\$ACROBAT_SUB_KEY"
      Goto done
    ${EndIf}  
  
    IntOp $7 $7 + 1 
    Goto loop
  done: 

FunctionEnd

; Function checkForExpiredTrial
;   ClearErrors

;   # Verify whether the DC registry entry is from an expired trial
;   MessageBox MB_OK "Checking whether the DC registry entry is from an expired trial"
;   Var /GLOBAL ACROBAT_DETAIL_KEY
;   StrCpy $7 0
;   loop:
;     EnumRegKey $ACROBAT_DETAIL_KEY HKCU "Software\Adobe\Adobe Acrobat\DC" $7
;     MessageBox MB_OK "Sub key found: $ACROBAT_DETAIL_KEY"

;     # Don't continue searching once we retrieve an empty key 
;     StrCmp $ACROBAT_DETAIL_KEY "" done

;     ${If} $ACROBAT_DETAIL_KEY == "AcroApp"
;       MessageBox MB_OK "The Acrobat DC registry entries are NOT due to an expired trial installation"
;       StrCpy $EXPIRED_TRIAL "NO"
;       Goto done
;     ${EndIf}  
  
;     IntOp $7 $7 + 1 
;     Goto loop
;   done: 

; FunctionEnd


# Depending on the version of Acrobat, this function will derive the correct path for the 
# Javascripts. Currently we only do this for DC, but theoretically it will be easy to 
# update the script in the future with new version markers
Function deriveAcrobatJsPath
    ${If} $ACROBAT_VERSION == "DC"
      StrCpy $ACROBAT_FOLDER "C:\Program Files (x86)\Adobe\Acrobat DC\Acrobat\Javascripts"
    ${EndIf}  
FunctionEnd

# Make relevant registry entries
# Firstly, edit existing Acrobat entries to enable JS capoabilty
# Secondly, add a custom entry which stores data that the uninstaller will need
Function makeRegistryEntries
  # Write Registry entries to update JS Preferences in Acrobat
  WriteRegDWORD HKCU "$ACROBAT_FULL_KEY\JSPrefs" "bEnableJS" 0x00000001
  WriteRegDWORD HKCU "$ACROBAT_FULL_KEY\JSPrefs" "bEnableMenuItems" 0x00000001
  WriteRegDWORD HKCU "$ACROBAT_FULL_KEY\JSPrefs" "bEnableGlobalSecurity" 0x00000000

  # Write Registry entry for the uninstaller
  WriteRegStr HKCU ${JAVASCRIPTS_UNINSTALL_REG_KEY} "JavascriptPath" $ACROBAT_FOLDER
FunctionEnd

# --------------------------------
# General Settings
# These settings are referenced by some of the pages during the execution of the 
# installer
# --------------------------------
  
  # The name of the installer
  Name "Marking Tool ${MARKING_TOOL_VERSION} for Adobe Acrobat DC"

  # The file to write
  OutFile "Marking_Tool_${MARKING_TOOL_VERSION}_DC.exe"

  # Show a message box with a warning when the user wants to close the installer.
  !define MUI_ABORTWARNING

# --------------------------------

#--------------------------------
# Pages
# -----
# Pages define the pages that will be shown by the installer. Each pages references specific 
# Variables that are initialised earlier in the process
# https://nsis.sourceforge.io/Docs/Modern%20UI/Readme.html
#--------------------------------

  # Display welcome page and license
  !insertmacro MUI_PAGE_WELCOME
  !insertmacro MUI_PAGE_LICENSE ${LICENSE_FILE}

  !define MUI_COMPONENTSPAGE_TEXT_TOP "The marking tool consists of a set of Javascript files and some resources that are referenced by them. You can select to skip some of the steps of the installation process, but ideally, all steps should be performed."
  !define MUI_COMPONENTSPAGE_TEXT_COMPLIST "Installation steps$\r$\nNote: If you select to skip the Acrobat verification step, $\r$\nyou MUST manually verify that Acrobat DC is installed first."
  !insertmacro MUI_PAGE_COMPONENTS

  # Add a directory page to let the user specify a plug-ins folder. Use the folder
  # derived during initialisation as the default ()
  # Store the folder in $ACROBAT_FOLDER
  !define MUI_DIRECTORYPAGE_VARIABLE $ACROBAT_FOLDER
  !define MUI_DIRECTORYPAGE_TEXT_TOP 'The marking tool is installed within your Adobe Acrobat folder, under the Javascripts subfolder. $\r$\n$\r$\nDepending on your machine setup, Adobe Acrobat may be installed in a non-standard location. If so, please ensure you select the correct Javascripts folder which exists within your Acrobat installation folder.'
  !insertmacro MUI_PAGE_DIRECTORY
  !insertmacro MUI_PAGE_INSTFILES
  !insertmacro MUI_PAGE_FINISH

  !insertmacro MUI_UNPAGE_CONFIRM
  !insertmacro MUI_UNPAGE_INSTFILES
  
#--------------------------------
  

;--------------------------------
;Languages
 
  !insertmacro MUI_LANGUAGE "English"

Section "Verify Acrobat Version" Section1
  
# Confirm that Acrobat DC is installed on the machine
  # If not, abort
  StrCpy $ACROBAT_INSTALLED "Unknown"
  StrCpy $ACROBAT_VERSION "Unknown"
  StrCpy $ACROBAT_FULL_KEY "Unknown"
  StrCpy $EXPIRED_TRIAL "Unknown"

  SetRegView 64
  StrCpy $REGISTRY_VIEW "64" 
  call checkForAcrobat
  ${If} $ACROBAT_INSTALLED == "Unknown"
    SetRegView 32
    StrCpy $REGISTRY_VIEW "32"
    call checkForAcrobat 
  ${EndIf}
  ${If} $ACROBAT_INSTALLED == "Unknown"
    MessageBox MB_OK '"Adobe Acrobat" not found on system, cannot continue with installation.'
    Abort   
  ${EndIf}  

  SetRegView 64
  StrCpy $REGISTRY_VIEW "64" 
  call checkForAcrobatVersion
  ${If} $ACROBAT_VERSION == "Unknown"
    SetRegView 32
    StrCpy $REGISTRY_VIEW "32" 
    call checkForAcrobatVersion
  ${EndIf}  
  ${If} $ACROBAT_VERSION == "Unknown"
    MessageBox MB_OK 'Did not find a supported version of "Adobe Acrobat" on system, cannot continue with installation.'
    Abort
  ${Else}
    MessageBox MB_OK 'Found Acrobat version $ACROBAT_VERSION.'
  ${EndIf}  

SectionEnd

Section "Acrobat JavaScripts" Section2
  
  # install acrobat javascript files
  SetOutPath $ACROBAT_FOLDER
  
  File ..\..\marking-plugin\javascripts\config.js
  File ..\..\marking-plugin\javascripts\pmt-annotations.js
  File ..\..\marking-plugin\javascripts\pmt-comments.js
  File ..\..\marking-plugin\javascripts\pmt-config.js
  File ..\..\marking-plugin\javascripts\pmt-finalise.js
  File ..\..\marking-plugin\javascripts\pmt-marking-tools.js
  File ..\..\marking-plugin\javascripts\pmt-results.js
  File ..\..\marking-plugin\javascripts\pmt-rubric.js
  File ..\..\marking-plugin\javascripts\pmt-utils.js

  # Make relevant registry entries that will apply Acrobat setting changes
  call makeRegistryEntries

SectionEnd

Section "Marking Tool Resources" Section3

  SetOutPath $INSTDIR
  
  File ..\..\marking-plugin\resources\BlankSheet.pdf
  File ..\..\marking-plugin\resources\check.png
  File ..\..\marking-plugin\resources\commentmark.png
  File ..\..\marking-plugin\resources\count.png
  File ..\..\marking-plugin\resources\crossmark.png
  File ..\..\marking-plugin\resources\deselect.png
  File ..\..\marking-plugin\resources\halftickmark.png
  File ..\..\marking-plugin\resources\mark.png
  File ..\..\marking-plugin\resources\rubricmark.png
  File ..\..\marking-plugin\resources\tickmark.png

SectionEnd

Section "Uninstaller" Section4

  # define uninstaller name
  WriteUninstaller $INSTDIR\uninstaller.exe

SectionEnd

Section "Uninstall"
 
  # Always delete uninstaller first
  Delete $INSTDIR\uninstaller.exe
 
  # now delete installed files
  Delete $INSTDIR
  Delete $INSTDIR\BlankSheet.pdf
  Delete $INSTDIR\check.png
  Delete $INSTDIR\commentmark.png
  Delete $INSTDIR\count.png
  Delete $INSTDIR\crossmark.png
  Delete $INSTDIR\deselect.png
  Delete $INSTDIR\halftickmark.png
  Delete $INSTDIR\mark.png
  Delete $INSTDIR\rubricmark.png
  Delete $INSTDIR\tickmark.png
  
  RMDir $INSTDIR
  
  ReadRegDWORD $0 HKCU ${JAVASCRIPTS_UNINSTALL_REG_KEY} "JavascriptPath"
  Delete $0\config.js
  Delete $0\pmt-annotations.js
  Delete $0\pmt-comments.js
  Delete $0\pmt-config.js
  Delete $0\pmt-finalise.js
  Delete $0\pmt-marking-tools.js
  Delete $0\pmt-results.js
  Delete $0\pmt-rubric.js
  Delete $0\pmt-utils.js
  
  DeleteRegKey HKCU "${JAVASCRIPTS_UNINSTALL_REG_KEY}"
 
SectionEnd

  LangString DESC_Section1 ${LANG_ENGLISH} "This installation step will verify that the correct version of Adobe Acrobat is installed."
  LangString DESC_Section2 ${LANG_ENGLISH} "Install the plugin Javascript code"
  LangString DESC_Section3 ${LANG_ENGLISH} "Install the plugin assets (mostly icons used by the plugin)"
  LangString DESC_Section4 ${LANG_ENGLISH} "Create an uninstaller which will remove the entire marking tool"

  !insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${Section1} $(DESC_Section1)
  !insertmacro MUI_DESCRIPTION_TEXT ${Section2} $(DESC_Section2)
  !insertmacro MUI_DESCRIPTION_TEXT ${Section3} $(DESC_Section3)
  !insertmacro MUI_DESCRIPTION_TEXT ${Section4} $(DESC_Section4)
  !insertmacro MUI_FUNCTION_DESCRIPTION_END
