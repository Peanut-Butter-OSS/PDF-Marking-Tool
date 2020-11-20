/*
PDF Marking Tool (PMT)

This script contains everything related to calculating results and producing the results page

*/

// Main method that is called by the Count tool
var countMarks = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  // Double check whether we have a results page byu reading the persisted form field
  if (firstInitialization) {
    try {
      var edtSpecial = aNewDoc.getField("ResultPage");
      if (edtSpecial != null) {
        resultsPageNumber = edtSpecial.page;
      }
    } catch (Error) {}
    firstInitialization = false;
  }

  // Delete the results page if it exists
  if (resultsPageNumber != -1) {
    aNewDoc.deletePages(resultsPageNumber);
    resultsPageNumber = -1;
  }

  deselectCurrentTool(aNewDoc);

  // Here we iterate over all annotations in the PDF
  // For each annotation we determine if it is one of our types by looking at
  // the subject. Based on the type we maintain some counters and build arrays of each type
  // TODO - This code block incorrectly looks at the subject field for the type. It should actually look at the name field
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
  var annots = aNewDoc.getAnnots();
  if (annots != null) {
    for (var i = 0; i < annots.length; i++) {
      var annot_data = annots[i].subject;

      var annot_type = "";
      try {
        annot_type = annot_data.indexOf("COMMENTM");
        if (annot_type == 0) {
          arrAnnotCommentMark[countCommentMark] = annot_data;
          countCommentMark++;
          console.println("Counting COMMENTM annotation: Name="+annots[i].name+", Subject="+annots[i].subject);
        }
      } catch (Error) {
        console.println("Error while counting COMMENTM annotation: "+Error);
      }
      try {
        annot_type = annot_data.indexOf("MARK");
        if (annot_type == 0) {
          arrAnnotMark[countMark] = annot_data;
          countMark++;
          console.println("Counting MARK annotation: Name="+annots[i].name+", Subject="+annots[i].subject);
        }
      } catch (Error) {
        console.println("Error while counting MARK annotation: "+Error);
      }
      try {
        annot_type = annot_data.indexOf("TICK");
        if (annot_type == 0) {
          arrAnnotTick[countTick] = annot_data;
          countTick++;
          console.println("Counting TICK annotation: Name="+annots[i].name+", Subject="+annots[i].subject);
        }
      } catch (Error) {
        console.println("Error while counting TICK annotation: "+Error);
      }
      try {
        annot_type = annot_data.indexOf("HALFT");
        if (annot_type == 0) {
          arrAnnotHalfTick[countHalfTick] = annot_data;
          countHalfTick++;
          console.println("Counting HALFT annotation: Name="+annots[i].name+", Subject="+annots[i].subject);
        }
      } catch (Error) {
        console.println("Error while counting HALFT annotation: "+Error);
      }
      try {
        annot_type = annot_data.indexOf("CROSS");
        if (annot_type == 0) {
          arrAnnotCross[countCross] = annot_data;
          countCross++;
          console.println("Counting CROSS annotation: Name="+annots[i].name+", Subject="+annots[i].subject);
        }
      } catch (Error) {
        console.println("Error while counting CROSS annotation: "+Error);
      }
    }

    var annotationCountResults = "Annotation Count Results: \n ----------------------------";
    annotationCountResults += "Half Ticks: "+countHalfTick+"\n";
    annotationCountResults += "Ticks: "+countTick+"\n";
    annotationCountResults += "Crosses: "+countCross+"\n";
    annotationCountResults += "Structured Marks: "+countMark+"\n";
    annotationCountResults += "Comment Marks: "+countCommentMark+"\n";
    annotationCountResults += "Rubric Marks: "+countMark+"\n";
    console.println(annotationCountResults);


    var arrMarkM = [];
    var arrMarkQM = [];
    var quesMarkCount = 0;
    var markMarkCount = 0;
    var tempQuestion = "";
    for (var i = 0; i < arrAnnotMark.length; i++) {
      var mark_data = arrAnnotMark[i];

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

    var arrTickQM = [];
    for (var i = 0; i < arrAnnotTick.length; i++) {
      var mark_data = arrAnnotTick[i];

      var question_mark = mark_data.substring(
        mark_data.indexOf("|") + 1,
        mark_data.length
      );

      arrTickQM[i] = question_mark;
    }

    var arrHalfTickQM = [];
    for (var i = 0; i < arrAnnotHalfTick.length; i++) {
      var mark_data = arrAnnotHalfTick[i];

      var question_mark = mark_data.substring(
        mark_data.indexOf("|") + 1,
        mark_data.length
      );

      arrHalfTickQM[i] = question_mark;
    }

    var arrCrossQM = [];
    for (var i = 0; i < arrAnnotCross.length; i++) {
      var mark_data = arrAnnotCross[i];

      var question_mark = mark_data.substring(
        mark_data.indexOf("|") + 1,
        mark_data.length
      );

      arrCrossQM[i] = question_mark;
    }

    skipTotalDialog = false;
    var skipAll = false;
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
    
    var skipBuild = false;
    if (!skipAll) {
      if (!skipTotalDialog) {
        skipBuild = getTotalDialog(aNewDoc);
      } else {
        skipBuild = false;
      }

      if (!skipBuild) {
        buildResultsPage(
          aNewDoc,
          arrMarkM,
          arrMarkQM,
          arrTickQM,
          arrHalfTickQM,
          arrCrossQM
        );
      }
    }
  } else {
    app.alert("There are no marks to calculate!");
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

  if (!skipTotalDialog) {
    totalMarks = 0;
  }

  resultsPageNumber = addBlankPage(aNewDoc);

  var aRect = [0, 612, 792, 0];

  var y = 5;
  var h = 80;

  var lx = 5;
  var ly = aRect[2] - y;
  var rx = aRect[1] - 20;
  var ry = aRect[2] - h;

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

  var edtSpecial = aNewDoc.addField("ResultPage", "text", resultsPageNumber, [
    0,
    0,
    0,
    0,
  ]);
  edtSpecial.hidden = true;

  var edtFinish = aNewDoc.addField("edtFinish", "text", resultsPageNumber, [
    0,
    0,
    0,
    0,
  ]);
  edtFinish.hidden = true;

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


var getTotalDialog = app.trustedFunction(function (aNewDoc) {
    app.beginPriv();
  
    var skipTotalCount = true;
  
    if (assignmentTotal != -1) {
      skipTotalCount = false;
    }
  
    var dialog1 = {
      initialize: function (dialog) {
        var todayDate = dialog.store()["date"];
        todayDate = "Date: " + util.printd("mmmm dd, yyyy", new Date());
        dialog.load({ date: todayDate });

        // Prepopulate total
        dialog.load({ totl: assignmentTotal });
  
        var arrFileData = readCommentTextFile(aNewDoc, "TOT_ENGINE");
  
        var totalFromFile = 0;
        if (arrFileData[1] == "</empty>") {
          totalFromFile = "";
        } else {
          totalFromFile = parseInt(arrFileData[1]);
        }
        dialog.load({ totl: "" + totalFromFile });
      },
      commit: function (dialog) {
        var results = dialog.store();
  
        var total = results["totl"];
  
        var regNumber = /\D/;
        if (regNumber.test(total)) {
          skipTotalCount = true;
  
          app.alert("Only numbers are allowed!");
        } else if (total == null) {
          skipTotalCount = true;
        } else if (total > 999) {
          skipTotalCount = true;
  
          app.alert("Total cannot be greater than 999!");
        } else if (total <= 0) {
          skipTotalCount = true;
  
          app.alert("Total cannot be 0 or less than 0!");
        } else {
          assignmentTotal = total;
  
          skipTotalCount = false;
        }
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
              {
                type: "static_text",
                name: "Date: ",
  
                char_width: 25,
                item_id: "date",
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
  
    app.execDialog(dialog1);
    app.endPriv();
  
    return skipTotalCount;
  });
  
  