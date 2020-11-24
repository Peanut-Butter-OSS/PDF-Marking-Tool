/*
PDF Marking Tool (PMT)

This file contains all the logic related to comments in the marking tool

*/

var addCommentPage = app.trustedFunction(function (aNewDoc) {
    var aRect = [0, 612, 792, 0];
  
    var y = 5;
    var h = 80;
  
    var lx = 5;
    var ly = aRect[2] - y;
    var rx = aRect[1] - 20;
    var ry = aRect[2] - h;
  
    var newPageNumber = addBlankPage(aNewDoc);
    var commentsPageHeader = aNewDoc.addField("edtCommentHeader", "text", newPageNumber, [
      lx,
      ly,
      rx,
      ry,
    ]);
    commentsPageHeader.value = "          COMMENTS";
    commentsPageHeader.readonly = true;
  
    return newPageNumber;
  });

  var addCommentBlock = app.trustedFunction(function (
    aNewDoc,
    uniqueNumber,
    commentNumber,
    commentPageNumber,
    content,
    rectComment,
    rectLabel
  ) {
    rectLabel[1] -= 1;
    rectComment[1] -= 1;
  
    // CREATE COMMENT
    var edtCommentDesc = aNewDoc.addField(
      "EDTCOMMENTDESCRIPTION:" + uniqueNumber,
      "text",
      commentPageNumber,
      rectComment
    );
    edtCommentDesc.delay = true;
    edtCommentDesc.value = content;
    edtCommentDesc.multiline = true;
    edtCommentDesc.textFont = "Courier";
    edtCommentDesc.readonly = true;
    edtCommentDesc.strokeColor = color.black;
    edtCommentDesc.lineWidth = 1;
    edtCommentDesc.borderStyle = border.s;
    edtCommentDesc.delay = false;
  
    // CREATE COMMENT LABEL
    var edtCommentNumber = aNewDoc.addField(
      "EDITCOMM:" + uniqueNumber,
      "text",
      commentPageNumber,
      rectLabel
    );
    edtCommentNumber.delay = true;
    edtCommentNumber.value = commentNumber;
    edtCommentNumber.readonly = true;
    edtCommentNumber.borderStyle = border.s;
    edtCommentNumber.fillColor = color.white;
    edtCommentNumber.strokeColor = color.red;
    edtCommentNumber.lineWidth = 1;
    edtCommentNumber.width = 20;
    edtCommentNumber.delay = false;
  });
  
  var biuldCommentsPages = app.trustedFunction(function (aNewDoc) {
    aNewDoc.syncAnnotScan();
    var annots = aNewDoc.getAnnots({ nSortBy: ANSB_Page });
    var theAnnots = [];
    var count = 0;
    for (var i in annots) {
      if (annots[i].contents != "") {
        theAnnots[count] = annots[i];
        count++;
      }
  
      annots[i].readOnly = true;
    }
  
    // below code creates annotation next to actual mark
    var edtComment;
    var coord = [];
    for (var i in theAnnots) {
      coord = coordinateAnnotInSpace(aNewDoc, theAnnots[i], i);
  
      edtComment = aNewDoc.addField(
        "EDITCOMM:" + i,
        "text",
        theAnnots[i].page,
        coord
      );
  
      edtComment.value = parseInt(i) + 1;
      edtComment.rect = coord;
      edtComment.readonly = true;
      edtComment.borderStyle = border.s;
      edtComment.fillColor = color.white;
      edtComment.strokeColor = color.red;
      edtComment.lineWidth = 1;
      edtComment.width = 20;
    }
    //####################################################################################
  
    // PAGE SIZE X,Y,W,H
    var aRect = [0, 612, 792, 0];
  
    var uniqueCommentNumber = 99999;
    var commentNumber = 1;
    var commentPageNumber = 0;
    var cursorY = aRect[2] - 80;
    var cursorHeight = 0;
    var cursorMaxHeight = 10;
  
    var commentX = 31;
    var commentWidth = 600;
    var commentMaxHeight = 712;
  
    var labelX = 10;
    var labelWidth = 30;
    var labelMaxHeight = 20;
    var labelHeight = cursorY - labelMaxHeight;
  
    var maxCharInComment = 78;
    var maxLinesInComment = 55;
  
    var commentBlockTextHeight = 12;
    var commentBlockMinHeight = 20;
  
    if (theAnnots.length > 0) {
      var totalLinesRemaining = maxLinesInComment;
      var testTotalLinesRemaining = 0;
      var pageSplit = false;
      var createNewPage = true;
      for (var i in theAnnots) {
        if (createNewPage) {
          commentPageNumber = addCommentPage(aNewDoc);
          cursorY = aRect[2] - 80;
          cursorHeight = 0;
          labelHeight = cursorY - labelMaxHeight;
          totalLinesRemaining = maxLinesInComment;
          testTotalLinesRemaining = 0;
          createNewPage = false;
        }
  
        var content = trimUpper(theAnnots[i].contents).toUpperCase();
        var amountOfLinesUsed =
          parseInt(parseInt(content.length) / maxCharInComment) + 1;
        var amountOfSpaceUsed = amountOfLinesUsed * commentBlockMinHeight;
  
        testTotalLinesRemaining = totalLinesRemaining - amountOfLinesUsed;
  
        if (testTotalLinesRemaining < 0) {
          // check if there is a full comment page available
          // if so add this whole comment to the page as we know its the max comment length
          if (totalLinesRemaining == maxLinesInComment) {
            var rectLabel = [labelX, cursorY, labelWidth, labelHeight];
            var rectComment = [commentX, cursorY, commentWidth, cursorMaxHeight];
  
            addCommentBlock(
              aNewDoc,
              uniqueCommentNumber,
              commentNumber,
              commentPageNumber,
              content,
              rectComment,
              rectLabel
            );
  
            uniqueCommentNumber--;
            commentNumber++;
  
            createNewPage = true;
          } else {
            pageSplit = true;
          }
        } else {
          // check to see if comment can fit on current comment page
          // app.alert("Remaining lines on comment page :: " + testTotalLinesRemaining);
          if (testTotalLinesRemaining > 0) {
            if (amountOfLinesUsed <= 4)
              cursorHeight = cursorY - amountOfLinesUsed * commentBlockMinHeight;
            else
              cursorHeight = cursorY - amountOfLinesUsed * commentBlockTextHeight;
  
            if (cursorHeight < 0) {
              cursorHeight = cursorMaxHeight;
              createNewPage = true;
            }
  
            var rectLabel = [labelX, cursorY, labelWidth, labelHeight];
            var rectComment = [commentX, cursorY, commentWidth, cursorHeight];
  
            addCommentBlock(
              aNewDoc,
              uniqueCommentNumber,
              commentNumber,
              commentPageNumber,
              content,
              rectComment,
              rectLabel
            );
  
            uniqueCommentNumber--;
            commentNumber++;
  
            cursorY = cursorHeight;
            labelHeight = cursorY - labelMaxHeight;
            totalLinesRemaining = testTotalLinesRemaining;
          } else {
            pageSplit = true;
          }
        }
  
        if (pageSplit) {
          var availableLinesOnPage = totalLinesRemaining;
          var remainingLinesOnNextPage = amountOfLinesUsed - availableLinesOnPage;
          /*app.alert("SPLIT COMMENT!!!\n Comment Lines :: " + amountOfLinesUsed + 
                              "\nAvailable lines left on page :: " + availableLinesOnPage +
                              "\nFallover lines on next page :: " + remainingLinesOnNextPage);*/
  
          if (availableLinesOnPage <= 4) {
            // whole comment should move to next page
  
            // start new page for second half of comment
            commentPageNumber = addCommentPage(aNewDoc);
            cursorY = aRect[2] - 80;
            cursorHeight = 0;
            labelHeight = cursorY - labelMaxHeight;
            totalLinesRemaining = maxLinesInComment;
            testTotalLinesRemaining = 0;
  
            // create second half of comment
            if (amountOfLinesUsed <= 4)
              cursorHeight = cursorY - amountOfLinesUsed * commentBlockMinHeight;
            else
              cursorHeight = cursorY - amountOfLinesUsed * commentBlockTextHeight;
  
            if (cursorHeight < 0) {
              cursorHeight = cursorMaxHeight;
              //createNewPage = true;
            }
  
            var rectLabel = [labelX, cursorY, labelWidth, labelHeight];
            var rectComment = [commentX, cursorY, commentWidth, cursorHeight];
  
            addCommentBlock(
              aNewDoc,
              uniqueCommentNumber,
              commentNumber,
              commentPageNumber,
              content,
              rectComment,
              rectLabel
            );
  
            uniqueCommentNumber--;
            commentNumber++;
  
            testTotalLinesRemaining = totalLinesRemaining - amountOfLinesUsed;
  
            cursorY = cursorHeight;
            labelHeight = cursorY - labelMaxHeight;
            totalLinesRemaining = testTotalLinesRemaining;
          } else {
            // split comment and create new page then create other half of comment on new page
            var c1 = content.substring(
              0,
              availableLinesOnPage * maxCharInComment
            );
            var c2 = content.substring(
              availableLinesOnPage * maxCharInComment,
              content.length
            );
            var c1Spaces = c1.split(/\s/g);
            var c1Last = c1Spaces[c1.split(/\s/g).length - 1];
            var content1 = "";
            var content2 = "";
            if (c1Spaces.length > 1 && c1Last != "") {
              content1 = c1.substring(0, c1.length - c1Last.length);
              content2 = c1Last + c2;
            } else {
              content1 = c1;
              content2 = c2;
            }
  
            // create first half of comment
            cursorHeight = cursorMaxHeight;
  
            var rectLabel = [labelX, cursorY, labelWidth, labelHeight];
            var rectComment = [commentX, cursorY, commentWidth, cursorHeight];
  
            addCommentBlock(
              aNewDoc,
              uniqueCommentNumber,
              commentNumber,
              commentPageNumber,
              content1,
              rectComment,
              rectLabel
            );
  
            uniqueCommentNumber--;
  
            // start new page for second half of comment
            commentPageNumber = addCommentPage(aNewDoc);
            cursorY = aRect[2] - 80;
            cursorHeight = 0;
            labelHeight = cursorY - labelMaxHeight;
            totalLinesRemaining = maxLinesInComment;
            testTotalLinesRemaining = 0;
  
            // create second half of comment
            if (remainingLinesOnNextPage <= 4)
              cursorHeight =
                cursorY - remainingLinesOnNextPage * commentBlockMinHeight;
            else
              cursorHeight =
                cursorY - remainingLinesOnNextPage * commentBlockTextHeight;
  
            if (cursorHeight < 0) {
              cursorHeight = cursorMaxHeight;
            }
  
            var rectLabel = [labelX, cursorY, labelWidth, labelHeight];
            var rectComment = [commentX, cursorY, commentWidth, cursorHeight];
  
            addCommentBlock(
              aNewDoc,
              uniqueCommentNumber,
              commentNumber,
              commentPageNumber,
              content2,
              rectComment,
              rectLabel
            );
  
            uniqueCommentNumber--;
            commentNumber++;
  
            testTotalLinesRemaining =
              totalLinesRemaining - remainingLinesOnNextPage;
  
            cursorY = cursorHeight;
            labelHeight = cursorY - labelMaxHeight;
            totalLinesRemaining = testTotalLinesRemaining;
          }
  
          pageSplit = false;
        }
      }
    }
  });

  var readCommentTextFile = app.trustedFunction(function (aNewDoc, type) {
    app.beginPriv();
  
    var filepath = "";
    if (type == "COMM_ENGINE") {
      filepath = "/C/Program Files/UNISA/comm_engine.txt";
    } else if (type == "TOT_ENGINE") {
      filepath = "/C/Program Files/UNISA/tot_engine.txt";
    } else if (type == "RUBRIC_ENGINE") {
      filepath = "/C/Program Files/UNISA/rubric_engine.txt";
    }
  
    try {
      var textArray = ["BOF"];
  
      var field = aNewDoc.addField("BOF", "text", aNewDoc.pageNum, [0, 0, 0, 0]);
      for (var i = 0; field.value != "EOF"; i++) {
        aNewDoc.importTextData(filepath, i);
        textArray.push(field.value);
      }
  
      aNewDoc.removeField("BOF");
    } catch (Error) {
      app.alert("There is no comment saved to file!", 1);
    }
  
    app.endPriv();
  
    return textArray;
  });