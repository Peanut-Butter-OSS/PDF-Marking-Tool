app.beginPriv();

var aActiveDocs = app.activeDocs;
var aNewDoc = aActiveDocs[0];

try {
  var numpages = aNewDoc.numPages;

  for (var i=0; i < numpages; i++) {      
    aNewDoc.removeField("btn" + i);
  }
} catch(Error) {}

var inUMSSession = "true";
try {
   var edtFinish = aNewDoc.getField("edtFinish");
   if(edtFinish.value == "FINAL_DONE") {
      inUMSSession = "false";
   }
} catch(Error) {}


try {
   var fileString = aNewDoc.path.substring(0, 4);
   
   if(fileString == "http") {
      inUMSSession = "false";
   }
} catch(Error) {}


if(inUMSSession == "true") {
    
  app.hideToolbarButton("Hand");
  app.hideToolbarButton("ZoomIn");
  app.hideToolbarButton("Zoom100");
  app.hideToolbarButton("PanAndZoom");
  app.hideToolbarButton("Loupe");
  
	app.addToolButton 
	  ({
		  cName: "toolVersion",
		  cExec: "removeContinuesMarking(aNewDoc)",
		  cTooltext: "Version 1.7",
		  cEnable: "setVerDisable();",
		  nPos: 0
	  });
  
  
  
		app.addToolButton
  ({
      cName: "toolAddTick",
      cExec: "addMark(aNewDoc, 'TICK');",
      cTooltext: "Tick",
      cMarked: "setIndentOnTick();",
      nPos: 1
  });
  
  app.addToolButton
  ({
      cName: "toolChangeTick",
      cExec: "getTickMarkDialog(aNewDoc);",
      cTooltext: "Change Tick Value/Colour",
      cMarked: "setIndentOnTick();",
      nPos: 2
  });
  
	  app.addToolButton
	  ({
		  cName: "toolAddHalfTick",
		  cExec: "addMark(aNewDoc, 'HALFT');",
		  cTooltext: "Half Tick",
		  cMarked: "setIndentOnHalfTick();",
		  nPos: 3
	  });
		
	  
  
  app.addToolButton
  ({
      cName: "toolAddCross",
      cExec: "addMark(aNewDoc, 'CROSS');",
      cTooltext: "Cross",
      cMarked: "setIndentOnCross();",
      nPos: 4
  });
  
  app.addToolButton 
  ({
      cName: "toolDeselect",
      cExec: "removeContinuesMarking(aNewDoc)",
      cTooltext: "Remove Tick Mark",
      cEnable: "setEnableOnDeselect();",
      nPos: 5
  });
  
  app.addToolButton
  ({
      cName: "toolAddMark",
      cExec: "addMark(aNewDoc, 'MARK');",
      cTooltext: "Summary Mark",
      cMarked: "setIndentOnMark();",
      nPos: 6
  });
  
  app.addToolButton
  ({
      cName: "toolAddCommentMark",
      cExec: "addMark(aNewDoc, 'COMMENTM');",
      cTooltext: "Summary Mark With A Comment",
      cMarked: "setIndentOnCommentMark();",
      nPos: 7
  });
  
  app.addToolButton
  ({
      cName: "toolAddCount",
      cExec: "countMarks(aNewDoc,0)",
      cTooltext: "Calculate Total",
      nPos: 8
  });
  
  app.addToolButton
  ({
      cName: "toolAddCountComment",
      cExec: "countMarks(aNewDoc,1)",
      cTooltext: "Calculate Total With Comments",
      nPos: 9
  });
  
  


}

app.endPriv();