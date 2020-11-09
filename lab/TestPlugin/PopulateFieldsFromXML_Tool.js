//<AcroButtons name="PopulateFieldsFromXML_Tool" version="2.0" "modified="2/18/2011 13:9:22" id="2:17:2011:19:2:42">
// This script was created by AcroButtons from Windjack Solutions, www.windjack.com
// Place Extra-AcroButton Code in the following "Code Above" Section
//


//<CodeAbove>
//////////////////////////////////////////////
// 
//  ** GENERAL INSTALLATION INSTRUCTIONS:
//
//  This Acrobat Automation Script will only work when 
//  placed in one of the Acrobat JavaScript Folders. Execute
//  the following code from the Acrobat JavaScript Console to find
//  the location of the JavaScript folders. 
//
//  To display the Acrobat JavaScript Console use Ctrl+J on 
//  Windows and Command+J on the Mac
//
//      app.getPath("user","javascript");
//
//      app.getPath("app","javascript");
//
//  On Windows, the application JavaScript folder is usually located at:
//
//  C:\Program Files\Adobe\Acrobat 10.0\Acrobat\JavaScripts
//
//  On Mac, the application JavaScript folder is in a configuration file
//  inside the Acrobat Application Package.  
//
//  The script file can be placed in either the "User" or "App" JavaScript 
//  folder. 
//
//  This script was designed for Acrobat X and will not operate in previous 
//  version.  It will operate in both Adobe Reader and Acrobat Professional 
//  It will place a toolbar button on the "Plug-in Add-on" Tools Panel. 
//  in Acrobat X and Adobe Reader X. Acrobat must be restarted to activate 
//  the tool
//
//  NOTE:  Adobe Reader X only displays the tools panel when 
//         the PDF has been Enabled with Reader Rights
//         However, event though the tool is not displayed
//         it is loaded and working.
//


//*******************************************
//
// Populate Customer fields on an AcroForm from 
// selection of customers,  Customer data
// is loaded from an XML file
//

// Name of Customer File data
// Expected to be in Acrobat's User JavaScript folder.
// And to have a specific Gramar
var cFileName = "CustomerData.xml";

// Title for all Alert Boxes
var cAlertTitle = "Populate Customer Fields";

//***********************************
//
// PDFS_PopulateFieldsFromXMLSelect 
//
// Main Function called by this tool, 
// but can be called from any Acrobat context
//
// Inputs:
//    oDoc - PDF Document ot be operated on
//    cFilePath  - Optional path to customer data file
//
//   If the data file path is not provided the script looks
//   for the data file using the "cFileName" parameter spcified above
//   and the path to the User JavaScript folder
//
var PDFS_PopulateFieldsFromXMLSelect = app.trustedFunction(function(oDoc, cFilePath)
{
  app.beginPriv();

   // Check Version and Document paramameters to make sure
   // tool will work in the environment.
   if(app.viewerVersion < 10)
   {
       var cMsg = "This tool only operates in Acrobat/Reader X and later";
       app.alert(cMsg,0,0,cAlertTitle);
       return;
   }
   else if(oDoc == null)
   {
       var cMsg = "No Form Availible";
       app.alert(cMsg,0,0,cAlertTitle);
       return;
   }
   else if(oDoc.xfa != null)
   {
       var cMsg = "Current Form is LiveCycle (XFA)\n\nThis tool only operates on AcroForm PDFs";
       app.alert(cMsg,0,0,cAlertTitle);
       return;
   }
   else if( (oDoc.getField("Name") == null) && (oDoc.getField("Company") == null)
            && (oDoc.getField("Email") == null) )
   {// Check for form fields
       var cMsg = "This form does not contain any of the fields necessary to use the tool\n\nName, Company, Email";
       app.alert(cMsg,0,0,cAlertTitle);
       return;
   }

   if(cFilePath == null)
   {
      // Get Path to Customer XML Data File from user JavaScript Area
      var cJSPath = app.getPath("user","javascript").replace(/\/?$/,"/");
      cFilePath = cJSPath + cFileName;
      var nRtn = 0;
      var stmData = null;

      // Load file into Acrobat 
      try{
         stmData = util.readFileIntoStream(cFilePath);
      }catch(e){
        // Load Failed so ask user if they want to browse for file
        var cMsg = "Customer Data File not Found:\n" + cFilePath + "\n\nDo you whish to browse for the file";
        nRtn = app.alert(cMsg,1,2,cAlertTitle);
      }
   }
   
   // If there was an error in the previous block, and the user chose to 
   // Browse for the file
   if(nRtn == 4)
   {// Browse for file
     try{
        stmData = util.readFileIntoStream();
     }catch(e){
       stmData = null;
       var cMsg = "Failed to open customer data file\n\n Aborting Operation";
       app.alert(cMsg,0,0,cAlertTitle);
     }
   
   }
   
   // Parse stream data if it was loaded
   if(stmData)
   {// File data loaded, 
      
      // Remove Header And Parse into E4X object
      var xmlData = null;
      try{
         var cData = util.stringFromStream(stmData);
         xmlData = eval(cData.replace(/^\<\?.*\?\>\s*/,""));
      }catch(e){
         xmlData = null;
         var cMsg = "Error Parsing Customer XML Data\n\n" + e + "\n\nAborting Operation";
         app.alert(cMsg,0,0,cAlertTitle);
      }
   }
   
   // Test and then search Customer XML Data
   // if it was correctly parsed
   var aNames = [];
   if(xmlData)
   { // Stream data is valid, but not guarenteed to be XML
      if(typeof(xmlData) != "xml")
      {
         var cMsg = "Customer Data File does not contain XML\n\nAborting Operation";
         app.alert(cMsg,0,0,cAlertTitle);
      }
      else
      {  // Data is valid, parsed XML 
         //Check to see if it is the correct XML Gramar
          var nLen = xmlData.child("Customer").length();
          if(nLen == 0)
          {
             var cMsg = "Customer Data File does not contain any Customers\n\nAborting Operation";
             app.alert(cMsg,1,0,cAlertTitle);
          }
          else
          {
             for(var i=0;i<nLen;i++)
             {
                aNames.push(xmlData.Customer[i].Name.text() + ": " + xmlData.Customer[i].Company.text());
             }
          }
      }
   }
   
   if(aNames.length)
   {
      // Display list of customers to user in popup menu
      cRtn = app.popUpMenu.apply(app,aNames);
      if(cRtn)
      {// Find Customer that matches selection 
         var cName = cRtn;
         for(var i=0;i<nLen;i++)
         {
            if(cName == (xmlData.Customer[i].Name.text() + ": " + xmlData.Customer[i].Company.text() ))
               break;
         }
   
         if(i<nLen)
         {// Fill Fields with selected Data
            var oFld = oDoc.getField("Name");
            if(oFld)
               oFld.value = xmlData.Customer[i].Name.text();
   
            oFld = oDoc.getField("Company");
            if(oFld)
               oFld.value = xmlData.Customer[i].Company.text();

            oFld = oDoc.getField("Email");
            if(oFld)
               oFld.value = xmlData.Customer[i].Email.text();
         }
   
      }
   }
  app.endPriv();
});   
   
   
  
//</CodeAbove>

//<JSCodeSnippet name="ImageData7">
var strData7PopulateFieldsFromXML_Tool = 
"00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0FF685400FF756100" +
"FF705E00FF695600FF77705E00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0FF715D09FFDBC766" +
"FFEBD97BFFFFFEA8FF564F3D00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0FF6A5100FFFFE668" +
"FFF6E161FFFFEE6CFF514D1D00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0FF755C0BFFE0C749" +
"FFFFF373FFFFF270FF6E6A3A00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0FF504C2FFF585220FF605200FFA38B00FFFBE436" +
"FFF6E331FFE7DC28FFAFAD49FF6C7439FF657340FF48523900C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0FF5D5725FFD4C674FFF6DE53FFF5DE30" +
"FFF4E12FFFFFFF4DFFF7F591FFE6EEB3FF606E3B00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0FF5E5311FFE5CE5AFFE5D053" +
"FFFFF371FFFDF06DFFEEEEA6FF7E7F5F00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0" +
"FF7E7D79FF83827E00C1C1C100C1C1C100C1C1C100C1C1C1FFA6A6A100C0C0C0FF6B5400FFF0DB5E" +
"FFEADE5CFFFFF471FF6A6A2200C0C0C0FF82866FFF72726D00C0C0C000C0C0C000C0C0C000C0C0C0" +
"FF837D84FF6A636BFF83778DFF887C92FF7E808CFF7B7E85FF83878AFF636862FF524228FF6B5D3A" +
"FFE0D4AAFF695D33FF3E3E34FF76737AFF696272FF78718100C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C0FFA29BA3FFF1E5FBFFEADEF4FFF5F7FFFFF0F3FAFFEEF2F5FFFCFFFBFFE0D0B6FF7E704D" +
"FF83774DFFBFB389FFFFFFF6FFEAE7EEFF665F6F00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C0FF888775FFF5EFF1FF544E50FF3C463BFF243225FF20302DFF0B1B18FFFFFAFEFFFFFDFF" +
"FFE3E0D9FFF2EFE8FFFCFFFFFFFCFFFFFF57535400C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C0FF868573FFFFFDFFFF393335FFF9FFF8FF223023FFEEFEFBFF1C2C29FFEFEAEEFFFFFDFF" +
"FFFFFFF8FFFFFFF8FFEAEDEDFFFCFFFFFF5C585900C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C0FFA4A699FFE9E2EAFFFCF5FDFFF3FBECFF364332FFF4FFF8FFE6F2F2FFFFFBFFFFEBE4F6" +
"FFF5F3F6FFFFFEFFFFF9FFFFFFF1FAF9FF58585600C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C0FF9A9C8FFFE8E1E9FFF8F1F9FFEDF5E6FF293625FFEAF5EEFFF7FFFFFFF7F3F7FFFCF5FF" +
"FFFFFEFFFFF6F5F6FFF9FFFFFFF7FFFFFF62626000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C0FFABB0ACFFFAF1FFFFF2E9FEFFF0F3E8FF24271CFFFBFFF5FFE8EDE6FFFFF7FFFFFFF6FF" +
"FFFFFEF8FFF8F8F0FFF9FFFAFFF9FFFAFF4D524B00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C0FF7C817DFFEFE6F4FFFFF6FFFF26291EFF12150AFF0F1309FFFCFFFAFFFFF7FFFFFFF8FF" +
"FFF9F8F2FFFFFFF8FFF5FBF6FFF9FFFAFF40453E00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C0FF747474FFF0F0F0FFF5F5F5FFFAFAFAFFF4F4F4FFFFFFFFFFF6F6F6FFFFFFFFFFFCFCFC" +
"FFFFFFFFFFFFFFFFFFF8F8F8FFFEFEFEFF4D4D4D00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0" +
"FF828282FF777777FF464646FF434343FF4E4E4EFF3A3A3AFF3F3F3FFF434343FF3C3C3CFF4C4C4C" +
"FF2D2D2DFF3C3C3CFF404040FF484848FF5E5E5EFF5D5D5D00C0C0C000C0C0C000C0C0C000C0C0C0" +
"FF808080FF69696900C1C1C100C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C1C1C100C1C1C1" +
"00C1C1C100C1C1C100C1C1C100C1C1C1FF6B6B6BFF54545400C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0" +
"00C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C000C0C0C0";
//</JSCodeSnippet>


// Icon Generic Stream Object
//<JSCodeSnippet name="ButtonIconDef">
var oIconPopulateFieldsFromXML_Tool = {count: 0, width: 20, height: 20,
read: function(nBytes){return strData7PopulateFieldsFromXML_Tool.slice(this.count, this.count += nBytes);}};
//}
//</JSCodeSnippet>

//<JSCodeSnippet name="EventCode">
var DoCmdPopulateFieldsFromXML_Tool = 
"PDFS_PopulateFieldsFromXMLSelect(event.target);"
//</JSCodeSnippet>

//<JSCodeSnippet name="ButtonObjDef">
var oButObjPopulateFieldsFromXML_Tool = 
{cName: "PopulateFieldsFromXML_Tool",
cExec: DoCmdPopulateFieldsFromXML_Tool,
cEnable: "event.rc = (app.doc != null)",
cMarked: "event.rc = false",
cTooltext: "Populate form fields from customer data in an XML file",
nPos: -1,
cLabel: "Fill Fields",
oIcon: oIconPopulateFieldsFromXML_Tool};
//</JSCodeSnippet>

try{app.removeToolButton("PopulateFieldsFromXML_Tool");}catch(e){}

//<JSCodeSnippet name="TryAddBut">
try{app.addToolButton(oButObjPopulateFieldsFromXML_Tool);}catch(e){}
//</JSCodeSnippet>
 
//</AcroButtons>



