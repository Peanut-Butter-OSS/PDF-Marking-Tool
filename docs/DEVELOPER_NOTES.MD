The marking tool is predominantly a JavaScript plug-in for Adobe Acrobat

For some background on Acribat JavaScript, have a look at these links:
* https://acrobatusers.com/tutorials/javascript_console/
* https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/AcrobatDC_js_api_reference.pdf

The tool consists of 2 Javascript files that are loaded at runtime. These javascript files enable a marking toolbar to become available to the end user.

Firstly, you should ensure that JAvaScript is enables in Acrobat:
* In Acrobat DC Pro - 
    * Edit > Preferences > JavaScript
    * Ensure that "Enable Acribat JavaScript" is ticked
    * Ensure thath "Enable interactive console" is ticked

To ensure the Tool is accessible and the javascript runs correctly, the JS needs to be stored in the Javascripts folder. On my current machine the location is: 
* C:\Program Files (x86)\Adobe\Acrobat DC\Acrobat\Javascripts

All javascript files that are stored in this location will be automatically loaded whenever a PDF file is opened.

Once the above steps have been taken, JS files will load and execute automatically on Acrobat Startup.

To view the interactive console: Ctrl-J