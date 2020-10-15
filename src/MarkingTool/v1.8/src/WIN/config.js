/* 
    UNISA eMarking Suite
    is delivered to UNISA under the
    FLOSS licencing regime

    Version 1.7 - February 2015

      Proudly Developed By
   
      KYLE BOWDEN in conjuction with Learning Curve
      kyle247365@gmail.com | +27 84 738 9643
   
      Enhancements:
        - Update installer to set Javascript prefs in Acrobat 11 & Higher
        - Fixed comments rolling off page 
        - Added installer for Mac OSX
        - Minor refactors / tweaks

    Version 1.6 - 1.6.1 -  November 2012
  
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
var initError = false;
var initErrorMsg = "Initialization Errors: \n";

if (aNewDoc != null) {
  // TODO - Seems like we're removing buttons from the form - Confirm when these are added
  try {
    var numpages = aNewDoc.numPages;

    for (var i=0; i < numpages; i++) {
      aNewDoc.removeField("btn" + i);
    }
  } catch(Error) {
    console.println("Error while removing any existing Rubric button from the document. "+Error);
    initError = true;
    initErrorMsg = initErrorMsg + " - Error while removing any existing Rubric button from the document. \n"
  }

  // The inUMSSession variable is used to determine whether we should enable the marking functionality
  var inUMSSession = "true";
  
  // If we have already finished the document, then we set inUMSSession to false
  try {
    var edtFinish = aNewDoc.getField("edtFinish");
    if(edtFinish != null && edtFinish.value == "FINAL_DONE") {
      inUMSSession = "false";
      console.println("The document has already been finalised. Marking tools will not be enabled");
      initError = true;
      initErrorMsg = initErrorMsg + " - The document has already been finalised. Marking tools will not be enabled. \n";
    }
  } catch(Error) {
    console.println("Error while verifying if the document has already been finished. "+Error);
    initError = true;
    initErrorMsg = initErrorMsg + " - Error while verifying if the document has already been finished. \n";
  }

  // If this is an online document (not a file stored on the local file system), then we set inUMSSession to false
  try {
    var fileString = aNewDoc.path.substring(0, 4);

    if(fileString == "http") {
      inUMSSession = "false";
      console.println("Current document is an online document. Marking tools will not be enabled");
      initError = true;
      initErrorMsg = initErrorMsg + " - Current document is an online document. Marking tools will not be enabled. \n";
    }
  } catch(Error) {
    console.println("Error while determining if the document is being viewed over HTTP. "+Error)
    initError = true;
    initErrorMsg = initErrorMsg + " - Error while determining if the document is being viewed over HTTP. \n";
  }

  if(inUMSSession == "true") {

    // Add the rubric button - Include some explanatory text here
    var btnOpenRubric = aNewDoc.addField("btnOpenRubric", "button", 0, [5, 5, 70, 30]);
    btnOpenRubric.buttonSetCaption("Open Rubric");
    btnOpenRubric.setAction("MouseUp", "openRubricForMarking(aNewDoc)");
    btnOpenRubric.borderStyle = "beveled";
    btnOpenRubric.highlight = "push";
    btnOpenRubric.lineWidth = 2;

    // TODO - Why are we hiding these buttons?
    // app.hideToolbarButton("Hand");
    // app.hideToolbarButton("ZoomIn");
    // app.hideToolbarButton("Zoom100");
    // app.hideToolbarButton("PanAndZoom");
    // app.hideToolbarButton("Loupe");

    // Load the icon images used by the marking tool
    // Note: Icons must be 20x20 pixels, else the creation of the toolbar button will fail
    var importResult = aNewDoc.importIcon("addCommentMark", "/C/Program Files/UNISA/commentmark.png");
    if (importResult != 0) {
      initError = true;
      initErrorMsg = initErrorMsg + " - Could not load the icon commentmark.png. \n"
    }
    importResult = aNewDoc.importIcon("addMark", "/C/Program Files/UNISA/mark.png");
    if (importResult != 0) {
      initError = true;
      initErrorMsg = initErrorMsg + " - Could not load the icon mark.png. \n"
    }
    importResult = aNewDoc.importIcon("addTick", "/C/Program Files/UNISA/tickmark.png");
    if (importResult != 0) {
      initError = true;
      initErrorMsg = initErrorMsg + " - Could not load the icon tickmark.png. \n"
    }
    importResult = aNewDoc.importIcon("addCross", "/C/Program Files/UNISA/crossmark.png");
    if (importResult != 0) {
      initError = true;
      initErrorMsg = initErrorMsg + " - Could not load the icon crossmark.png. \n"
    }
    importResult = aNewDoc.importIcon("addCount", "/C/Program Files/UNISA/count.png");
    if (importResult != 0) {
      initError = true;
      initErrorMsg = initErrorMsg + " - Could not load the icon count.png. \n"
    }
    importResult = aNewDoc.importIcon("addStamp", "/C/Program Files/UNISA/check.png");
    if (importResult != 0) {
      initError = true;
      initErrorMsg = initErrorMsg + " - Could not load the icon check.png. \n"
    }
    importResult = aNewDoc.importIcon("addDeselect", "/C/Program Files/UNISA/deselect.png");
    if (importResult != 0) {
      initError = true;
      initErrorMsg = initErrorMsg + " - Could not load the icon deselect.png. \n"
    }
    importResult = aNewDoc.importIcon("addHalfTick", "/C/Program Files/UNISA/halftickmark.png");
    if (importResult != 0) {
      initError = true;
      initErrorMsg = initErrorMsg + " - Could not load the icon halftickmark.png. \n"
    }
    importResult = aNewDoc.importIcon("addHalfTick", "/C/Program Files/UNISA/halftickmark.png");
    if (importResult != 0) {
      initError = true;
      initErrorMsg = initErrorMsg + " - Could not load the icon halftickmark.png. \n"
    }

    if (!initError) {
      var addCommentMarkIcon = util.iconStreamFromIcon(aNewDoc.getIcon("addCommentMark"));
      if (addCommentMarkIcon == null) {
        initError = true;
        initErrorMsg = initErrorMsg + " - Could not convert the addCommentMark icon to an icon stream. \n"
      }
      var addMarkIcon = util.iconStreamFromIcon(aNewDoc.getIcon("addMark"));
      if (addMarkIcon == null) {
        initError = true;
        initErrorMsg = initErrorMsg + " - Could not convert the addMarkIcon icon to an icon stream. \n"
      }
      var addTickIcon = util.iconStreamFromIcon(aNewDoc.getIcon("addTick"));
      if (addTickIcon == null) {
        initError = true;
        initErrorMsg = initErrorMsg + " - Could not convert the addTickIcon icon to an icon stream. \n"
      }
      var addCrossIcon = util.iconStreamFromIcon(aNewDoc.getIcon("addCross"));
      if (addCrossIcon == null) {
        initError = true;
        initErrorMsg = initErrorMsg + " - Could not convert the addCrossIcon icon to an icon stream. \n"
      }
      var addCountIcon = util.iconStreamFromIcon(aNewDoc.getIcon("addCount"));
      if (addCountIcon == null) {
        initError = true;
        initErrorMsg = initErrorMsg + " - Could not convert the addCountIcon icon to an icon stream. \n"
      }
      var addStampIcon = util.iconStreamFromIcon(aNewDoc.getIcon("addStamp"));
      if (addStampIcon == null) {
        initError = true;
        initErrorMsg = initErrorMsg + " - Could not convert the addStampIcon icon to an icon stream. \n"
      }
      var addDeselectIcon = util.iconStreamFromIcon(aNewDoc.getIcon("addDeselect"));
      if (addDeselectIcon == null) {
        initError = true;
        initErrorMsg = initErrorMsg + " - Could not convert the addDeselectIcon icon to an icon stream. \n"
      }
      var addHalfTick = util.iconStreamFromIcon(aNewDoc.getIcon("addHalfTick"));
      if (addHalfTick == null) {
        initError = true;
        initErrorMsg = initErrorMsg + " - Could not convert the addHalfTick icon to an icon stream. \n"
      }
    }

    // Now we add the toolbar buttons
    if (!initError) {
      try {
        app.addToolButton
        ({
          cName: "toolAddHalfTick",
          oIcon: addHalfTick,
          //cLabel: "T1", 
          cExec: "addMark(aNewDoc, 'HALFT');",
          cTooltext: "Add a Half Tick Mark.",
          cMarked: "setIndentOnHalfTick();",
          nPos: 0
        });  
      } catch(Error) {
        console.println("Error while adding Halftick toolbar button");
        initError = true;
        initErrorMsg = initErrorMsg + " - Error while adding Halftick toolbar button. \n"
      }

      try {
        app.addToolButton
        ({
          cName: "toolAddTick",
          oIcon: addTickIcon,
          //cLabel: "T2", 
          cExec: "addMark(aNewDoc, 'TICK');",
          cTooltext: "Add a Tick.",
          cMarked: "setIndentOnTick();",
          nPos: 1
        });
      } catch(Error) {
        console.println("Error while adding Tick toolbar button");
        initError = true;
        initErrorMsg = initErrorMsg + " - Error while adding Tick toolbar button. \n"
      }
  
      try {
        app.addToolButton
        ({
          cName: "toolAddStamp",
          oIcon: addStampIcon,
          //cLabel: "T3", 
          cExec: "addMark(aNewDoc, 'CHECK');",
          cTooltext: "Add a Stamp.",
          cMarked: "setIndentOnCheck();",
          nPos: 2
        });
      } catch(Error) {
        console.println("Error while adding Check toolbar button");
        initError = true;
        initErrorMsg = initErrorMsg + " - Error while adding Check toolbar button. \n"
      }
  
      try {
        app.addToolButton
        ({
          cName: "toolAddCross",
          oIcon: addCrossIcon,
          //cLabel: "T4", 
          cExec: "addMark(aNewDoc, 'CROSS');",
          cTooltext: "Add a Cross.",
          cMarked: "setIndentOnCross();",
          nPos: 3
        });
      } catch(Error) {
        console.println("Error while adding Cross toolbar button");
        initError = true;
        initErrorMsg = initErrorMsg + " - Error while adding Cross toolbar button. \n"
      }
  
      try {
        app.addToolButton
        ({
          cName: "toolDeselect",
          oIcon: addDeselectIcon,
          //cLabel: "T5", 
          cExec: "removeContinuesMarking(aNewDoc)",
          cTooltext: "Deselect Mark Tool.",
          cEnable: "setEnableOnDeselect();",
          nPos: 4
        });
      } catch(Error) {
        console.println("Error while adding Deselect toolbar button");
        initError = true;
        initErrorMsg = initErrorMsg + " - Error while adding Deselect toolbar button. \n"
      }
  
      try {
        app.addToolButton
        ({
          cName: "toolAddMark",
          oIcon: addMarkIcon,
          //cLabel: "T6", 
          cExec: "addMark(aNewDoc, 'MARK');",
          cTooltext: "Add a Mark.",
          cMarked: "setIndentOnMark();",
          nPos: 5
        });
      } catch(Error) {
        console.println("Error while adding Mark toolbar button");
        initError = true;
        initErrorMsg = initErrorMsg + " - Error while adding Mark toolbar button. \n"
      }
  
      try {
        app.addToolButton
        ({
          cName: "toolAddCommentMark",
          oIcon: addCommentMarkIcon,
          //cLabel: "T7", 
          cExec: "addMark(aNewDoc, 'COMMENTM');",
          cTooltext: "Comment Mark.",
          cMarked: "setIndentOnCommentMark();",
          nPos: 6
        });
      } catch(Error) {
        console.println("Error while adding Comment toolbar button");
        initError = true;
        initErrorMsg = initErrorMsg + " - Error while adding Comment toolbar button. \n"
      }
  
      try {
        app.addToolButton
        ({
          cName: "toolAddCount",
          oIcon: addCountIcon,
          //cLabel: "T8", 
          cExec: "countMarks(aNewDoc)",
          cTooltext: "Count Marks.",
          nPos: 7
        });
      } catch(Error) {
        console.println("Error while adding Count toolbar button");
        initError = true;
        initErrorMsg = initErrorMsg + " - Error while adding Count toolbar button. \n"
      }
  
      try {
        app.addToolButton
        ({
          cName: "toolVersion",
          cLabel: "v1.8",
          cTooltext: "Click Here",
          cExec: "showAboutInformation()",
          nPos: 8
        });
      } catch(Error) {
        console.println("Error while adding Info toolbar button");
        initError = true;
        initErrorMsg = initErrorMsg + " - Error while adding Info toolbar button. \n"
      }
    }
  }

  if (initError == true) {
    console.println("Initialization of marking tool aborted. Details: "+initErrorMsg);

    // Add a tool to the toolbar that will give the user information about why initialization failed.
    try {
      app.addToolButton
      ({
        cName: "errorMsg",
        cExec: "app.alert('Errors occurred while loading the marking tool. Details: '+initErrorMsg)",
        cLabel: "Errors Encountered",
        nPos: 9
      });
    } catch(Error)  {
      app.alert("An unknown error occurred while loading the marking tool plugin.")
    }
  }

} else {
  console.println("No active document found. Cannot initialise the onscreen marking tool");
  try {
    app.addToolButton
    ({
      cName: "noDocMsg",
      cExec: "app.alert('No active document found. Cannot initialise the onscreen marking tool. Note, initilization only occurs when opening Acrobat. Please close Acrobat and recopen the document.')",
      cLabel: "No document to mark",
      nPos: 9
    });
  } catch(Error)  {
    app.alert("An unknown error occurred while loading the marking tool plugin.")
  }
}

app.endPriv();