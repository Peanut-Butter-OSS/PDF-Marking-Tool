/*

This file contains reusable JavaScript functions related to Rubric functionality

TODO - On loading of a new document we should:
    - Check if a Rubric is selected (in global variables)
    - Check if the Rubric file is attached to the document as a DataObject
    - If not attached, import it from the Rubrics folder


*/

var selectRubric = app.trustedFunction(
    function () {
        app.beginPriv();

        // TODO - Check that document doesn't already have a Rubric applied, this  looks at two things:
        //  - An attachment titled "Rubric"
        //  - A Rubric page

        aActiveDocs = app.activeDocs;
        aNewDoc = aActiveDocs[0];
        if (aNewDoc != null) {
            var alertMsg = "In the next screen, please select the required Rubric file from your file system. \n\n";
            alertMsg += "Once the rubric file is selected, it will be attached to the document, but the marking sheet will not automatically appear \n";

            var continueImport = app.alert(alertMsg, 3, 1);
            if (continueImport == 1) {
                this.importDataObject("Rubric");
                var rubric = this.getDataObject("Rubric")
                console.println("Rubric File Name: " + rubric.path)
                var oFile = this.getDataObjectContents("Rubric");
                var strRubric = util.stringFromStream(oFile, "utf-8");
                //console.println("Rubric content:");
                //console.println(strRubric);
                var jsonRubric = eval("(" + strRubric + ")");
                //console.println("Parsed Rubric:");
                //console.println(" - rubricId: " + jsonRubric.rubricId);
                //console.println(" - courseCode: " + jsonRubric.courseCode);
                //console.println(" - assignmentId: " + jsonRubric.assignmentId);
                //console.println(" - Sections (" + jsonRubric.sections.length + "): ");
                //var i;
                //for (i = 0; i < jsonRubric.sections.length; i++) {
                //    console.println("    - sectionName=" + jsonRubric.sections[i].sectionName + "\t totalMarks=" + jsonRubric.sections[i].totalMarks);
                //}

                validationResult = validateRubric(jsonRubric);

                if (validationResult.isValid) {
                    global.selectedRubricContent = jsonRubric;
                    global.setPersistent("selectedRubricContent", true);
                    global.selectedRubricFileName = rubric.path;
                    global.setPersistent("selectedRubricFileName", true);
                    global.selectedRubricName = jsonRubric.rubricName;
                    global.setPersistent("selectedRubricName", true);
                    global.selectedRubricVersion = jsonRubric.rubricVersion;
                    global.setPersistent("selectedRubricVersion", true);

                    alertMsg = "The rubric " + rubric.path + " was successfully attached to the current document \n\n";
                    alertMsg += "To add the rubric marking sheet to the document, select the 'Add Rubric Marking Sheet' tool"
                } else {
                    alertMsg = "The selected file (" + rubric.path + ") is not a valid Rubric. The following validation errors were reported: \n\n";
                    alertMsg += validationResult.validationErrors;
                }

                app.alert(alertMsg, 3, 0);
            }
        } else {
            app.alert("To select a Rubric, you must first have single active document open");
        }

        app.endPriv();
    }
);

var validateRubric = app.trustedFunction(
    function (rubric) {
        app.beginPriv();
        var validationResult = {
            isValid: true,
            validationErrors: ""
        }

        // TODO
        // - rubricId is specified
        // - rubricName is specified
        // - rubricVersion is specified
        // - courseCode Specified
        // - assignmentId specified
        // - At least one section specified
        // - For each section:
        //    - sectionName is specified
        //    - totalMarks is specified
        //    - At least one markerOption specified
        //    - No duplication of sectionId or Section name
        //    - For each markerOption:
        //        - optionName is specified
        //        - optionMarks is specified
        //        - optionDefaultComment is specified
        //        - no duplication of optionName

        if (!rubric.rubricId) {
            var errorMsg = " - No rubricId was specified. \n";
            validationResult.isValid = false;
            validationResult.validationErrors += errorMsg;
        }

        app.endPriv();
        return validationResult;
    }
);

var viewRubricDetails = app.trustedFunction(
    function () {
        app.beginPriv();

        var rubricName = "NO RUBRIC SELECTED";
        var rubricFileName = "Not Applicable";
        var rubricVersion = "Not Applicable";
        if (global.selectedRubricName) {
            rubricName = global.selectedRubricName;
        }
        if (global.selectedRubricFileName) {
            rubricFileName = global.selectedRubricFileName;
        }
        if (global.selectedRubricVersion) {
            rubricVersion = global.selectedRubricVersion;
        }

        var detailsString = "Rubric Tool Status: \n------------------------\n\n";
        detailsString += "Rubric Name: \t" + rubricName + "\n";
        detailsString += "Rubric File Name: \t" + rubricFileName + "\n";
        detailsString += "Rubric Version: \t" + rubricVersion + "\n";

        //console.println(detailsString);
        app.alert(detailsString, 3);

        app.endPriv();
    }
);

var clearRubricSelection = app.trustedFunction(
    function () {
        app.beginPriv();

        global.selectedRubricContent = null;
        global.setPersistent("selectedRubricContent", true);
        global.selectedRubricFileName = null;
        global.setPersistent("selectedRubricFileName", true);
        global.selectedRubricName = null;
        global.setPersistent("selectedRubricName", true);
        global.selectedRubricVersion = null;
        global.setPersistent("selectedRubricVersion", true);

        app.endPriv();
    }
);

var applyRubricToDocument = app.trustedFunction(
    function () {
        app.beginPriv();

        aActiveDocs = app.activeDocs;
        aNewDoc = aActiveDocs[0];
        if (aNewDoc != null) {

            if ((global.selectedRubricName) &&
                (global.selectedRubricFileName) &&
                (global.selectedRubricVersion) &&
                global.selectedRubricContent) {

                console.println("Applying Rubric to document");
              
                makeDocumentMarkable("RUBRIC");

                var rubricPageNumber = buildRubricPage();
                this.pageNum = rubricPageNumber;


            } else {
                var errorMsg = "Cannot apply rubric to current document, no Rubric has been selected";
                console.println(errorMsg)
                app.alert(errorMsg);
            }

        } else {
            var errorMsg = "Cannot apply rubric because there is no currently active document. Please ensure you have a single document open before applying the rubric";
            console.println(errorMsg)
            app.alert(errorMsg);
        }

        app.endPriv();
    }
);


var buildRubricPage = app.trustedFunction(
    function() {
       app.beginPriv();
       
       rubricPageNumber = addBlankPage(aNewDoc);
       var pageRect = this.getPageBox("Crop", rubricPageNumber);
       console.println("Page rectangle: "+pageRect[0]+", "+pageRect[1]+","+pageRect[2]+", "+pageRect[3]);
       var pageBoxWidth = pageRect[2] - pageRect[0];
       var pageBoxHeight = pageRect[1] - pageRect[3];
       console.println("Rubric page (#"+rubricPageNumber+") has a width of " + pageBoxWidth + " and a height of "
       + pageBoxHeight);
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
       var rubricHeader = aNewDoc.addField("rubricHeader", "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
       rubricHeader.value = "Marking Rubric";
       rubricHeader.readonly = true;
       rubricHeader.alignment = "center";
       rubricHeader.fillColor = color.white;
       currentTopY = bottomY -1;

        // Course Code
        topY = currentTopY;
        bottomY = currentTopY - lineHeight;
        leftX = 0;
        rightX = 100;
        var labelCourseCode = aNewDoc.addField("labelCourseCode", "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        labelCourseCode.value = "Course Code";
        labelCourseCode.readonly = true;
        labelCourseCode.alignment = "left";
        labelCourseCode.fillColor = color.ltGray;

        leftX = rightX + 1;
        rightX = xMax;
        var valueCourseCode = aNewDoc.addField("valueCourseCode", "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        valueCourseCode.value = global.selectedRubricContent.courseCode;
        valueCourseCode.readonly = true;
        valueCourseCode.alignment = "left";
        valueCourseCode.fillColor = color.white;
        currentTopY = bottomY -1;

        // Assignment
        topY = currentTopY;
        bottomY = currentTopY - lineHeight;
        leftX = 0;
        rightX = 100;
        var labelAssignmentId = aNewDoc.addField("labelAssignmentId", "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        labelAssignmentId.value = "Assignment";
        labelAssignmentId.readonly = true;
        labelAssignmentId.alignment = "left";
        labelAssignmentId.fillColor = color.ltGray;

        leftX = rightX + 1;
        rightX = xMax;
        var valueAssignmentId = aNewDoc.addField("valueAssignmentId", "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        valueAssignmentId.value = global.selectedRubricContent.assignmentId;
        valueAssignmentId.readonly = true;
        valueAssignmentId.alignment = "left";
        valueAssignmentId.fillColor = color.white;
        currentTopY = bottomY -1;

        // Header row for sections table
        topY = currentTopY - 20;
        bottomY = topY - lineHeight;
        addRubricSectionHeader(topY, bottomY);
        currentTopY = bottomY -1;

        // Now build individual entries for each element in the Rubric
        var i;
        for (i = 0; i < global.selectedRubricContent.sections.length; i++) {
            leftX = 0;
            topY = currentTopY;
            bottomY = currentTopY - lineHeight;
            addRubricSectionRow(global.selectedRubricContent.sections[i], leftX, topY, rightX, bottomY)
            currentTopY = bottomY -1;
        }
 
       app.endPriv();
       return rubricPageNumber;
    }
  );

var addRubricSectionHeader = app.trustedFunction(
    function(topY, bottomY) {
        app.beginPriv();

        leftX = 0;

        // Col 1
        colWidth = 100;
        rightX = leftX + colWidth;
        var rubricSectionsCol1Header = aNewDoc.addField("rubricSectionsCol1Header", "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        rubricSectionsCol1Header.value = "Section Name";
        rubricSectionsCol1Header.readonly = true;
        rubricSectionsCol1Header.alignment = "center";
        rubricSectionsCol1Header.fillColor = color.white;
        leftX = rightX + 1;

        // Col 2
        colWidth = 150;
        rightX = leftX + colWidth;
        var rubricSectionsCol2Header = aNewDoc.addField("rubricSectionsCol2Header", "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        rubricSectionsCol2Header.value = "Rating";
        rubricSectionsCol2Header.readonly = true;
        rubricSectionsCol2Header.alignment = "center";
        rubricSectionsCol2Header.fillColor = color.white;
        rubricSectionsCol2Header.borderStyle = "solid";
        leftX = rightX + 1;

        // Col 3
        colWidth = 257;
        rightX = leftX + colWidth;
        var rubricSectionsCol3Header = aNewDoc.addField("rubricSectionsCol3Header", "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        rubricSectionsCol3Header.value = "Comments";
        rubricSectionsCol3Header.readonly = true;
        rubricSectionsCol3Header.alignment = "center";
        rubricSectionsCol3Header.fillColor = color.white;
        rubricSectionsCol2Header.borderStyle = "solid";
        leftX = rightX + 1;

        // Col 4
        colWidth = 50;
        rightX = leftX + colWidth;
        var rubricSectionsCol4Header = aNewDoc.addField("rubricSectionsCol4Header", "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        rubricSectionsCol4Header.value = "Marks";
        rubricSectionsCol4Header.readonly = true;
        rubricSectionsCol4Header.alignment = "center";
        rubricSectionsCol4Header.fillColor = color.white;
        rubricSectionsCol2Header.borderStyle = "solid";
        leftX = rightX + 1;

        // Col 5
        colWidth = 50;
        rightX = leftX + colWidth;
        var rubricSectionsCol5Header = aNewDoc.addField("rubricSectionsCol5Header", "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        rubricSectionsCol5Header.value = "Out of";
        rubricSectionsCol5Header.readonly = true;
        rubricSectionsCol5Header.alignment = "center";
        rubricSectionsCol5Header.fillColor = color.white;
        rubricSectionsCol2Header.borderStyle = "solid";
        leftX = rightX + 1;

        app.endPriv();
    }
  );


// TODO: Should return the row height that was actually used, so that we can dynamically adjust
// TODO: Need to add a method to re-layout the table based on the length of the text.
var addRubricSectionRow = app.trustedFunction(
    function(section, leftX, topY, rightX, bottomY) {
        app.beginPriv();

        var colWidth = 0;
        
        // Col 1
        colWidth = 100;
        rightX = leftX + colWidth;
        var col1FieldName = "col1"+section.sectionId;
        var col1Field = aNewDoc.addField(col1FieldName, "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        col1Field.value = section.sectionName;
        col1Field.readonly = true;
        col1Field.alignment = "left";
        col1Field.fillColor = color.ltGray;
        leftX = rightX + 1;

        // Col 2
        colWidth = 150;
        rightX = leftX + colWidth;
        var col2FieldName = "col2"+section.sectionId;
        var col2Field = aNewDoc.addField(col2FieldName, "combobox", rubricPageNumber, [leftX, topY, rightX, bottomY]);

        var n;
        for (n = 0; n < section.markerOptions.length; n++) {
            col2Field.insertItemAt(section.markerOptions[n].optionName);
        }
        col2Field.insertItemAt("Awaiting Marker ...");
        col2Field.fillColor = color.ltGray;
        var cscript="changeSectionRating('"+ section.sectionId +"',event);";
        col2Field.setAction("Keystroke", cscript);
        col2Field.commitOnSelChange = "true";
        leftX = rightX + 1;

        // Col 3
        colWidth = 257;
        rightX = leftX + colWidth;
        var col3FieldName = "col3"+section.sectionId;
        var col3Field = aNewDoc.addField(col3FieldName, "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        col3Field.multiline = true
        col3Field.alignment = "left";
        col3Field.fillColor = color.ltGray;
        leftX = rightX + 1;

        // Col 4
        colWidth = 50;
        rightX = leftX + colWidth;
        var col4FieldName = "col4"+section.sectionId;
        var col4Field = aNewDoc.addField(col4FieldName, "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        col4Field.alignment = "right";
        col4Field.fillColor = color.ltGray;
        leftX = rightX + 1;

        // Col 5
        colWidth = 50;
        rightX = leftX + colWidth;
        var col5FieldName = "col5"+section.sectionId;
        var col5Field = aNewDoc.addField(col5FieldName, "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        col5Field.value = section.totalMarks;
        col5Field.readonly = true;
        col5Field.alignment = "right";
        col5Field.fillColor = color.ltGray;
        leftX = rightX + 1;

        app.endPriv();
    }
);


var changeSectionRating = app.trustedFunction(
    function(sectionId, event) {
        app.beginPriv();

        // console.println("Event object: "+event);
        // console.println(" - event.name: "+event.name);
        // console.println(" - event.target: "+event.target);
        // console.println(" - event.targetName: "+event.targetName);
        // console.println(" - event.change: "+event.change);
        // console.println(" - event.changeEx: "+event.changeEx);
        // console.println(" - event.value: "+event.value);
        // console.println(" - event.commitKey: "+event.commitKey);
        // console.println(" - event.willCommit: "+event.willCommit);
        // console.println(" - event.type: "+event.type);
        // console.println(" - event.selStart: "+event.selStart);
        // console.println(" - event.selEnd: "+event.selEnd);
        // console.println(" - event.modifier: "+event.modifier);

        // Only executing when the new value is committed
        if (event.willCommit) {
            console.println("Changing selection for section: "+sectionId+" to "+event.value);

            // Get the default comment and marks from the Rubric:
            var newRating = event.value;
            var i;
            var rubricComment = "";
            var rubricMark = 0;
            for (i = 0; i < global.selectedRubricContent.sections.length; i++) {
                if (global.selectedRubricContent.sections[i].sectionId === sectionId) {
                    var n;
                    for (n = 0; n < global.selectedRubricContent.sections[i].markerOptions.length; n++) {
                        if (global.selectedRubricContent.sections[i].markerOptions[n].optionName === newRating) {
                            rubricComment = global.selectedRubricContent.sections[i].markerOptions[n].optionDefaultComment;
                            rubricMark = global.selectedRubricContent.sections[i].markerOptions[n].optionMarks;
                            break;
                        }
                    }
                    break;
                }
            }

            var commentFieldName = "col3"+sectionId;
            var commentField = aNewDoc.getField(commentFieldName);
            commentField.value = rubricComment;
            var markFieldName = "col4"+sectionId;
            var markField = aNewDoc.getField(markFieldName);
            markField.value = rubricMark;

        }

        app.endPriv();
    }
);


// ======================================================================================== 
// ======================================================================================== 
// EVERYTHING BELOW THIS COMMENT IS OLD FUNCTIONALITY THAT IS LIKELY NOT APPLICABLE ANYMORE
// ======================================================================================== 
// ======================================================================================== 


// TODO - Removing old Rubric functionality
// var openRubricForMarking = app.trustedFunction(function (aNewDoc) {
//   app.beginPriv();

//   var allDocs = app.activeDocs;
//   var stillOpen = false;
//   if (rubricDoc != null) {
//     for (var i in allDocs) {
//       try {
//         if (allDocs[i].path == rubricDoc.path) {
//           stillOpen = true;
//           break;
//         }
//       } catch (Error) {}
//     }
//   }

//   if (!stillOpen) {
//     rubricDoc = null;
//   }

//   if (rubricDoc == null) {
//     var arrText = readCommentTextFile(aNewDoc, "RUBRIC_ENGINE");
//     var rubricFile = arrText[1];

//     if (rubricFile != "</empty>") {
//       rubricDoc = app.openDoc(rubricFile);

//       var docFileName = aNewDoc.documentFileName;
//       var fileName = docFileName.substring(0, docFileName.indexOf("."));

//       currentRubricOpened =
//         "/C/Program Files/UNISA/Rubrics/" + fileName + "_UNMARKED_RUBRIC.pdf";
//       rubricDoc.saveAs({
//         cPath: currentRubricOpened,
//       });

//       hasRubricAttached = true;
//     } else {
//       app.alert(
//         "There is no Rubric accossiated with this Assignment, please re-specify Rubric in Comment Tool!"
//       );
//     }
//   } else {
//     app.alert("You have already opened the Rubric!", 1);
//   }

//   app.endPriv();
// });