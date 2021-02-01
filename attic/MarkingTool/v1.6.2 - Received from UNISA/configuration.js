/* 
   UNISA eMarking Suite
   is delivered to UNISA under the
   FLOSS licencing regime

Version 1.6 -  June 2011
  
   Proudly Developed By
   KYLE BOWDEN in conjuction with Learning Curve
   kyle247365@gmail.com | +27 84 738 9643
   
   Enhancements:
    - Minor system updates / tweaks
    - Ported application to the Windows 7 32-bit platform
   
Version 0.1 - 1.5 - October 2009

   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
 
      CREDITS
      Lead Developer    :: War Commander      :: Kyle Bowden
      Business Analyst  :: Field General      :: Willy Gadney
      Test Squad        :: Clean Out Crew     :: Herman Van Wyk & Tina Kanniah
      Dev Support       :: Backup             :: Nelson Baloyi
      LC Designer       :: Artillery          :: Lentswe Morule
      Installer         :: Mobilizer          :: Thabahla Shoko
      Enviro & Food     :: Crew Support       :: Khosi Gwala
      Architect         :: Special Operations :: Luigi D'Amico
*/

app.beginPriv();

var aActiveDocs = app.activeDocs;
var aNewDoc = aActiveDocs[0];

/*
Version 1.6 -  June 2011
  
   Proudly Developed By
   KYLE BOWDEN in conjuction with Learning Curve
   kyle247365@gmail.com | +27 84 738 9643
   
   Enhancements:
    - Minor system updates / tweaks
    - Ported application to the Windows 7 32-bit platform
   
Version 0.1 - 1.5 - October 2009

   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
 
      CREDITS
      Lead Developer    :: War Commander      :: Kyle Bowden
      Business Analyst  :: Field General      :: Willy Gadney
      Test Squad        :: Clean Out Crew     :: Herman Van Wyk & Tina Kanniah
      Dev Support       :: Backup             :: Nelson Baloyi
      LC Designer       :: Artillery          :: Lentswe Morule
      Installer         :: Mobilizer          :: Thabahla Shoko
      Enviro & Food     :: Crew Support       :: Khosi Gwala
      Architect         :: Special Operations :: Luigi D'Amico
*/
try {
var numpages = aNewDoc.numPages;

for (var i=0; i < numpages; i++) {
aNewDoc.removeField("btn" + i);
}
} catch(Error) {}

var inUMSSession = "true";
try {
var edtFinish = aNewDoc.getField("edtFinish");
if(edtFinish != null){
if(edtFinish.value == "FINAL_DONE") {
inUMSSession = "false";
}
}
} catch(Error) {}

/*
Version 1.6 -  June 2011
  
   Proudly Developed By
   KYLE BOWDEN in conjuction with Learning Curve
   kyle247365@gmail.com | +27 84 738 9643
   
   Enhancements:
    - Minor system updates / tweaks
    - Ported application to the Windows 7 32-bit platform
   
Version 0.1 - 1.5 - October 2009

   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
 
      CREDITS
      Lead Developer    :: War Commander      :: Kyle Bowden
      Business Analyst  :: Field General      :: Willy Gadney
      Test Squad        :: Clean Out Crew     :: Herman Van Wyk & Tina Kanniah
      Dev Support       :: Backup             :: Nelson Baloyi
      LC Designer       :: Artillery          :: Lentswe Morule
      Installer         :: Mobilizer          :: Thabahla Shoko
      Enviro & Food     :: Crew Support       :: Khosi Gwala
      Architect         :: Special Operations :: Luigi D'Amico
*/
try {
var fileString = aNewDoc.path.substring(0, 4) ;

if(fileString == "http") {
inUMSSession = "false";
}
} catch(Error) {}

try {
var appViewerType = "" + app.viewerType;
if(appViewerType == "Reader") {
inUMSSession = "false";
}
} catch(Error) {}

/*
Version 1.6 -  June 2011
  
   Proudly Developed By
   KYLE BOWDEN in conjuction with Learning Curve
   kyle247365@gmail.com | +27 84 738 9643
   
   Enhancements:
    - Minor system updates / tweaks
    - Ported application to the Windows 7 32-bit platform
   
Version 0.1 - 1.5 - October 2009

   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
 
      CREDITS
      Lead Developer    :: War Commander      :: Kyle Bowden
      Business Analyst  :: Field General      :: Willy Gadney
      Test Squad        :: Clean Out Crew     :: Herman Van Wyk & Tina Kanniah
      Dev Support       :: Backup             :: Nelson Baloyi
      LC Designer       :: Artillery          :: Lentswe Morule
      Installer         :: Mobilizer          :: Thabahla Shoko
      Enviro & Food     :: Crew Support       :: Khosi Gwala
      Architect         :: Special Operations :: Luigi D'Amico
*/
if(inUMSSession == "true") {
var btnOpenRubric = aNewDoc.addField("btnOpenRubric", "button", 0, [5, 5, 70, 30]);
btnOpenRubric.buttonSetCaption("Open Rubric");
btnOpenRubric.setAction("MouseUp", "openRubricForMarking(aNewDoc)");
btnOpenRubric.borderStyle = "beveled";
btnOpenRubric.highlight = "push";
btnOpenRubric.lineWidth = 2;

app.hideToolbarButton("Hand");
app.hideToolbarButton("ZoomIn");
app.hideToolbarButton("Zoom100");
app.hideToolbarButton("PanAndZoom");
app.hideToolbarButton("Loupe");

aNewDoc.importIcon("addCommentMark", "C:/Program Files/UNISA/commentmark.png");
aNewDoc.importIcon("addMark", "C:/Program Files/UNISA/mark.png");
aNewDoc.importIcon("addTick", "C:/Program Files/UNISA/tickmark.png");
aNewDoc.importIcon("addCross", "C:/Program Files/UNISA/crossmark.png");
aNewDoc.importIcon("addCount", "C:/Program Files/UNISA/count.png");
aNewDoc.importIcon("addStamp", "C:/Program Files/UNISA/check.png");
aNewDoc.importIcon("addDeselect", "C:/Program Files/UNISA/deselect.png");
aNewDoc.importIcon("addHalfTick", "C:/Program Files/UNISA/halftickmark.png");

var addCommentMarkIcon = util.iconStreamFromIcon(aNewDoc.getIcon("addCommentMark"));
var addMarkIcon = util.iconStreamFromIcon(aNewDoc.getIcon("addMark"));
var addTickIcon = util.iconStreamFromIcon(aNewDoc.getIcon("addTick"));
var addCrossIcon = util.iconStreamFromIcon(aNewDoc.getIcon("addCross"));
var addCountIcon = util.iconStreamFromIcon(aNewDoc.getIcon("addCount"));
var addStampIcon = util.iconStreamFromIcon(aNewDoc.getIcon("addStamp"));
var addDeselectIcon = util.iconStreamFromIcon(aNewDoc.getIcon("addDeselect"));
var addHalfTick = util.iconStreamFromIcon(aNewDoc.getIcon("addHalfTick"));

/*
Version 1.6 -  June 2011
  
   Proudly Developed By
   KYLE BOWDEN in conjuction with Learning Curve
   kyle247365@gmail.com | +27 84 738 9643
   
   Enhancements:
    - Minor system updates / tweaks
    - Ported application to the Windows 7 32-bit platform
   
Version 0.1 - 1.5 - October 2009

   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
 
      CREDITS
      Lead Developer    :: War Commander      :: Kyle Bowden
      Business Analyst  :: Field General      :: Willy Gadney
      Test Squad        :: Clean Out Crew     :: Herman Van Wyk & Tina Kanniah
      Dev Support       :: Backup             :: Nelson Baloyi
      LC Designer       :: Artillery          :: Lentswe Morule
      Installer         :: Mobilizer          :: Thabahla Shoko
      Enviro & Food     :: Crew Support       :: Khosi Gwala
      Architect         :: Special Operations :: Luigi D'Amico
*/
app.addToolButton
({
cName: "toolAddHalfTick",
oIcon: addHalfTick,
cExec: "addMark(aNewDoc, 'HALFT');",
cTooltext: "Add a Half Tick Mark.",
cMarked: "setIndentOnHalfTick();",
nPos: 0
});

app.addToolButton
({
cName: "toolAddTick",
oIcon: addTickIcon,
cExec: "addMark(aNewDoc, 'TICK');",
cTooltext: "Add a Tick.",
cMarked: "setIndentOnTick();",
nPos: 1
});

app.addToolButton
({
cName: "toolAddStamp",
oIcon: addStampIcon,
cExec: "addMark(aNewDoc, 'CHECK');",
cTooltext: "Add a Stamp.",
cMarked: "setIndentOnCheck();",
nPos: 2
});

app.addToolButton
({
cName: "toolAddCross",
oIcon: addCrossIcon,
cExec: "addMark(aNewDoc, 'CROSS');",
cTooltext: "Add a Cross.",
cMarked: "setIndentOnCross();",
nPos: 3
});

app.addToolButton
({
cName: "toolDeselect",
oIcon: addDeselectIcon,
cExec: "removeContinuesMarking(aNewDoc)",
cTooltext: "Deselect Mark Tool.",
cEnable: "setEnableOnDeselect();",
nPos: 4
});

app.addToolButton
({
cName: "toolAddMark",
oIcon: addMarkIcon,
cExec: "addMark(aNewDoc, 'MARK');",
cTooltext: "Add a Mark.",
cMarked: "setIndentOnMark();",
nPos: 5
});

app.addToolButton
({
cName: "toolAddCommentMark",
oIcon: addCommentMarkIcon,
cExec: "addMark(aNewDoc, 'COMMENTM');",
cTooltext: "Comment Mark.",
cMarked: "setIndentOnCommentMark();",
nPos: 6
});

app.addToolButton
({
cName: "toolAddCount",
oIcon: addCountIcon,
cExec: "countMarks(aNewDoc)",
cTooltext: "Count Marks.",
nPos: 7
});

app.addToolButton
({
cName: "toolVersion",
cExec: "",
cLabel: "v1.6.2",
cTooltext: "Click Here",
cExec: "showAboutInformation()",
nPos: 8
});
}

app.endPriv();
/*
Version 1.6 -  June 2011
  
   Proudly Developed By
   KYLE BOWDEN in conjuction with Learning Curve
   kyle247365@gmail.com | +27 84 738 9643
   
   Enhancements:
    - Minor system updates / tweaks
    - Ported application to the Windows 7 32-bit platform
   
Version 0.1 - 1.5 - October 2009

   Proudly Developed By
 
   THE AESIR DEVELOPMENT SQUAD 
   www.aesir.co.za | info@aesir.co.za | +27 11 702 9000
 
      CREDITS
      Lead Developer    :: War Commander      :: Kyle Bowden
      Business Analyst  :: Field General      :: Willy Gadney
      Test Squad        :: Clean Out Crew     :: Herman Van Wyk & Tina Kanniah
      Dev Support       :: Backup             :: Nelson Baloyi
      LC Designer       :: Artillery          :: Lentswe Morule
      Installer         :: Mobilizer          :: Thabahla Shoko
      Enviro & Food     :: Crew Support       :: Khosi Gwala
      Architect         :: Special Operations :: Luigi D'Amico
*/