/*

This file contains reusable JavaScript functions related to the configuration of the marking tool

*/ 

var showAboutInfo = app.trustedFunction(
    function() {
      app.beginPriv();

      app.alert("PDF Marking tool\n" +
      "\n" +
      "The PDF Marking Tool is a custom plugin for Adobe Acrobat. It leverages a range of built-in Acrobat " +
      "features to allow the on-screen marking of PDF-based documents." +
      "\n\n" +
      "For additional information (including licensing and acknowledgements), please refer to: https://github.com/Peanut-Butter-OSS/PDF-Marking-Tool" +
      "\n" +
      "----------------------------------------------------------------------------\n" +
      "Version: "+markingToolVersion+"\n" +
      "Date: "+markingToolReleaseDate+"\n" +
      "----------------------------------------------------------------------------\n" +
      "\n" +
      "Tools currently enabled?: "+markingToolsActive+"\n", 3);

      app.endPriv();  
    }
  );