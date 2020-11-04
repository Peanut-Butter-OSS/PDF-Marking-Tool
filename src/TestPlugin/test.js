/*
    This script files is used to explore various options available in the Acrobat JavaScript API
*/ 
app.beginPriv();

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
var initMarkingTool = app.trustedFunction(
  function() {
    app.beginPriv();
    var openDocCount = app.activeDocs.length;
    console.println("TF - Open document count: "+openDocCount);
    console.println("TF - Initializing the marking tool")

    if (openDocCount==1) {
      var aNewDoc = app.activeDocs[0];
      markingToolsActive = true
    } else if (openDocCount==0) {
      console.println("TF - No active document found. Cannot initialise the onscreen marking tool");
    } else {
      console.println("TF - Cannot initialise marking tool, because multiple files are currently open")
    }
    app.endPriv();  
  }
);

var checkPlugins = app.trustedFunction(
  function() {
    var aPlugins = app.plugIns;
    var nPlugins = aPlugins.length;
    for ( var i = 0; i < nPlugins; i++) {
      console.println("Plugin \#"+i+" is " + aPlugins[i].name);
    }
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
    var cFileName = "CustomerData.xml";
    var cJSPath = app.getPath("app","javascript")
    //var cJSPathFormatted = app.getPath("user","javascript").replace(/\/?$/,"/");
    console.println("Folder Path: "+cJSPath)
    //console.println("Formatted Path: "+cJSPathFormatted)
    cFilePath = cJSPath + "/" + cFileName;
    console.println("File Path: "+cFilePath)
    var nRtn = 0;
    var stmData = null;

    // Load file into Acrobat 
    try{
       stmData = util.readFileIntoStream(cFilePath);
    }catch(e){
      // Load Failed so ask user if they want to browse for file
      var cMsg = "Customer Data File not Found:\n" + cFilePath + "\n\nDo you whish to browse for the file";
      nRtn = app.alert(cMsg,1,2,"File access error");
    }

   // Parse stream data if it was loaded
   if(stmData)
   {// File data loaded, 
      
      // Remove Header And Parse into E4X object
      var xmlData = null;
      try{
         var cData = util.stringFromStream(stmData);
         xmlData = eval(cData.replace(/^\<\?.*\?\>\s*/,""));
         console.println("XML Data: "+xmlData)
      }catch(e){
         xmlData = null;
         var cMsg = "Error Parsing Customer XML Data\n\n" + e + "\n\nAborting Operation";
         app.alert(cMsg,0,0,cAlertTitle);
      }
   }

    // var cMyC = "abc";
    // var doc = this.createDataObject({cName: "test.txt", cValue: cMyC});
    // this.exportDataObject({cName: "test.txt", nLaunch:0});

    app.endPriv(); 
  }
);

// Simple method that adds toolbar buttons to test various scripts
var addTestButtons = app.trustedFunction(
  function() {
    app.beginPriv();


    try {
      app.addToolButton
      ({
        cName: "test1",
        cLabel: "Test 1", 
        cExec: "app.alert('Sanity Test',0,0,'Test 1');",
        cTooltext: "Run Test 1 - Sanity",
        nPos: 2
      });
    } catch(Error) {
      console.println("Error while adding Test 1 toolbar button");
      initError = true;
      initErrorMsg = initErrorMsg + " - Error while adding Test 1 toolbar button. \n"
    }
    app.endPriv(); 
  }
);

// Main script - These commands are run on Acrobat startup
var markingToolsActive = false;
initMarkingTool();
initMarkingMenu();
addTestButtons();
//checkPlugins();
//testPopupMenu();
//readXmp();
//readXmlData();


app.endPriv();

