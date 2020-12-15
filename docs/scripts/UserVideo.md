# Video Script - Usage Basics

#### Snippet 1 - START

Hello World

This is video 2 is a series of three videos that provide an introduction to installing and using the PDF marking tool. 
 - Video 1 covers installation of the tool
 - Video 2 (This video) covers basic usage of the tool, and
 - Video 3 explores the new Rubric marking functionality in the tool

Please take note: These videos apply only to v 2 and above of the marking tool, since a large number of changes were introduced during the upgrade from v1.x to v2.x

#### Snippet 1 - END
####
#### ===============================
####
#### Snippet 2 - START

The PDF marking tool was originally developed in 2009 as an open source product with funding from the University of South Africa. Since then there have been minor upgrades to stay aligned with changes in Operating Systems and the Adobe Acrobat platform. 

In 2020, with the assistance of Adobe and Learning Curve, we were able to secure funding for some much-needed functional enhancements to the product.

#### Snippet 2 - END
####
#### ===============================
####
#### Snippet 3 - START

For the purposes of this video we are assuming that you have completed the installation process and are now ready to begin working with the tool.

#### Snippet 3 - END
####
#### ===============================
####
#### Snippet 4 - START

We'll cover the following topics:
 - How to check if the tool was installed
 - How to view or update the tool configuration
 - How to open a PDF document for marking
 - How to access the marking tools
 - How to add unstructured marks
 - How to add structured marks
 - How to add structured marks with comments
 - How to add uncounted annotations
 - How to generate the results page
 - How to finalise a marked document

#### Snippet 4 - END
####
#### ===============================
####
#### Snippet 5 - START

## How to check if the tool was installed
Once you open Adobe Acrobat, and assuming the marking tool was successfully installed you should see a new menu item
under the edit menu.

If you don't see this menu item it means one of two things:

1. The tool did not install correctly, or
2. You might have opened Adobe Acrobat Reader, not Acrobat DC (Don't worry, it happens to the best of us)

#### Snippet 5 - END
####
#### ===============================
####
#### Snippet 6 - START

Under the marking tool menu, you will find an item titled "About". If you select this item, the system pops up a dialog that gives some basic information about the tool. The most important pieces of information are:
 - The version number
 - The installation folder

Also note that the GitHub URL is provided for the marking tool. This is where we manage the development of new feature requests, so if you have ideas or suggestions, please feel free to get in touch.

#### Snippet 6 - END
####
#### ===============================
####
#### Snippet 7 - START

## How to view or update the tool configuration
Also under the marking tool menu, you will find another item titled "Config". If you select this item, the system pops up a dialog that allows you to adjust the configuration options for the marking tool.

At the moment, the only configurable item is the name of the current marker, but in the future, additional options may be added here.

#### Snippet 7 - END
####
#### ===============================
####
#### Snippet 8 - START

## How to open a PDF document for marking
When using the PDF marking tool, it is essential that you only work with one active PDF document at a time. The best way to achieve this is to follow these steps:

1. Ensure Adobe Acrobat DC is closed
2. In you file explorer, right-click on the PDF file you want to mark
3. Select "Open with Adobe Acrobat DC" from the context menu

Important: Do NOT select the "Edit with Adobe Acrobat" option.

If you follow these steps, Adobe Acrobat DC will open, with your document open and ready to mark.

#### Snippet 8 - END
####
#### ===============================
####
#### Snippet 9 - START

You can verify that the document is ready to mark by opening the "Current Status" item under the "Edit" > "PDF Marking Tool" menu. This will open a dialog that provides a summary of the current status of the marking tool, based on the document that has been selected for marking.

Let's quickly run through the items listed in the status dialog:

#### Snippet 9 - END
####
#### ===============================
####
#### Snippet 10 - START

1. Marking Tools Active
   1. This value tell you whether the marking tools were activated during the startup phase of Adobe Acrobat.
   2. The possible value are: ACTIVE and NOT ACTIVE
   3. You want this value to be ACTIVE

#### Snippet 10 - END
####
#### ===============================
####
#### Snippet 11 - START

2. Initialization Errors Found:
   1. This value gives an indication if any unexpected errors occurred during the startup phase of Adobe Acrobat.
   2. You want this value to be "FALSE"

#### Snippet 11 - END
####
#### ===============================
####
#### Snippet 12 - START

3. Tool load statuses
   1. The next set of items list each of the tools individually, along with a detailed status of the tool's status
   2. The possible values are: "NOT LOADED", "LOADED WITH ICON", "LOADED WITHOUT ICON", and "FAILED TO LOAD"
   3. Ideally, you want this value to be "LOADED WITH ICON"

#### Snippet 12 - END
####
#### ===============================
####
#### Snippet 13 - START

4. Document Marking Status
   1. This value gives you the current status of the active document
   2. Initially the value will be UNKNOWN, but during the course of marking a document, the different values will change to "IN PROGRESS", "COUNTED" and then "FINALISED"

#### Snippet 13 - END
####
#### ===============================
####
#### Snippet 14 - START

Assuming the marking tools are ACTIVE, no initialization errors were found and all tools are shown in the "LOADED WITH ICON" state, you are ready to start marking. If not, your best solution will be to carefully repeat the steps for opening a PDF, as described earlier.

#### Snippet 14 - END
####
#### ===============================
####
#### Snippet 15 - START

## How to access the marking tools
The marking tools are added into Adobe Acrobat under the "Add-On tools" category. 

To access them, simply click Tools, and then "Add-on tools", this will open the tools for use.

What I like to do is to add a shortcut to the "Add-on tools", this makes it faster to access them when opening documents in the future.

To create a shortcut to the add-on tools, simply select the "Add shortcut" option and place the shortcut in your preferred position.

#### Snippet 15 - END
####
#### ===============================
####
#### Snippet 16 - START

## Understanding different approaches to marking
The PDF marking tool supports 2 different approaches to marking. The first approach is called free-format marking, where you add ticks and marks at any place in the document, according to your needs.

The second approach is called rubric-based marking, where you use a pre-built rubric that provides guidance to a marker. 

Since rubric-based marking involves a few setup steps, we have dedicated a separate video for rubric-based marking

#### Snippet 16 - END
####
#### ===============================
####
#### Snippet 17 - START

## How to add unstructured marks
Unstructured marks refer to the tick and half-tick tools in the toolbar. They are called unstructured marks, because they add a mark to the document, but they do not specify which question the mark applies to.

A half-tick mark always counts exactly 0.5 marks, but a tick-mark can be configured to count a specific number of marks.

Once you set the value of a tick-mark, it remembers it for the current marking session

In this example, I will mark question 1, using a few unstructured marks

#### Snippet 17 - END
####
#### ===============================
####
#### Snippet 18 - START

## How to add structured marks
Structured marks are added using the "Add a Mark" tool. They are called structured, because they allow the marker to associate a mark with a specific criterion being marked.

For example, here I am adding a mark that applies to question 2.

Notice that after I click on the point to mark, the system pops up a dialog that allows me to specify the marks as well as the criterion to which they apply.

It should be noted however, that you could leave the Criterion field empty. To demonstrate, I will add a mark to question 3 without specifying the criterion.

#### Snippet 18 - END
####
#### ===============================
####
#### Snippet 19 - START

## How to add structured marks with comments
Sometimes you want to add a unique comment alongside a mark. If this is required, simply use the "Comment Mark" tool

For example, here I will be adding a mark with a comment to Question 4. The system also pops up a dialog, but not the dialog includes an extra field in which I can type a comment.

Once the mark is applied, you can hover over the annotation to see the comment.

#### Snippet 19 - END
####
#### ===============================
####
#### Snippet 20 - START

## How to add uncounted annotations
The system also includes a two annotations that do not carry a mark value, they are:
 - The "Checked" stamp, and 
 - The "Cross" tool

The Checked stamp is intended to show that the marker has taken note of something in the answer, without assigning a specific value to it.

The Cross tool is intended to show that an answer is incorrect. The cross tool also does not add any mark value to the document.

As an example, I will use the cross tool to show that the answer for question 5 is incorrect.

#### Snippet 20 - END
####
#### ===============================
####
#### Snippet 21 - START

## How to generate the results page
After all questions in a document have been marked, the next step is to count up all the marks. This is as simple as clicking the "Count Marks" button.

When this button is clicked, the system pops up a dialog asking the user to specify the total value of the assignment or exam. For our example, I'll specify that the total value is 100 marks.

Once the total has been specified, the system automatically adds a new page to the document. The new page contains the marking results summary, breaking down the marks according to the criteria they were applied to.

In our example we used 2 structured marks and all other marks were unstructured. The system counts all the marks up and calculates the percentage.

Although not a typical use case, it is also possible to add additional marks at this stage and recalculate the results. I'll demonstrate this by adding an additional tick to question 1.

#### Snippet 21 - END
####
#### ===============================
####
#### Snippet 22 - START

## How to finalise a marked document
If the marker is satisfied with the calculated marks, the final step is to FINALISE the document. Notice in the bottom left corner of the results page, there is a new button titled "Finalise". When this button is clicked, the document will be moved into a FINAL state, after which marks can no longer be added or changed.

Let me demonstrate this by finalising the document.

Notice that the system provides a warning. If I acknowledge this warning, the system now creates a new document which contains the score in the file name.

Also notice that I can no longer apply marks to the document

#### Snippet 22 - END
####
#### ===============================
####
#### Snippet 23 - START

Additionally, notice that a further page was added to the document listing all off the comments. In our example, only one comment was added.

If I now close the document and open it again, you will notice two things:
1. The Add-on toolbar is no longer available, and
2. The status dialog highlights that the marking status is FINALISED

#### Snippet 23 - END
####
#### ===============================
####
#### Snippet 24 - START

## Conclusion
That brings us to the end of the basic marking functionality.

As mentioned earlier, the PDF marking Tool also support a rubric-based approach to marking. 

Rubric-based marking will be explained in the third video of the series.

See you there

#### Snippet 24 - END

