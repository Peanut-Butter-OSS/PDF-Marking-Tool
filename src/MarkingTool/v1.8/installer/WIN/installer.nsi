; UNISA Marking Tool Installer example
; Written by kyle Bowden
; Updated for Acrobat DC by Greg Fullard

; --------------------------------

!include MultiUser.nsh
!include LogicLib.nsh
!include MUI2.nsh
!include x64.nsh

!define MUI_ICON "setup.ico"
!define MUI_UNICON "setup.ico"

!define MULTIUSER_EXECUTIONLEVEL Highest

!define MARKING_TOOL_VERSION "v1.8"
!define ADOBE_ACROBAT_MIN_VERSION "DC"
!define ADOBE_ACROBAT_JAVASCRIPTS_PATH "\Javascripts"
!define JAVASCRIPTS_UNINSTALL_REG_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\UNISA"

Function un.onInit
  !insertmacro MULTIUSER_UNINIT
FunctionEnd

Function .onInit
  !insertmacro MULTIUSER_INIT

 # Greg testing - START
;  StrCpy $7 0
;   loop:
;     EnumRegKey $8 HKLM Software $7
;     StrCmp $8 "" done
;     IntOp $7 $7 + 1
;     MessageBox MB_YESNO|MB_ICONQUESTION "$8$\n$\nMore?" IDYES loop
;   done:

;  EnumRegKey $0 HKCU "Software\Adobe" 2
;  MessageBox MB_OK "$0"

;  call checkForAcrobat
 # Greg testing - END



  # 64bit system 
  ${If} ${RunningX64}
    SetRegView 64
    ;call configureAdobeAcrobatPaths
    call hardCodeAcrobatPaths
    StrCpy $INSTDIR "$PROGRAMFILES64\UNISA"
  # 32bit system
  ${Else}
    ;call configureAdobeAcrobatPaths
    call hardCodeAcrobatPaths
    StrCpy $INSTDIR "$PROGRAMFILES\UNISA"
  ${EndIf}
FunctionEnd
 
; Function checkForAcrobat
;   ClearErrors

;   EnumRegKey $0 HKCU "Software\Adobe" "Adobe Acrobat"
;   ;MessageBox MB_OK "$0"
;   ${if} ${Errors}
;     MessageBox MB_OK '"Adobe Acrobat" not found on system, cannot continue with installation.'
;     Abort
;   ${EndIf}

;   StrCpy $7 0
;    loop:
;      EnumRegKey $8 HKCU "Software\Adobe" $7
;      StrCmp $8 "" done
;      IntOp $7 $7 + 1
;      MessageBox MB_YESNO|MB_ICONQUESTION "$8$\n$\nMore?" IDYES loop
;    done:

;   ReadRegStr $0 HKLM "Software\Adobe\Adobe Acrobat\DC" ""
;   ${If} ${Errors}
;     MessageBox MB_OK "No registry key found for Adobe Acrobat"
;     Abort
;   ${Else}
;     MessageBox MB_OK "Registry key found for Adobe Acrobat. $0"
;   ${EndIf}

; FunctionEnd

Function hardCodeAcrobatPaths
  StrCpy $3 "C:\Program Files (x86)\Adobe\Acrobat DC\Acrobat\Javascripts"
FunctionEnd

Function configureAdobeAcrobatPaths
  # test if Adobe Acrobat is installed
  # Greg: This below code is definitely wrong - It will only fail if there isn't a single Adobe product on the machine
  # I suspect it should rather loop through all the Adober entries and compare them against a string
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

;--------------------------------
;General Settings
  ; The name of the installer
  Name "Marking Tool ${MARKING_TOOL_VERSION}"

  ; The file to write
  OutFile "Marking Tool ${MARKING_TOOL_VERSION}.exe"

;--------------------------------
;Interface Settings

  !define MUI_ABORTWARNING
  
;--------------------------------
;Pages

  !insertmacro MUI_PAGE_WELCOME
  !insertmacro MUI_PAGE_INSTFILES
  
  !insertmacro MUI_UNPAGE_CONFIRM
  !insertmacro MUI_UNPAGE_INSTFILES
  
  
;--------------------------------
;Languages
 
  !insertmacro MUI_LANGUAGE "English"

Section "Install"
  
  # install acrobat javascript files
  SetOutPath $3
  
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

