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

  var getConfigDialog = app.trustedFunction(
    function() {
      app.beginPriv();
  
      var dialog = {
        initialize: function (dialog) {
          // Create a static text containing the current date.
          var todayDate = dialog.store()["date"];
          todayDate = "Date: " + util.printd("mmmm dd, yyyy", new Date());
  
          // Load from Global configs
          var configReadyToMarkFolder = global.readyToMarkFolder;
          var configMarkingCompleteFolder = global.markingCompleteFolder;
          var configMarkerName = global.markerName;
          var lastConfigChangeDate = global.lastConfigChangeDate;
  
          dialog.load({ 
            "date": todayDate,
            "rtmf": configReadyToMarkFolder,
            "mcfl": configMarkingCompleteFolder,
            "mknm": configMarkerName,
            "lccd": lastConfigChangeDate
          });
        },
        commit:function (dialog) { 
          // called when OK pressed
          var results = dialog.store();
          // Now do something with the data collected, for example,
          global.readyToMarkFolder = results['rtmf'];
          global.setPersistent("readyToMarkFolder", true);
          global.markingCompleteFolder = results['mcfl'];
          global.setPersistent("markingCompleteFolder", true);
          global.markerName = results['mknm'];
          global.setPersistent("markerName", true);
          global.lastConfigChangeDate = results['lccd'];
          global.setPersistent("lastConfigChangeDate", true);
        },
        description:
        {
          name: "Marking Tool Configuration", // Dialog box title
          align_children: "align_left",
          width: 350,
          height: 400,
          elements:
          [
            {
              type: "ok_cancel",
              ok_name: "Ok",
              cancel_name: "Cancel"
            },
            {
              type: "cluster",
              name: "System Folders",
              align_children: "align_left",
              elements:
              [
                {
                  type: "view",
                  align_children: "align_row",
                  elements:
                  [
                    {
                      type: "static_text",
                      name: "Ready to mark folder:    "
                    },
                    {
                      item_id: "rtmf",
                      type: "edit_text",
                      alignment: "align_fill",
                      width: 300,
                      height: 20
                    }
                  ]
                },
                {
                  type: "view",
                  align_children: "align_row",
                  elements:
                  [
                    {
                      type: "static_text",
                      name: "Marking Complete Folder: "
                    },
                    {
                      item_id: "mcfl",
                      type: "edit_text",
                      alignment: "align_fill",
                      width: 300,
                      height: 20
                    }
                  ]
                },
              ]
            }
          ]
        }
      };
  
      app.endPriv();
      
      return dialog;   
    }
  );

  var configureMarkingTool = app.trustedFunction(
    function() {
      app.beginPriv();

      var configDialog = getConfigDialog();
      app.execDialog(configDialog);

      app.endPriv();  
    }
  );

