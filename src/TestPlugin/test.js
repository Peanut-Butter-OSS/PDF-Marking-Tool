/*
    This script files is used to explore various options available in the Acrobat JavaScript API
*/ 
app.beginPriv();

// This function will initialise the marking toolbar. It can only be executed if 
// exactly one document is currently open.
var initMarkingTool = app.trustedFunction(
  function(document) {
     app.beginPriv();
     var openDocCount = app.activeDocs.length;
     console.println("Open document count: "+openDocCount);
     console.println("TF - Initializing the marking tool")

     app.endPriv();  
  }
);

var aActiveDocs = app.activeDocs;
console.println("TF - Number of active documents: "+aActiveDocs.length);

var aNewDoc = aActiveDocs[0];
var initError = false;
var initErrorMsg = "TF - Initialization Errors: \n";

if (aNewDoc != null) {
  try {
    initMarkingTool(aNewDoc)

  } catch(Error) {
    console.println(" "+Error);
  }
} else {
  console.println("TF - No active document found. Cannot initialise the onscreen marking tool");
}



app.endPriv();

