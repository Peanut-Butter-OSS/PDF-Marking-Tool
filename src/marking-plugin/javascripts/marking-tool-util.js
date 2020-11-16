/*
 UTIL METHODS
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