/*
PDF Marking Tool (PMT)

This file contains all functions that work with Acrobat annotations

NOTE: Acrobat defines a fixed number of properties for annotations. To enables the PMT to 
track the value and type of each annotation, we use a strict naming convention on the "name"
and "subject" properties of the annotations we create.

The annotation name property follows this format: [TYPE]:[count], where
 - TYPE is the tool type, eg. TICK, HALFT, CROSS, CHECK, MARK, COMMENTM, RUBRICM
 - count is a simple sequence number incremented each time an annotation is added
 - for example: "TICK:2"

The annotation subject property follows 2 different formats, depending on whether 
the type is for a structured annotation (MARK, COMMENTM, or RUBRICM) and for an 
unstructured annotation (TICK, HALFT, CROSS, CHECK)

For unstructured annotations, the format is: "MARK | " + [mark], where 
 - mark is the value of the annotation
 - for example: "MARK | 2"

For structured annotations, the format is: "MARK:[criterion] | " + [mark], where 
 - criterion is the criterion that the mark applies to
 - mark is the value of the annotation 
 - for example: "MARK:Question 2 | 5"

*/

// Parse an annotation to convert it to a structured JSON object
// That can be used for processing. The original annotation will
// be part of the returned object
var enrichAnnotWithMetadata = app.trustedFunction(function (annot) {
  app.beginPriv();

  var type = "UNKNOWN";
  var value = 0;
  var criterion = "UNDEFINED";
  var subject = annot.subject;
  var name = annot.name;
  var typeFound = false;

  if (name.indexOf("COMMENTM") == 0 && !typeFound) {
    type = "COMMENTM";
    typeFound = true;
    value = subject.substring(subject.indexOf("|") + 1, subject.length);
    criterion = subject.substring(
      subject.indexOf(":") + 1,
      subject.indexOf("|")
    ).trim();
    if (criterion.length === 0) {
      criterion = "UNDEFINED"
    }
  } else if (name.indexOf("MARK") == 0 && !typeFound) {
    type = "MARK";
    typeFound = true;
    value = subject.substring(subject.indexOf("|") + 1, subject.length).trim();
    criterion = subject.substring(
      subject.indexOf(":") + 1,
      subject.indexOf("|")
    ).trim();
    if (criterion.length === 0) {
      criterion = "UNDEFINED"
    }
  } else if (name.indexOf("RUBRICM") == 0 && !typeFound) {
    type = "RUBRICM";
    typeFound = true;
    value = subject.substring(subject.indexOf("|") + 1, subject.length).trim();
    criterion = subject.substring(
      subject.indexOf(":") + 1,
      subject.indexOf("|")
    ).trim();
    if (criterion.length === 0) {
      criterion = "UNDEFINED"
    }
  } else if (name.indexOf("TICK") == 0 && !typeFound) {
    type = "TICK";
    typeFound = true;
    value = subject.substring(subject.indexOf("|") + 1, subject.length).trim();
  } else if (name.indexOf("HALFT") == 0 && !typeFound) {
    type = "HALFT";
    typeFound = true;
    value = subject.substring(subject.indexOf("|") + 1, subject.length).trim();
  } else if (name.indexOf("CROSS") == 0 && !typeFound) {
    type = "CROSS";
    typeFound = true;
    value = subject.substring(subject.indexOf("|") + 1, subject.length).trim();
  } else if (annotName.indexOf("CHECK") == 0 && !typeFound) {
    type = "CHECK";
    typeFound = true;
    value = subject.substring(subject.indexOf("|") + 1, subject.length).trim();
  }

  var enrichedAnnot = {
    type: type,
    value: parseFloat(value),
    criterion: criterion,
    annot: annot
  };

  app.endPriv();
  return enrichedAnnot;
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

  var aimAnnot = aNewDoc.addAnnot({
    type: "Ink",
    page: aNewDoc.pageNum,
    name: "AIM",
    gestures: drawPoints,
    opacity: 0.5,
    strokeColor: color.red,
    width: 1,
  });

  app.endPriv();
  return aimAnnot;
});

// This is the main method for applying annotations to the document
// Arguments:
// - aNewDoc: The document on which to apply the annotation (There should be only one)
// - x: The X coordinate where to place the annotation
// - y: The Y coordinate where to place the annotation
// - criterion: The criterion to which the annotation applies (For unstructured marks, this value is passed as null)
// - comment: A comment to be applied with the annotation (For unstructured marks, this value is passed as null)
// - mark: The mark value associated with the annotation
// - type: the annotation type
var doAnnot = app.trustedFunction(function (
  aNewDoc,
  x,
  y,
  criterion,
  comment,
  mark,
  type
) {
  app.beginPriv();

  console.println(
    "Adding annotation: Coords=(" +
      x +
      "," +
      y +
      "), Criterion=" +
      criterion +
      ", Mark=" +
      mark +
      ", Type=" +
      type
  );
  var annotationName = "";
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
    mark = 0;
  } else if (type == "CHECK") {
    checkPoints = createCheck(aNewDoc, x, y);
    drawPoints = [checkPoints];
    mark = 0;
  } else if (type == "HALFT") {
    crossPoints = createHalfTick(aNewDoc, x, y);
    drawPoints = crossPoints;
    mark = 0.5;
  }

  annotationName = type + ":" + totalAnnotationCount;
  if (!structuredMark) {
    aNewDoc.addAnnot({
      type: "Ink",
      page: currentPage,
      name: annotationName,
      subject: "MARK | " + mark,
      gestures: drawPoints,
      width: 2,
    });
  } else {
    if (hasTextContentForAnnot) {
      var fullComment;
      if (type === "RUBRICM") {
        fullComment = "Rubric: " + criterion + "\n" + comment;
      } else {
        fullComment = comment;
      }
      aNewDoc.addAnnot({
        type: "Ink",
        page: currentPage,
        name: annotationName,
        subject: "MARK: " + criterion + " | " + mark,
        gestures: drawPoints,
        contents: fullComment,
        width: 2,
      });
    } else {
      aNewDoc.addAnnot({
        type: "Ink",
        page: currentPage,
        name: annotationName,
        subject: "MARK: " + criterion + " | " + mark,
        gestures: drawPoints,
        width: 2,
      });
    }
  }

  totalAnnotationCount++;

  app.endPriv();
  return annotationName;
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

var goToAnnotation = app.trustedFunction(function (
  annotationPage,
  annotationName
) {
  app.beginPriv();

  this.syncAnnotScan();
  var annotation = this.getAnnot(annotationPage, annotationName);
  this.pageNum = annotationPage;

  app.endPriv();
});

// Print a list of annotations to the console. This is used for debugging purposes
var listAnnotations = app.trustedFunction(function () {
  app.beginPriv();

  this.syncAnnotScan();
  var annots = this.getAnnots();

  var statusString = "Annotations: \n------------------------\n";
  statusString += "Total number of annotations: " + annots.length + "\n";

  for (var i = 0; i < annots.length; i++) {
    var tmpAnnotation = annots[i];
    statusString +=
      " - Page=" +
      tmpAnnotation.page +
      ", Name=" +
      tmpAnnotation.name +
      ", Type=" +
      tmpAnnotation.type +
      ", Subject=" +
      tmpAnnotation.subject +
      "\n";
  }

  console.println(statusString);

  app.endPriv();
});

var removeRubricBasedAnnotations = app.trustedFunction(function () {
  app.beginPriv();

  console.println("Removing Rubric-based annotations");
  this.syncAnnotScan();
  var annots = this.getAnnots();

  if (annots != null) {
    for (var i = 0; i < annots.length; i++) {
      var annotationName = annots[i].name;
      markerIndex = annotationName.indexOf("RUBRICM");
      if (markerIndex == 0) {
        console.println("Removing annotation: " + annotationName);
        annots[i].destroy();
      }
    }
  }

  app.endPriv();
});

// Collect all marking tool annotations in the document and assemble them together in
// a structured object, with separate arrays for each type.
// Each annotation is first enriched into a proper JSON object, so that we can
// easily access the type, value and criterion associated with each annotation
var collectAllEnrichedAnnotations = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  var allPmtAnnots;
  var countHalfTick = 0;
  var countTick = 0;
  var countCross = 0;
  var countCheck = 0;
  var countMark = 0;
  var countCommentMark = 0;
  var countRubricMark = 0;
  var arrAnnotHalfTick = new Array();
  var arrAnnotTick = new Array();
  var arrAnnotCross = new Array();
  var arrAnnotCheck = new Array();
  var arrAnnotMark = new Array();
  var arrAnnotCommentMark = new Array();
  var arrAnnotRubricMark = new Array();
  var annots = aNewDoc.getAnnots();
  if (annots != null) {
    for (var i = 0; i < annots.length; i++) {
      var enrichedAnnotation = enrichAnnotWithMetadata(annots[i]);
      var annotType = enrichedAnnotation.type;
      try {
        switch (annotType) {
          case "COMMENTM":
            arrAnnotCommentMark[countCommentMark] = enrichedAnnotation;
            countCommentMark++;
            console.println(
              "Counting COMMENTM annotation: Name=" +
                annots[i].name +
                ", Subject=" +
                annots[i].subject
            );
            break;
          case "RUBRICM":
            arrAnnotRubricMark[countRubricMark] = enrichedAnnotation;
            countRubricMark++;
            console.println(
              "Counting RUBRICM annotation: Name=" +
                annots[i].name +
                ", Subject=" +
                annots[i].subject
            );
            break;
          case "MARK":
            arrAnnotMark[countMark] = enrichedAnnotation;
            countMark++;
            console.println(
              "Counting MARK annotation: Name=" +
                annots[i].name +
                ", Subject=" +
                annots[i].subject
            );
            break;
          case "TICK":
            arrAnnotTick[countTick] = enrichedAnnotation;
            countTick++;
            console.println(
              "Counting TICK annotation: Name=" +
                annots[i].name +
                ", Subject=" +
                annots[i].subject
            );
            break;
          case "HALFT":
            arrAnnotHalfTick[countHalfTick] = enrichedAnnotation;
            countHalfTick++;
            console.println(
              "Counting HALFT annotation: Name=" +
                annots[i].name +
                ", Subject=" +
                annots[i].subject
            );
            break;
          case "CROSS":
            arrAnnotCross[countCross] = enrichedAnnotation;
            countCross++;
            console.println(
              "Counting CROSS annotation: Name=" +
                annots[i].name +
                ", Subject=" +
                annots[i].subject
            );
            break;
            case "CHECK":
              arrAnnotCheck[countCheck] = enrichedAnnotation;
              countCheck++;
              console.println(
                "Counting CHECK annotation: Name=" +
                  annots[i].name +
                  ", Subject=" +
                  annots[i].subject
              );
              break;
        }
      } catch (Error) {
        console.println("Error while counting PMT annotations: " + Error);
      }
    }

    var annotationCountResults =
      "Annotation Count Results: \n ----------------------------\n";
    annotationCountResults += "Half Ticks: " + countHalfTick + "\n";
    annotationCountResults += "Ticks: " + countTick + "\n";
    annotationCountResults += "Crosses: " + countCross + "\n";
    annotationCountResults += "Structured Marks: " + countMark + "\n";
    annotationCountResults += "Comment Marks: " + countCommentMark + "\n";
    annotationCountResults += "Rubric Marks: " + countMark + "\n";
    console.println(annotationCountResults);
  } else {
    app.alert("There are no marks to calculate!");
  }

  var totalPmtAnnotCount =
    countHalfTick +  
    countTick +
    countCross +
    countCheck +
    countMark +
    countCommentMark +
    countRubricMark;

  allPmtAnnots = {
    totalPmtAnnotCount: totalPmtAnnotCount,
    arrAnnotHalfTick: arrAnnotHalfTick,
    arrAnnotTick: arrAnnotTick,
    arrAnnotCross: arrAnnotCross,
    arrAnnotCheck: arrAnnotCheck,
    arrAnnotMark: arrAnnotMark,
    arrAnnotCommentMark: arrAnnotCommentMark,
    arrAnnotRubricMark: arrAnnotRubricMark,
  };
  app.endPriv();
  return allPmtAnnots;
});
