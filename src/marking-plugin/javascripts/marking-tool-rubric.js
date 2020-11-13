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
        //    - For each markerOption:
        //        - optionName is specified
        //        - optionMarks is specified
        //        - optionDefaultComment is specified

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

                buildRubricPage();
                // TODO
                // - Add Rubric page
                // - Add Rubric fields

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
       rubricHeader.value = "RUBRIC";
       rubricHeader.readonly = true;
       rubricHeader.alignment = "center";
       rubricHeader.fillColor = color.blue;
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
        labelCourseCode.fillColor = color.red;

        leftX = rightX + 1;
        rightX = xMax;
        var valueCourseCode = aNewDoc.addField("valueCourseCode", "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        valueCourseCode.value = global.selectedRubricContent.courseCode;
        valueCourseCode.readonly = true;
        valueCourseCode.alignment = "left";
        valueCourseCode.fillColor = color.gray;
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
        labelAssignmentId.fillColor = color.magenta;

        leftX = rightX + 1;
        rightX = xMax;
        var valueAssignmentId = aNewDoc.addField("valueAssignmentId", "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        valueAssignmentId.value = global.selectedRubricContent.assignmentId;
        valueAssignmentId.readonly = true;
        valueAssignmentId.alignment = "left";
        valueAssignmentId.fillColor = color.ltGray;
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
    }
  );

var addRubricSectionRow = app.trustedFunction(
    function(section, leftX, topY, rightX, bottomY) {
        app.beginPriv();

        var colWidth = 0;
        
        // Col 1
        colWidth = 100;
        rightX = leftX + colWidth;
        var col1FieldName = "col1"+section.sectionName;
        var col1Field = aNewDoc.addField(col1FieldName, "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        col1Field.value = section.sectionName;
        col1Field.readonly = true;
        col1Field.alignment = "left";
        col1Field.fillColor = color.ltGray;
        leftX = rightX + 1;

        // Col 2
        colWidth = 150;
        rightX = leftX + colWidth;
        var col2FieldName = "col2"+section.sectionName;
        var col2Field = aNewDoc.addField(col2FieldName, "combobox", rubricPageNumber, [leftX, topY, rightX, bottomY]);

        var n;
        for (n = 0; n < section.markerOptions.length; n++) {
            col2Field.insertItemAt(section.markerOptions[n].optionName,n);
        }
        col2Field.fillColor = color.ltGray;
        leftX = rightX + 1;

        // Col 3
        colWidth = 257;
        rightX = leftX + colWidth;
        var col3FieldName = "col3"+section.sectionName;
        var col3Field = aNewDoc.addField(col3FieldName, "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        col3Field.alignment = "left";
        col3Field.fillColor = color.ltGray;
        leftX = rightX + 1;

        // Col 4
        colWidth = 50;
        rightX = leftX + colWidth;
        var col4FieldName = "col4"+section.sectionName;
        var col4Field = aNewDoc.addField(col4FieldName, "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        col4Field.readonly = true;
        col4Field.alignment = "right";
        col4Field.fillColor = color.ltGray;
        leftX = rightX + 1;

        // Col 5
        colWidth = 50;
        rightX = leftX + colWidth;
        var col5FieldName = "col5"+section.sectionName;
        var col5Field = aNewDoc.addField(col5FieldName, "text", rubricPageNumber, [leftX, topY, rightX, bottomY]);
        col5Field.value = section.totalMarks;
        col5Field.readonly = true;
        col5Field.alignment = "right";
        col5Field.fillColor = color.ltGray;
        leftX = rightX + 1;

        app.endPriv();
    }
);


