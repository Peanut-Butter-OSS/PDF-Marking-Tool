/*
PDF Marking Tool (PMT)

This script contains everything related to calculating results and producing the results page.

The process for counting marks is as follows:
 - First collect all annotations that were created from the PMT tools.
 - Enrich each annotation by embedding it in a JSON object that contains the annotation, its type, its value and optionally the criterion it applies to
 - Store the annotations in a set of arrays, according to type
 - TODO

*/

// Main method that is called by the Count tool
var countMarks = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  deselectCurrentTool(aNewDoc);
  deleteResultsPage(aNewDoc);
  var arrPmtAnnotations = collectAllEnrichedAnnotations(aNewDoc);
  var arrCriteriaNames = collectAllMarkingCriteriaNames(aNewDoc, arrPmtAnnotations);
  
  // Create the marks summary object, which contains the criteria 
  // along with the marks for each criteria
  var marksSummary = [];
  for (var i = 0; i < arrCriteriaNames.length; i++) {
    marksSummary[i] = [];
    marksSummary[i][0] = arrCriteriaNames[i];
  }
  
  // console.println("Summary of marks before we begin allocating to criteria:");
  // printMarksSummary(marksSummary);

  if (arrPmtAnnotations.totalPmtAnnotCount > 0) {
    marksSummary = populateMarksSummary(marksSummary, arrPmtAnnotations);
    var totalDialog = getTotalDialog(aNewDoc);
    var dialogResult = app.execDialog(totalDialog);
    console.println(
      "Result from the total dialog: " + dialogResult
    );

    if (dialogResult === "ok") {
      resultsPageNumber = buildResultsPage(
        aNewDoc,
        marksSummary
      );

      this.pageNum = resultsPageNumber;
    }
  }

  app.endPriv();
});

// This function will create the results page
// Arguments:
//  - aNewDoc: The document being marked
//  - marksSummary: 2D array containing all mark values, categorised by criteria
var buildResultsPage = app.trustedFunction(function (
  aNewDoc,
  marksSummary
) {
  app.beginPriv();

  totalMarks = 0;
  resultsPageNumber = createResultsPage(aNewDoc);

  var pageRect = this.getPageBox("Crop", resultsPageNumber);
  var pageBoxWidth = pageRect[2] - pageRect[0];
  var pageBoxHeight = pageRect[1] - pageRect[3];
  console.println(
    "Results page (#" +
    resultsPageNumber +
      ") has a width of " +
      pageBoxWidth +
      " and a height of " +
      pageBoxHeight
  );

  var lineHeight = 20;
  var lineWidth = pageBoxWidth;

  var yMax = pageBoxHeight;
  var topY = 0;
  var bottomY = 0;

  var xMax = pageBoxWidth;
  var leftX = 0;
  var rightX = 0;

  var currentTopY = yMax;

  // Header
  topY = currentTopY;
  bottomY = currentTopY - 40;
  leftX = 0;
  rightX = xMax;
  var resultsHeader = aNewDoc.addField(
    "resultsHeader",
    "text",
    resultsPageNumber,
    [leftX, topY, rightX, bottomY]
  );
  resultsHeader.value = "Results";
  resultsHeader.readonly = true;
  resultsHeader.alignment = "center";
  resultsHeader.fillColor = color.white;
  currentTopY = bottomY - 1;

  // Header row for marks table
  leftX = 50;
  topY = currentTopY - 20;
  bottomY = topY - lineHeight;
  addResultsTableHeader(resultsPageNumber, leftX, topY, bottomY);
  currentTopY = bottomY - 1;

  // Now build individual lines for each marking category
  var i;
  for (i = 0; i < marksSummary.length; i++) {
    leftX = 50;
    topY = currentTopY;
    bottomY = currentTopY - lineHeight;
    addResultsTableRow(resultsPageNumber, i,
      marksSummary[i][0],
      marksSummary[i],
      leftX,
      topY,
      rightX,
      bottomY
    );
    currentTopY = bottomY - 1;
  }

  totalMarks = countTotalMarksAllocated(marksSummary);

  if (totalMarks > assignmentTotal) {
    app.alert("You have entered a total that is less then the given marks!", 1);
  }

  addFinishStatusField(aNewDoc);
  addFinishButton(aNewDoc);

  // Add the total score
  currentTopY = currentTopY - 20;
  leftX = 50;
  topY = currentTopY;
  rightX = xMax;
  bottomY = currentTopY - lineHeight;
  addTotalScoreLine(aNewDoc, totalMarks, assignmentTotal, resultsPageNumber, leftX, topY, rightX, bottomY);

  app.endPriv();
  return resultsPageNumber;
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

// Utility method that just adds up all the marks in the marksSummary
var countTotalMarksAllocated = app.trustedFunction(function (marksSummary) {
  app.beginPriv();

  var totalMarks = 0;
  for (var i = 0; i < marksSummary.length; i++) {
    for (var m = 1; m < marksSummary[i].length; m++) {
      totalMarks = totalMarks + parseFloat(marksSummary[i][m]);
    }
  }

  app.endPriv();
  return totalMarks;
});

// Add a static header for the results table
var addResultsTableHeader = app.trustedFunction(function (resultsPageNumber, leftX, topY, bottomY) {
  app.beginPriv();

  // Col 1
  colWidth = 450;
  rightX = leftX + colWidth;
  var resultsCol1Header = aNewDoc.addField(
    "resultsCol1Header",
    "text",
    resultsPageNumber,
    [leftX, topY, rightX, bottomY]
  );
  resultsCol1Header.value = "Criterion";
  resultsCol1Header.readonly = true;
  resultsCol1Header.alignment = "left";
  resultsCol1Header.fillColor = color.white;
  leftX = rightX + 1;

  // Col 2
  colWidth = 50;
  rightX = leftX + colWidth;
  var resultsCol2Header = aNewDoc.addField(
    "resultsCol2Header",
    "text",
    resultsPageNumber,
    [leftX, topY, rightX, bottomY]
  );
  resultsCol2Header.value = "Marks";
  resultsCol2Header.readonly = true;
  resultsCol2Header.alignment = "center";
  resultsCol2Header.fillColor = color.white;
  resultsCol2Header.borderStyle = "solid";
  leftX = rightX + 1;

  app.endPriv();
});

// Add a single row to the results table
var addResultsTableRow = app.trustedFunction(function (
  resultsPageNumber,
  rowIndex,
  criterionName,
  arrMarkValues,
  leftX,
  topY,
  rightX,
  bottomY
) {
  app.beginPriv();

  var colWidth = 0;

  // Col 1
  colWidth = 450;
  rightX = leftX + colWidth;
  var col1FieldName = "resultsCol1Row" + rowIndex;
  var col1Field = aNewDoc.addField(col1FieldName, "text", resultsPageNumber, [
    leftX,
    topY,
    rightX,
    bottomY,
  ]);
  col1Field.value = criterionName;
  col1Field.readonly = true;
  col1Field.alignment = "left";
  col1Field.fillColor = color.ltGray;
  leftX = rightX + 1;

  // Count all the marks together
  // We start counting at index 1, because the 0 slot is used for the criterion name
  var marksSubTotal = 0;
  for (var m=1; m<arrMarkValues.length; m++) {
    marksSubTotal = marksSubTotal + parseFloat(arrMarkValues[m])
  }

  // Col 2
  colWidth = 50;
  rightX = leftX + colWidth;
  var col2FieldName = "resultsCol2Row" + rowIndex;
  var col2Field = aNewDoc.addField(
    col2FieldName,
    "text",
    resultsPageNumber,
    [leftX, topY, rightX, bottomY]
  );
  col2Field.value = marksSubTotal;
  col2Field.readonly = true;
  col2Field.alignment = "right";
  col2Field.fillColor = color.ltGray;

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

// Iterate over the collected annotations and build an array of all the criteria used
// for marking throughout the document.
var collectAllMarkingCriteriaNames = app.trustedFunction(function (aNewDoc, arrPmtAnnotations) {
  app.beginPriv();

  var arrCriteriaNames = [];
  var criteriaCount = 0;
  
  // Add a "dummy" criteria for all marks that do not have explicitly defined criteria
  arrCriteriaNames[criteriaCount] = "No Criterion";
  criteriaCount++;

  // If there is a rubric associated with this assignment, add all the criteria from the rubric
  if (hasRubricAttached) {
    for (var r = 0; r < selectedRubricContent.criteria.length; r++) {
      var criterionName = selectedRubricContent.criteria[r].criterionName.trim();
      if (!arrayContainsString(arrCriteriaNames, criterionName)) {
        arrCriteriaNames[criteriaCount] = criterionName;
        criteriaCount++;
      }
    }
  }

  // Now iterate over all marks annotations that were created using the Mark
  // tool. If the mark has a criteria specified, add it to the array
  for (var m = 0; m < arrPmtAnnotations.arrAnnotMark.length; m++) {
    var pmtMarkAnnot = arrPmtAnnotations.arrAnnotMark[m];
    if ((pmtMarkAnnot.criterion) && (pmtMarkAnnot.criterion != "UNDEFINED")) {
      if (!arrayContainsString(arrCriteriaNames, pmtMarkAnnot.criterion)) {
        arrCriteriaNames[criteriaCount] = pmtMarkAnnot.criterion.trim();
        criteriaCount++;
      }
    }
  }

  // Now iterate over all marks annotations that were created using the Comment Mark
  // tool. If the mark has a criteria specified, add it to the array
  for (var c = 0; c < arrPmtAnnotations.arrAnnotCommentMark.length; c++) {
    var pmtCommentMarkAnnot = arrPmtAnnotations.arrAnnotCommentMark[c];
    if ((pmtCommentMarkAnnot.criterion) && (pmtCommentMarkAnnot.criterion != "UNDEFINED")) {
      if (!arrayContainsString(arrCriteriaNames, pmtCommentMarkAnnot.criterion)) {
        arrCriteriaNames[criteriaCount] = pmtCommentMarkAnnot.criterion.trim();
        criteriaCount++;
      }
    }
  }

  app.endPriv();
  return arrCriteriaNames;
});

// Iterate through each of the annotation type arrays, adding the marks into
// the marksSummary
var populateMarksSummary = app.trustedFunction(function (marksSummary, arrPmtAnnotations) {
  app.beginPriv();

      // Iterate over all marks that were created with the "MARK" tool
    // If a criterion was supplied, add the mark value to the relevant criterion array in marksSummary,
    // else add it to the No Criterion array in marksSummary
    for (var i = 0; i < arrPmtAnnotations.arrAnnotMark.length; i++) {
      var pmtMarkAnnot = arrPmtAnnotations.arrAnnotMark[i];
      console.println("Classifying MARK annotation: "+pmtMarkAnnot.criterion+"("+pmtMarkAnnot.value+")");
      var summaryIndex = 0;
      var entryCounter = 0;
      var criterionName = "";
      if (pmtMarkAnnot.criterion === "UNDEFINED") {
        criterionName = "No Criterion";
      } else {
        criterionName = pmtMarkAnnot.criterion;
      }

      summaryIndex = getCriterionIndexInMarksSummary(criterionName, marksSummary);
      entryCounter = marksSummary[summaryIndex].length;
      marksSummary[summaryIndex][entryCounter] = pmtMarkAnnot.value;
    }

    // Iterate over all marks that were created with the "COMMENT MARK" tool
    // If a criterion was supplied, add the mark value to the relevant criterion array in marksSummary,
    // else add it to the No Criterion array in marksSummary
    for (var i = 0; i < arrPmtAnnotations.arrAnnotCommentMark.length; i++) {
      var pmtCommentMarkAnnot = arrPmtAnnotations.arrAnnotCommentMark[i];
      console.println("Classifying COMMENT MARK annotation: "+pmtCommentMarkAnnot.criterion+"("+pmtCommentMarkAnnot.value+")");
      var summaryIndex = 0;
      var entryCounter = 0;
      var criterionName = "";
      if (pmtCommentMarkAnnot.criterion === "UNDEFINED") {
        criterionName = "No Criterion";
      } else {
        criterionName = pmtCommentMarkAnnot.criterion;
      }

      summaryIndex = getCriterionIndexInMarksSummary(criterionName, marksSummary);
      entryCounter = marksSummary[summaryIndex].length;
      marksSummary[summaryIndex][entryCounter] = pmtCommentMarkAnnot.value;
    }

    // Iterate over all marks that were created with the "RUBRIC MARK" tool
    // If a criterion was supplied, add the mark value to the relevant criterion array in marksSummary,
    // else add it to the No Criterion array in marksSummary
    for (var i = 0; i < arrPmtAnnotations.arrAnnotRubricMark.length; i++) {
      var pmtRubricMarkAnnot = arrPmtAnnotations.arrAnnotRubricMark[i];
      console.println("Classifying RUBRIC MARK annotation: "+pmtRubricMarkAnnot.criterion+"("+pmtRubricMarkAnnot.value+")");
      var summaryIndex = 0;
      var entryCounter = 0;
      var criterionName = "";
      if (pmtRubricMarkAnnot.criterion === "UNDEFINED") {
        criterionName = "No Criterion";
      } else {
        criterionName = pmtRubricMarkAnnot.criterion;
      }

      summaryIndex = getCriterionIndexInMarksSummary(criterionName, marksSummary);
      entryCounter = marksSummary[summaryIndex].length;
      marksSummary[summaryIndex][entryCounter] = pmtRubricMarkAnnot.value;
    }

    // Iterate over all marks that were created with the "TICK" tool
    // Since ticks are not associated with criteria, all marks are added
    // to the No Criterion array in marksSummary
    for (var i = 0; i < arrPmtAnnotations.arrAnnotTick.length; i++) {
      var pmtTickAnnot = arrPmtAnnotations.arrAnnotTick[i];
      console.println("Classifying TICK annotation: "+pmtTickAnnot.value);
      var summaryIndex = 0;
      var entryCounter = 0;
      var criterionName = "No Criterion";
      summaryIndex = getCriterionIndexInMarksSummary(criterionName, marksSummary);
      entryCounter = marksSummary[summaryIndex].length;
      marksSummary[summaryIndex][entryCounter] = pmtTickAnnot.value;
    }

    // Iterate over all marks that were created with the "HALF TICK" tool
    // Since half ticks are not associated with criteria, all marks are added
    // to the No Criterion array in marksSummary
    for (var i = 0; i < arrPmtAnnotations.arrAnnotHalfTick.length; i++) {
      var pmtHalfTickAnnot = arrPmtAnnotations.arrAnnotHalfTick[i];
      console.println("Classifying HALF TICK annotation: "+pmtHalfTickAnnot.value);
      var summaryIndex = 0;
      var entryCounter = 0;
      var criterionName = "No Criterion";
      summaryIndex = getCriterionIndexInMarksSummary(criterionName, marksSummary);
      entryCounter = marksSummary[summaryIndex].length;
      marksSummary[summaryIndex][entryCounter] = pmtHalfTickAnnot.value;
    }

    printMarksSummary(marksSummary);

  app.endPriv();
  return marksSummary;
});

// Utility method that prints the marksSummary object to the console
var printMarksSummary = app.trustedFunction(function (marksSummary) {
  app.beginPriv();

  var strSummary = "Marks Summary: \n"

  for (var i = 0; i < marksSummary.length; i++) {
    strSummary += "|"+marksSummary[i][0]+"|";
    strSummary += ": "

    for (var n = 1; n < marksSummary[i].length; n++) {
      strSummary += marksSummary[i][n];
      if (n < marksSummary[i].length-1 ) {
        strSummary += ", "
      }
    }

    strSummary += "\n"
  }
  console.println(strSummary);
  app.endPriv();
});

// Search for a specified criterion in the marksSummary 2D array
// Return the index of the criterion
var getCriterionIndexInMarksSummary = app.trustedFunction(function (criterion, marksSummary) {
  app.beginPriv();

  console.println("Finding index of "+criterion+" the marksSummary 2D array");
  var index = -1;

  for (var i = 0; i < marksSummary.length; i++) {
    if (marksSummary[i][0]==criterion) {
      index = i;
      break;
    }
  }

  console.println("Index is: "+index);
  app.endPriv();
  return index;
});