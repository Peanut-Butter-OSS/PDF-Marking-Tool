/*
  Config.js runs once when Acrobat is opened.
  
  Effectively it serves as the startup script for the marking tool

  According to the Acrobat scripting API the file titled "config.js" is guaranteed to be executed first
  It performs various initialization steps that are required by other scripts, including:
   - Adding the marking tool menu
   - Creating the marking tool buttons
   - Setting global configurations
*/
app.beginPriv();

console.println("Initializing PDF Marking Tool.");

//var markingToolVersion = "2.0 - UNRELEASED";
//var markingToolReleaseDate = "YYYY-MM-DD";
var markingToolVersion = "2.0.1";
var markingToolReleaseDate = "2021-01-11";
var initError = false;
var initErrorMsg = "Initialization Errors: \n";
var errorMsg = "";

// This is the main installation folder for the PDF marking tool.
// All other paths (for icons etc) are created off this one
var cJSPath = app.getPath("app","javascript");
var baseFilePath = cJSPath + "/PdfMarkingTool/";

// aActiveDocs and aNewDoc are used to store the list of active documents in the current Acrobat
// session, as well as the actual document being marked.
var aActiveDocs;
var aNewDoc;

// Documents can have 4 marking states: UNMARKED, IN_PROGRESS, COUNTED, FINALISED
// These states define what functions are available to the user
// This value is embedded as a field in the form, so that it is available on subsequent opening
var markingState = "UNKNOWN";

// Marking can be done as either FREE, RUBRIC, or MIXED
// This value is embedded as a field in the form, so that it is available on subsequent opening
var markingType = "UNKNOWN";

// Storing the page numbers of the system generated pages
// TODO - These should be stored in hidden fields too
var rubricPageNumber = -1;
var resultsPageNumber = -1;

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
var rubricMarkToolLoadStatus = "NOT LOADED";
var countToolLoadStatus = "NOT LOADED";

// Variables that track which tool is currently selected
var isHalfMarkSelected = false;
var isTickSelected = false;
var isCheckSelected = false;
var isCrossSelected = false;
var isMarkSelected = false;
var isCommentMarkSelected = false;
var isRubricMarkSelected = false;
var isDeselectAvailable = false;

// The marking buttons are a series of invisible form buttons that are added as an overlay to each page of the
// document. These buttons then "capture" the marking clicks as they are applied.
// This variables simply tracks whether marking buttons have been applied to the form
var hasMarkingButtons = false;

var firstInitialization = true;

// Global variable of the number of annotations
// TODO: Not sure this adds any value, we could calculate at the time of adding the annotation
var totalAnnotationCount = 0;

// All variables that contain Rubric information at runtime
var selectedRubricContent;
var selectedRubricFileName;
var selectedRubricName;
var selectedRubricVersion;
var hasRubricAttached = false;

// Total number of marks assigned
var totalMarks = 0;

// The total value of the assignment
var assignmentTotal = -1;

// TODO START - Old variables. Suspect these are no longer needed
var attachedRubricMark = "";
var rubricDoc;
var currentRubricOpened = "";
var isPortrait = true;
var addDeselectIcon;
var isOrientationChanged = false;
var commentFromFile = "";
//var labelForMark = "";
var skipRemoveButtons = false;
var skipTotalDialog = false;
// TODO END - Old variables. Suspect these are no longer needed

var showStatusInfo = app.trustedFunction(function () {
  app.beginPriv();

  var globalStatus = "UNKNOWN";
  if (markingToolsActive) {
    globalStatus = "ACTIVE";
  } else {
    globalStatus = "NOT ACTIVE";
  }

  var statusString = "Marking Tool Status: \n------------------------\n";
  statusString += "Marking Tools Active:          " + globalStatus + "\n\n";
  if (!markingToolsActive) {
    statusString +=
      "Note: To ensure the marking tools are loaded successfully, close Acrobat and then open a single document using the PDF file's context menu (i.e. right-click and select 'Open with Adobe Acrobat DC').\n\n";
  }
  statusString += "Initialization Errors Found:\t" + initError + "\n\n";
  if (initError) {
    statusString +=
      "Note: For a full list of errors, please view Javascript console \n\n";
  }
  statusString +=
    "HalfTick Tool Load Status: \t\t" + halfTickToolLoadStatus + "\n";
  statusString += "Tick Tool Load Status: \t\t" + tickToolLoadStatus + "\n";
  statusString += "Check Tool Load Status: \t\t" + checkToolLoadStatus + "\n";
  statusString += "Cross Tool Load Status: \t\t" + crossToolLoadStatus + "\n";
  statusString +=
    "Deselect Tool Load Status: \t\t" + deselectToolLoadStatus + "\n";
  statusString += "Mark Tool Load Status: \t\t" + markToolLoadStatus + "\n";
  statusString +=
    "Comment Mark Tool Load Status: \t" + commentMarkToolLoadStatus + "\n";
  statusString +=
    "Rubric Mark Tool Load Status: \t\t" + rubricMarkToolLoadStatus + "\n";
  statusString += "Count Tool Load Status: \t\t" + countToolLoadStatus + "\n";
  statusString += "--------------------------\n\n";
  statusString += "Document Marking Status: \t\t" + markingState + "\n";
  if (markingState != "UNKNOWN") {
    statusString += "Document Marking Type: \t\t" + markingType + "\n";
  }

  //console.println(statusString);
  if (initError) {
    console.println(initErrorMsg);
  }
  app.alert(statusString, 3);

  showToolSelectionStatus();

  app.endPriv();
});

var initMarkingMenu = app.trustedFunction(function () {
  app.beginPriv();
  //console.println("Initializing application menu for marking tool.");

  try {
    app.addSubMenu({ cName: "PDF Marking Tool", cParent: "Edit" });
    app.addMenuItem({
      cName: "Config",
      cParent: "PDF Marking Tool",
      cExec: "configureMarkingTool();",
    });
    app.addMenuItem({
      cName: "About Marking Tool",
      cParent: "PDF Marking Tool",
      cExec: "showMarkingToolAboutInfo();",
    });
    app.addMenuItem({
      cName: "Current Status",
      cParent: "PDF Marking Tool",
      cExec: "showStatusInfo();",
    });
    app.addSubMenu({
      cName: "Rubric",
      cParent: "PDF Marking Tool",
    });
    app.addMenuItem({
      cName: "Select Rubric",
      cParent: "Rubric",
      cExec: "selectRubric();",
    });
    app.addMenuItem({
      cName: "Remove Rubric",
      cParent: "Rubric",
      cExec: "removeRubric();",
    });
    app.addMenuItem({
      cName: "View Rubric Details",
      cParent: "Rubric",
      cExec: "viewRubricDetails();",
    });
  } catch (Error) {
    errorMsg = "Error while initializing marking tool menu: " + Error;
    console.println(errorMsg);
    initError = true;
    initErrorMsg = initErrorMsg + " - " + errorMsg + "\n";
  }

  app.endPriv();
});

var addMarkingTools = app.trustedFunction(function () {
  app.beginPriv();
  aActiveDocs = app.activeDocs;
  aNewDoc = aActiveDocs[0];
  var iconPath = baseFilePath;

  if (aNewDoc != null) {
    if (halfTickToolLoadStatus === "NOT LOADED") {
      halfTickToolLoadStatus = addTool(
        aNewDoc,
        iconPath,
        "halftickmark",
        "Add a Half Tick Mark.",
        "selectToolFromToolbar(aNewDoc, 'HALFT');",
        "isToolMarked('HALFT');",
        0
      );
    }
    if (tickToolLoadStatus === "NOT LOADED") {
      tickToolLoadStatus = addTool(
        aNewDoc,
        iconPath,
        "tickmark",
        "Add a tick",
        "selectToolFromToolbar(aNewDoc, 'TICK');",
        "isToolMarked('TICK');",
        1
      );
    }
    if (checkToolLoadStatus === "NOT LOADED") {
      checkToolLoadStatus = addTool(
        aNewDoc,
        iconPath,
        "check",
        "Add a Checked Stamp.",
        "selectToolFromToolbar(aNewDoc, 'CHECK');",
        "isToolMarked('CHECK');",
        2
      );
    }
    if (crossToolLoadStatus === "NOT LOADED") {
      crossToolLoadStatus = addTool(
        aNewDoc,
        iconPath,
        "crossmark",
        "Add a Cross",
        "selectToolFromToolbar(aNewDoc, 'CROSS');",
        "isToolMarked('CROSS');",
        3
      );
    }
    if (deselectToolLoadStatus === "NOT LOADED") {
      deselectToolLoadStatus = addTool(
        aNewDoc,
        iconPath,
        "deselect",
        "Deselect Current Tool.",
        "deselectCurrentTool(aNewDoc)",
        "isToolMarked('DESELECT');",
        4
      );
    }
    if (markToolLoadStatus === "NOT LOADED") {
      markToolLoadStatus = addTool(
        aNewDoc,
        iconPath,
        "mark",
        "Add a Mark",
        "selectToolFromToolbar(aNewDoc, 'MARK');",
        "isToolMarked('MARK');",
        5
      );
    }
    if (commentMarkToolLoadStatus === "NOT LOADED") {
      commentMarkToolLoadStatus = addTool(
        aNewDoc,
        iconPath,
        "commentmark",
        "Comment Mark.",
        "selectToolFromToolbar(aNewDoc, 'COMMENTM');",
        "isToolMarked('COMMENTM');",
        6
      );
    }
    if (countToolLoadStatus === "NOT LOADED") {
      countToolLoadStatus = addTool(
        aNewDoc,
        iconPath,
        "count",
        "Count Marks.",
        "countMarks(aNewDoc)",
        "",
        7
      );
    }
    if (rubricMarkToolLoadStatus === "NOT LOADED") {
      rubricMarkToolLoadStatus = addTool(
        aNewDoc,
        iconPath,
        "rubricmark",
        "Rubric Mark.",
        "selectToolFromToolbar(aNewDoc, 'RUBRICM');",
        "isToolMarked('RUBRICM');",
        8
      );
    }

  } else {
    console.println(
      "Cannot add marking tools because there is no active document"
    );
  }
  app.endPriv();
});

var addTool = app.trustedFunction(function (
  docToMark,
  iconPath,
  toolName,
  toolLabel,
  execString,
  markedFunc,
  position
) {
  app.beginPriv();

  var loadStatus = "UNKNOWN";

  console.println("Adding tool: "+toolName);
  if (docToMark != null) {
    var iconLoaded = false;

    // Read the icon into the current document
    var filePath = iconPath + toolName + ".png";
    //console.println("Path for file to be loaded: "+filePath);
    importResult = docToMark.importIcon(toolName, filePath);
    if (importResult != 0) {
      initError = true;
      initErrorMsg =
        initErrorMsg + " - Could not load the icon " + filePath + ". \n";
      console.println(initErrorMsg);
    } else {
      console.println("Icon file read successfully");
    }

    // Convert the icon into a stream
    if (!initError) {
      var icon = util.iconStreamFromIcon(docToMark.getIcon(toolName));
      if (icon == null) {
        initError = true;
        initErrorMsg =
          initErrorMsg +
          " - Could not convert the " +
          toolName +
          " icon to an icon stream. \n";
        console.println(initErrorMsg);
      } else {
        iconLoaded = true;
        console.println("Icon converted from stream successfully");
      }
    }

    // Add the toolbar tool
    if (iconLoaded) {
      try {
        app.addToolButton({
          cName: toolName,
          oIcon: icon,
          cLabel: toolLabel,
          cExec: execString,
          cTooltext: toolLabel,
          cMarked: markedFunc,
          nPos: position,
        });
        loadStatus = "LOADED WITH ICON";
      } catch (Error) {
        var errMsg =
          "Error while adding " + toolName + " toolbar button: " + Error;
        console.println(errMsg);
        initError = true;
        initErrorMsg = initErrorMsg + " - " + errMsg + "\n";
        loadStatus = "FAILED TO LOAD";
        try {
          app.addToolButton({
            cName: toolName,
            cLabel: toolLabel,
            cExec: execString,
            cTooltext: toolLabel,
            cMarked: markedFunc,
            nPos: position,
          });
          loadStatus = "LOADED WITHOUT ICON";
        } catch (Error) {
          var errMsg = "Error while adding " + toolName + " toolbar button";
          console.println(errMsg);
          initError = true;
          initErrorMsg = initErrorMsg + " - " + errMsg + "\n";
        }
      }
    } else {
      try {
        app.addToolButton({
          cName: toolName,
          cLabel: toolLabel,
          cExec: execString,
          cTooltext: toolLabel,
          cMarked: markedFunc,
          nPos: position,
        });
        loadStatus = "LOADED WITHOUT ICON";
      } catch (Error) {
        var errMsg = "Error while adding " + toolName + " toolbar button";
        console.println(errMsg);
        initError = true;
        initErrorMsg = initErrorMsg + " - " + errMsg + "\n";
      }
    }
  }
  app.endPriv();
  return loadStatus;
});

// This method is executed immediately on load of a document. It looks for the
// hidden marking fields and initialises the document variables accordingly
var initDocument = app.trustedFunction(function () {
  app.beginPriv();

  var openDocCount = app.activeDocs.length;
  //console.println("Open document count: "+openDocCount);

  if (openDocCount == 1) {
    aActiveDocs = app.activeDocs;
    aNewDoc = aActiveDocs[0];

    // If this is an online document (not a file stored on the local file system), then we set inUMSSession to false
    try {
      var fileString = aNewDoc.path.substring(0, 4);

      if (fileString == "http") {
        markingToolsActive = false;
        console.println(
          "Current document is an online document. Marking tools will not be enabled"
        );
        initError = true;
        initErrorMsg =
          initErrorMsg +
          " - Current document is an online document. Marking tools will not be enabled. \n";
      } else {
        markingToolsActive = true;

        // Initialise the markingType and markingState variables from the embedded fields
        var markingStateField = aNewDoc.getField("MarkingState");
        if (markingStateField != null) {
          markingState = markingStateField.value;

          var markingTypeField = aNewDoc.getField("MarkingType");
          if (markingTypeField != null) {
            markingType = markingTypeField.value;
          }

          var resultsPageField = aNewDoc.getField("ResultPageNumber");
          if (resultsPageField != null) {
            resultsPageNumber = parseInt(resultsPageField.value);
          }
        }
      }
    } catch (Error) {
      console.println(
        "Error while determining if the document is being viewed over HTTP. " +
          Error
      );
      initError = true;
      initErrorMsg =
        initErrorMsg +
        " - Error while determining if the document is being viewed over HTTP. \n";
    }

    // If we have already finished the document, then we set markingToolsActive to false
    if (markingState == "FINALISED") {
      markingToolsActive = false;
      console.println(
        "The document has already been finalised. Marking tools will not be enabled"
      );
      initError = true;
      initErrorMsg =
        initErrorMsg +
        " - The document has already been finalised. Marking tools will not be enabled. \n";
    }

    // Determine if a rubric is being used. If so, load the rubric into memory
    if (markingType == "RUBRIC") {
      var rubric = aNewDoc.getDataObject("Rubric");
      console.println("Rubric File Name: " + rubric.path);
      var oFile = aNewDoc.getDataObjectContents("Rubric");
      var strRubric = util.stringFromStream(oFile, "utf-8");
      // console.println("Rubric content:");
      // console.println(strRubric);
      var jsonRubric = eval("(" + strRubric + ")");
      selectedRubricContent = jsonRubric;

      var rubricFileNameField = aNewDoc.getField("RubricFileName");
      selectedRubricFileName = rubricFileNameField.value;

      var rubricNameField = aNewDoc.getField("RubricName");
      selectedRubricName = rubricNameField.value;

      var rubricVersionField = aNewDoc.getField("RubricVersion");
      selectedRubricVersion = rubricVersionField.value;
    }

  } else if (openDocCount == 0) {
    console.println(
      "No active document found. Cannot enable the PDF Marking Tool"
    );
    markingToolsActive = false;
  } else {
    console.println(
      "Cannot enable PDF Marking Tool, because multiple files are currently open. \n" +
        "Please ensure that one one document is open during a marking session."
    );
    markingToolsActive = false;
  }

  app.endPriv();
});

// When a document is made markable, a number of hidden fields are embedded on the first page for tracking
// the marking process.
var makeDocumentMarkable = app.trustedFunction(function (inputMarkingType) {
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
        if (markingTypeField == null) {
          var em = 16;
          var aRect = this.getPageBox({ nPage: 0 });
          aRect[0] += 2 * em; // from upper left hand corner of page.
          aRect[2] = aRect[0] + 2 * em; // Make it .5 inch wide
          aRect[1] -= 2 * em;
          aRect[3] = aRect[1] - 24; // and 24 points high
          markingTypeField = aNewDoc.addField("MarkingType", "text", 0, aRect);
          markingTypeField.hidden = true;
        }
        markingTypeField.value = inputMarkingType;
        markingType = inputMarkingType;

        updateMarkingState("UNMARKED");
      } catch (Error) {
        var errorMsg = "Error while making document markable " + Error;
        console.println(errorMsg);
        app.alert(errorMsg);
      }
    }
  } else if (openDocCount == 0) {
    var errorMsg =
      "No active document found. Cannot make the document markable";
    console.println(errorMsg);
    app.alert(errorMsg);
  } else {
    var errorMsg =
      "Cannot enable PDF Marking Tool, because multiple files are currently open. \n" +
      "Please ensure that one one document is open during a marking session.";
    console.println(errorMsg);
    app.alert(errorMsg);
  }
  app.endPriv();
});

var updateMarkingState = app.trustedFunction(function (newState) {
  app.beginPriv();

  markingStateField = aNewDoc.getField("MarkingState");
  if (markingStateField == null) {
    var em = 16;
    var aRect = [0,0,0,0]
    markingStateField = aNewDoc.addField(
      "MarkingState",
      "text",
      0,
      aRect
    );
    markingStateField.hidden = true;
  }
  markingStateField.value = newState;
  markingState = newState;

  app.endPriv();
});

// Depending on the current marking type, the new type will be set
// TODO
var updateMarkingType = app.trustedFunction(function (newType) {
  app.beginPriv();

  markingTypeField = aNewDoc.getField("MarkingType");
  if (markingTypeField == null) {
    var em = 16;
    var aRect = [0,0,0,0]
    markingTypeField = aNewDoc.addField(
      "MarkingType",
      "text",
      0,
      aRect
    );
    markingTypeField.hidden = true;
  }
  markingTypeField.value = newType;
  markingType = newType;

  app.endPriv();
});

initMarkingMenu();
initDocument();

if (markingToolsActive) {
  addMarkingTools();
}

console.println("Initialization of PDF Marking Tool Complete ");
console.println("Errors found?: " + initError);
if (initError) {
  console.println(initErrorMsg);
}

app.endPriv();
