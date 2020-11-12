/*

This file contains reusable JavaScript functions related to Rubric functionality

TODO - On loading of a new document we should:
    - Check if a Rubric is selected (in global variables)
    - Check if the Rubric file is attached to the document as a DataObject
    - If not attached, import it from the Rubrics folder


*/ 

var selectRubric = app.trustedFunction(
    function() {
        app.beginPriv();        

        // TODO - Check that document doesn't already have a Rubric applied, this  looks at two things:
        //  - An attachment titled "Rubric"
        //  - A Rubric page

        aActiveDocs = app.activeDocs;
        aNewDoc = aActiveDocs[0];
        if (aNewDoc != null) {
            var alertMsg = "In the next screen, please select the required Rubric file from your file system. \n\n";
            alertMsg += "Once the rubric file is selected, it will be attached to the document, but the marking sheet will not automatically appear \n";

            var continueImport = app.alert(alertMsg,3,1);
            if (continueImport == 1) {
                this.importDataObject("Rubric");
                var rubric = this.getDataObject("Rubric")
                console.println("Rubric File Name: "+rubric.path)
                var oFile = this.getDataObjectContents("Rubric");
                var strRubric = util.stringFromStream(oFile, "utf-8");
                console.println("Rubric content:");
                console.println(strRubric);
                var jsonRubric = eval("("+strRubric+")");
                console.println("Parsed Rubric:");
                console.println(" - rubricId: "+jsonRubric.rubricId);
                console.println(" - courseCode: "+jsonRubric.courseCode);
                console.println(" - assignmentId: "+jsonRubric.assignmentId);
                console.println(" - Sections ("+jsonRubric.sections.length+"): ");
                var i;
                for (i = 0; i < jsonRubric.sections.length; i++) {
                    console.println("    - sectionName="+jsonRubric.sections[i].sectionName+"\t totalMarks="+jsonRubric.sections[i].totalMarks);
                }

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

                    alertMsg = "The rubric "+rubric.path+" was successfully attached to the current document \n\n";
                    alertMsg += "To add the rubric marking sheet to the document, select the 'Add Rubric Marking Sheet' tool"
                } else {
                    alertMsg = "The selected file ("+rubric.path+") is not a valid Rubric. The following validation errors were reported: \n\n";
                    alertMsg += validationResult.validationErrors;
                }

                app.alert(alertMsg,3,0);
            }
        } else {
            app.alert("To select a Rubric, you must first have single active document open");
        }

        app.endPriv();  
    }
);

var validateRubric = app.trustedFunction(
    function(rubric) {
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
    function() {
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
      detailsString += "Rubric Name: \t"+rubricName+"\n";
      detailsString += "Rubric File Name: \t"+rubricFileName+"\n";
      detailsString += "Rubric Version: \t"+rubricVersion+"\n";
  
      console.println(detailsString);
      app.alert(detailsString, 3);
  
      app.endPriv();  
    }
  );

  var clearRubricSelection = app.trustedFunction(
    function() {
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
    function() {
      app.beginPriv();
  
      if ((global.selectedRubricName) && 
            (global.selectedRubricFileName) &&
            (global.selectedRubricVersion) &&
            global.selectedRubricContent) {

      } else {
        var errorMsg = "Cannot apply rubric to current document, no Rubric has been selected";
        console.println(errorMsg)
        app.alert(errorMsg);
      }

      app.endPriv();  
    }
  );





