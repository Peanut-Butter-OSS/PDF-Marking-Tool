/*
PDF Marking Tool (PMT)

This script contains everything related to calculating results and producing the results page

*/

// Main method that is called by the Count tool
var countMarks = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  deselectCurrentTool(aNewDoc);
  deleteResultsPage(aNewDoc);
  var allPmtAnnotations = collectAllEnrichedAnnotations(aNewDoc);

  if (allPmtAnnotations.totalPmtAnnotCount > 0) {
    var arrMarkM = [];
    var arrMarkQM = [];
    var quesMarkCount = 0;
    var markMarkCount = 0;
    var tempQuestion = "";

    // 
    for (var i = 0; i < allPmtAnnotations.arrAnnotMark.length; i++) {
      var pmtMarkAnnot = allPmtAnnotations.arrAnnotMark[i];

      if (pmtMarkAnnot.criterion === "UNDEFINED") {
        arrMarkM[markMarkCount] = pmtMarkAnnot.value;
        markMarkCount++;
      } else {
        arrMarkQM[quesMarkCount] = [pmtMarkAnnot.criterion, pmtMarkAnnot.value];
        quesMarkCount++;
      }
      
      // var mark_data = allPmtAnnotations.arrAnnotMark[i];

      // var question = mark_data.substring(
      //   mark_data.indexOf(":") + 1,
      //   mark_data.indexOf("|")
      // );
      // var mark = mark_data.substring(
      //   mark_data.indexOf("|") + 1,
      //   mark_data.length
      // );

      // if (question == "MARK " || question == "  ") {
      //   arrMarkM[markMarkCount] = mark;
      //   markMarkCount++;
      // } else {
      //   arrMarkQM[quesMarkCount] = [question, mark];
      //   quesMarkCount++;
      // }
    }

    var arrTempMarkQM = [];
    var countTheSame = 0;
    for (var i = 0; i < arrMarkQM.length; i++) {
      var question = arrMarkQM[i][0];
      var mark = arrMarkQM[i][1];

      var notTheSame = true;
      for (var j = 0; j < arrTempMarkQM.length; j++) {
        if (question == arrTempMarkQM[j][0]) {
          var addSameMark = parseFloat(arrTempMarkQM[j][1]) + parseFloat(mark);
          arrTempMarkQM[j] = [question, addSameMark];
          notTheSame = false;
          break;
        }

        countTheSame = j + 1;
      }

      if (notTheSame) {
        arrTempMarkQM[countTheSame] = [question, mark];
      }
    }
    arrMarkQM = arrTempMarkQM;

    // Build an array comprising only the values of each of the tick marks.
    var arrTickQM = [];
    for (var i = 0; i < allPmtAnnotations.arrAnnotTick.length; i++) {
      var mark_data = allPmtAnnotations.arrAnnotTick[i];

      var question_mark = mark_data.substring(
        mark_data.indexOf("|") + 1,
        mark_data.length
      );
      console.println("Adding "+question_mark+" to the tick marks array");
      arrTickQM[i] = question_mark;
    }

    // Add the marks assigned to all half ticks into a single array
    var arrHalfTickQM = [];
    for (var i = 0; i < allPmtAnnotations.arrAnnotHalfTick.length; i++) {
      var mark_data = allPmtAnnotations.arrAnnotHalfTick[i];

      var question_mark = mark_data.substring(
        mark_data.indexOf("|") + 1,
        mark_data.length
      );

      arrHalfTickQM[i] = question_mark;
    }

    // Add all the marks assigned to all crosses into a single array
    // TODO - Not sure this is appropriate, since crosses do not have a value
    var arrCrossQM = [];
    for (var i = 0; i < allPmtAnnotations.arrAnnotCross.length; i++) {
      var mark_data = allPmtAnnotations.arrAnnotCross[i];

      var question_mark = mark_data.substring(
        mark_data.indexOf("|") + 1,
        mark_data.length
      );

      arrCrossQM[i] = question_mark;
    }

    //skipTotalDialog = false;
    //var skipAll = false;
    // if (hasRubricAttached) {
    //   var choice = app.alert("Does this Assignment have a Rubric?", 1, 2);

    //   if (choice == 4) {
    //     hasRubricAttached = aNewDoc.importDataObject({
    //       cName: "RUBRIC_FORM",
    //       cDIPath: currentRubricOpened,
    //     });

    //     var attachedRubic = aNewDoc.openDataObject("RUBRIC_FORM");
    //     attachedRubricMark = new String(attachedRubic.title);

    //     if (attachedRubricMark.length == 3) {
    //       attachedRubricMark = "000" + attachedRubricMark;
    //     } else if (attachedRubricMark.length == 4) {
    //       attachedRubricMark = "00" + attachedRubricMark;
    //     } else if (attachedRubricMark.length == 5) {
    //       attachedRubricMark = "0" + attachedRubricMark;
    //     } else {
    //       if (attachedRubricMark.length == 6) {
    //         var val1 = parseInt(attachedRubricMark.substring(0, 3));
    //         var val2 = parseInt(attachedRubricMark.substring(3, 6));

    //         if (val1 > val2) {
    //           app.alert(
    //             "This Rubric has not been finalized!\n" +
    //               "Please ensure that the Rubric has been finalized and saved!"
    //           );

    //           skipAll = true;
    //         }
    //       } else {
    //         app.alert(
    //           "This Rubric has not been finalized!\n" +
    //             "Please ensure that the Rubric has been finalized and saved!"
    //         );

    //         skipAll = true;
    //       }
    //     }

    //     var regNumber = /\D/;
    //     if (regNumber.test(attachedRubricMark)) {
    //       app.alert(
    //         "This Rubric is not finalized!\n" +
    //           "Please ensure that the Rubric has been finalized and saved!"
    //       );

    //       skipAll = true;
    //     }

    //     if (!skipAll) {
    //       var docFileName = aNewDoc.documentFileName;
    //       var fileName = docFileName.substring(0, docFileName.indexOf("."));

    //       var newRubricPath =
    //         "/C/Program Files/UNISA/Rubrics/" +
    //         fileName +
    //         "_MARK" +
    //         attachedRubricMark +
    //         "_RUBRIC.pdf";
    //       attachedRubic.saveAs({
    //         cPath: newRubricPath,
    //       });

    //       aNewDoc.removeDataObject("RUBRIC_FORM");

    //       aNewDoc.importDataObject({
    //         cName: "RUBRIC_FORM",
    //         cDIPath: newRubricPath,
    //       });

    //       assignmentTotal = parseInt(attachedRubricMark.substring(3, 6));
    //       totalMarks = parseFloat(attachedRubricMark.substring(0, 3));

    //       skipTotalDialog = true;
    //     } else {
    //       aNewDoc.removeDataObject("RUBRIC_FORM");
    //     }
    //   }
    // }

    var totalDialog = getTotalDialog(aNewDoc);
    var dialogResult = app.execDialog(totalDialog);
    console.println(
      "Result from the total dialog: " + dialogResult
    );
    if (dialogResult === "ok") {
      buildResultsPage(
        aNewDoc,
        arrMarkM,
        arrMarkQM,
        arrTickQM,
        arrHalfTickQM,
        arrCrossQM
      );
    }
    // I've decided to simplify the logic of this final section because the way we handle rubrics is now different
    // var skipBuild = false;
    // if (!skipAll) {
    //   if (!skipTotalDialog) {
    //     skipBuild = getTotalDialog(aNewDoc);
    //   } else {
    //     skipBuild = false;
    //   }

    //   if (!skipBuild) {
    //     buildResultsPage(
    //       aNewDoc,
    //       arrMarkM,
    //       arrMarkQM,
    //       arrTickQM,
    //       arrHalfTickQM,
    //       arrCrossQM
    //     );
    //   }
    // }
  }

  app.endPriv();
});

// This function will create the results page
// Arguments:
//  - aNewDoc: The document being marked
//  - arrMMark: Array containing the marks assigned via any of the structured mark tools, but for which no criterion was defined
//  - arrQMark: 2 dimensional array containing the marks assigned via any of the structured mark tools where a specific criterion was defined
//  - arrTick: Array containing the marks assigned via the tick tool
//  - arrHalfTick: Array containing the marks assigned via the half-tick tool
//  - arrCross:
var buildResultsPage = app.trustedFunction(function (
  aNewDoc,
  arrMMark,
  arrQMark,
  arrTick,
  arrHalfTick,
  arrCross
) {
  app.beginPriv();

  totalMarks = 0;

  resultsPageNumber = createResultsPage(aNewDoc);

  var countQuestionMark = 0;
  for (var i = 0; i < arrQMark.length; i++) {
    countQuestionMark += parseFloat(arrQMark[i][1]);
  }

  var countMarkMarks = 0;
  for (var i = 0; i < arrMMark.length; i++) {
    countMarkMarks += parseFloat(arrMMark[i]);
  }

  var countTickMarks = 0;
  for (var i = 0; i < arrTick.length; i++) {
    countTickMarks += parseInt(arrTick[i]);
  }

  var countHalfMarks = 0;
  for (var i = 0; i < arrHalfTick.length; i++) {
    countHalfMarks += parseFloat(arrHalfTick[i]);
  }

    totalMarks =
      countQuestionMark + countMarkMarks + countTickMarks + countHalfMarks;

  if (totalMarks > assignmentTotal) {
    app.alert("You have entered a total that is less then the given marks!", 1);
  }

  addFinishStatusField(aNewDoc);
  addFinishButton(aNewDoc);

  var aRect = [0, 612, 792, 0];

  var y = 5;
  var h = 80;

  var lx = 5;
  var ly = aRect[2] - y;
  var rx = aRect[1] - 20;
  var ry = aRect[2] - h;

  // Add results page header
  var resultsPageHeaderField = aNewDoc.addField(
    "edtResultHeader",
    "text",
    resultsPageNumber,
    [lx, ly, rx, ry]
  );
  resultsPageHeaderField.value = "             RESULTS";
  resultsPageHeaderField.readonly = true;

  y += 85;
  h += 30;
  ly = aRect[2] - y;
  ry = aRect[2] - h;

  //var showTotalLine = false;

  //if (!skipTotalDialog) {
    for (var i = 0; i < arrQMark.length; i++) {
      var edtMarkResult = aNewDoc.addField(
        "edtMarkResult" + i,
        "text",
        resultsPageNumber,
        [lx, ly, rx, ry]
      );
      edtMarkResult.value = arrQMark[i][0] + " = " + arrQMark[i][1];

      edtMarkResult.readonly = true;

      y += 30;
      h += 30;
      ly = aRect[2] - y;
      ry = aRect[2] - h;

      //showTotalLine = true;
    }

  var totalMarkMarks = parseFloat(
    countMarkMarks + countTickMarks + countHalfMarks
  );

  if (countQuestionMark > 0 && totalMarkMarks > 0) {
    var noElementsScoreField = aNewDoc.addField(
      "noElementsScore",
      "text",
      resultsPageNumber,
      [lx, ly, rx, ry]
    );
    noElementsScoreField.value = "No Elements = " + totalMarkMarks;
    noElementsScoreField.readonly = true;

    y += 30;
    h += 30;
    ly = aRect[2] - y;
    ry = aRect[2] - h;

  }

  // Add a horizontal line before the totals
  var horizontalRuleField = aNewDoc.addField(
    "horizontalRule",
    "text",
    resultsPageNumber,
    [lx, ly, rx, ry]
  );
  horizontalRuleField.value = "------------------------------";
  horizontalRuleField.readonly = true;

  y += 30;
  h += 30;
  ly = aRect[2] - y;
  ry = aRect[2] - h;

  addTotalScoreLine(aNewDoc, totalMarks, assignmentTotal, resultsPageNumber, lx, ly, rx, ry);

  app.endPriv();
});

// Create empty results page
var createResultsPage = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  var pageNumber = addBlankPage(aNewDoc);
  var emptyRect = [0, 0, 0, 0];
  var resultsPageField = aNewDoc.addField("ResultPage", "text", 0, emptyRect);
  resultsPageField.hidden = true;
  resultsPageField.value = resultsPageNumber;

  app.endPriv();
  return pageNumber;
});

// Remove the results page entirely
var deleteResultsPage = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  // Delete the results page if it exists
  if (resultsPageNumber != -1) {
    aNewDoc.deletePages(resultsPageNumber);
    resultsPageNumber = -1;
    aNewDoc.removeField("ResultPage");
  }

  app.endPriv();
});

// Add line on the result page containing the total score for the assignment
var addTotalScoreLine = app.trustedFunction(function (aNewDoc, totalMarks, assignmentTotal, resultsPageNumber, lx, ly, rx, ry) {
  app.beginPriv();

  var percentage = Math.round((totalMarks / assignmentTotal) * 100);
  var totalScoreField = aNewDoc.addField("totalScore", "text", resultsPageNumber, [
    lx,
    ly,
    rx,
    ry,
  ]);
  totalScoreField.value =
    "Total = " +
    totalMarks +
    " / " +
    assignmentTotal +
    "  (" +
    percentage +
    "%)";
  totalScoreField.readonly = true;

  app.endPriv();
});

// Add a finish status field on the results page
// TODO - This will still be refactored. Status fields should have logical names 
// and must be stored on page 0
var addFinishStatusField = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  var emptyRect = [0, 0, 0, 0];
  // Add field for storing finish state data
  var edtFinish = aNewDoc.addField(
    "edtFinish",
    "text",
    resultsPageNumber,
    emptyRect
  );
  edtFinish.hidden = true;

  app.endPriv();
});

// Adds a Finish button on the Results page
var addFinishButton = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  var btnFinish = aNewDoc.addField("btnFinish", "button", resultsPageNumber, [
    5,
    5,
    70,
    30,
  ]);
  btnFinish.buttonSetCaption("Finalize");
  btnFinish.setAction("MouseUp", "finalizePDF(aNewDoc)");
  btnFinish.borderStyle = border.b;
  btnFinish.display = display.noPrint;
  btnFinish.highlight = "push";
  btnFinish.lineWidth = 2;

  app.endPriv();
});

// The dialog that pops up when a user selects the Count tool
var getTotalDialog = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  var totalDialog = {
    initialize: function (dialog) {
      // Prepopulate total
      console.println("Assignment total before being captured on the dialog: "+assignmentTotal);
      if (assignmentTotal == -1) {
        dialog.load({ totl: ""});
      } else {
        dialog.load({ totl: "" +assignmentTotal });
      }
    },
    validate: function (dialog) {
      var results = dialog.store();
      var total = results["totl"];

      var regNumber = /\D/;
      if (regNumber.test(total)) {
        app.alert("Only numbers are allowed!");
        return false;
      } else if (total == null) {
        return true;
      } else if (total > 999) {
        app.alert("Total cannot be greater than 999!");
        return false;
      } else if (total <= 0) {
        app.alert("Total cannot be 0 or less than 0!");
        return false
      } else {
        assignmentTotal = total;
        return true;
      }
    },
    commit: function (dialog) {
      var results = dialog.store();
      var total = results["totl"];
      assignmentTotal = total;
      //console.println("Successfully configured assignment total: " + assignmentTotal);
    },
    description: {
      name: "Result Data",
      align_children: "align_left",
      width: 100,
      height: 100,
      first_tab: "totl",
      elements: [
        {
          type: "cluster",
          name: "Result Setup",
          align_children: "align_left",
          elements: [
            {
              type: "view",
              align_children: "align_row",
              elements: [
                {
                  type: "static_text",
                  name: "Total:       ",
                },
                {
                  item_id: "totl",
                  type: "edit_text",
                  alignment: "align_fill",
                  width: 80,
                  height: 20,
                },
              ],
            },
          ],
        },
        {
          alignment: "align_left",
          type: "ok_cancel",
          ok_name: "Ok",
          cancel_name: "Cancel",
        },
      ],
    },
  };

  app.endPriv();
  return totalDialog;
});


