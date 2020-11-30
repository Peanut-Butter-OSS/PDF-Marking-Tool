/*
PDF Marking Tool (PMT)

This file contains reusable JavaScript functions related to Rubric functionality

*/

// Allow the user to select a rubric JSON file. Once the file is selected it is uploaded,
// validated and applied to the current document.
var selectRubric = app.trustedFunction(function () {
  app.beginPriv();

  aActiveDocs = app.activeDocs;
  aNewDoc = aActiveDocs[0];

  if (aNewDoc != null) {
    // Only allow rubric attachment if we have an active doc
    if (!hasRubricAttached) {
      // Document can only have one rubric at a time
      var alertMsg =
        "In the next screen, please select the required rubric file from your file system. \n\n";
      alertMsg +=
        "Once the rubric file is selected, it will be attached to the document. \n";

      var continueImport = app.alert(alertMsg, 3, 1);
      if (continueImport == 1) {
        this.importDataObject("Rubric");
        var rubric = this.getDataObject("Rubric");
        console.println("Rubric File Name: " + rubric.path);
        var oFile = this.getDataObjectContents("Rubric");
        var strRubric = util.stringFromStream(oFile, "utf-8");
        //console.println("Rubric content:");
        //console.println(strRubric);
        var jsonRubric = eval("(" + strRubric + ")");
        validationResult = validateRubric(jsonRubric);

        if (validationResult.isValid) {
          // Only proceed to attach the rubric if it passed validation
          selectedRubricContent = jsonRubric;

          // Save rubric details into document level fields. These will be read when
          // the document is opened in subsequent occasions
          var rubricFileNameField = aNewDoc.getField("RubricFileName");
          if (rubricFileNameField == null) {
            rubricFileNameField = aNewDoc.addField(
              "RubricFileName",
              "text",
              0,
              [0, 0, 0, 0]
            );
            rubricFileNameField.hidden = true;
          }
          rubricFileNameField.value = rubric.path;
          selectedRubricFileName = rubricFileNameField.value;

          var rubricNameField = aNewDoc.getField("RubricName");
          if (rubricNameField == null) {
            rubricNameField = aNewDoc.addField("RubricName", "text", 0, [
              0,
              0,
              0,
              0,
            ]);
            rubricNameField.hidden = true;
          }
          rubricNameField.value = jsonRubric.rubricName;
          selectedRubricName = rubricNameField.value;

          var rubricVersionField = aNewDoc.getField("RubricVersion");
          if (rubricVersionField == null) {
            rubricVersionField = aNewDoc.addField("RubricVersion", "text", 0, [
              0,
              0,
              0,
              0,
            ]);
            rubricVersionField.hidden = true;
          }
          rubricVersionField.value = jsonRubric.rubricVersion;
          selectedRubricVersion = rubricVersionField.value;

          // Applying Rubric to document
          makeDocumentMarkable("RUBRIC");
          rubricPageNumber = buildRubricPage();
          this.pageNum = rubricPageNumber;
          hasRubricAttached = true;
          assignmentTotal = jsonRubric.totalMarks;

          alertMsg =
            "The rubric " +
            rubric.path +
            " was successfully attached to the current document \n";
        } else {
          alertMsg =
            "The selected file (" +
            rubric.path +
            ") is not a valid rubric. The following validation errors were reported: \n\n";
          alertMsg += validationResult.validationErrors;
        }
        app.alert(alertMsg, 3, 0);
      }
    } else {
      app.alert(
        "There is already a rubric attached to the document. To replace it, you must first remove the existing rubric"
      );
    }
  } else {
    app.alert(
      "To select a rubric, you must first have single active document open"
    );
  }

  app.endPriv();
});

// Validates a rubric JSON object to ensure all the values required from a Rubric are supplied
var validateRubric = app.trustedFunction(function (rubric) {
  app.beginPriv();
  var validationResult = {
    isValid: true,
    validationErrors: "",
  };

  // TODO
  // - At least one criteria specified
  // - For each criteria:
  //    - criteriaName is specified
  //    - totalMarks is specified
  //    - At least one level specified
  //    - No duplication of criteriaId or criteriaName
  //    - For each level:
  //        - levelName is specified
  //        - levelMarks is specified
  //        - levelDefaultComment is specified
  //        - no duplication of levelName

  if (!rubric.rubricId) {
    var errorMsg = " - No rubricId was specified. \n";
    validationResult.isValid = false;
    validationResult.validationErrors += errorMsg;
  }
  if (!rubric.rubricName) {
    var errorMsg = " - No rubricName was specified. \n";
    validationResult.isValid = false;
    validationResult.validationErrors += errorMsg;
  }
  if (!rubric.rubricVersion) {
    var errorMsg = " - No rubricVersion was specified. \n";
    validationResult.isValid = false;
    validationResult.validationErrors += errorMsg;
  }
  if (!rubric.courseCode) {
    var errorMsg = " - No courseCode was specified. \n";
    validationResult.isValid = false;
    validationResult.validationErrors += errorMsg;
  }
  if (!rubric.assignmentId) {
    var errorMsg = " - No assignmentId was specified. \n";
    validationResult.isValid = false;
    validationResult.validationErrors += errorMsg;
  }
  if (!rubric.totalMarks) {
    var errorMsg = " - No totalMarks was specified. \n";
    validationResult.isValid = false;
    validationResult.validationErrors += errorMsg;
  }

  app.endPriv();
  return validationResult;
});

// Allow a user to view Rubric details from a menu option
var viewRubricDetails = app.trustedFunction(function () {
  app.beginPriv();

  var rubricName = "NO RUBRIC SELECTED";
  var rubricFileName = "Not Applicable";
  var rubricVersion = "Not Applicable";
  if (selectedRubricName) {
    rubricName = selectedRubricName;
  }
  if (selectedRubricFileName) {
    rubricFileName = selectedRubricFileName;
  }
  if (selectedRubricVersion) {
    rubricVersion = selectedRubricVersion;
  }

  var detailsString = "Rubric Tool Status: \n------------------------\n\n";
  detailsString += "Rubric Name: \t" + rubricName + "\n";
  detailsString += "Rubric File Name: \t" + rubricFileName + "\n";
  detailsString += "Rubric Version: \t" + rubricVersion + "\n";

  //console.println(detailsString);
  app.alert(detailsString, 3);

  app.endPriv();
});

// Removes a rubric from the PDF
var removeRubric = app.trustedFunction(function () {
  app.beginPriv();

  var alertMsg =
    "This action will entirely remove the rubric and all rubric marks that were added to the document. \n\n";
  alertMsg += "Are you sure \n";

  var continueDelete = app.alert(alertMsg, 1, 2);

  if (continueDelete === 4) {

    // Remove rubric-based annotations
    removeRubricBasedAnnotations();

    // Set variables to null
    selectedRubricContent = null;
    selectedRubricFileName = null;
    selectedRubricName = null;
    selectedRubricVersion = null;

    // Remove the form fields
    this.removeField("RubricFileName");
    this.removeField("RubricName");
    this.removeField("RubricVersion");

    // Reset Marking Type
    markingType = "UNKNOWN";
    markingTypeField = this.getField("MarkingType");
    if (markingTypeField != null) {
      markingTypeField.value = markingType;
    }

    // Remove the Rubric page
    this.deletePages(rubricPageNumber);
    rubricPageNumber = -1;

    // Remove Rubric data object
    this.removeDataObject("Rubric");

    hasRubricAttached = false;
  }
  app.endPriv();
});

var buildRubricPage = app.trustedFunction(function () {
  app.beginPriv();

  rubricPageNumber = addBlankPage(aNewDoc);
  var pageRect = this.getPageBox("Crop", rubricPageNumber);
  console.println(
    "Page rectangle: " +
      pageRect[0] +
      ", " +
      pageRect[1] +
      "," +
      pageRect[2] +
      ", " +
      pageRect[3]
  );
  var pageBoxWidth = pageRect[2] - pageRect[0];
  var pageBoxHeight = pageRect[1] - pageRect[3];
  console.println(
    "Rubric page (#" +
      rubricPageNumber +
      ") has a width of " +
      pageBoxWidth +
      " and a height of " +
      pageBoxHeight
  );
  // Page rectangle: 0, 792,612, 0
  // Rubric page (#1) has a width of 612 and a height of 792

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
  var rubricHeader = aNewDoc.addField(
    "rubricHeader",
    "text",
    rubricPageNumber,
    [leftX, topY, rightX, bottomY]
  );
  rubricHeader.value = "Marking Rubric";
  rubricHeader.readonly = true;
  rubricHeader.alignment = "center";
  rubricHeader.fillColor = color.white;
  currentTopY = bottomY - 1;

  // Course Code
  topY = currentTopY;
  bottomY = currentTopY - lineHeight;
  leftX = 0;
  rightX = 100;
  var labelCourseCode = aNewDoc.addField(
    "labelCourseCode",
    "text",
    rubricPageNumber,
    [leftX, topY, rightX, bottomY]
  );
  labelCourseCode.value = "Course Code";
  labelCourseCode.readonly = true;
  labelCourseCode.alignment = "left";
  labelCourseCode.fillColor = color.ltGray;

  leftX = rightX + 1;
  rightX = xMax;
  var valueCourseCode = aNewDoc.addField(
    "valueCourseCode",
    "text",
    rubricPageNumber,
    [leftX, topY, rightX, bottomY]
  );
  valueCourseCode.value = selectedRubricContent.courseCode;
  valueCourseCode.readonly = true;
  valueCourseCode.alignment = "left";
  valueCourseCode.fillColor = color.white;
  currentTopY = bottomY - 1;

  // Assignment
  topY = currentTopY;
  bottomY = currentTopY - lineHeight;
  leftX = 0;
  rightX = 100;
  var labelAssignmentId = aNewDoc.addField(
    "labelAssignmentId",
    "text",
    rubricPageNumber,
    [leftX, topY, rightX, bottomY]
  );
  labelAssignmentId.value = "Assignment";
  labelAssignmentId.readonly = true;
  labelAssignmentId.alignment = "left";
  labelAssignmentId.fillColor = color.ltGray;

  leftX = rightX + 1;
  rightX = xMax;
  var valueAssignmentId = aNewDoc.addField(
    "valueAssignmentId",
    "text",
    rubricPageNumber,
    [leftX, topY, rightX, bottomY]
  );
  valueAssignmentId.value = selectedRubricContent.assignmentId;
  valueAssignmentId.readonly = true;
  valueAssignmentId.alignment = "left";
  valueAssignmentId.fillColor = color.white;
  currentTopY = bottomY - 1;

  // Header row for criteria table
  topY = currentTopY - 20;
  bottomY = topY - lineHeight;
  addRubricCriterionHeader(topY, bottomY);
  currentTopY = bottomY - 1;

  // Now build individual entries for each element in the Rubric
  var i;
  for (i = 0; i < selectedRubricContent.criteria.length; i++) {
    leftX = 0;
    topY = currentTopY;
    bottomY = currentTopY - lineHeight;
    addRubricCriterionRow(
      selectedRubricContent.criteria[i],
      leftX,
      topY,
      rightX,
      bottomY
    );
    currentTopY = bottomY - 1;
  }

  app.endPriv();
  return rubricPageNumber;
});

var addRubricCriterionHeader = app.trustedFunction(function (topY, bottomY) {
  app.beginPriv();

  leftX = 0;

  // Col 1
  colWidth = 100;
  rightX = leftX + colWidth;
  var rubricCriteriaCol1Header = aNewDoc.addField(
    "rubricCriteriaCol1Header",
    "text",
    rubricPageNumber,
    [leftX, topY, rightX, bottomY]
  );
  rubricCriteriaCol1Header.value = "Criterion";
  rubricCriteriaCol1Header.readonly = true;
  rubricCriteriaCol1Header.alignment = "center";
  rubricCriteriaCol1Header.fillColor = color.white;
  leftX = rightX + 1;

  // Col 2
  colWidth = 150;
  rightX = leftX + colWidth;
  var rubricCriteriaCol2Header = aNewDoc.addField(
    "rubricCriteriaCol2Header",
    "text",
    rubricPageNumber,
    [leftX, topY, rightX, bottomY]
  );
  rubricCriteriaCol2Header.value = "Level";
  rubricCriteriaCol2Header.readonly = true;
  rubricCriteriaCol2Header.alignment = "center";
  rubricCriteriaCol2Header.fillColor = color.white;
  rubricCriteriaCol2Header.borderStyle = "solid";
  leftX = rightX + 1;

  // Col 3
  colWidth = 207;
  rightX = leftX + colWidth;
  var rubricCriteriaCol3Header = aNewDoc.addField(
    "rubricCriteriaCol3Header",
    "text",
    rubricPageNumber,
    [leftX, topY, rightX, bottomY]
  );
  rubricCriteriaCol3Header.value = "Comments";
  rubricCriteriaCol3Header.readonly = true;
  rubricCriteriaCol3Header.alignment = "center";
  rubricCriteriaCol3Header.fillColor = color.white;
  rubricCriteriaCol2Header.borderStyle = "solid";
  leftX = rightX + 1;

  // Col 4
  colWidth = 50;
  rightX = leftX + colWidth;
  var rubricCriteriaCol4Header = aNewDoc.addField(
    "rubricCriteriaCol4Header",
    "text",
    rubricPageNumber,
    [leftX, topY, rightX, bottomY]
  );
  rubricCriteriaCol4Header.value = "Marks";
  rubricCriteriaCol4Header.readonly = true;
  rubricCriteriaCol4Header.alignment = "center";
  rubricCriteriaCol4Header.fillColor = color.white;
  rubricCriteriaCol2Header.borderStyle = "solid";
  leftX = rightX + 1;

  // Col 5
  colWidth = 50;
  rightX = leftX + colWidth;
  var rubricCriteriaCol5Header = aNewDoc.addField(
    "rubricCriteriaCol5Header",
    "text",
    rubricPageNumber,
    [leftX, topY, rightX, bottomY]
  );
  rubricCriteriaCol5Header.value = "Out of";
  rubricCriteriaCol5Header.readonly = true;
  rubricCriteriaCol5Header.alignment = "center";
  rubricCriteriaCol5Header.fillColor = color.white;
  rubricCriteriaCol2Header.borderStyle = "solid";
  leftX = rightX + 1;

  app.endPriv();
});

// TODO: Should return the row height that was actually used, so that we can dynamically adjust
// TODO: Need to add a method to re-layout the table based on the length of the text.
var addRubricCriterionRow = app.trustedFunction(function (
  criterion,
  leftX,
  topY,
  rightX,
  bottomY
) {
  app.beginPriv();

  var colWidth = 0;

  // Col 1
  colWidth = 100;
  rightX = leftX + colWidth;
  var col1FieldName = "col1" + criterion.criterionId;
  var col1Field = aNewDoc.addField(col1FieldName, "text", rubricPageNumber, [
    leftX,
    topY,
    rightX,
    bottomY,
  ]);
  col1Field.value = criterion.criterionName;
  col1Field.readonly = true;
  col1Field.alignment = "left";
  col1Field.fillColor = color.ltGray;
  leftX = rightX + 1;

  // Col 2
  colWidth = 150;
  rightX = leftX + colWidth;
  var col2FieldName = "col2" + criterion.criterionId;
  var col2Field = aNewDoc.addField(
    col2FieldName,
    "combobox",
    rubricPageNumber,
    [leftX, topY, rightX, bottomY]
  );

  var n;
  for (n = 0; n < criterion.levels.length; n++) {
    col2Field.insertItemAt(criterion.levels[n].levelName);
  }
  col2Field.insertItemAt("Awaiting Marker ...");
  col2Field.fillColor = color.ltGray;
  var cscript =
    "catchCriterionLevelChange('" + criterion.criterionId + "',event);";
  col2Field.setAction("Keystroke", cscript);
  col2Field.commitOnSelChange = "true";
  leftX = rightX + 1;

  // Col 3 "Comments"
  colWidth = 207;
  rightX = leftX + colWidth;
  var col3FieldName = "col3" + criterion.criterionId;
  var col3Field = aNewDoc.addField(col3FieldName, "text", rubricPageNumber, [
    leftX,
    topY,
    rightX,
    bottomY,
  ]);
  col3Field.multiline = true;
  col3Field.alignment = "left";
  col3Field.fillColor = color.ltGray;
  leftX = rightX + 1;

  // Col 4 "Marks"
  colWidth = 50;
  rightX = leftX + colWidth;
  var col4FieldName = "col4" + criterion.criterionId;
  var col4Field = aNewDoc.addField(col4FieldName, "text", rubricPageNumber, [
    leftX,
    topY,
    rightX,
    bottomY,
  ]);
  col4Field.alignment = "right";
  col4Field.fillColor = color.ltGray;
  leftX = rightX + 1;

  // Col 5 "Out of"
  colWidth = 50;
  rightX = leftX + colWidth;
  var col5FieldName = "col5" + criterion.criterionId;
  var col5Field = aNewDoc.addField(col5FieldName, "text", rubricPageNumber, [
    leftX,
    topY,
    rightX,
    bottomY,
  ]);
  col5Field.value = criterion.totalMarks;
  col5Field.readonly = true;
  col5Field.alignment = "right";
  col5Field.fillColor = color.ltGray;
  leftX = rightX + 1;

  // Col 6 (Invisible field to store page of linked annotation)
  colWidth = 0;
  rightX = leftX + colWidth;
  var col6FieldName = "col6" + criterion.criterionId;
  var col6Field = aNewDoc.addField(col6FieldName, "text", rubricPageNumber, [
    leftX,
    topY,
    rightX,
    bottomY,
  ]);
  col6Field.value = 0;
  col6Field.hidden = true;
  leftX = rightX;

  // Col 7 (Invisible field to store annotation name of linked annotation)
  colWidth = 0;
  rightX = leftX + colWidth;
  var col7FieldName = "col7" + criterion.criterionId;
  var col7Field = aNewDoc.addField(col7FieldName, "text", rubricPageNumber, [
    leftX,
    topY,
    rightX,
    bottomY,
  ]);
  col7Field.value = "";
  col7Field.hidden = true;
  leftX = rightX;

  // Col 8 (Button to go to the annotation)
  colWidth = 25;
  rightX = leftX + colWidth;
  var col8FieldName = "col8" + criterion.criterionId;
  var col8Field = aNewDoc.addField(col8FieldName, "button", rubricPageNumber, [
    leftX,
    topY,
    rightX,
    bottomY,
  ]);
  col8Field.fillColor = color.ltGray;
  col8Field.borderStyle = border.b;
  col8Field.display = display.noPrint;
  col8Field.highlight = "push";
  col8Field.lineWidth = 2;
  col8Field.hidden = true;
  leftX = rightX + 1;

  app.endPriv();
});

// This method catches the event when a user picks a new level value for
// a single rubric item
var catchCriterionLevelChange = app.trustedFunction(function (
  criterionId,
  event
) {
  app.beginPriv();

  // Only executing when the new value is committed
  if (event.willCommit) {
    console.println(
      "Changing selection for criterion: " + criterionId + " to " + event.value
    );

    // Get the default comment and marks from the Rubric:
    var newLevel = event.value;
    var rubricSpec = retrieveDefaultCommentAndMarkFromRubric(
      criterionId,
      newLevel
    );
    updateRubricCriterionCommentsAndMarks(
      criterionId,
      rubricSpec.rubricComment,
      rubricSpec.rubricMark
    );
  }

  app.endPriv();
});

// This method catches the event when a user picks a new level value for
// a single rubric item
var retrieveDefaultCommentAndMarkFromRubric = app.trustedFunction(function (
  criterionId,
  level
) {
  app.beginPriv();

  var response = {
    rubricComment: "",
    rubricMark: 0,
  };

  var i;
  var rubricComment = "";
  var rubricMark = 0;
  for (i = 0; i < selectedRubricContent.criteria.length; i++) {
    if (selectedRubricContent.criteria[i].criterionId === criterionId) {
      var n;
      for (n = 0; n < selectedRubricContent.criteria[i].levels.length; n++) {
        if (selectedRubricContent.criteria[i].levels[n].levelName === level) {
          rubricComment =
            selectedRubricContent.criteria[i].levels[n].levelDefaultComment;
          rubricMark = selectedRubricContent.criteria[i].levels[n].levelMarks;
          break;
        }
      }
      break;
    }
  }

  response.rubricComment = rubricComment;
  response.rubricMark = rubricMark;

  console.println(
    "Found rubric spec: Mark=" + rubricMark + ", Comment=" + rubricComment
  );

  app.endPriv();
  return response;
});

// This method populates the rubric Comments and Marks values for a specific criterion
var updateRubricCriterionCommentsAndMarks = app.trustedFunction(function (
  criterionId,
  comment,
  marks
) {
  app.beginPriv();

  console.println(
    "Updating marks and comment of criterion " +
      criterionId +
      " to: " +
      marks +
      " -- " +
      comment
  );

  var commentFieldName = "col3" + criterionId;
  var commentField = this.getField(commentFieldName);
  commentField.value = comment;
  var markFieldName = "col4" + criterionId;
  var markField = aNewDoc.getField(markFieldName);
  markField.value = marks;

  app.endPriv();
});

// This method allows setting the criterion level on the rubric from any dialog in the
// application. Once the level is updated, it will automatically trigger the update of the
// Marks and comment
var updateCriterionLevel = app.trustedFunction(function (criterionId, level) {
  app.beginPriv();

  console.println(
    "Changing selection for criterion: " + criterionId + " to " + level
  );

  var levelFieldName = "col2" + criterionId;
  var levelField = this.getField(levelFieldName);
  levelField.value = level;

  app.endPriv();
});

// This method allows the automatically selected comment to be overridden
// This is needed when a Rubric mark is applied but the marks are adjusted
var overrideCriterionComment = app.trustedFunction(function (
  criterionId,
  comment
) {
  app.beginPriv();

  console.println(
    "Overriding comment for criterion: " + criterionId + " to " + comment
  );

  var commentFieldName = "col3" + criterionId;
  var commentField = this.getField(commentFieldName);
  commentField.value = comment;

  app.endPriv();
});

// This method allows the automatically selected mark to be overridden
// This is needed when a Rubric mark is applied with custom comments
var overrideCriterionMark = app.trustedFunction(function (criterionId, mark) {
  app.beginPriv();

  console.println(
    "Overriding mark for criterion: " + criterionId + " to " + mark
  );

  var markFieldName = "col4" + criterionId;
  var markField = this.getField(markFieldName);
  markField.value = mark;

  app.endPriv();
});

// When a rubric mark is applied via the toolbar, we link the table row with the annotation
// by setting two inivible columns in the table row. At this point we also make the button active
var addAnnotationDetailsToRubricCriterion = app.trustedFunction(function (
  criterionId,
  annotPage,
  annotName
) {
  app.beginPriv();

  console.println(
    "Linking rubric table row for " +
      criterionId +
      " to with annotation: " +
      annotName +
      "on page " +
      annotPage
  );

  var annotPageFieldName = "col6" + criterionId;
  var annotPageField = this.getField(annotPageFieldName);
  annotPageField.value = annotPage;

  var annotNameFieldName = "col7" + criterionId;
  var annotNameField = this.getField(annotNameFieldName);
  annotNameField.value = annotName;

  var navButtonFieldName = "col8" + criterionId;
  var navButtonField = this.getField(navButtonFieldName);
  var cmd = "goToAnnotation(" + annotPage + ",'" + annotName + "')";
  navButtonField.setAction("MouseUp", cmd);
  navButtonField.buttonSetCaption("p" + annotPage);
  navButtonField.hidden = false;

  app.endPriv();
});

// When marking via Rubric, this method determines whether a specific criterion has already been marked
// This allows the Rubric marking tool to always default to the next unmarked question
var criterionIsAlreadyMarked = app.trustedFunction(function (criterionId) {
  app.beginPriv();

  var isMarked = false;
  console.println(
    "Checking if we already have a level for criterion: " + criterionId
  );
  var levelFieldName = "col2" + criterionId;
  var levelField = this.getField(levelFieldName);

  if (levelField.value === "Awaiting Marker ...") {
    isMarked = false;
  } else {
    isMarked = true;
  }

  app.endPriv();
  return isMarked;
});
