/*
PDF Marking Tool (PMT)

This file contains generic utility methods used by other files in the PMT

*/

var addBlankPage = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  var newPageNum = -1;

  var blankSheetPath = baseFilePath + "BlankSheet.pdf";

  aNewDoc.insertPages({
    nPage: aNewDoc.numPages - 1,
    cPath: blankSheetPath,
    nStart: 0,
  });

  newPageNum = aNewDoc.numPages - 1;

  app.endPriv();

  return newPageNum;
});

// Vanilla implementation of trim method, because the JS version bundled with
// Acrobat does include trim
String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g, "");
};

var trimUpper = app.trustedFunction(function (str) {
  console.println("Value before trim: |"+str+"|");
  str = str.replace(/\r?/gm, " ");
  str = str.replace(/\s{2,}/g, "|");
  str = str.replace(/\s/g, "");
  str = str.replace(/\|/g, " ");

  str = str.replace(/^\s/, "");
  console.println("Value after trim: |"+str+"|");
  return str.toUpperCase();
});

// This is a vanilla implementation of the array.includes() method which is built
// into more recent versions of javascript
var arrayContainsString = app.trustedFunction(function (arr, str) {
  var includes = false;

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === str) {
      includes = true;
      break;
    }
  }

  return includes;
});

var listFields = app.trustedFunction(function () {
  app.beginPriv();

  var statusString = "Form fields: \n------------------------\n";
  statusString += "Total number of fields: " + this.numFields + "\n";
  var tmpField;
  for (var fieldNumber = 0; fieldNumber < this.numFields; fieldNumber ++)  {
    tmpField = this.getField(this.getNthFieldName(fieldNumber));
    var fieldName = tmpField.name;
    var fieldPage = tmpField.page;
    var fieldType = tmpField.type;
    var fieldValue = tmpField.value;
    statusString += " - Page="+fieldPage+", Name="+fieldName+", Type="+fieldType+", Value="+fieldValue+"\n";
  }

  console.println(statusString);

  app.endPriv();
});
