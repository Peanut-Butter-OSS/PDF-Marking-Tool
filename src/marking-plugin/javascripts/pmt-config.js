/*

PDF Marking Tool (PMT)

This file contains functions related to the configuration of the marking tool

*/

var showAboutInfo = app.trustedFunction(function () {
  app.beginPriv();

  app.alert(
    "PDF Marking tool\n" +
      "\n" +
      "The PDF Marking Tool is a custom plugin for Adobe Acrobat. It leverages a range of built-in Acrobat " +
      "features to allow the on-screen marking of PDF-based documents." +
      "\n\n" +
      "For additional information (including licensing and acknowledgements), please refer to: https://github.com/Peanut-Butter-OSS/PDF-Marking-Tool" +
      "\n" +
      "----------------------------------------------------------------------------\n" +
      "Version: " +
      markingToolVersion +
      "\n" +
      "Date: " +
      markingToolReleaseDate +
      "\n" +
      "----------------------------------------------------------------------------\n" +
      "\n" +
      "Tools currently enabled?: " +
      markingToolsActive +
      "\n\n" + 
      "Installation Folder: " +
      baseFilePath +
      "\n",
    3
  );

  app.endPriv();
});

var getConfigDialog = app.trustedFunction(function () {
  app.beginPriv();

  var configDialog = {
    initialize: function (configDialog) {

      // Load from Global configs
      var configMarkerName = global.markerName;
      var configMarkingCompleteFolder = global.markingCompleteFolder;
      
      configDialog.load({
        mcfl: configMarkingCompleteFolder,
        name: configMarkerName,
      });
    },
    commit: function (configDialog) {
      // called when OK pressed
      var results = configDialog.store();
      // Now do something with the data collected, for example,
      global.markingCompleteFolder = results["mcfl"];
      global.setPersistent("markingCompleteFolder", true);
      global.markerName = results["name"];
      global.setPersistent("markerName", true);
    },
    description: {
      name: "Marking Tool Configuration", // Dialog box title
      align_children: "align_left",
      width: 350,
      height: 400,
      first_tab: "crit",
      elements: [
        {
          type: "cluster",
          name: "Marking Tool Configuration",
          align_children: "align_left",
          elements: [
            {
              type: "static_text",
              name: "Marker Name:",
            },
            {
              item_id: "name",
              type: "edit_text",
              alignment: "align_fill",
              width: 200,
              height: 20,
              next_tab: "mcfl",
            },
            // {
            //   type: "static_text",
            //   name: "Marking Complete Folder:",
            // },
            // {
            //   item_id: "mcfl",
            //   type: "edit_text",
            //   alignment: "align_fill",
            //   width: 200,
            //   height: 20,
            //   next_tab: "mcfl",
            // },
          ],
        },
        {
          alignment: "align_left",
          type: "ok_cancel",
          ok_name: "Ok",
          cancel_name: "Cancel",
        }
      ],
    },
  };

  app.endPriv();

  return configDialog;
});

var configureMarkingTool = app.trustedFunction(function () {
  app.beginPriv();

  var configDialog = getConfigDialog();
  app.execDialog(configDialog);

  app.endPriv();
});
