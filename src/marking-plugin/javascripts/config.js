/*
  Config.js runs once when Acrobat is opened with a document. 
  According to the Acrobat scripting API the file titled "config.js" is guaranteed to be executed first
  It performs various initialization steps that are required by other scripts, including:
   - Adding the marking tool menu
   - Creating the marking tool buttons
   - Setting global configurations
*/ 
app.beginPriv();

console.println("Initializing PDF Marking Tool.");

var markingToolVersion = "2.0 - UNRELEASED";
var markingToolReleaseDate = "YYYY-MM-DD";
var initError = false;
var initErrorMsg = "Initialization Errors: \n";
var errorMsg = "";

var aActiveDocs;
var aNewDoc;
// Documents can have 4 marking states: UNMARKED, IN_PROGRESS, COUNTED, FINALIZED
// These states define what functions are available to the user
// This value is embedded as a field in the form, so that it is available on subsequent opening
var markingState = "UNKNOWN";

// Marking can be done as either UNSTRUCTURED, or RUBRIC-BASED
// This value is embedded as a field in the form, so that it is available on subsequent opening
var markingType = "UNKNOWN";

// The active flag indicates whether the tools are currently active
var markingToolsActive = false;

// Variables that help us track whether all tools were successfully loaded
var halfTickToolLoadStatus = "NOT LOADED";
var tickToolLoadStatus = "NOT LOADED";
var checkToolLoadStatus = "NOT LOADED";
var crossToolLoadStatus = "NOT LOADED";
var deselectToolLoadStatus = "NOT LOADED";
var markToolLoadStatus = "NOT LOADED";
var commentMarkToolLoadStatus = "NOT LOADED";
var countToolLoadStatus = "NOT LOADED";

var showStatusInfo = app.trustedFunction(
  function() {
    app.beginPriv();

    var globalStatus = "UNKNOWN";
    if (markingToolsActive) {
      globalStatus = "ACTIVE";
    } else {
      globalStatus = "NOT ACTIVE";
    }

    var statusString = "Marking Tool Status: \n------------------------\n";
    statusString += "Marking Tools Active:          "+globalStatus+"\n\n";
    if (!markingToolsActive) {
      statusString += "Note: To ensure the marking tools are loaded successfully, close Acrobat and then open a single document using the PDF file's context menu (i.e. right-click and select 'Open with Adobe Acrobat DC').\n\n";
    }
    statusString += "Initialization Errors Found:\t"+initError+"\n\n";
    if (initError) {
      statusString += "Note: For a full list of errors, please view Javascript console \n\n";
    }
    statusString += "HalfTick Tool Load Status: \t\t"+halfTickToolLoadStatus+"\n";
    statusString += "Tick Tool Load Status: \t\t"+tickToolLoadStatus+"\n";
    statusString += "Check Tool Load Status: \t\t"+checkToolLoadStatus+"\n";
    statusString += "Cross Tool Load Status: \t\t"+crossToolLoadStatus+"\n";
    statusString += "Deselect Tool Load Status: \t\t"+deselectToolLoadStatus+"\n";
    statusString += "Mark Tool Load Status: \t\t"+markToolLoadStatus+"\n";
    statusString += "Comment Mark Tool Load Status: \t"+commentMarkToolLoadStatus+"\n";
    statusString += "Count Tool Load Status: \t\t"+countToolLoadStatus+"\n";
    statusString += "--------------------------\n\n";
    statusString += "Document Marking Status: \t\t"+markingState+"\n";
    if(markingState!="UNKNOWN") {
      statusString += "Document Marking Type: \t\t"+markingType+"\n";
    }

    //console.println(statusString);
    if (initError) {
      console.println(initErrorMsg);
    }
    app.alert(statusString, 3);

    app.endPriv();  
  }
);

var initMarkingMenu = app.trustedFunction(
  function() {
    app.beginPriv();
    //console.println("Initializing application menu for marking tool.");

    try {
      app.addSubMenu({ cName: "PDF Marking Tool", cParent: "Edit"})
      app.addMenuItem({ 
        cName: "Config",
        cParent: "PDF Marking Tool", 
        cExec: "configureMarkingTool();"});
      app.addMenuItem({ 
        cName: "About", 
        cParent: "PDF Marking Tool", 
        cExec: "showAboutInfo();"});
      app.addMenuItem({ 
        cName: "Current Status",
        cParent: "PDF Marking Tool", 
        cExec: "showStatusInfo();"});
      app.addSubMenu({ 
        cName: "Rubric",
        cParent: "PDF Marking Tool"});
      app.addMenuItem({ 
        cName: "Select Rubric",
        cParent: "Rubric", 
        cExec: "selectRubric();"});
      app.addMenuItem({ 
        cName: "Clear Selected Rubric",
        cParent: "Rubric", 
        cExec: "clearRubricSelection();"});
      app.addMenuItem({ 
        cName: "View Rubric Details",
        cParent: "Rubric", 
        cExec: "viewRubricDetails();"});
      app.addMenuItem({ 
        cName: "Apply Rubric to Active Document",
        cParent: "Rubric", 
        cExec: "applyRubricToDocument();"});
    } catch(Error) {
      errorMsg = "Error while initializing marking tool menu: "+Error;
      console.println(errorMsg);
      initError = true;
      initErrorMsg = initErrorMsg + " - " + errorMsg + "\n";
    }

    app.endPriv();
  }
);

var addMarkingTools = app.trustedFunction(
  function() {
    app.beginPriv();
    aActiveDocs = app.activeDocs;
    aNewDoc = aActiveDocs[0];
    var iconPath = "/C/Program Files/UNISA/";

    if (aNewDoc != null) {
      if (halfTickToolLoadStatus==="NOT LOADED") {
        halfTickToolLoadStatus = addTool(aNewDoc, iconPath, "halftickmark", "Add a Half Tick Mark.", "addMark(aNewDoc, 'HALFT');", "setIndentOnHalfTick();",0);
      }
      if (tickToolLoadStatus==="NOT LOADED") {
        tickToolLoadStatus = addTool(aNewDoc, iconPath, "tickmark", "Add a tick", "addMark(aNewDoc, 'TICK');", "setIndentOnTick();",1);
      }
      if (checkToolLoadStatus==="NOT LOADED") {
        checkToolLoadStatus = addTool(aNewDoc, iconPath, "check", "Add a Checked Stamp.", "addMark(aNewDoc, 'CHECK');", "setIndentOnCheck();",2);
      }
      if (crossToolLoadStatus==="NOT LOADED") {
        crossToolLoadStatus = addTool(aNewDoc, iconPath, "crossmark", "Add a Cross", "addMark(aNewDoc, 'CROSS');", "setIndentOnCross();",3);
      }
      if (deselectToolLoadStatus==="NOT LOADED") {
        deselectToolLoadStatus = addTool(aNewDoc, iconPath, "deselect", "Deselect Current Tool.", "removeContinuesMarking(aNewDoc)", "setEnableOnDeselect();",4);
      }
      if (markToolLoadStatus==="NOT LOADED") {
        markToolLoadStatus = addTool(aNewDoc, iconPath, "mark", "Add a Mark", "addMark(aNewDoc, 'MARK');", "setIndentOnMark();",5);
      }
      if (commentMarkToolLoadStatus==="NOT LOADED") {
        commentMarkToolLoadStatus = addTool(aNewDoc, iconPath, "commentmark", "Comment Mark.", "addMark(aNewDoc, 'COMMENTM');", "setIndentOnCommentMark();",6);
      }
      if (countToolLoadStatus==="NOT LOADED") {
        countToolLoadStatus = addTool(aNewDoc, iconPath, "count", "Count Marks.", "countMarks(aNewDoc)", "",7);
      }
    } else {
      console.println("Cannot add marking tools because there is no active document");
    }
    app.endPriv();
  }
);

var addTool = app.trustedFunction(
  function(docToMark, iconPath, toolName, toolLabel, execString, markedFunc, position) {
    app.beginPriv();

    var loadStatus = "UNKNOWN";
    
    if (docToMark != null) {
      var iconLoaded = false;

      // Read the icon into the current document
      var filePath = iconPath + toolName + ".png";
      //console.println("Path for file to be loaded: "+filePath);
      importResult = docToMark.importIcon(toolName, filePath);
      if (importResult != 0) {
        initError = true;
        initErrorMsg = initErrorMsg + " - Could not load the icon "+filePath+". \n"
      }

      // Convert the icon into a stream
      if (!initError) {
        var icon = util.iconStreamFromIcon(docToMark.getIcon(toolName));
        if (icon == null) {
          initError = true;
          initErrorMsg = initErrorMsg + " - Could not convert the "+toolName+" icon to an icon stream. \n"
        } else {
          iconLoaded = true;
        }
      }

      // Add the toolbar tool
      if (iconLoaded) {
        try {
          app.addToolButton
          ({
            cName: toolName,
            oIcon: icon,
            cLabel: toolLabel, 
            cExec: execString,
            cTooltext: toolLabel,
            cMarked: markedFunc,
            nPos: position
          });
          loadStatus = "LOADED WITH ICON";
        } catch(Error) {
          var errMsg = "Error while adding "+toolName+" toolbar button";
          console.println(errMsg);
          initError = true;
          initErrorMsg = initErrorMsg + " - " + errMsg + "\n";
          loadStatus = "FAILED TO LOAD";
        }
      } else {
        try {
          app.addToolButton
          ({
            cName: toolName,
            cLabel: toolLabel, 
            cExec: execString,
            cTooltext: toolLabel,
            cMarked: markedFunc,
            nPos: position
          });
          loadStatus = "LOADED WITHOUT ICON";
        } catch(Error) {
          var errMsg = "Error while adding "+toolName+" toolbar button";
          console.println(errMsg);
          initError = true;
          initErrorMsg = initErrorMsg + " - " + errMsg + "\n";
        }        
      }

    }
    app.endPriv();
    return loadStatus;
  }
);

var determineMarkingStatus = app.trustedFunction(
  function() {
    app.beginPriv();
  
    var openDocCount = app.activeDocs.length;
    //console.println("Open document count: "+openDocCount);

    if (openDocCount==1) {
      aActiveDocs = app.activeDocs;
      aNewDoc = aActiveDocs[0];

      // If this is an online document (not a file stored on the local file system), then we set inUMSSession to false
      try {
        var fileString = aNewDoc.path.substring(0, 4);

        if(fileString == "http") {
          markingToolsActive = false;
          console.println("Current document is an online document. Marking tools will not be enabled");
          initError = true;
          initErrorMsg = initErrorMsg + " - Current document is an online document. Marking tools will not be enabled. \n";
        } else {
          markingToolsActive = true;

          // Initialise the markingType and markingState variables from the embedded fields
          markingStateField = aNewDoc.getField("MarkingState");
          if (markingStateField != null) {
            markingState = markingStateField.value;
            
            markingTypeField = aNewDoc.getField("MarkingType");
            if (markingTypeField != null) {
              markingType = markingTypeField.value;
            }
          }
        }
      } catch(Error) {
        console.println("Error while determining if the document is being viewed over HTTP. "+Error)
        initError = true;
        initErrorMsg = initErrorMsg + " - Error while determining if the document is being viewed over HTTP. \n";
      }
      
      // If we have already finished the document, then we set markingToolsActive to false
      try {
        var edtFinish = aNewDoc.getField("edtFinish");
        if(edtFinish != null && edtFinish.value == "FINAL_DONE") {
          markingToolsActive = false;
          markingState = "FINALISED";
          console.println("The document has already been finalised. Marking tools will not be enabled");
          initError = true;
          initErrorMsg = initErrorMsg + " - The document has already been finalised. Marking tools will not be enabled. \n";
        }
      } catch(Error) {
        console.println("Error while verifying if the document has already been finished. "+Error);
        initError = true;
        initErrorMsg = initErrorMsg + " - Error while verifying if the document has already been finished. \n";
      }

    } else if (openDocCount==0) {
      console.println("No active document found. Cannot enable the PDF Marking Tool");
      markingToolsActive = false;
    } else {
      console.println("Cannot enable PDF Marking Tool, because multiple files are currently open. \n"
       + "Please ensure that one one document is open during a marking session.");
       markingToolsActive = false;
    }

    app.endPriv();
  }
);

// When a document is made markable, a number of hidden fields are embedded on the first page for tracking 
// the marking process. 
var makeDocumentMarkable = app.trustedFunction(
  function(inputMarkingType) {
    app.beginPriv();
    console.println("Making document markable.");

    var openDocCount = app.activeDocs.length;
    if (openDocCount == 1) {
      aActiveDocs = app.activeDocs;
      aNewDoc = aActiveDocs[0];
      if (aNewDoc != null) {
        var markingTypeField;
        try {
          markingTypeField = aNewDoc.getField("MarkingType");
          if(markingTypeField == null) {
            var em = 16;
            var aRect = this.getPageBox( {nPage: 0} );
            aRect[0] += 2*em; // from upper left hand corner of page.
            aRect[2] = aRect[0]+2*em; // Make it .5 inch wide
            aRect[1] -= 2*em;
            aRect[3] = aRect[1] - 24; // and 24 points high
            markingTypeField = aNewDoc.addField("MarkingType", "text", 0, aRect);
            markingTypeField.hidden = true;
          }
          markingTypeField.value=inputMarkingType;
          markingType=inputMarkingType;

          markingStateField = aNewDoc.getField("MarkingState");
          if(markingStateField == null) {
            var em = 16;
            var aRect = this.getPageBox( {nPage: 0} );
            aRect[0] += 2*em; // from upper left hand corner of page.
            aRect[2] = aRect[0]+2*em; // Make it .5 inch wide
            aRect[1] -= 2*em;
            aRect[3] = aRect[1] - 24; // and 24 points high
            markingStateField = aNewDoc.addField("MarkingState", "text", 0, aRect);
            markingStateField.hidden = true;
          }
          markingStateField.value="UNMARKED";
          markingState="UNMARKED";

        } catch(Error) {
          var errorMsg = "Error while making document markable "+Error;
          console.println(errorMsg);
          app.alert(errorMsg);
        }
      }
    } else if (openDocCount==0) {
      var errorMsg = "No active document found. Cannot make the document markable";
      console.println(errorMsg);
      app.alert(errorMsg);
    } else {
      var errorMsg = "Cannot enable PDF Marking Tool, because multiple files are currently open. \n"
      + "Please ensure that one one document is open during a marking session.";
      console.println(errorMsg);
      app.alert(errorMsg);
    }







    app.endPriv();
  }
);

initMarkingMenu();
determineMarkingStatus();

if (markingToolsActive) {
  addMarkingTools();
}

console.println("Initialization of PDF Marking Tool Complete ");
console.println("Errors found?: "+initError)
if (initError) {
  console.println(initErrorMsg)
}

app.endPriv();