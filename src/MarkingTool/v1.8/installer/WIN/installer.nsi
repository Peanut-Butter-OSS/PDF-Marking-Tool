; UNISA Marking Tool Installer
; Written by Kyle Bowden
; Updated for Acrobat DC by Greg Fullard

; --------------------------------

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
!define MARKING_TOOL_VERSION "v1.8"

# ADOBE_ACROBAT_MIN_VERSION
# Lowest version of Acrobat that must exist on the machange to allow installation of the tool
!define ADOBE_ACROBAT_MIN_VERSION "DC"

# ADOBE_ACROBAT_JAVASCRIPTS_PATH
# Sub-folder inside the Acrobat installation folder where the Javascript files should be stored
!define ADOBE_ACROBAT_JAVASCRIPTS_PATH "\Javascripts"

# JAVASCRIPTS_UNINSTALL_REG_KEY
# Windows registry key that should be used for the uninstaller
!define JAVASCRIPTS_UNINSTALL_REG_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\UNISA"

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

  # Derive the installation folder based on whether
  # the machine is running 32 or 64 bits
  ${If} ${RunningX64}
    SetRegView 64
    StrCpy $INSTDIR "$PROGRAMFILES64\UNISA"
  ${Else}
    StrCpy $INSTDIR "$PROGRAMFILES\UNISA"
  ${EndIf}

  # Confirm that Acrobat DC is installed on the machine
  # If not, abort
  Var /GLOBAL ACROBAT_VERSION
  StrCpy $ACROBAT_VERSION "Unknown"
  
  call checkForAcrobatAndVersion
  ${If} $ACROBAT_VERSION == "Unknown"
    MessageBox MB_OK 'Did not find a supported version of "Adobe Acrobat" on system, cannot continue with installation.'
    Abort
  ${Else}
    MessageBox MB_OK 'Found Acrobat version $ACROBAT_VERSION.'
  ${EndIf}  

  # Configure expected installation folder for Acrobat
  # TODO
  ;call configureAdobeAcrobatPaths
  call hardCodeAcrobatPaths
  Var /GLOBAL ACROBAT_FOLDER
  StrCpy $ACROBAT_FOLDER $3

  # Make relevant registry entries that will apply Acrobat setting changes
  # TODO


  ################################################
  # Greg testing - START (Delete this when we are done)
  #MessageBox MB_OK "Installation Folder: $INSTDIR"
  #MessageBox MB_OK "Acrobat folder: $ACROBAT_FOLDER"

  # Greg testing - END
  #################################################

FunctionEnd
 

Function checkForAcrobatAndVersion
  ClearErrors

  # Check for an Adobe Acrobat key underneath the HKCU (HKEY_CURRENT_USER) root key
  # If nothing is found we abort.
  Var /GLOBAL ACROBAT_KEY
  StrCpy $8 0
  EnumRegKey $ACROBAT_KEY HKCU "Software\Adobe\Adobe Acrobat" $8
  # MessageBox MB_OK "Check 1: $ACROBAT_KEY"
  ${if} ${Errors}
    MessageBox MB_OK '"Adobe Acrobat" not found on system, cannot continue with installation.'
    Abort
  ${EndIf}

  # Verify the version of Acrobat by looping through sub-keys
  # Here, we are only checking for "DC", but in future we simply need to add
  # additional checks
  Var /GLOBAL ACROBAT_SUB_KEY
  StrCpy $7 0
  loop:
    EnumRegKey $ACROBAT_SUB_KEY HKCU "Software\Adobe\Adobe Acrobat" $7
    
    # Don't continue searching once we retrieve an empty key 
    StrCmp $ACROBAT_SUB_KEY "" done

    ${If} $ACROBAT_SUB_KEY == "DC"
      StrCpy $ACROBAT_VERSION "DC"
      Goto done
    ${EndIf}  
   
    IntOp $7 $7 + 1 
    Goto loop
    #MessageBox MB_YESNO|MB_ICONQUESTION "$ACROBAT_SUB_KEY$\n$\nMore?" IDYES loop
  done:

FunctionEnd


Function hardCodeAcrobatPaths
  StrCpy $3 "C:\Program Files (x86)\Adobe\Acrobat DC\Acrobat\Javascripts"
FunctionEnd

# Computer\HKEY_CURRENT_USER\SOFTWARE\Adobe\Adobe Acrobat\DC\JSPrefs
Function configureAdobeAcrobatPaths
  # test if Adobe Acrobat is installed
  # Greg: This below code is definitely wrong - It will only fail if there isn't a single Adobe product on the machine
  # I suspect it should rather loop through all the Adobe entries and compare them against a string
  EnumRegKey $0 HKCU "Software\Adobe" "Adobe Acrobat"
  ;MessageBox MB_OK "$0"
  ${if} ${Errors}
    MessageBox MB_OK '"Adobe Acrobat" not found on system, cannot continue with installation.'
    Abort
  ${EndIf}
  # try find the correct version of Adobe Acrobat
  # Greg: Once again, the code for reading the registry is wrong, it uses an uninitialised variable - 
  # Although the loop will initialise it after the first try
  # Key point - This is crazy code
  ${Do}
    EnumRegKey $2 HKCU "Software\Adobe\Adobe Acrobat" $1
    MessageBox MB_OK 'Looping through Acrobat Registry keys. Key # $1 is $2'  
    ${if} $2 == ''
      ${if} $5 != ''
        ${if} $5 >= ${ADOBE_ACROBAT_MIN_VERSION}
          StrCpy $6 'Software\Adobe\Adobe Acrobat\$5'
          StrCpy $4 '$6\InstallPath'
          ReadRegDWORD $3 HKCU $4 ""
          StrCpy $3 "$3${ADOBE_ACROBAT_JAVASCRIPTS_PATH}"
          ;MessageBox MB_OK "Adobe Acrobat is installed at: $3"
          # write uninstall path to registry fro javascript files
          WriteRegStr HKCU ${JAVASCRIPTS_UNINSTALL_REG_KEY} "JavascriptPath" $3
          # write default javascript priviledge registers
          WriteRegDWORD HKCU "$6\JSPrefs" "bEnableJS" 0x00000001
          WriteRegDWORD HKCU "$6\JSPrefs" "bEnableMenuItems" 0x00000001
          WriteRegDWORD HKCU "$6\JSPrefs" "bEnableGlobalSecurity" 0x00000001
          ${ExitDo}
        ${Else}
          MessageBox MB_OK '"Adobe Acrobat  ${ADOBE_ACROBAT_MIN_VERSION} or Higher" not found on system, cannot continue with installation.'
          Abort
        ${EndIf}
      ${EndIf}
    ${EndIf}
    StrCpy $5 $2
    IntOp $1 $1 + 1
  ${Loop}
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

  # Add a directory page to let the user specify a plug-ins folder. Use the folder
  # derived during initialisation as the default ()
  # Store the folder in $ACROBAT_FOLDER
  !define MUI_DIRECTORYPAGE_VARIABLE $ACROBAT_FOLDER
  !define MUI_DIRECTORYPAGE_TEXT_TOP 'The marking tool is installed in 2 locations. $\r$\n  1. Tool assets are installed in a fixed location at $INSTDIR. $\r$\n  2. The plugin code is installed within your Adobe Acrobat folder. $\r$\n$\r$\nDepending on your machine setup, Adobe Acrobat may be installed in a non-standard location. If so, please ensure you select the correct Javascripts folder which exists within your Acrobat installation folder.'
  !insertmacro MUI_PAGE_DIRECTORY

  # 
  !insertmacro MUI_PAGE_INSTFILES
  
  !insertmacro MUI_UNPAGE_CONFIRM
  !insertmacro MUI_UNPAGE_INSTFILES
  
#--------------------------------
  

;--------------------------------
;Languages
 
  !insertmacro MUI_LANGUAGE "English"

Section "Install"
  
  # install acrobat javascript files
  SetOutPath $ACROBAT_FOLDER
  
  File ..\..\src\WIN\config.js
  File ..\..\src\WIN\unisa_funct.js
  
  SetOutPath $INSTDIR
  
  File ..\..\res\BlankSheet.pdf
  
  File ..\..\res\check.png
  File ..\..\res\commentmark.png
  File ..\..\res\count.png
  File ..\..\res\crossmark.png
  File ..\..\res\deselect.png
  File ..\..\res\halftickmark.png
  File ..\..\res\mark.png
  File ..\..\res\tickmark.png
  
  File ..\..\res\rubric_engine.txt
  File ..\..\res\comm_engine.txt
  File ..\..\res\tot_engine.txt
  
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
  Delete $INSTDIR\tickmark.png
  
  Delete $INSTDIR\rubric_engine.txt
  Delete $INSTDIR\comm_engine.txt
  Delete $INSTDIR\tot_engine.txt
  
  RMDir $INSTDIR
  
  ReadRegDWORD $0 HKCU ${JAVASCRIPTS_UNINSTALL_REG_KEY} "JavascriptPath"
  Delete $0\config.js
  Delete $0\unisa_funct.js
  
  DeleteRegKey HKCU "${JAVASCRIPTS_UNINSTALL_REG_KEY}"
 
SectionEnd

