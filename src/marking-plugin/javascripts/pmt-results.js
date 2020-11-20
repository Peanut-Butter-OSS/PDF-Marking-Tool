/*
PDF Marking Tool (PMT)

This script contains everything related to calculating results and producing the results page

*/

// Main method that is called by the Count tool
var countMarks = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  // // Double check whether we have a results page by reading the persisted form field
  // // TODO: I'm not sure this is required at all
  // if (firstInitialization) {
  //   try {
  //     var edtSpecial = aNewDoc.getField("ResultPage");
  //     if (edtSpecial != null) {
  //       resultsPageNumber = edtSpecial.page;
  //     }
  //   } catch (Error) {}
  //   firstInitialization = false;
  // }

  deselectCurrentTool(aNewDoc);
  deleteResultsPage(aNewDoc);
  var allPmtAnnotations = collectAllPmtAnnots(aNewDoc);

  if (allPmtAnnotations.totalPmtAnnotCount > 0) {
    var arrMarkM = [];
    var arrMarkQM = [];
    var quesMarkCount = 0;
    var markMarkCount = 0;
    var tempQuestion = "";
    for (var i = 0; i < allPmtAnnotations.arrAnnotMark.length; i++) {
      var mark_data = allPmtAnnotations.arrAnnotMark[i];

      var question = mark_data.substring(
        mark_data.indexOf(":") + 1,
        mark_data.indexOf("|")
      );
      var mark = mark_data.substring(
        mark_data.indexOf("|") + 1,
        mark_data.length
      );

      if (question == "MARK " || question == "  ") {
        arrMarkM[markMarkCount] = mark;
        markMarkCount++;
      } else {
        arrMarkQM[quesMarkCount] = [question, mark];
        quesMarkCount++;
      }
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

    // Add the marks assigned to all ticks into a single array
    var arrTickQM = [];
    for (var i = 0; i < allPmtAnnotations.arrAnnotTick.length; i++) {
      var mark_data = allPmtAnnotations.arrAnnotTick[i];

      var question_mark = mark_data.substring(
        mark_data.indexOf("|") + 1,
        mark_data.length
      );

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
//  - arrMMark:
//  - arrQMark:
//  - arrTick:
//  - arrHalfTick:
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

  //if (!skipTotalDialog) {
  totalMarks = 0;
  //}

  // Create the blank page and store it's page number for reference
  resultsPageNumber = addBlankPage(aNewDoc);
  var emptyRect = [0, 0, 0, 0];
  var resultsPageField = aNewDoc.addField("ResultPage", "text", 0, emptyRect);
  resultsPageField.hidden = true;
  resultsPageField.value = resultsPageNumber;

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

  if (!skipTotalDialog) {
    totalMarks =
      countQuestionMark + countMarkMarks + countTickMarks + countHalfMarks;
  }

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
  var edtHeader = aNewDoc.addField(
    "edtResultHeader",
    "text",
    resultsPageNumber,
    [lx, ly, rx, ry]
  );
  edtHeader.value = "             RESULTS";
  edtHeader.readonly = true;

  y += 85;
  h += 30;
  ly = aRect[2] - y;
  ry = aRect[2] - h;

  var showTotalLine = false;

  if (!skipTotalDialog) {
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

      showTotalLine = true;
    }

    var totalMarkMarks = parseFloat(
      countMarkMarks + countTickMarks + countHalfMarks
    );
    if (countQuestionMark > 0 && totalMarkMarks > 0) {
      var edtHeader2 = aNewDoc.addField(
        "edtMMarks",
        "text",
        resultsPageNumber,
        [lx, ly, rx, ry]
      );
      edtHeader2.value = "No Elements = " + totalMarkMarks;

      edtHeader2.readonly = true;

      y += 30;
      h += 30;
      ly = aRect[2] - y;
      ry = aRect[2] - h;

      showTotalLine = true;
    }

    if (showTotalLine) {
      var edtHeader = aNewDoc.addField(
        "edtTotalScore",
        "text",
        resultsPageNumber,
        [lx, ly, rx, ry]
      );
      edtHeader.value = "------------------------------";
      edtHeader.readonly = true;
    }

    y += 30;
    h += 30;
    ly = aRect[2] - y;
    ry = aRect[2] - h;
  }

  if (!skipTotalDialog) {
    var percentage = Math.round((totalMarks / assignmentTotal) * 100);
    var edtHeader = aNewDoc.addField("edtTotal", "text", resultsPageNumber, [
      lx,
      ly,
      rx,
      ry,
    ]);
    edtHeader.value =
      "Total = " +
      totalMarks +
      " / " +
      assignmentTotal +
      "  (" +
      percentage +
      "%)";
    edtHeader.readonly = true;
  } else {
    var edtHeader = aNewDoc.addField("edtTotal", "text", resultsPageNumber, [
      lx,
      ly,
      rx,
      ry,
    ]);
    edtHeader.value =
      "Total = " +
      totalMarks +
      " / " +
      assignmentTotal +
      "  (" +
      totalMarks +
      "%)";
    edtHeader.readonly = true;
  }

  app.endPriv();
});

var deleteResultsPage = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  // Delete the results page if it exists
  if (resultsPageNumber != -1) {
    aNewDoc.deletePages(resultsPageNumber);
    resultsPageNumber = -1;
  }

  app.endPriv();
});

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

// Collect all marking tool annotations in the document and assemble them together in
// a structured object, with separate arrays for each type.
var collectAllPmtAnnots = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  var allPmtAnnots;
  var countMark = 0;
  var countTick = 0;
  var countCross = 0;
  var countHalfTick = 0;
  var countCommentMark = 0;
  var countRubricMark = 0;
  var arrAnnotMark = new Array();
  var arrAnnotTick = new Array();
  var arrAnnotCross = new Array();
  var arrAnnotHalfTick = new Array();
  var arrAnnotCommentMark = new Array();
  var arrAnnotRubricMark = new Array();
  var annots = aNewDoc.getAnnots();
  if (annots != null) {
    for (var i = 0; i < annots.length; i++) {
      var annot_data = annots[i].subject;
      var annot_type = getPmtAnnotType(annots[i]);
      try {
        switch (annot_type) {
          case "COMMENTM":
            arrAnnotCommentMark[countCommentMark] = annot_data;
            countCommentMark++;
            console.println(
              "Counting COMMENTM annotation: Name=" +
                annots[i].name +
                ", Subject=" +
                annots[i].subject
            );
            break;
          case "RUBRICM":
            arrAnnotRubricMark[countRubricMark] = annot_data;
            countRubricMark++;
            console.println(
              "Counting RUBRICM annotation: Name=" +
                annots[i].name +
                ", Subject=" +
                annots[i].subject
            );
            break;
          case "MARK":
            arrAnnotMark[countMark] = annot_data;
            countMark++;
            console.println(
              "Counting MARK annotation: Name=" +
                annots[i].name +
                ", Subject=" +
                annots[i].subject
            );
            break;
          case "TICK":
            arrAnnotTick[countTick] = annot_data;
            countTick++;
            console.println(
              "Counting TICK annotation: Name=" +
                annots[i].name +
                ", Subject=" +
                annots[i].subject
            );
            break;
          case "HALFT":
            arrAnnotHalfTick[countHalfTick] = annot_data;
            countHalfTick++;
            console.println(
              "Counting HALFT annotation: Name=" +
                annots[i].name +
                ", Subject=" +
                annots[i].subject
            );
            break;
          case "CROSS":
            arrAnnotCross[countCross] = annot_data;
            countCross++;
            console.println(
              "Counting CROSS annotation: Name=" +
                annots[i].name +
                ", Subject=" +
                annots[i].subject
            );
            break;
        }
      } catch (Error) {
        console.println("Error while counting PMT annotations: " + Error);
      }
    }

    var annotationCountResults =
      "Annotation Count Results: \n ----------------------------\n";
    annotationCountResults += "Half Ticks: " + countHalfTick + "\n";
    annotationCountResults += "Ticks: " + countTick + "\n";
    annotationCountResults += "Crosses: " + countCross + "\n";
    annotationCountResults += "Structured Marks: " + countMark + "\n";
    annotationCountResults += "Comment Marks: " + countCommentMark + "\n";
    annotationCountResults += "Rubric Marks: " + countMark + "\n";
    console.println(annotationCountResults);
  } else {
    app.alert("There are no marks to calculate!");
  }

  var totalPmtAnnotCount =
    countMark +
    countTick +
    countCross +
    countHalfTick +
    countCommentMark +
    countRubricMark;

  allPmtAnnots = {
    totalPmtAnnotCount: totalPmtAnnotCount,
    arrAnnotMark: arrAnnotMark,
    arrAnnotTick: arrAnnotTick,
    arrAnnotCross: arrAnnotCross,
    arrAnnotHalfTick: arrAnnotHalfTick,
    arrAnnotCommentMark: arrAnnotCommentMark,
    arrAnnotRubricMark: arrAnnotRubricMark,
  };
  app.endPriv();
  return allPmtAnnots;
});
