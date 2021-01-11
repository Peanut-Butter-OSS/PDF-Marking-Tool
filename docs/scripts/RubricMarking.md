# Rubric setup video script

#### Snippet 1 - START

Hello World

This is video 3 in a series of three videos that provide an introduction to installing and using the PDF marking tool. 
 - Video 1 covers installation of the tool
 - Video 2 covers basic usage of the tool, and
 - Video 3 (This video) explores the new Rubric marking functionality in the tool

Please take note: These videos apply only to v 2 and above of the marking tool, since a large number of changes were introduced during the upgrade from v1 to v2

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

For the purposes of this video we are assuming that you have completed the installation process and that you are comfortable with the basic usage of the marking tool

#### Snippet 3 - END
####
#### ===============================
####
#### Snippet 4 - START

We'll cover the following topics:
 - Overview of rubric-based marking
 - How to link a pre-configured rubric to an assignment 
 - How to add rubric marks
 - How to use custom comments and marks in a rubric
 - How the results page is generated in rubric based marking
 - How to creating your own rubric 

#### Snippet 4 - END
####
#### ===============================
####

## Overview of rubric-based marking
In most instances, assignments or exams are not marked by a single person. This may lead to inconsistent marking, because each marker may apply their own criteria for marking submissions.

Rubric-based marking is designed to overcome this potential risk. A rubric is typically compiled by a single examiner and serves as a guideline for markers to ensure they apply the same standards when marking. 

A rubric is always created for exactly one assignment or exam and defines the following:

* A set of criteria to be marked
* For each criterion, a set of levels that could be applied, and
* For each level, an associated mark value and comment.

Let's look at an example:

Our example is for an introductory English poetry assignment. This assignment contains 5 questions.
* Questions 1 to 4 are simple questions in which the answer is simply correct or incorrect
  * Each question has a value of 2 marks, if the answer is wrong, the student gets 0 marks. 
  * And, of course, if the answer is correct, the student gets 2 marks
* Question 5 is an essay type question, where the marker should look at the overall argument of the answer, as well as the grammar used.

In this example our rubric will be composed with the following criteria:
* Question 1
* Question 2
* Question 3
* Question 4
* Question 5 - Argument Structure
* Question 5 - Grammar

For question 1 to 4, we will define the following levels:
* Correct
* Incorrect

Each level will then have an associated "Default Comment" and an associated mark value

Question 5 will be different, since there is much more variability in an essay question. There will be 2 criteria applied for question 5, along with the levels that are possible for each. One criterion focuses on the grammar used and the second criterion focuses on the argument structure

Once again, each level is associated with a default comment and mark.

Using such a rubric, the marker does not need to apply their own personal standards when marking the submission, they can simply apply the standards as defined by the examiner. This ensures overall consistency and fairness for all students.

## How to link a pre-configured rubric to an assignment 
Marking rubrics have to be attached to an assignment before they can be used for marking.

To attach the rubric, you must first have access to the Rubric file. A rubric file uses a JSON structure, so the file name will be something like MyRubric.json. If you have this file saved somewhere on your computer, you are ready to proceed.

Let me demonstrate you to attach a Rubric to an Assignment file.

First, I will open the file as I always do with the marking tool.
Then I open the "Edit" > "PDF Marking Tool" > Rubric menu

From the Rubric Menu I will choose the "Select Rubric" function. The system first shows me a brief explanation and then I am allowed to pick my rubric file.

Once the rubric file has been linked you may notice 3 important results:

1. A new page has been added to the document, containing the values specified in the rubric
1. The rubric file has been added as an attachment to the document
2. The current status and marking type of the document has been automatically updated

At this point you are ready to proceed with rubric-based marking

## How to add rubric marks
Rubric-driven marks are added using the "Rubric Mark" tool. Let me demonstrate by adding a mark to question 1:

Notice that after I click on the point to mark, the system pops up a dialog. In the dialog there are 2 dropdown fields. The first field is titled "Criterion". This is where I will pick the criterion being marked. By default this dropdown shows the first unmarked criterion in the assignment.

After the criterion has been selected, the second dropdown field (titled "Level") allows me to select the result level for the particular question. In our example, the only options are "Correct" and "Incorrect"

Once I've selected "Correct" as the level, notice that the Marks and Comments field is pre-populated from the rubric. At this point I can simply click OK to apply the rubric mark

For demonstration purposes I will now quickly mark questions 2-4. Notice that the system automatically selects the next unmarked criterion, making it faster to mark and making double-marks less likely.

Before we move on to Question 5, I'd like to make a quick detour and show you what has been happening in the rubric page while we were adding marks.

Notice that the rubric table is has been filled in, showing which questions have already been marked.

Also notice that the questions that have already been marked, now have a new button on the right hand side. If I click this button, the PDF will show the page on which the mark appears. Let me demonstrate this by clicking on the button next to Question 1. After click the button I am automagically taken to the page on which the mark appears. 
Take note though, that I'm only taken to the page on which it appears - Depending on my current screen resolution and the page size, I may need to scroll down to see the mark.

## How to use custom comments and marks in a rubric
You may recall that Question 5 is an essay style question where we are marking based on 2 separate criteria: The argument structure as well as the grammar used.

To mark question 5, we could easily just follow the process we've been following all along, but simply adding one mark for each of the criteria. However, I'd like to use the opportunity to show how defaults comments and marks can be overridden

While adding the mark for argument structure, I see that there are 5 pre-configured levels. Based on the names for each of the levels, I feel that the correct level is "Successful and convincing", but I would want to add a custom comment and also adjust the marks proposed from a 7 to an 8  

Notice that after I selected level "Successful and convincing" I am still able to adjust the mark value and the default comment.

## How the results page is generated in rubric based marking
After all questions in a document have been marked, the next step is to count up all the marks. This is as simple as clicking the "Count Marks" button.

When this button is clicked, the system pops up a dialog asking the user to specify the total value of the assignment or exam. Because this is a rubric based assignment, the value is already populated with the total value from our Rubric.

Once the total has been specified, the system automatically adds a new page to the document. The new page contains the marking results summary, breaking down the marks according to the criteria they were applied to.

Notice that the results page now neatly lists each of the criteria from our rubric along with the marks for each.

If you are satisfied with the results, you can finalise the document. The finalise process works exactly the same as described in the basic usage video.

## How to creating your own rubric 
Now that we understand how to use a rubric for marking, it is time to explore how to create a new rubric.

As mentioned earlier in this video, rubrics are files created using the JSON structure.

JSON files are simply text files that you can edit with any text editor, even something like Windows Notepad. Personally, I prefer to use a free tool called Visual Studio Code. Visual Studio Code is a powerful text editor published by Microsoft. You can download and install it from their website at code . visualstudio . com

Let me open the rubric file we used earlier in this demonstration.

If you have never seen a JSON file, the file might seem intimidating at first, but it is actually very simple to understand. the important thing to understand is that a JSON file is designed to be easy to read for humans AND computers. As a result, it has some strict formatting rules, but besides that it simply uses normal english.

To explain the rubric file strcuture, I will assemble the JSON file from start to finish, explaining each portion as we go.

Step 1: Create a new JSON file
I have already created a folder on my desktop titled "Rubric Demonstration". Our rubric file will be created here.

My first step is to open visual studio code. Notice that it shows a default welcome page. I'll close that for now, since we won't be using it.

Next I will open my folder in Visual Studio Code. So I will go to File > Open Folder, and select the folder that I created

Next I'll create the new file. There are, of course, many ways to create a new file. For me the easiest and fastest way is to click the "New File" button inside the VS Code project.

Step 2: Curly Braces
A JSON file always starts for an opening curly bracket and ends with a closing curly bracket. This allows the reader to know where the file starts and ends. In technical lingo, we call everything within the curly brackets an OBJECT. In our particular case, the main object in the file is a RUBRIC

Step 3: Adding some properties to the Object
In order to specify the details of the rubric we need to list each of its properties. One property is added at a time, listing the name of the property and then the value of that property. The names and values are enclosed in quotations and separated by a colon.

In this example notice that we have number of properties, including:
* A rubric Id, which is just a unique number
* A rubric name, which is intended for human consumption
* A version for the rubric, which is useful if we need to make adjustments to an existing rubric
* The course code that the rubric applies to
* An id for the assignment that the rubric applies to
* The total possible marks for the assignment, in this case the assignment will count out of 20

If you look carefully ans still structure, you should notice some interesting things:

Firstly, notice that the property names are written in an interesting way, they don't have spaces between the words, and every subsequent word is capitalized. This makes it easier for the computer to read. But don't be too concerned about this, because you will never be defining your own properties, you will be using existing properties.

The second thing to notice is that some property values are simple characters, like the Rubric name and the course code. These are called character strings and they must be enclosed in quotation marks

Other property values are numbers, like the rubric Id and the version. These are just included directly.

Also notice that each line ends with a comma, EXCEPT the very last line

Additionally, you may notice that the property names are shown in blue, character strings in orange and numbers in green. This is actually a feature of Visual Studio Code, which makes JSON files much easier to work with.

Step 4: Adding criteria
To add the marking criteria to our rubric, we simply add a new property with the name CRITERIA.

However, the value of this property will not be a simple string or number. Instead it will be a LIST of other objects. To show a list we use square brackets. So let's add an opening and closing square bracket to denote the list.

Inside our list, we could've just added a list of simple strings or numbers, but that will not suffice for our purposes, our list needs to contain nested objects. As you remember from earlier, objects are enclosed in curly brackets.

First I add a line break inside our list, to make things easier to see

Let's start by just adding one criterion to the list. Notice that I first add the curly brackets and then I add the properties that describe a criterion. In this case:
* A criterion Id, which is just a unique number within this rubric
* A criterion name, which is intended for human consumption
* The total possible marks for this particular criterion. The first criterion will count out of 2

Great stuff, so now we have a rubric for our assignment, and it includes one criterion. 

Before we proceed, let's circle back for a short while to recap the structure of a rubric. Earlier in the video we showed this image which explained that a rubric contains multiple criteria, and then each criteria will have multiple levels. And for each level, we will specify the marks and default comment.

So based on this we need to add some more information to our criterion.

Step 5: Adding levels

I will add a new property called "levels", and once again this will be a list of objects. In our example, I'll add 2 sets of curly brackets inside the list, because we will have 2 potential levels for our criterion. It can either be correct, or incorrect.

And all that remains now is to specify the properties of each level. Each level will have a name, the marks and the default comment.

And that is it for the first criterion

To create a second criterion, we can simply copy and past the existing one and make changes as necessary. Indeed, I would expect that most examiners would generally reuse an existing template rubric instead of creating a file from scratch, like we are doing here.

There's one important thing I'd like to highlight at this point: Remember that I mentioned earlier that each property is followed by a comma, except the last one. This rule also applies in lists, so you should just check those carefully. 
If you look at the example, notice that we have commas between the two criterion objects and also between the two level objects.

As an example, if I remove one of these commas, Visual Studio Code immediately adds a red underline to the next row, to highlight that something is wrong. This is another reason why using Visual Studio Code is valuable.

Step 6: Importing your rubric
Now that we've created a rubric, we should test it by importing it into marking tool. 

I'll demonstrate by following the same steps shown earlier, but this time I'll import our brand new rubric.

Notice that after import, the new rubric marking page was added and it includes all the options that we specified in the JSON file.

But what if there is an error in your Rubric JSON file?

Well, when you import a rubric, marking tool will validate the file to ensure it is correctly structured and that it includes all the required properties. If the file is invalid, it will not allow the import.

Let's demonstrate this by making a minor change to the rubric file that will cause it to fail upload. Let me remove the rubricId, which is a mandatory field.

Now I'll remove the old rubric and attempt to import our new (but broken) rubric

Notice, when I now try to import the rubric, the system gives me a clear indication wheat the error is.

Step 7: Distributing the rubric
Once you are satisfied with the rubric JSON file, you can distribute it to the relevant markers via any suitable channel, such as email, storing it on your LMS or central file server.

## Reusing an existing rubric template
As mentioned earlier, it is unlikely that you will often create rubric files front scratch in the way that we did in this video. What is more likely is that you will simply reuse an existing rubric file and edit it according to your needs.

For this purpose, the marking tool includes the Demo Rubric inside the installation folder.

## Conclusion
That brings us to the end of the rubric functionality, and also the last video in this series.

Remember, if you have any ideas or suggestions for future improvements, please feel free to get in touch via GitHub.

Thanks for watching


