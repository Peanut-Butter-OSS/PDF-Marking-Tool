/*
PDF Marking Tool (PMT)

This file contains all the functions that are used during the finalisation process

*/

var deriveMarkedFileName = app.trustedFunction(function (aNewDoc, originalFileName) {
  app.beginPriv();

  var newFileName = "";

  // Calculate and pad the score, since it gets added into the file name
  var percentage = Math.round((totalMarks / assignmentTotal) * 100);
  var padTotal = "" + percentage;
  var padTotalMarks = "100";
  if (padTotal.length == 1) {
    padTotal = "00" + padTotal;
  } else if (padTotal.length == 2) {
    padTotal = "0" + padTotal;
  }
  if (padTotalMarks.length == 1) {
    padTotalMarks = "00" + padTotalMarks;
  } else if (padTotalMarks.length == 2) {
    padTotalMarks = "0" + padTotalMarks;
  }

  newFileName = originalFileName + "_MARK" + padTotal + padTotalMarks + ".pdf";

  app.endPriv();
  return newFileName;
});

var finalizePDF = app.trustedFunction(function (aNewDoc) {
    app.beginPriv();
  
    if (markingState=="FINALIZED") {
      app.alert("This document has already been finalized!");
    } else {
      var docFileName = aNewDoc.documentFileName;
      var originalFileName = docFileName.substring(0, docFileName.indexOf("."));

      var finalisedFileName = deriveMarkedFileName(aNewDoc, originalFileName);
      var choice = app.alert(
        "This document will be finalized with the name [" +
        finalisedFileName +
          "], once this document is finalized no future changes can be made to it, you will have to use the original PDF [" +
          originalFileName +
          ".pdf] for a remark.",
        1,
        2
      );

      if (choice == 4) {
        //Save doc with the new name
        aNewDoc.saveAs({
          cPath: finalisedFileName
        });

      //   aNewDoc.saveAs({
      //     cPath: originalFileName + "_MARK" + "_TEST_" + ".pdf" 
      //  });

        // TODO - Remove rubric attachment

        updateMarkingState("FINALISED");

        // Hide the finalise button
        var btnFinish = aNewDoc.getField("btnFinish");
        btnFinish.display = display.hidden;

        // Flatten the document. This removes all fields and annotations
        // TODO - But since metadata is now removed we will need to add XMP metadata
        // To ensure doc is not remarked
        //this.flattenPages();

        // TODO Check out
        // // Add comments page
        // var annots = aNewDoc.getAnnots();
        // var hasCommentsToBiuld = false;
        // for (var i in annots) {
        //   if (annots[i].contents != "") {
        //     hasCommentsToBiuld = true;
        //   }
        // }
  
        // if (hasCommentsToBiuld) {
        //   biuldCommentsPages(aNewDoc);
        // }
      }
    }
    
    app.endPriv();
  });
  