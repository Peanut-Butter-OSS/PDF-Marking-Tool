/*

This file contains all functions that relate to the working of the toolbar

*/

var firstMarkForTick = true;
var currentMarkForTick = "1";
var configuredTickMark = false;

// This is the main method that gets called When a tool is selected from the toolbar
var selectToolFromToolbar = app.trustedFunction(function (aNewDoc, type) {
  app.beginPriv();

  console.println("Tool selected: " + type);
  // Check if we already has a results page.
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

  // TODO -  Logic here should be cleaned up.
  if (hasMarkingButtons == true) {
    deselectCurrentTool(aNewDoc);
  }

  switch (type) {
    case "HALFT": {
      isHalfMarkSelected = true;
      isTickSelected = false;
      isCheckSelected = false;
      isCrossSelected = false;
      isMarkSelected = false;
      isCommentMarkSelected = false;
      isRubricMarkSelected = false;
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
        var tickmarkConfigDialog = getTickMarkConfigDialog(aNewDoc,currentMarkForTick);
        var dialogResult = app.execDialog(tickmarkConfigDialog);
        console.println("Result from the tickmark config dialog: "+dialogResult);
        if (dialogResult === "ok") {
            console.println("Tick successfully configured: Value="+currentMarkForTick);
            isTickSelected = true;
            firstMarkForTick = false;
        } else if (dialogResult === "cancel") {
            console.println("Cancelled configuration of tickmark");
            deselectCurrentTool(aNewDoc);
        }
      } else {
        isTickSelected = true;
      }
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
      break;
    }
    case "RUBRICM": {
      isHalfMarkSelected = false;
      isTickSelected = false;
      isCheckSelected = false;
      isCrossSelected = false;
      isMarkSelected = false;
      isCommentMarkSelected = false;
      isRubricMarkSelected = true;
      break;
    }
  }

  if (hasMarkingButtons == false) {
    isDeselectAvailable = true;
    addMarkingButtons(aNewDoc, type);
    hasMarkingButtons = true;
  }

  app.endPriv();
});

var getTickMarkConfigDialog = app.trustedFunction(function (aNewDoc, currentValue) {
  app.beginPriv();

  var tickmarkConfigDialog = {
    initialize: function (dialog) {
      var todayDate = dialog.store()["date"];
      todayDate = "Date: " + util.printd("mmmm dd, yyyy", new Date());
      dialog.load({ date: todayDate });
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
      console.println("Successfully configured tick mark in the dialog? "+configuredTickMark);
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
              align_children: "align_row",
              elements: [
                {
                  type: "static_text",
                  name: "Mark for Tick:",
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
  app.endPriv();
  return tickmarkConfigDialog;
});

var getCommentMarkDialog = app.trustedFunction(function (aNewDoc, x, y, type) {
  app.beginPriv();

  var qc = "";

  var dialog1 = {
    initialize: function (dialog) {
      var todayDate = dialog.store()["date"];
      todayDate = "Date: " + util.printd("mmmm dd, yyyy", new Date());
      dialog.load({ date: todayDate });

      var arrText = readCommentTextFile(aNewDoc, "COMM_ENGINE");

      var qn = "" + arrText[1];
      var qm = "" + arrText[2];

      if (qn == "</empty>") {
        qn = "";
      }
      if (qm == "</empty>") {
        qm = "";
      }

      var txt = "";
      for (var i = 3; i < arrText.length - 1; i++) {
        txt = "" + arrText[i];
        if (txt == "</p>") {
          qc = qc + "\n";
        } else {
          qc = qc + txt + "\n";
        }
      }

      if (arrText[3] == "</empty>") {
        qc = "";
      }

      dialog.load({ mark: qm });
      dialog.load({ ques: qn });
      dialog.load({ comm: qc });
    },
    destroy: function (dialog) {
      var aim_annot = aNewDoc.getAnnot({
        nPage: aNewDoc.pageNum,
        cName: "AIM",
      });
      aim_annot.destroy();

      commentFromFile = "";
    },
    commit: function (dialog) {
      var results = dialog.store();

      var mark = results["mark"];
      var ques = results["ques"];
      var comm = results["comm"];

      var lastNumber;
      var indexOfDot;
      var skipLastValidation = false;
      var dot = mark.substring(mark.indexOf("."), mark.indexOf(".") + 1);

      if (dot == ".") {
        indexOfDot = mark.indexOf(".");

        if (indexOfDot == 0) {
          mark = "0.5";
        } else {
          lastNumber = mark.substring(mark.indexOf(".") + 1, mark.length);

          if (lastNumber != "5") {
            app.alert("Only decimals of .5 are allowed!");

            skipRemoveButtons = true;
            skipLastValidation = true;
          }
        }
      }

      if (!skipLastValidation) {
        var regNumber = /\D/;
        if (
          regNumber.test(mark) &&
          mark.indexOf(".") == -1 &&
          mark.indexOf("-") == -1
        ) {
          app.alert("Only numbers are allowed!");

          skipRemoveButtons = true;
        } else if (mark == "") {
          app.alert("Please enter a mark!");

          skipRemoveButtons = true;
        } else if (mark > 100) {
          app.alert("You cannot enter a mark more than 100!");

          skipRemoveButtons = true;
        } else if (mark < -100) {
          app.alert("You cannot enter a mark less than -100!");

          skipRemoveButtons = true;
        } else {
          commentFromFile = comm;

          doAnnot(aNewDoc, x, y, ques, mark, type);
        }
      }
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
              align_children: "align_row",
              elements: [
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
                  next_tab: "ques",
                },
              ],
            },
            {
              type: "view",
              align_children: "align_row",
              elements: [
                {
                  type: "static_text",
                  name: "Element:  ",
                },
                {
                  item_id: "ques",
                  type: "edit_text",
                  alignment: "align_fill",
                  width: 80,
                  height: 20,
                  next_tab: "comm",
                },
              ],
            },
            {
              type: "view",
              align_children: "align_row",
              elements: [
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

  app.endPriv();

  return dialog1;
});

var getMarkDialog = app.trustedFunction(function (aNewDoc, x, y, type) {
  app.beginPriv();

  var dialog1 = {
    initialize: function (dialog) {
      var todayDate = dialog.store()["date"];
      todayDate = "Date: " + util.printd("mmmm dd, yyyy", new Date());
      dialog.load({ date: todayDate });

      if (labelForMark != "") {
        dialog.load({ ques: labelForMark });
      }
    },
    destroy: function (dialog) {
      var aim_annot = aNewDoc.getAnnot({
        nPage: aNewDoc.pageNum,
        cName: "AIM",
      });
      aim_annot.destroy();
    },
    commit: function (dialog) {
      var results = dialog.store();

      var mark = results["mark"];
      var ques = results["ques"];

      var lastNumber;
      var indexOfDot;
      var skipLastValidation = false;
      var dot = mark.substring(mark.indexOf("."), mark.indexOf(".") + 1);

      if (dot == ".") {
        indexOfDot = mark.indexOf(".");

        if (indexOfDot == 0) {
          mark = "0.5";
        } else {
          lastNumber = mark.substring(mark.indexOf(".") + 1, mark.length);

          if (lastNumber != "5") {
            app.alert("Only decimals of .5 are allowed!");

            skipRemoveButtons = true;
            skipLastValidation = true;
          }
        }
      }

      if (!skipLastValidation) {
        var regNumber = /\D/;
        if (
          regNumber.test(mark) &&
          mark.indexOf(".") == -1 &&
          mark.indexOf("-") == -1
        ) {
          app.alert("Only numbers are allowed!");

          skipRemoveButtons = true;
        } else if (mark == "") {
          app.alert("Please enter a mark!");

          skipRemoveButtons = true;
        } else if (mark > 100) {
          app.alert("You cannot enter a mark more than 100!");

          skipRemoveButtons = true;
        } else if (mark < -100) {
          app.alert("You cannot enter a mark less than -100!");

          skipRemoveButtons = true;
        } else {
          labelForMark = ques;

          doAnnot(aNewDoc, x, y, ques, mark, type);
        }
      }
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
              align_children: "align_row",
              elements: [
                {
                  type: "static_text",
                  name: "Mark:    ",
                },
                {
                  item_id: "mark",
                  type: "edit_text",
                  alignment: "align_fill",
                  width: 80,
                  height: 20,
                  next_tab: "ques",
                },
              ],
            },
            {
              type: "view",
              align_children: "align_row",
              elements: [
                {
                  type: "static_text",
                  name: "Element:",
                },
                {
                  item_id: "ques",
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

  app.endPriv();

  return dialog1;
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

// Simple function that prints the current tool selection data to the console.
// Useful for debugging
var showToolSelectionStatus = app.trustedFunction(function () {
  app.beginPriv();

  var statusString = "Tool Selection Status: \n------------------------\n";
  statusString += "HalfTick Selected:      "+isHalfMarkSelected+"\n";
  statusString += "Tick Selected:          "+isTickSelected+"\n";
  statusString += "Check Selected:         "+isCheckSelected+"\n";
  statusString += "Cross Selected:         "+isCrossSelected+"\n";
  statusString += "Mark Selected:          "+isMarkSelected+"\n";
  statusString += "Comment Mark Selected:  "+isCommentMarkSelected+"\n";
  statusString += "Rubric Mark Selected:   "+isRubricMarkSelected+"\n";
  statusString += "Deselect Available:     "+isDeselectAvailable+"\n";

  console.println(statusString);

  app.endPriv();
});


var deselectCurrentTool = app.trustedFunction(
    function(aNewDoc) {
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
    }
  );

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