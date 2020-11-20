/*
PDF Marking Tool (PMT)

This file contains generic utility methods used by other files in the PMT

*/

var addBlankPage = app.trustedFunction(function (aNewDoc) {
  app.beginPriv();

  var newPageNum = -1;

  aNewDoc.insertPages({
    nPage: aNewDoc.numPages - 1,
    cPath: "/C/Program Files/UNISA/BlankSheet.pdf",
    nStart: 0,
  });

  newPageNum = aNewDoc.numPages - 1;

  app.endPriv();

  return newPageNum;
});

var trim = app.trustedFunction(function (str) {
  str = str.replace(/\r?/gm, " ");
  str = str.replace(/\s{2,}/g, "|");
  str = str.replace(/\s/g, "");
  str = str.replace(/\|/g, " ");

  str = str.replace(/^\s/, "");

  return str.toUpperCase();
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
