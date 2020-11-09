; UNISA Marking Tool Installer example
; Written by kyle Bowden

; --------------------------------

!include MultiUser.nsh
!include LogicLib.nsh
!include MUI2.nsh
!include x64.nsh

!define MUI_ICON "setup.ico"
!define MUI_UNICON "setup.ico"

!define MULTIUSER_EXECUTIONLEVEL Highest

!define MARKING_TOOL_VERSION "v1.7"
!define ADOBE_ACROBAT_MIN_VERSION "10.0"
!define ADOBE_ACROBAT_JAVASCRIPTS_PATH "\Javascripts"
!define JAVASCRIPTS_UNINSTALL_REG_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\UNISA"

Function un.onInit
  !insertmacro MULTIUSER_UNINIT
FunctionEnd

Function .onInit
  !insertmacro MULTIUSER_INIT
  # 64bit system 
  ${If} ${RunningX64}
    SetRegView 64
    call configureAdobeAcrobatPaths
    StrCpy $INSTDIR "$PROGRAMFILES64\UNISA"
  # 32bit system
  ${Else}
    call configureAdobeAcrobatPaths
    StrCpy $INSTDIR "$PROGRAMFILES\UNISA"
  ${EndIf}
FunctionEnd
 
Function configureAdobeAcrobatPaths
  # test if Adobe Acrobat is installed
  EnumRegKey $0 HKCU "Software\Adobe" "Adobe Acrobat"
  ${if} ${Errors}
    MessageBox MB_OK '"Adobe Acrobat" not found on system, cannot continue with installation.'
    Abort
  ${EndIf}
  # try find the correct version of Adobe Acrobat
  ${Do}
    EnumRegKey $2 HKCU "Software\Adobe\Adobe Acrobat" $1  
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
  
  File ..\..\src\WIN\configuration.js
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
  Delete $0\configuration.js
  Delete $0\unisa_funct.js
  
  DeleteRegKey HKCU "${JAVASCRIPTS_UNINSTALL_REG_KEY}"
 
SectionEnd

