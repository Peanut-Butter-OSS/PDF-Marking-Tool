/*
PDF Marking Tool (PMT)

This file contains all the functions that are used for managing the status of the document document

*/

var finalizePDF = app.trustedFunction(function (aNewDoc, marks, total) {
    app.beginPriv();
  
    var edtFinish = aNewDoc.getField("edtFinish");
  
    if (edtFinish.value == "") {
      var docFileName = aNewDoc.documentFileName;
      var fileName = docFileName.substring(0, docFileName.indexOf("."));
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
  
      var combinedMark = "";
      if (hasRubricAttached) {
        combinedMark = attachedRubricMark;
      } else {
        combinedMark = padTotal + "" + padTotalMarks;
      }
  
      var choice = app.alert(
        "This document will be finalized with the name [" +
          fileName +
          "_MARK" +
          combinedMark +
          ".pdf]," +
          "once this document is finalized no future changes can be made to it, you will have to use the original PDF [" +
          fileName +
          ".pdf] for a remark.",
        1,
        2
      );
  
      if (choice == 4) {
        edtFinish.value = "FINAL_DONE";
        edtFinish.readonly = true;
  
        var btnFinish = aNewDoc.getField("btnFinish");
        btnFinish.display = display.hidden;
  
        app.hideToolbarButton("toolAddHalfTick");
        app.hideToolbarButton("toolAddTick");
        app.hideToolbarButton("toolAddStamp");
        app.hideToolbarButton("toolAddCross");
        app.hideToolbarButton("toolDeselect");
        app.hideToolbarButton("toolAddMark");
        app.hideToolbarButton("toolAddCommentMark");
        app.hideToolbarButton("toolAddCount");
        app.hideToolbarButton("toolVersion");
        //app.toolbar = false;
  
        aNewDoc.saveAs({
          cPath: fileName + "_MARK" + combinedMark + ".pdf",
        });
  
        if (skipTotalDialog) {
          var btnViewRubric = aNewDoc.addField(
            "btnViewRubric",
            "text",
            resultsPageNumber,
            [20, 100, 592, 20]
          );
          btnViewRubric.value =
            "To view the attached Rubric (with marking criteria, comments and marks allocation),\n" +
            "please click the PaperClip Icon in the bottom left hand corner of Adobe Reader or Acrobat and open the attachment.";
          btnViewRubric.readonly = true;
          btnViewRubric.textSize = 16;
          btnViewRubric.multiline = true;
          btnViewRubric.display = display.noPrint;
  
          rubricDoc.closeDoc();
        }
  
        aNewDoc.removeField("btnOpenRubric");
  
        var annots = aNewDoc.getAnnots();
        var hasCommentsToBiuld = false;
        for (var i in annots) {
          if (annots[i].contents != "") {
            hasCommentsToBiuld = true;
          }
        }
  
        if (hasCommentsToBiuld) {
          biuldCommentsPages(aNewDoc);
        }
      }
    } else {
      app.alert("This document has already been finalized!");
    }
  
    app.endPriv();
  });
  