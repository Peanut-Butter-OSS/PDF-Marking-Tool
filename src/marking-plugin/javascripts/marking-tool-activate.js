/*

This file contains the functions that allow us to activate/deactivate the marking tool

*/ 

var enableMarkingTools = app.trustedFunction(
    function() {
      app.beginPriv();

      var enableError = false;
      var enableErrorMsg = "Enable Errors: \n";

      console.println("Enabling marking tools.");

      var openDocCount = app.activeDocs.length;
      console.println("Open document count: "+openDocCount);
  
      if(markingToolsActive) {
        app.alert("Cannot enable marking tools, they are already enabled")
      } else if (openDocCount==1) {
        console.println("Enabling marking tools - TODO")

        var aNewDoc = app.activeDocs[0];

        // Verify that document is not opened from an online location
        // TODO

        // Load the icons
        // TODO

        // Create the marking buttons
        // TODO

        markingToolsActive = true

        // Refresh the marking tool menu
        refreshMarkingMenu();

      } else if (openDocCount==0) {
        app.alert("No active document found. Cannot enable the PDF Marking Tool");
      } else {
        app.alert("Cannot enable PDF Marking Tool, because multiple files are currently open. \n"
         + "Please ensure that one one document is open during a marking session.")
      }

      app.endPriv();
    }
  );

  var disableMarkingTools = app.trustedFunction(
    function() {
      app.beginPriv();

      var disableError = false;
      var disableErrorMsg = "Disable Errors: \n";

      console.println("Disabling marking tools.");

      if (!markingToolsActive) {
        app.alert("Cannot disable marking tools, they are not currently enabled")
      } else {
        console.println("Disabling marking tools - TODO")

        // Remote toolbar buttons
        // TODO

        markingToolsActive = false

        // Refresh the marking tool menu
        refreshMarkingMenu();

        
      }
      app.endPriv();  
    }
  );