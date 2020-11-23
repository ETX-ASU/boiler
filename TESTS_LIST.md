

### Instructor / Assignments 

#### AssignmentNewOrDupe.js

* When it mounts:
  * Should show option to create new assignment
  * Should nav to AssignmentCreator when create button is clicked 
  * When no pre-existing assignments are found
    * should not show option to duplicate
  * When pre-existing assignment are found
    * should show them in listing
    * When 'dupe' button is pressed
      * Should duplicate selected assignment
      * Should give it name "copy of X-orig-name-X"
      * Should navigate to editing screen

#### AssignmentCreator.js

* When it mounts:
  * Should display form to create assignment data
  * When user clicks top cancel button
    * Should show modal warning user changes will be lost
      * When user clicks modal cancel
        * Should close modal
      * When user clicks continue
        * Should return to AssignmentNewOrDupe.js screen
  * When user clicks top submit button
    * Should create new assignment in DB
      * Should return to AssignmentNewOrDupe.js screen

#### AssignmentEditor.js

* When it mounts:
  * Should display form to edit assignment data
  * Should pre-populate form with existing assignment data
  * When user clicks top cancel button
    * Should show modal warning user changes will be lost
    * Should close modal/return to edit screen when user clicks modal cancel
    * When user clicks continue
      * When assignmentId does NOT exist
        * Should return to AssignmentNewOrDupe.js screen
      * When assignmentId DOES exist
        * Should return to AssignmentViewer.js screen
  * When user clicks top submit button
    * Should save changes to assignment in DB
    * Should trigger refresh that updates current assignment data
      * When assignmentId does NOT exist
        * Should return to AssignmentNewOrDupe.js screen
      * When assignmentId DOES exist
        * Should return to AssignmentViewer.js screen

#### AssignmentViewer.js

* When it mounts:
  * When no activeReviewedStudent is selected
    * When no students are in the class
      * Show show notice that no students are enrolled
    * When students are enrolled
      * Should show listing of all students
        * Should show name of each student
        * Should indicate progress status of each student's homework
        * Should indicate grading status of each student's homework
        * Should indicate autoScore of each student's homework
        * Should indicate resultScore of each student's homework
      * When anonymize is ON
        * Should show anonymized version of student name
      * When anonymize button is toggled
        * Should toggle anonymize state on/off
      * When a student name is clicked
        * Should set selected user as activeReviewedStudent
        * Should navigate to HomeworkReview.js screen
        
