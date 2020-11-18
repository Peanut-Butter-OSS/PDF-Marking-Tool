/*

This file contains the code relates to all annotation capability in the plugin,
i.e. for applyiing the Acrobat Annotations

*/

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
    doAimAnnot(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY);

    dialog = getCommentMarkDialog(
      aNewDoc,
      aNewDoc.mouseX,
      aNewDoc.mouseY,
      type
    );

    app.execDialog(dialog);

    // TODO - Not sure what this is doing
    if (skipRemoveButtons == false) {
      deselectCurrentTool(aNewDoc);
    } else {
      skipRemoveButtons = false;
    }
  } else if (type == "MARK") {
    doAimAnnot(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY);

    dialog = getMarkDialog(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY, type);

    app.execDialog(dialog);

    // TODO - Not sure what this is doing
    if (skipRemoveButtons == false) {
      deselectCurrentTool(aNewDoc);
    } else {
      skipRemoveButtons = false;
    }
  } else if (type == "RUBRICM") {
    doAimAnnot(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY);

    dialog = getRubricMarkDialog(aNewDoc, aNewDoc.mouseX, aNewDoc.mouseY, type);

    app.execDialog(dialog);

    // TODO - Not sure what this is doing
    if (skipRemoveButtons == false) {
      deselectCurrentTool(aNewDoc);
    } else {
      skipRemoveButtons = false;
    }
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

// The Aim Annotation is a temporary annotation added to the document before a dialog is popped up
var doAimAnnot = app.trustedFunction(function (aNewDoc, x, y) {
  app.beginPriv();

  var drawPoints = [];
  var points1 = drawArc(0, 0, 0, 360, 15);
  var points2 = drawArc(0, 0, 0, 360, 10);
  var points3 = drawArc(0, 0, 0, 360, 5);

  drawPoints[0] = points1;
  drawPoints[1] = points2;
  drawPoints[2] = points3;

  drawPoints = rotateObjectPoints(drawPoints, aNewDoc, x, y);

  aNewDoc.addAnnot({
    type: "Ink",
    page: aNewDoc.pageNum,
    name: "AIM",
    gestures: drawPoints,
    opacity: 0.5,
    strokeColor: color.red,
    width: 1,
  });

  app.endPriv();
});

// This is the main method for applying annotations to the document
// Arguments:
// - aNewDoc: The document on which to apply the annotation (There should be only one)
// - x: The X coordinate where to place the annotation
// - y: The Y coordinate where to place the annotation
// - section: The section to which the annotation applies (For unstructured marks, this value is passed as null)
// - comment: A comment to be applied with the annotation (For unstructured marks, this value is passed as null)
// - mark: The mark value associated with the annotation
// - type: the annotation type
var doAnnot = app.trustedFunction(function (aNewDoc, x, y, section, comment, mark, type) {
  app.beginPriv();

  console.println("Adding annotation: Coords=("+x+","+y+"), Section="+section+", Mark="+mark+", Type="+type);

  var currentPage = aNewDoc.pageNum;

  var tickPoints;
  var crossPoints;
  var checkPoints;
  var circlePoints;
  var numberPoints;

  var structuredMark = false;

  var drawPoints = [];

  var hasTextContentForAnnot = false;

  if (type == "RUBRICM") {
    numberPoints = createNumbers(aNewDoc, x, y, mark);
    drawPoints = numberPoints;
    structuredMark = true;
    hasTextContentForAnnot = true;
  } else if (type == "COMMENTM") {
    numberPoints = createNumbers(aNewDoc, x, y, mark);
    drawPoints = numberPoints;
    structuredMark = true;
    hasTextContentForAnnot = true;
  } else if (type == "MARK") {
    numberPoints = createNumbers(aNewDoc, x, y, mark);
    drawPoints = numberPoints;
    structuredMark = true;
  } else if (type == "TICK") {
    tickPoints = createTick(aNewDoc, x, y);
    drawPoints = [tickPoints];
  } else if (type == "CROSS") {
    crossPoints = createCross(aNewDoc, x, y);
    drawPoints = crossPoints;
    mark = 0
  } else if (type == "CHECK") {
    checkPoints = createCheck(aNewDoc, x, y);
    drawPoints = [checkPoints];
    mark = 0;
  } else if (type == "HALFT") {
    crossPoints = createHalfTick(aNewDoc, x, y);
    drawPoints = crossPoints;
    mark = 0.5;
  }

  if (!structuredMark) {
    aNewDoc.addAnnot({
      type: "Ink",
      page: currentPage,
      name: type + ":" + totalAnnotationCount,
      subject: "MARK | " + mark,
      gestures: drawPoints,
      width: 2,
    });
  } else {
    if (hasTextContentForAnnot) {
      aNewDoc.addAnnot({
        type: "Ink",
        page: currentPage,
        name: type + ":" + totalAnnotationCount,
        subject: "MARK: " + section + " | " + mark,
        gestures: drawPoints,
        contents: comment,
        width: 2,
      });
    } else {
      aNewDoc.addAnnot({
        type: "Ink",
        page: currentPage,
        name: type + ":" + totalAnnotationCount,
        subject: "MARK: " + section + " | " + mark,
        gestures: drawPoints,
        width: 2,
      });
    }
  }

  totalAnnotationCount++;

  app.endPriv();
});

var createCheck = app.trustedFunction(function (aNewDoc, x, y) {
  var drawPoints = [];
  var points1 = [];
  var points2 = [];

  var bufferx = 0;
  var buffery = 0;

  points1[0] = [bufferx - 6, buffery - 6];
  points1[1] = [bufferx, buffery];
  points1[2] = [bufferx + 4, buffery - 14];

  drawPoints = [points1];
  var arr = rotateObjectPoints(drawPoints, aNewDoc, x, y);
  drawPoints = arr[0];

  return drawPoints;
});

var createHalfTick = app.trustedFunction(function (aNewDoc, x, y) {
  var drawPoints = [];
  var points = [];
  var points2 = [];

  var bufferx = 0;
  var buffery = 0;

  points[0] = [bufferx + 11, buffery + 10];
  points[1] = [bufferx, buffery];
  points[2] = [bufferx - 4, buffery + 4];

  points2[0] = [bufferx + 11.25, buffery + 10.75];
  points2[1] = [bufferx + 11.25, buffery + 5];

  drawPoints = [points, points2];
  var arr = rotateObjectPoints(drawPoints, aNewDoc, x, y);
  drawPoints = arr;

  return drawPoints;
});

var createTick = app.trustedFunction(function (aNewDoc, x, y) {
  var drawPoints = [];
  var points = [];

  var bufferx = 0;
  var buffery = 0;

  points[0] = [bufferx + 11, buffery + 10];
  points[1] = [bufferx, buffery];
  points[2] = [bufferx - 4, buffery + 4];

  drawPoints = [points];
  var arr = rotateObjectPoints(drawPoints, aNewDoc, x, y);
  drawPoints = arr[0];

  return drawPoints;
});

var createCross = app.trustedFunction(function (aNewDoc, x, y) {
  var drawPoints = [];
  var points = [];
  var points2 = [];

  var bufferx = 0;
  var buffery = 0;

  points[0] = [bufferx + 6, buffery + 10];
  points[1] = [bufferx - 6, buffery - 2];

  points2[0] = [bufferx - 6, buffery + 10];
  points2[1] = [bufferx + 6, buffery - 2];

  drawPoints = [points, points2];
  var arr = rotateObjectPoints(drawPoints, aNewDoc, x, y);
  drawPoints = arr;

  return drawPoints;
});

var degreesToRadians = app.trustedFunction(function (degrees) {
  return (degrees * Math.PI) / 180;
});

// A utility method to draw an arc at a specific X/Y coordinate of the document.
// It returns an array of points that comprise the arc.
var drawArc = app.trustedFunction(function (
  x,
  y,
  start_degree,
  end_degree,
  radius
) {
  var points = [];

  var angle = start_degree;
  var i = 0;

  if (start_degree > end_degree) {
    while (angle >= end_degree) {
      points[i] = [
        parseFloat(x + Math.cos(degreesToRadians(angle)) * radius),
        parseFloat(y + Math.sin(degreesToRadians(angle)) * radius),
      ];
      angle -= 1;
      i++;
    }
  } else {
    while (angle <= end_degree) {
      points[i] = [
        parseFloat(x + Math.cos(degreesToRadians(angle)) * radius),
        parseFloat(y + Math.sin(degreesToRadians(angle)) * radius),
      ];
      angle += 1;
      i++;
    }
  }

  return points;
});

// A utility method to draw a circle with a specific radiusc at a specific X/Y 
// coordinate of the document. It returns an array of points that comprise the circle.
var drawCircle = app.trustedFunction(function (x, y, radius) {
  var angle = 0.1;
  var nNodes = 360;
  var circlePoints = new Array();
  for (var i = 0; i < nNodes; i++) {
    circlePoints[i] = [
      x + Math.cos(angle) * radius,
      y + Math.sin(angle) * radius,
    ];

    angle += 0.1;
  }

  return circlePoints;
});

var createNumbers = app.trustedFunction(function (aNewDoc, x, y, m) {
  var currentPage = aNewDoc.pageNum;

  var currentPageRotation = aNewDoc.getPageRotation({ nPage: currentPage });

  var bufferx = 0;
  var buffery = 0;
  var currx = x;
  var curry = y;

  if (currentPageRotation == 90) {
    isPortrait = false;
  } else {
    isPortrait = true;
  }

  var drawPoints = [];
  var circlePoints = [];

  var flag = -1;
  var hasTwoNumbers = false;
  var hasThreeNumbers = false;
  var createHalfMark = false;
  var isOnehundred = false;
  var isNegative = false;
  var number1 = -1;
  var number2 = -1;
  var number3 = -1;

  var halfmarkPoints = [];
  var countPointArrays = -1;

  if (m < 0) {
    m = m.substring(1, m.length);

    isNegative = true;
  }

  if (m <= 9.5 && m >= 0) {
    circlePoints = drawCircle(bufferx, buffery, 22);

    var numberhalf = m.substring(m.indexOf("."), m.indexOf(".") + 1);

    if (numberhalf == ".") {
      number1 = m.substring(0, 1);
      number2 = m.substring(m.indexOf(".") + 1, m.length);
      m = number1;
      bufferx -= 6;

      hasTwoNumbers = true;
      createHalfMark = true;
    }
  } else if (m > 9.5 && m <= 100) {
    circlePoints = drawCircle(bufferx, buffery, 22);

    number1 = m.substring(0, 1);

    if (m == 100) {
      m = "1";
      number2 = "0";
      number3 = "0";
      bufferx -= 10;

      isOnehundred = true;
      hasThreeNumbers = true;
    } else if (m.length == 4) {
      number2 = m.substring(1, m.indexOf("."));
      number3 = m.substring(m.indexOf(".") + 1, m.length);

      m = number1;
      bufferx -= 11;

      hasThreeNumbers = true;
    } else {
      number2 = m.substring(1, m.length);

      m = number1;
      bufferx -= 5;

      hasTwoNumbers = true;
    }
  }

  countPointArrays++;
  drawPoints[countPointArrays] = circlePoints;

  var joinTwoPoints = false;
  var joinThreePoints = false;
  while (flag == -1) {
    switch (m) {
      case "0": {
        mx = bufferx;
        my = buffery;

        cx = bufferx;
        cy = buffery + 2.5;

        cx2 = bufferx;
        cy2 = buffery - 2;

        var points1 = drawArc(cx, cy, 182, -2, 3);
        var points2 = [];
        points2[0] = [mx + 3, my + 2.5];
        points2[1] = [mx + 3, my - 2];
        var points3 = [];
        points3[0] = [mx - 3, my + 2.5];
        points3[1] = [mx - 3, my - 2];
        var points4 = drawArc(cx2, cy2, 178, 362, 3);

        countPointArrays++;
        drawPoints[countPointArrays] = points1;
        countPointArrays++;
        drawPoints[countPointArrays] = points2;
        countPointArrays++;
        drawPoints[countPointArrays] = points3;
        countPointArrays++;
        drawPoints[countPointArrays] = points4;
        break;
      }
      case "1": {
        mx = bufferx;
        my = buffery;

        var points1 = [];
        points1[0] = [mx - 3, my + 3];
        points1[1] = [mx, my + 5];
        points1[2] = [mx, my - 5];
        var points2 = [];
        points2[0] = [mx - 4, my - 5];
        points2[1] = [mx + 4, my - 5];

        countPointArrays++;
        drawPoints[countPointArrays] = points1;
        countPointArrays++;
        drawPoints[countPointArrays] = points2;
        break;
      }
      case "2": {
        mx = bufferx;
        my = buffery;

        cx = bufferx;
        cy = buffery + 2;

        var points1 = drawArc(cx, cy, 182, -9, 3);
        var points2 = [];
        points2[0] = [mx + 3, my + 2];
        points2[1] = [mx - 3, my - 5];
        points2[2] = [mx + 4, my - 5];

        countPointArrays++;
        drawPoints[countPointArrays] = points1;
        countPointArrays++;
        drawPoints[countPointArrays] = points2;
        break;
      }
      case "3": {
        mx = bufferx;
        my = buffery;

        cx = bufferx;
        cy = buffery + 2.5;

        cx2 = bufferx;
        cy2 = buffery - 2.5;

        var points1 = [];
        points1[0] = [mx - 3.5, my + 5];
        points1[1] = [mx + 0.5, my + 5];
        var points2 = drawArc(cx, cy, 90, -90, 2.5);
        var points3 = [];
        points3[0] = [mx - 2.5, my];
        points3[1] = [mx + 0.5, my];
        var points4 = drawArc(cx2, cy2, 90, -90, 2.5);
        var points5 = [];
        points5[0] = [mx - 3.5, my - 5];
        points5[1] = [mx + 0.5, my - 5];

        countPointArrays++;
        drawPoints[countPointArrays] = points1;
        countPointArrays++;
        drawPoints[countPointArrays] = points2;
        countPointArrays++;
        drawPoints[countPointArrays] = points3;
        countPointArrays++;
        drawPoints[countPointArrays] = points4;
        countPointArrays++;
        drawPoints[countPointArrays] = points5;
        break;
      }
      case "4": {
        mx = bufferx;
        my = buffery;

        var points1 = [];
        points1[0] = [mx + 4, my - 3];
        points1[1] = [mx - 4, my - 3];
        points1[2] = [mx + 1, my + 5.5];
        var points2 = [];
        points2[0] = [mx + 1, my + 6];
        points2[1] = [mx + 1, my - 6];

        countPointArrays++;
        drawPoints[countPointArrays] = points1;
        countPointArrays++;
        drawPoints[countPointArrays] = points2;
        break;
      }
      case "5": {
        mx = bufferx;
        my = buffery;

        cx = bufferx;
        cy = buffery - 2;

        var points1 = [];
        points1[0] = [mx + 3.5, my + 5];
        points1[1] = [mx - 2, my + 5];
        var points2 = [];
        points2[0] = [mx - 2, my + 6];
        points2[1] = [mx - 2, my];
        var points3 = [];
        points3[0] = [mx - 2, my + 1];
        points3[1] = [mx + 1, my + 1];
        var points4 = drawArc(cx, cy, 90, -90, 3);
        var points5 = [];
        points5[0] = [mx + 1, my - 5];
        points5[1] = [mx - 3, my - 5];

        countPointArrays++;
        drawPoints[countPointArrays] = points1;
        countPointArrays++;
        drawPoints[countPointArrays] = points2;
        countPointArrays++;
        drawPoints[countPointArrays] = points3;
        countPointArrays++;
        drawPoints[countPointArrays] = points4;
        countPointArrays++;
        drawPoints[countPointArrays] = points5;
        break;
      }
      case "6": {
        mx = bufferx;
        my = buffery;

        cx = bufferx;
        cy = buffery + 2;

        cx2 = bufferx;
        cy2 = buffery - 2.5;

        var points1 = drawArc(cx, cy, 10, 180, 3);
        var points2 = [];
        points2[0] = [mx - 3, my + 2.5];
        points2[1] = [mx - 3, my - 2.5];
        var points3 = drawArc(cx2, cy2, 0, 360, 3);

        countPointArrays++;
        drawPoints[countPointArrays] = points1;
        countPointArrays++;
        drawPoints[countPointArrays] = points2;
        countPointArrays++;
        drawPoints[countPointArrays] = points3;
        break;
      }
      case "7": {
        mx = bufferx;
        my = buffery;

        var points1 = [];
        points1[0] = [mx - 4, my + 5];
        points1[1] = [mx + 4, my + 5];
        points1[2] = [mx - 2, my - 6];

        countPointArrays++;
        drawPoints[countPointArrays] = points1;
        break;
      }
      case "8": {
        cx = bufferx;
        cy = buffery + 3;

        cx2 = bufferx;
        cy2 = buffery - 2;

        var points1 = drawArc(cx, cy, -60, 240, 2.5);
        var points2 = drawArc(cx2, cy2, 0, 360, 3);

        countPointArrays++;
        drawPoints[countPointArrays] = points1;
        countPointArrays++;
        drawPoints[countPointArrays] = points2;
        break;
      }
      case "9": {
        mx = bufferx;
        my = buffery;

        cx = bufferx;
        cy = buffery + 2.5;

        cx2 = bufferx;
        cy2 = buffery - 2;

        var points1 = drawArc(cx, cy, 0, 360, 3);
        var points2 = [];
        points2[0] = [mx + 3, my + 2.5];
        points2[1] = [mx + 3, my - 2.5];
        var points3 = drawArc(cx2, cy2, 0, -170, 3);

        countPointArrays++;
        drawPoints[countPointArrays] = points1;
        countPointArrays++;
        drawPoints[countPointArrays] = points2;
        countPointArrays++;
        drawPoints[countPointArrays] = points3;
        break;
      }
    }

    if (hasTwoNumbers == false && hasThreeNumbers == false) {
      flag = 0;
    }

    if (joinTwoPoints == true) {
      hasTwoNumbers = false;

      flag = 0;
      break;
    }

    if (isNegative) {
      var points = [];
      points[0] = [bufferx - 9, buffery];
      points[1] = [bufferx - 5, buffery];
      countPointArrays++;
      drawPoints[countPointArrays] = points;

      isNegative = false;
    }

    if (joinThreePoints == true) {
      flag = -1;

      joinThreePoints = false;
      joinTwoPoints = true;
      hasThreeNumbers = false;

      if (!isOnehundred) {
        var points = [];
        points[0] = [bufferx + 5, buffery - 5];
        points[1] = [bufferx + 7, buffery - 5];
        countPointArrays++;
        drawPoints[countPointArrays] = points;

        bufferx += 12.5;
      } else {
        bufferx += 10;
      }

      m = number3;
    }

    if (hasThreeNumbers == true) {
      flag = -1;

      joinThreePoints = true;

      m = number2;
      bufferx += 10;
    } else if (hasTwoNumbers == true) {
      flag = -1;

      joinTwoPoints = true;

      if (createHalfMark) {
        var points = [];
        points[0] = [bufferx + 5, buffery - 5];
        points[1] = [bufferx + 7, buffery - 5];
        countPointArrays++;
        drawPoints[countPointArrays] = points;

        bufferx += 11;
      } else {
        bufferx += 10;
      }
      m = number2;
    }
  }

  drawPoints = rotateObjectPoints(drawPoints, aNewDoc, currx, curry);

  return drawPoints;
});

var rotateObjectPoints = app.trustedFunction(function (
  drawPoints,
  aNewDoc,
  currx,
  curry
) {
  var currentPage = aNewDoc.pageNum;

  var currentPageRotation = aNewDoc.getPageRotation({ nPage: currentPage });

  var pageSizeBox = aNewDoc.getPageBox("Crop");
  var width = pageSizeBox[2] - pageSizeBox[0];
  var height = pageSizeBox[1] - pageSizeBox[3];

  var arr = [];
  var innerX;
  var innerY;
  var mxFromRot;
  for (var i = 0; i < drawPoints.length; i++) {
    arr = drawPoints[i];
    mxFromRot = new Matrix2D().fromRotated(aNewDoc, aNewDoc.pageNum);
    drawPoints[i] = mxFromRot.transform(arr);
  }

  for (i = 0; i < drawPoints.length; i++) {
    arr = drawPoints[i];
    for (j = 0; j < arr.length; j++) {
      innerX = arr[j][0];
      innerY = arr[j][1];

      if (currentPageRotation == 0) {
        innerX = innerX + currx;
        innerY = innerY + curry;
      } else if (currentPageRotation == 90) {
        innerX = innerX + currx - width;
        innerY = innerY + curry;
      } else if (currentPageRotation == 180) {
        innerX = innerX + currx - width;
        innerY = innerY + curry - height;
      } else if (currentPageRotation == 270) {
        innerX = innerX + currx;
        innerY = innerY + curry - width;
      }

      arr[j][0] = innerX;
      arr[j][1] = innerY;
    }

    drawPoints[i] = arr;
  }

  return drawPoints;
});

var coordinateAnnotInSpace = app.trustedFunction(function (
  aNewDoc,
  annot,
  count
) {
  var pageSizeBox = aNewDoc.getPageBox("Crop");
  var width = pageSizeBox[2] - pageSizeBox[0];
  var height = pageSizeBox[1] - pageSizeBox[3];

  var ae2d = [];

  var numberW = 10;
  var numberWdouble = 17;
  var numberH = 15;
  var shiftUp = 18;
  var shiftRight = -15;
  var twenty = 20;

  var currentPageRotation = aNewDoc.getPageRotation({ nPage: annot.page });
  var coord = [];
  coord = annot.rect;

  if (count > 8) {
    numberW = numberWdouble;
  }

  if (currentPageRotation == 0) {
    ae2d[0] = [coord[2], coord[3]];
    ae2d[1] = [coord[0], coord[1]];

    coord[0] = ae2d[0][0] + shiftRight;
    coord[1] = ae2d[0][1] + shiftUp;
    coord[2] = coord[0] - numberW;
    coord[3] = coord[1] - numberH;
  } else if (currentPageRotation == 90) {
    ae2d[0] = [coord[3], coord[2]];
    ae2d[1] = [coord[1], coord[0]];

    coord[0] = 20 + ae2d[0][0] + shiftRight;
    coord[1] = width + twenty - ae2d[0][1] + shiftUp;
    coord[2] = coord[0] - numberW;
    coord[3] = coord[1] - numberH;
  } else if (currentPageRotation == 180) {
    ae2d[0] = [coord[0], coord[1]];

    coord[0] = ae2d[0][0] + shiftRight;
    coord[1] = height + twenty - ae2d[0][1] + shiftUp;
    coord[2] = coord[0] - numberW;
    coord[3] = coord[1] - numberH;
  } else if (currentPageRotation == 270) {
    ae2d[0] = [coord[3], coord[2]];

    coord[0] = width + twenty - ae2d[0][0] + shiftRight;
    coord[1] = ae2d[0][1] + shiftUp;
    coord[2] = coord[0] - numberW;
    coord[3] = coord[1] - numberH;
  }

  return coord;
});

var listAnnotations = app.trustedFunction(function () {
  app.beginPriv();

  this.syncAnnotScan();
  var annots = this.getAnnots();

  var statusString = "Annotations: \n------------------------\n";
  statusString += "Total number of annotations: " + annots.length + "\n";

  for (var i = 0; i < annots.length; i++) {
    var tmpAnnotation = annots[i];
    statusString += " - Page="+tmpAnnotation.page+", Name="+tmpAnnotation.name+", Type="+tmpAnnotation.type+", Subject="+tmpAnnotation.subject+"\n";
  }
 
  console.println(statusString);

  app.endPriv();
});