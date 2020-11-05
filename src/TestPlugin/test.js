/*
    This script files is used to explore various options available in the Acrobat JavaScript API
    It defines a number of independent functions and then adds a bunch of buttons to the Add-Ons toolbat
    to allow you to interactively play with each one.

    To work with this test, simply drop test.js into your Acrobat javascripts folder and restart acrobat
*/ 
app.beginPriv();

var markingToolsActive = false;
var testNumber = 0;
var testName = "Undefined";
var testTitle = "Undefined";
var testHandle = "Undefined";
var testDescription = "Undefined";

var initMarkingMenu = app.trustedFunction(
  function() {
    app.beginPriv();
    console.println("TF - Creating new application menu for marking tool");

    app.addSubMenu({ cName: "Marking Tool", cParent: "Edit"})
    app.addMenuItem({ 
      cName: "Enable",
      cParent: "Marking Tool", 
      cExec: "app.alert('TODO');"});
    app.addMenuItem({ 
      cName: "Disable",
      cParent: "Marking Tool", 
      cExec: "app.alert('TODO');"});
    app.addMenuItem({ 
      cName: "Config",
      cParent: "Marking Tool", 
      cExec: "app.alert('TODO');"});
    app.addMenuItem({ 
      cName: "About", 
      cParent: "Marking Tool", 
      cExec: "app.alert('Hello from the marking tool');"});

    app.endPriv();  
  }
);

// This function will initialise the marking toolbar. It can only be executed if 
// exactly one document is currently open.
var enableMarkingTools = app.trustedFunction(
  function() {
    app.beginPriv();
    var openDocCount = app.activeDocs.length;
    console.println("TF - Open document count: "+openDocCount);

    if(markingToolsActive) {
      app.alert("Cannot enable marking tools, they are already enabled")
    } else if (openDocCount==1) {
      console.println("TF - Enabling marking tools - TODO")
      var aNewDoc = app.activeDocs[0];
      markingToolsActive = true
    } else if (openDocCount==0) {
      app.alert("No active document found. Cannot initialise the onscreen marking tool");
    } else {
      app.alert("Cannot initialise marking tool, because multiple files are currently open")
    }
    app.endPriv();  
  }
);

var disableMarkingTools = app.trustedFunction(
  function() {
    app.beginPriv();
    if (!markingToolsActive) {
      app.alert("Cannot disable marking tools, they are not currently enabled")
    } else {
      console.println("TF - Disabling marking tools - TODO")
      markingToolsActive = false
    }
    app.endPriv();  
  }
);

var testPopupMenu = app.trustedFunction(
  function() {
    var cChoice = app.popUpMenuEx
    (
      {cName: "Item 1", bMarked:true, bEnabled:false},
      {cName: "-"},
      {cName: "Item 2", oSubMenu:
        [ {cName: "Item 2, Submenu 1"},
          {
            cName: "Item 2, Submenu 2",
            oSubMenu: {cName:"Item 2, Submenu 2, Subsubmenu 1", cReturn: "0"}
          }
        ]
      },
      {cName: "Item 3"},
      {cName: "Item 4", bMarked:true, cReturn: "1"}
    )
    app.alert("You chose the \"" + cChoice + "\" menu item");
  }
);

var readXmp = app.trustedFunction(
  function() {
    app.beginPriv();
    // var r = new Report();
    // r.writeText(this.metadata);
    // r.open("myMetadataReportFile");
    var openDocCount = app.activeDocs.length;
    var aNewDoc = app.activeDocs[0];
    console.println("TF - Reading metadata from open document. Count: "+openDocCount);
    // //console.println("Metadata:");
    var mdata = aNewDoc.metadata;
    console.println("Metadata extracted");
    app.endPriv(); 
  }
);

var readXmlData = app.trustedFunction(
  function() {
    app.beginPriv();
    var cFileName = "Config.xml";
    var cJSPath = app.getPath("app","javascript")
    //var cJSPathFormatted = app.getPath("user","javascript").replace(/\/?$/,"/");
    console.println("Javascript Folder Path: "+cJSPath)
    //console.println("Formatted Path: "+cJSPathFormatted)
    cConfigFilePath = cJSPath + "/MarkingToolData/" + cFileName;
    console.println("File Path: "+cConfigFilePath)
    var nRtn = 0;
    var stmData = null;

    // Load file into Acrobat 
    try{
       stmData = util.readFileIntoStream(cConfigFilePath);
    } catch(e){
      // Load Failed so ask user if they want to browse for file
      var cMsg = "Config file not found:\n" + cConfigFilePath + "\n\nDo you whish to browse for the file";
      nRtn = app.alert(cMsg,1,2,"File access error");
    }

    // Parse stream data if it was loaded
    if(stmData) {
      // Remove Header And Parse into E4X object
      var xmlData = null;
      try{
         var cData = util.stringFromStream(stmData);
         xmlData = eval(cData.replace(/^\<\?.*\?\>\s*/,""));
         console.println("XML Data: ");
         console.println(xmlData);
      } catch(e){
         xmlData = null;
         var cMsg = "Error Parsing Customer XML Data\n\n" + e + "\n\nAborting Operation";
         app.alert(cMsg,0,0,cAlertTitle);
      }
    }
    app.endPriv(); 
  }
);

var writeXmlData = app.trustedFunction(
  function() {
    app.beginPriv();
    
    // var cMyC = "abc";
    // var doc = this.createDataObject({cName: "test.txt", cValue: cMyC});
    // this.exportDataObject({cName: "test.txt", nLaunch:0});

    app.endPriv(); 
  }
);

var readGloballyPersistedData = app.trustedFunction(
  function() {
    app.beginPriv();
    
    var y = global.x;
    console.println("Value read from Global data is: "+y);

    app.endPriv(); 
  }
);

var writeGloballyPersistedData = app.trustedFunction(
  function() {
    app.beginPriv();
    
    var value = Date.now();
    global.x = value;
    global.setPersistent("x", true);
    console.println("Setting global variable x to: "+value);

    app.endPriv(); 
  }
);

// Test 1 - Sanity
var test1 = app.trustedFunction(
  function(testHandle) {
    app.beginPriv();

    try {
      testDescription = "This test simply verifies that the test script is available. It doesn't do anything";
      app.alert(testDescription,3,0,testHandle);
      app.alert('Complete',3,0,testHandle);
    } catch(Error) {
      console.println("Error while executing test: "+testHandle);
    }

    app.endPriv();  
  }
);

// Test 2 - Add Menu
var test2 = app.trustedFunction(
  function(testHandle) {
    app.beginPriv();

    try {
      testDescription = "This test will add a menu bar for the marking tool. \n";
      testDescription = testDescription + "Once complete, you can open the Edit menu and you should find a new 'Marking Tools' menu with various sub-menu options";
      app.alert(testDescription,3,0,testHandle);
      initMarkingMenu();
      app.alert('Complete',3,0,testHandle);
    } catch(Error) {
      console.println("Error while executing test: "+testHandle);
    }

    app.endPriv();  
  }
);

// Test 3 - Enable Marking Tools
var test3 = app.trustedFunction(
  function(testHandle) {
    app.beginPriv();

    try {
      testDescription = "This test will enable the marking tools. \n";
      testDescription = testDescription + "This includes checking whether only a single document is open and whether the marking tools are currently disabled \n";
      testDescription = testDescription + "If so, it will add the marking tools to the add-on toolbar \n\n";
      testDescription = testDescription + "NOTE: This test is not complete yet";
      app.alert(testDescription,3,0,testHandle);
      enableMarkingTools();;
      app.alert('Complete',3,0,testHandle);
    } catch(Error) {
      console.println("Error while executing test: "+testHandle);
    }

    app.endPriv();  
  }
);

// Test 4 - Disable Marking Tools
var test4 = app.trustedFunction(
  function(testHandle) {
    app.beginPriv();

    try {
      testDescription = "This test will disable the marking tools. \n";
      testDescription = testDescription + "This includes checking whether the tools are currently enabled. \n";
      testDescription = testDescription + "If so, it will remove the marking tools from the add-on toolbar \n\n";
      testDescription = testDescription + "NOTE: This test is not complete yet";
      app.alert(testDescription,3,0,testHandle);
      disableMarkingTools();
      app.alert('Complete',3,0,testHandle);
    } catch(Error) {
      console.println("Error while executing test: "+testHandle);
    }

    app.endPriv();  
  }
);

// Test 5 - Simple Popup
var test5 = app.trustedFunction(
  function(testHandle) {
    app.beginPriv();

    try {
      testDescription = "This is a simple popup menu test. \n";
      testDescription = testDescription + "It is used for checking options in popup menus";
      app.alert(testDescription,3,0,testHandle);
      testPopupMenu();
      app.alert('Complete',3,0,testHandle);
    } catch(Error) {
      console.println("Error while executing test: "+testHandle);
    }

    app.endPriv();  
  }
);

// Test 6 - Read XMP Data
var test6 = app.trustedFunction(
  function(testHandle) {
    app.beginPriv();

    try {
      testDescription = "This test is used to explore options for reading XMP metadata that is embedded in the PDF document \n\n";
      testDescription = testDescription + "NOTE: This test is a work in progress";
      app.alert(testDescription,3,0,testHandle);
      testXmp(); 
      app.alert('Complete',3,0,testHandle);
    } catch(Error) {
      console.println("Error while executing test: "+testHandle);
    }

    app.endPriv();  
  }
);

// Test 7 - Write XMP Data
var test7 = app.trustedFunction(
  function(testHandle) {
    app.beginPriv();

    try {
      testDescription = "This test is used to explore options for writing XPM metadata into the PDF document \n\n";
      testDescription = testDescription + "NOTE: This test is not implemented yet";
      app.alert(testDescription,3,0,testHandle);
      // TODO
      app.alert('Complete',3,0,testHandle);
    } catch(Error) {
      console.println("Error while executing test: "+testHandle);
    }

    app.endPriv();  
  }
);

// Test 8 - Read XML Data
var test8 = app.trustedFunction(
  function(testHandle) {
    app.beginPriv();

    try {
      testDescription = "This test is used to explore options for reading an existing XML file from the file system \n";
      testDescription = testDescription + "It expects a file to be located in the Acrobat Javascripts folder (inside a subfolder called 'MarkingToolData') \n";
      testDescription = testDescription + "The file should be titled 'Config.xml' \n\n"
      testDescription = testDescription + "To view the test output, please ensure your Javascript console is open (Ctrl-J)"
      app.alert(testDescription,3,0,testHandle);
      readXmlData();
      app.alert('Complete',3,0,testHandle);
    } catch(Error) {
      console.println("Error while executing test: "+testHandle);
    }

    app.endPriv();  
  }
);

// Test 9 - Write XML Data
var test9 = app.trustedFunction(
  function(testHandle) {
    app.beginPriv();

    try {
      testDescription = " \n";
      testDescription = testDescription + "";
      app.alert(testDescription,3,0,testHandle);
      // TODO
      app.alert('Complete',3,0,testHandle);
    } catch(Error) {
      console.println("Error while executing test: "+testHandle);
    }

    app.endPriv();  
  }
);

// Test 10 - Read Globally Persisted Data
var test10 = app.trustedFunction(
  function(testHandle) {
    app.beginPriv();

    console.println("TestHanlde received from calling function: "+testHandle);

    try {
      testDescription = "This test will read a few values to globally persisted variables. \n";
      testDescription = testDescription + "Globally persisted variables are accessible from any open PDF doc. they are stored in the glob.js file which is contained in the Javascripts folder \n\n";
      testDescription = testDescription + "To test effectively, first write the variables (Test 11). Then close Acrobat, open another PDF and read the value"
      app.alert(testDescription,3,0,testHandle);
      readGloballyPersistedData();
      app.alert('Complete',3,0,testHandle);
    } catch(Error) {
      console.println("Error while executing test: "+testHandle);
    }

    app.endPriv();  
  }
);

// Test 11 - Write Globally Persisted Data
var test11 = app.trustedFunction(
  function(testHandle) {
    app.beginPriv();

    try {
      testDescription = "This test will write a few values to globally persisted variables. \n";
      testDescription = testDescription + "Globally persisted variables are accessible from any open PDF doc. They are stored in the glob.js file which is contained in the Javascripts folder \n\n";
      testDescription = testDescription + "To test effectively, first write the variables. Then close Acrobat, open another PDF and read the value (Test 10)"
      app.alert(testDescription,3,0,testHandle);
      writeGloballyPersistedData();
      app.alert('Complete',3,0,testHandle);
    } catch(Error) {
      console.println("Error while executing test: "+testHandle);
      console.println(Error);
    }

    app.endPriv();  
  }
);

// Test 12 - Placeholder for future tests
var test12 = app.trustedFunction(
  function(testHandle) {
    app.beginPriv();

    try {
      testDescription = " \n";
      testDescription = testDescription + "";
      app.alert(testDescription,3,0,testHandle);
      // TODO
      app.alert('Complete',3,0,testHandle);
    } catch(Error) {
      console.println("Error while executing test: "+testHandle);
    }

    app.endPriv();  
  }
);

// Adds toolbar buttons for each of the test methods
var addTestButtons = app.trustedFunction(
  function() {
    app.beginPriv();

    // Test 1 - Sanity Test
    testNumber = 1;
    testName = "test"+testNumber
    testTitle = "Sanity Test";
    testHandle = "Test " + testNumber + " " + testTitle;
    try {
      app.addToolButton
      ({
        cName: testName,
        cLabel: testHandle, 
        cExec: "test1(testHandle);",
        cTooltext: testHandle,
        nPos: testNumber
      });
    } catch(Error) {
      console.println("Error while adding Test "+testNumber+" toolbar button");
    }

    // Test 2 - Add Menu
    testNumber = 2;
    testName = "test"+testNumber
    testTitle = "Add Menu";
    testHandle = "Test " + testNumber + " " + testTitle;
    try {
      app.addToolButton
      ({
        cName: testName,
        cLabel: testHandle, 
        cExec: "test2(testHandle);",
        cTooltext: testHandle,
        nPos: testNumber
      });
    } catch(Error) {
      console.println("Error while adding Test "+testNumber+" toolbar button");
    }

    // Test 3 - Enable marking tools
    testNumber = 3;
    testName = "test"+testNumber
    testTitle = "Enable Marking Tools";
    testHandle = "Test " + testNumber + " " + testTitle;
    try {
      app.addToolButton
      ({
        cName: testName,
        cLabel: testHandle, 
        cExec: "test3(testHandle);",
        cTooltext: testHandle,
        nPos: testNumber
      });
    } catch(Error) {
      console.println("Error while adding Test "+testNumber+" toolbar button");
    }

    // Test 4 - Disable marking tools
    testNumber = 4;
    testName = "test"+testNumber
    testTitle = "Disable Marking Tools";
    testHandle = "Test " + testNumber + " " + testTitle;
    try {
      app.addToolButton
      ({
        cName: testName,
        cLabel: testHandle, 
        cExec: "test4(testHandle);",
        cTooltext: testHandle,
        nPos: testNumber
      });
    } catch(Error) {
      console.println("Error while adding Test "+testNumber+" toolbar button");
    }

    // Test 5 - Popup Menu
    testNumber = 5;
    testName = "test"+testNumber
    testTitle = "Popup Menu";
    testHandle = "Test " + testNumber + " " + testTitle;
    try {
      app.addToolButton
      ({
        cName: testName,
        cLabel: testHandle, 
        cExec: "test5(testHandle);",
        cTooltext: testHandle,
        nPos: testNumber
      });
    } catch(Error) {
      console.println("Error while adding Test "+testNumber+" toolbar button");
    }

    // Test 6 - Read XMP Metadata
    testNumber = 6;
    testName = "test"+testNumber
    testTitle = "Read XMP Metadata";
    testHandle = "Test " + testNumber + " " + testTitle;
    try {
      app.addToolButton
      ({
        cName: testName,
        cLabel: testHandle, 
        cExec: "test6(testHandle);",
        cTooltext: testHandle,
        nPos: testNumber
      });
    } catch(Error) {
      console.println("Error while adding Test "+testNumber+" toolbar button");
    }

    // Test 7 - Write XMP Metadata
    testNumber = 7;
    testName = "test"+testNumber
    testTitle = "Write XMP Metadata";
    testHandle = "Test " + testNumber + " " + testTitle;
    try {
      app.addToolButton
      ({
        cName: testName,
        cLabel: testHandle, 
        cExec: "test7(testHandle);",
        cTooltext: testHandle,
        nPos: testNumber
      });
    } catch(Error) {
      console.println("Error while adding Test "+testNumber+" toolbar button");
    }

    // Test 8 - Read XML Data
    testNumber = 8;
    testName = "test"+testNumber
    testTitle = "Read XML Data";
    testHandle = "Test " + testNumber + " " + testTitle;
    try {
      app.addToolButton
      ({
        cName: testName,
        cLabel: testHandle, 
        cExec: "test8(testHandle);",
        cTooltext: testHandle,
        nPos: testNumber
      });
    } catch(Error) {
      console.println("Error while adding Test "+testNumber+" toolbar button");
    }

    // Test 9 - Write XML Data
    testNumber = 9;
    testName = "test"+testNumber
    testTitle = "Write XML Data";
    testHandle = "Test " + testNumber + " " + testTitle;
    try {
      app.addToolButton
      ({
        cName: testName,
        cLabel: testHandle, 
        cExec: "test9(testHandle);",
        cTooltext: testHandle,
        nPos: testNumber
      });
    } catch(Error) {
      console.println("Error while adding Test "+testNumber+" toolbar button");
    }

    // Test 10 - Read Global Data
    testNumber = 10;
    testName = "test"+testNumber
    testTitle = "Read Global DataXX";
    testHandle = "Test " + testNumber + " " + testTitle;
    try {
      app.addToolButton
      ({
        cName: testName,
        cLabel: testHandle, 
        cExec: "test10(testHandle);",
        cTooltext: testHandle,
        nPos: testNumber
      });
    } catch(Error) {
      console.println("Error while adding Test "+testNumber+" toolbar button");
    }
    
    // Test 11 - Write Global Data
    testNumber = 11;
    testName = "test"+testNumber
    testTitle = "Write Global Data";
    testHandle = "Test " + testNumber + " " + testTitle;
    try {
      app.addToolButton
      ({
        cName: testName,
        cLabel: testHandle, 
        cExec: "test11(testHandle);",
        cTooltext: testHandle,
        nPos: testNumber
      });
    } catch(Error) {
      console.println("Error while adding Test "+testNumber+" toolbar button");
    }

    app.endPriv(); 
  }
);

// Main script - These commands are run on Acrobat startup
addTestButtons();

app.endPriv();

