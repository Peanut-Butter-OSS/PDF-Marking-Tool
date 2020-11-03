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



// Main script - These commands are run on Acrobat startup
var markingToolsActive = false;
initMarkingTool();
initMarkingMenu();

app.endPriv();

