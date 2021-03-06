/*
PDF Marking Tool (PMT)

This file contains all functions that relate to the working of the toolbar

*/

var firstMarkForTick = true;
var currentMarkForTick = "1";
var configuredTickMark = false;

// This is the main method that gets called When a tool is selected from the toolbar
// TODO - Selection of tools should depend on the current marking state of the document
var selectToolFromToolbar = app.trustedFunction(function (aNewDoc, type) {
  app.beginPriv();

  console.println("Selecting Tool: " + type);

  if (markingState == "FINALISED") {
    app.alert("Cannot select marking tools. The document has already been finalised");
  } else {
    updateMarkingState("IN_PROGRESS");
    deleteResultsPage(aNewDoc)
  
    // TODO -  Logic here should be cleaned up.
    if (hasMarkingButtons == true) {
      deselectCurrentTool(aNewDoc);
    }
  
    var tmpMarkingType = "";

    switch (type) {
      case "HALFT": {
        isHalfMarkSelected = true;
        isTickSelected = false;
        isCheckSelected = false;
        isCrossSelected = false;
        isMarkSelected = false;
        isCommentMarkSelected = false;
        isRubricMarkSelected = false;
        isDeselectAvailable = true;
        tmpMarkingType = "FREE";
        break;
      }
      case "TICK": {
        isHalfMarkSelected = false;
        isCheckSelected = false;
        isCrossSelected = false;
        isMarkSelected = false;
        isCommentMarkSelected = false;
        isRubricMarkSelected = false;
  
        if (firstMarkForTick) {
          var tickmarkConfigDialog = getTickMarkConfigDialog(
            aNewDoc,
            currentMarkForTick
          );
          var dialogResult = app.execDialog(tickmarkConfigDialog);
          console.println(
            "Result from the tickmark config dialog: " + dialogResult
          );
          if (dialogResult === "ok") {
            console.println(
              "Tick successfully configured: Value=" + currentMarkForTick
            );
            isTickSelected = true;
            isDeselectAvailable = true;
            firstMarkForTick = false;
          } else if (dialogResult === "cancel") {
            console.println("Cancelled configuration of tickmark");
            deselectCurrentTool(aNewDoc);
          }
        } else {
          isTickSelected = true;
          isDeselectAvailable = true;
        }
        tmpMarkingType = "FREE";
        break;
      }
      case "CHECK": {
        isHalfMarkSelected = false;
        isTickSelected = false;
        isCheckSelected = true;
        isCrossSelected = false;
        isMarkSelected = false;
        isCommentMarkSelected = false;
        isRubricMarkSelected = false;
        isDeselectAvailable = true;
        tmpMarkingType = "FREE";
        break;
      }
      case "CROSS": {
        isHalfMarkSelected = false;
        isTickSelected = false;
        isCheckSelected = false;
        isCrossSelected = true;
        isMarkSelected = false;
        isCommentMarkSelected = false;
        isRubricMarkSelected = false;
        isDeselectAvailable = true;
        break;
      }
      case "MARK": {
        isHalfMarkSelected = false;
        isTickSelected = false;
        isCheckSelected = false;
        isCrossSelected = false;
        isMarkSelected = true;
        isCommentMarkSelected = false;
        isRubricMarkSelected = false;
        isDeselectAvailable = true;
        tmpMarkingType = "FREE";
        break;
      }
      case "COMMENTM": {
        isHalfMarkSelected = false;
        isTickSelected = false;
        isCheckSelected = false;
        isCrossSelected = false;
        isMarkSelected = false;
        isCommentMarkSelected = true;
        isRubricMarkSelected = false;
        isDeselectAvailable = true;
        break;
      }
      case "RUBRICM": {
        if (markingType!="RUBRIC") {
          app.alert("Cannot select the Rubric Mark tool until a rubric has been applied to the document. Please add a rubric using the Edit > PDF Marking Tool > Rubric menu");
          return;
        }
        isHalfMarkSelected = false;
        isTickSelected = false;
        isCheckSelected = false;
        isCrossSelected = false;
        isMarkSelected = false;
        isCommentMarkSelected = false;
        isRubricMarkSelected = true;
        isDeselectAvailable = true;
        tmpMarkingType = "RUBRIC";
        break;
      }
    }
  
    // If we don't currently have marking buttons, add them
    if (hasMarkingButtons == false) {
      addMarkingButtons(aNewDoc, type);
      hasMarkingButtons = true;
    }

    // // Update marking type
    // if ((markingType === "FREE")&&(tmpMarkingType==="RUBRIC")) {

    // }

  }

  app.endPriv();
});

var deselectCurrentTool = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  isDeselectAvailable = false;
  isHalfMarkSelected = false;
  isTickSelected = false;
  isCheckSelected = false;
  isCrossSelected = false;
  isMarkSelected = false;
  isCommentMarkSelected = false;

  firstMarkForTick = true;

  // Also Remove marking buttons, so that we do not intercept any click events
  removeMarkingButtons(aNewDoc);
  hasMarkingButtons = false;

  app.endPriv();
});

// This function is used to determine which tools in the toolbar are currently marked as "in use"
// Setting event.rc is how we plug  into Acrobat's built-in capability to mark selected tools
var isToolMarked = app.trustedFunction(function (type) {
  var toolIsMarked = false;
  switch (type) {
    case "HALFT": {
      toolIsMarked = isHalfMarkSelected;
      break;
    }
    case "TICK": {
      toolIsMarked = isTickSelected;
      break;
    }
    case "CHECK": {
      toolIsMarked = isCheckSelected;
      break;
    }
    case "CROSS": {
      toolIsMarked = isCrossSelected;
      break;
    }
    case "MARK": {
      toolIsMarked = isMarkSelected;
      break;
    }
    case "COMMENTM": {
      toolIsMarked = isCommentMarkSelected;
      break;
    }
    case "RUBRICM": {
      toolIsMarked = isRubricMarkSelected;
      break;
    }
    case "DESELECT": {
      toolIsMarked = isDeselectAvailable;
      break;
    }
  }

  event.rc = toolIsMarked;
  return toolIsMarked;
});

// Simple function that prints the current tool selection data to the console.
// Useful for debugging
var showToolSelectionStatus = app.trustedFunction(function () {
  app.beginPriv();

  var statusString = "Tool Selection Status: \n------------------------\n";
  statusString += "HalfTick Selected:      " + isHalfMarkSelected + "\n";
  statusString += "Tick Selected:          " + isTickSelected + "\n";
  statusString += "Check Selected:         " + isCheckSelected + "\n";
  statusString += "Cross Selected:         " + isCrossSelected + "\n";
  statusString += "Mark Selected:          " + isMarkSelected + "\n";
  statusString += "Comment Mark Selected:  " + isCommentMarkSelected + "\n";
  statusString += "Rubric Mark Selected:   " + isRubricMarkSelected + "\n";
  statusString += "Deselect Available:     " + isDeselectAvailable + "\n";

  console.println(statusString);

  app.endPriv();
});

// To enable the ability to add marks anywhere on the document we are applying a bit of a
// hack: We are adding an invisible button on top of the entire document for each of the
// tools in the toolbar.
var addMarkingButtons = app.trustedFunction(function (aNewDoc, type) {
  app.beginPriv();

  var annotButton;
  var copy_annot_btn;
  var numpages = aNewDoc.numPages;

  var coords = [];
  for (var i = 0; i < numpages; i++) {
    var pageSizeBox = aNewDoc.getPageBox("Media", i);

    annotButton = {
      cName: "btn" + i,
      cFieldType: "button",
      nPageNum: i,
      oCoords: pageSizeBox,
    };

    copy_annot_btn = aNewDoc.addField(annotButton);

    if (type == "RUBRICM") {
      copy_annot_btn.setAction("MouseUp", "doMark(aNewDoc, 'RUBRICM')");
    } else if (type == "COMMENTM") {
      copy_annot_btn.setAction("MouseUp", "doMark(aNewDoc, 'COMMENTM')");
    } else if (type == "MARK") {
      copy_annot_btn.setAction("MouseUp", "doMark(aNewDoc, 'MARK')");
    } else if (type == "TICK") {
      copy_annot_btn.setAction("MouseUp", "doMark(aNewDoc, 'TICK')");
    } else if (type == "CROSS") {
      copy_annot_btn.setAction("MouseUp", "doMark(aNewDoc, 'CROSS')");
    } else if (type == "CHECK") {
      copy_annot_btn.setAction("MouseUp", "doMark(aNewDoc, 'CHECK')");
    } else if (type == "HALFT") {
      copy_annot_btn.setAction("MouseUp", "doMark(aNewDoc, 'HALFT')");
    }

    copy_annot_btn.highlight = highlight.n;
  }

  app.endPriv();
});

var removeMarkingButtons = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  var numpages = aNewDoc.numPages;

  for (var i = 0; i < numpages; i++) {
    aNewDoc.removeField("btn" + i);
  }

  app.endPriv();
});

// Main controller function for applying marking annotations to the document.
// This method is called by the currently active marking button when a user clicks
// it.
// Since the marking button fills the whole screen, and is invisible, it results in this
// event firing when the user clicks anywhere on the screen
//
// For some types of mark, the system first pops up a dialog, others proceed without a dialog
// The method then applies the relevant annotation to the document, at the current X,Y coordinates
// of the mouse.
var doMark = app.trustedFunction(function (aNewDoc, type) {
  app.beginPriv();

  console.println("Adding Mark: " + type);
  var currentPage = aNewDoc.pageNum;

  var dialog;

  if (type == "COMMENTM") {
    var aimAnnot = doAimAnnot(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY);
    var commentMarkDialog = getCommentMarkDialog(
      aNewDoc,
      aNewDoc.mouseX,
      aNewDoc.mouseY,
      type
    );
    var dialogResult = app.execDialog(commentMarkDialog);
    // console.println("Result from the comment mark dialog: "+dialogResult);
    aimAnnot.destroy();
  } else if (type == "MARK") {
    var aimAnnot = doAimAnnot(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY);
    var markDialog = getMarkDialog(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY, type);
    var dialogResult = app.execDialog(markDialog);
    // console.println("Result from the mark dialog: "+dialogResult);
    aimAnnot.destroy();
  } else if (type == "RUBRICM") {
    var aimAnnot = doAimAnnot(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY);
    var rubricDialog = getRubricMarkDialog(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY, type);
    var dialogResult = app.execDialog(rubricDialog);
    // console.println("Result from the rubric dialog: "+dialogResult);
    aimAnnot.destroy();
  } else if (type == "TICK") {
    doAnnot(
      aNewDoc,
      aNewDoc.mouseX,
      aNewDoc.mouseY,
      null,
      null,
      currentMarkForTick,
      type
    );
  } else if (type == "CROSS") {
    doAnnot(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY, null, null, 0, type);
  } else if (type == "CHECK") {
    doAnnot(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY, null, null, 0, type);
  } else if (type == "HALFT") {
    doAnnot(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY, null, null, 0.5, type);
  }

  app.endPriv();
});

var getTickMarkConfigDialog = app.trustedFunction(function (
  aNewDoc,
  currentValue
) {
  app.beginPriv();

  var tickmarkConfigDialog = {
    initialize: function (dialog) {
      dialog.load({ mark: currentValue });
    },
    validate: function (dialog) {
      var results = dialog.store();
      var mark = results["mark"];
      var regExNumber = /\D/;
      if (regExNumber.test(mark)) {
        app.alert("Only positive numbers are allowed!");
        return false;
      } else if (mark > 100) {
        app.alert("Mark for tick cannot be greater than 100!");
        return false;
      } else if (mark < 0) {
        app.alert("Mark for tick cannot be less than 0!");
        return false;
      } else {
        return true;
      }
    },
    commit: function (dialog) {
      var results = dialog.store();

      var mark = results["mark"];

      if (mark == "") {
        mark = 1;
      }

      currentMarkForTick = mark;
      configuredTickMark = true;
      console.println(
        "Successfully configured tick mark in the dialog? " + configuredTickMark
      );
    },
    description: {
      name: "Tick Value",
      align_children: "align_left",
      width: 100,
      height: 100,
      first_tab: "mark",
      elements: [
        {
          type: "cluster",
          name: "Mark Setup",
          align_children: "align_left",
          elements: [
            {
              type: "view",
              align_children: "align_left",
              elements: [
                {
                  type: "static_text",
                  name: "Tick Value:",
                },
                {
                  item_id: "mark",
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
  return tickmarkConfigDialog;
});

var getCommentMarkDialog = app.trustedFunction(function (aNewDoc, x, y, type) {
  app.beginPriv();

  var commentMarkDialog = {
    initialize: function (dialog) {
      // TODO - Initialise cached comments
    },
    validate: function (dialog) {
      var results = dialog.store();
      var mark = results["mark"];

      var dot = mark.substring(mark.indexOf("."), mark.indexOf(".") + 1);
      var indexOfDot;
      var lastNumber;

      if (dot == ".") {
        indexOfDot = mark.indexOf(".");
        if (indexOfDot == 0) {
          mark = "0.5";
        } else {
          lastNumber = mark.substring(mark.indexOf(".") + 1, mark.length);
          if (lastNumber != "5") {
            app.alert("Only decimals of .5 are allowed!");
            return false;
          }
        }
      }

      var regExNumber = /\D/;
      if (regExNumber.test(mark) && 
        mark.indexOf(".") == -1 &&
        mark.indexOf("-") == -1) {
        app.alert("Only positive numbers are allowed!");
        return false;
      } else if (mark == "") {
        app.alert("Please enter a mark!");
        return false;
      } else if (mark > 100) {
        app.alert("Mark for tick cannot be greater than 100!");
        return false;
      } else if (mark < 0) {
        app.alert("Mark for tick cannot be less than 0!");
        return false;
      } else {
        return true;
      }
    },
    commit: function (dialog) {
      var results = dialog.store();

      var mark = results["mark"];
      var crit = results["crit"];
      var comm = results["comm"];

      doAnnot(aNewDoc, x, y, crit, comm, mark, type);
    },
    description: {
      name: "Mark Data",
      align_children: "align_left",
      width: 100,
      height: 100,
      first_tab: "mark",
      elements: [
        {
          type: "cluster",
          name: "Mark Setup",
          align_children: "align_left",
          elements: [
            {
              type: "view",
              align_children: "align_left",
              elements: [
                {
                  type: "static_text",
                  name: "Mark:",
                },
                {
                  item_id: "mark",
                  type: "edit_text",
                  alignment: "align_left",
                  width: 200,
                  height: 20,
                  next_tab: "crit",
                },
              ],
            },
            {
              type: "view",
              align_children: "align_left",
              elements: [
                {
                  type: "static_text",
                  name: "Element / Criterion:",
                },
                {
                  item_id: "crit",
                  type: "edit_text",
                  alignment: "align_left",
                  width: 200,
                  height: 20,
                  next_tab: "comm",
                },
              ],
            },
            {
              type: "view",
              align_children: "align_left",
              elements: [
                {
                  type: "static_text",
                  name: "Comment:",
                },
                {
                  item_id: "comm",
                  type: "edit_text",
                  multiline: true,
                  alignment: "align_left",
                  width: 200,
                  height: 150,
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

  return commentMarkDialog;
});

var getMarkDialog = app.trustedFunction(function (aNewDoc, x, y, type) {
  app.beginPriv();

  var markDialog = {
    initialize: function (dialog) {
      // if (labelForMark != "") {
      //   dialog.load({ crit: labelForMark });
      // }
    },
    validate: function (dialog) {
      var results = dialog.store();
      var mark = results["mark"];

      var dot = mark.substring(mark.indexOf("."), mark.indexOf(".") + 1);
      var indexOfDot;
      var lastNumber;

      if (dot == ".") {
        indexOfDot = mark.indexOf(".");
        if (indexOfDot == 0) {
          mark = "0.5";
        } else {
          lastNumber = mark.substring(mark.indexOf(".") + 1, mark.length);
          if (lastNumber != "5") {
            app.alert("Only decimals of .5 are allowed!");
            return false;
          }
        }
      }

      var regExNumber = /\D/;
      if (regExNumber.test(mark)) {
        app.alert("Only positive numbers are allowed!");
        return false;
      } else if (mark > 100) {
        app.alert("Mark for tick cannot be greater than 100!");
        return false;
      } else if (mark < 0) {
        app.alert("Mark for tick cannot be less than 0!");
        return false;
      } else {
        return true;
      }
    },
    commit: function (dialog) {
      var results = dialog.store();
      var mark = results["mark"];
      var crit = results["crit"];
      doAnnot(aNewDoc, x, y, crit, null, mark, type);
    },
    description: {
      name: "Mark Data",
      align_children: "align_left",
      width: 100,
      height: 100,
      first_tab: "mark",
      elements: [
        {
          type: "cluster",
          name: "Mark Setup",
          align_children: "align_left",
          elements: [
            {
              type: "view",
              align_children: "align_left",
              elements: [
                {
                  type: "static_text",
                  name: "Mark:",
                },
                {
                  item_id: "mark",
                  type: "edit_text",
                  alignment: "align_left",
                  width: 200,
                  height: 20,
                  next_tab: "crit",
                },
              ],
            },
            {
              type: "view",
              align_children: "align_left",
              elements: [
                {
                  type: "static_text",
                  name: "Element / Criterion:",
                },
                {
                  item_id: "crit",
                  type: "edit_text",
                  alignment: "align_left",
                  width: 200,
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

  return markDialog;
});

var getRubricMarkDialog = app.trustedFunction(function (aNewDoc, x, y, type) {
  app.beginPriv();

  var rubricMarkDialog = {
    initialize: function (dialog) {
      // Prepare initial lookup data for the criterion dropdown
      // Note: the lookup list must be structured in a specific way for Acrobat to
      // behave correctly. From the API docs:
      //    "the value should be an object literal consisting of the displayed entry as the
      //      label and a numeric value as the contents. If the numeric value is greater than 0, 
      //      the item was selected, otherwise it was not selected.
      console.println("Initializing rubric dialog");
      var i;
      var criterionPopupData = {};
      var defaultSelectionFound = false;
      var selectedCriterionIndex = 0;
      for (i = 1; i <= selectedRubricContent.criteria.length; i++) {
        var criterionId = selectedRubricContent.criteria[i-1].criterionId;
        if ((!criterionIsAlreadyMarked(criterionId))&&(!defaultSelectionFound)) {
          criterionPopupData[selectedRubricContent.criteria[i-1].criterionName] = i ;
          defaultSelectionFound = true;
          selectedCriterionIndex = i-1;
        } else {
          criterionPopupData[selectedRubricContent.criteria[i-1].criterionName] = i*-1 ;
        }
      }
      dialog.load({ crit: criterionPopupData });

      // Prepare initial lookup data for the level dropdown - based on the default 
      // selection for the criteria dropdown above.
      // If no default criterion was selected, disable the level field
      console.println("Selected criterion index: "+selectedCriterionIndex);
      var levelsPopupData = {};
      if (selectedCriterionIndex > -1) {
        var n;
        for (n = 1; n <= selectedRubricContent.criteria[selectedCriterionIndex].levels.length; n++) {
          var levelName = selectedRubricContent.criteria[selectedCriterionIndex].levels[n-1].levelName;
          levelsPopupData[levelName] = n*-1 ;
        }
        dialog.load({ levl: levelsPopupData });
      } else {
        dialog.enable({ levl : false})
      }
    },
    validate: function (dialog) {
      var results = dialog.store();
      var mark = results["mark"];

      var dot = mark.substring(mark.indexOf("."), mark.indexOf(".") + 1);
      var indexOfDot;
      var lastNumber;

      if (dot == ".") {
        indexOfDot = mark.indexOf(".");
        if (indexOfDot == 0) {
          mark = "0.5";
        } else {
          lastNumber = mark.substring(mark.indexOf(".") + 1, mark.length);
          if (lastNumber != "5") {
            app.alert("Only decimals of .5 are allowed!");
            return false;
          }
        }
      }

      var regExNumber = /\D/;
      if (regExNumber.test(mark)) {
        app.alert("Only positive numbers are allowed!");
        return false;
      } else if (mark > 100) {
        app.alert("Mark for tick cannot be greater than 100!");
        return false;
      } else if (mark < 0) {
        app.alert("Mark for tick cannot be less than 0!");
        return false;
      } else {
        return true;
      }
    },
    crit: function (dialog) {
      var criteria = dialog.store()["crit"];
      var selectedCriterionIndex = 0;
      for (var i in criteria) {
        if (criteria[i] > 0) {
          selectedCriterionIndex = criteria[i]-1;
        }
      }

      // Now prepare the list of levels available for the selected criterion
      var levelsPopupData = {};
      var n;
      for (n = 1; n <= selectedRubricContent.criteria[selectedCriterionIndex].levels.length; n++) {
        var levelName = selectedRubricContent.criteria[selectedCriterionIndex].levels[n-1].levelName;
        levelsPopupData[levelName] = n*-1 ;
      }
      dialog.load({ levl: levelsPopupData });
    },
    levl: function (dialog) {
      var criteria = dialog.store()["crit"];
      var selectedCriterionIndex = 0;
      for (var i in criteria) {
        if (criteria[i] > 0) {
          selectedCriterionIndex = criteria[i]-1;
        }
      }

      var levels = dialog.store()["levl"];
      var selectedLevelIndex = 0;
      for (var m in levels) {
        if (levels[m] > 0) {
          selectedLevelIndex = levels[m]-1;
        }
      }

      // Populate the default mark and comment
      if ((selectedCriterionIndex > -1)&&(selectedLevelIndex > -1)) {
        var defaultComment = selectedRubricContent.criteria[selectedCriterionIndex].levels[selectedLevelIndex].levelDefaultComment;
        var defaultMark =  selectedRubricContent.criteria[selectedCriterionIndex].levels[selectedLevelIndex].levelMarks;
        dialog.load({
          mark: defaultMark.toString(),
          comm: defaultComment,
        });
      }    
    },
    commit: function (dialog) {
      var results = dialog.store();

      // Extract criterionId from the selection made in popup
      var criteria = results["crit"];
      var selectedCriterionIndex = 0;
      for (var i in criteria) {
        if (criteria[i] > 0) {
          selectedCriterionIndex = criteria[i]-1;
        }
      }
      var criterionId = selectedRubricContent.criteria[selectedCriterionIndex].criterionId;
      var criterionName = selectedRubricContent.criteria[selectedCriterionIndex].criterionName;

      // Extract level from the selection made in popup
      var levels = results["levl"];
      var selectedLevelIndex = 0;
      for (var m in levels) {
        if (levels[m] > 0) {
          selectedLevelIndex = levels[m]-1;
        }
      }
      var level = selectedRubricContent.criteria[selectedCriterionIndex].levels[selectedLevelIndex].levelName;
      
      var comment = results["comm"];
      var mark = results["mark"];

      console.println("Committing rubric mark: CriterionId="+criterionId+", Level="+level+", Mark="+mark+", Comment="+comment);
      
      // Apply selection to Rubric form
      updateCriterionLevel(criterionId, level);
      overrideCriterionComment(criterionId, comment);
      overrideCriterionMark(criterionId, mark);

      // Apply annotation
      var annotName = doAnnot(aNewDoc, x, y, criterionName, comment, mark, type);
      addAnnotationDetailsToRubricCriterion(criterionId, aNewDoc.pageNum, annotName);
    },
    description: {
      name: "Rubric Mark Data",
      align_children: "align_left",
      width: 100,
      height: 100,
      first_tab: "crit",
      elements: [
        {
          type: "cluster",
          name: "Apply Rubric Mark",
          align_children: "align_left",
          elements: [
            {
              type: "static_text",
              name: "Select Criterion:",
            },
            {
              item_id: "crit",
              type: "popup",
              alignment: "align_fill",
              width: 200,
              height: 20,
              next_tab: "levl",
            },
            {
              type: "static_text",
              name: "Select Level:",
            },
            {
              item_id: "levl",
              type: "popup",
              alignment: "align_fill",
              width: 200,
              height: 20,
              next_tab: "mark",
            },
            {
              type: "static_text",
              name: "Mark:       ",
            },
            {
              item_id: "mark",
              type: "edit_text",
              alignment: "align_fill",
              width: 80,
              height: 20,
              next_tab: "comm",
            },
            {
              type: "static_text",
              name: "Comment:",
            },
            {
              item_id: "comm",
              type: "edit_text",
              multiline: true,
              alignment: "align_fill",
              width: 200,
              height: 150,
              next_tab: "sect",
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

  return rubricMarkDialog;
});
