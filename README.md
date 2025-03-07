# SBA308

## What does this script do?

This script function takes in 3 different arrays of data from a separate file called testData.js.

CourseInfo - an object with an id and course name.

AssignmentGroup - an object with an id, assignments information

LearnerSubmission - Submitted assignments with total points earned

Finally, it will return data for graded assignments.

## What is happening in the code?

The script first identifies the student IDs that have turned in assignments. It will then merge the AssignmentGroup information with the LearnerSubmission information in order to do assignment calculations per student ID for the final report output.

## How is the data returned?

The final script function returns an object with two properties: data(array), logfile(array)

They can be both accessed in this manner:

```
// initialize the data object
const finishedResult = getLearnerData(
  CourseInfo,
  AssignmentGroup,
  LearnerSubmissions
);

const myGrades = finishedResult.data; // array
const myLogfile = finishedResult.logFile; // array

// show the final results
console.log("Final Result:");
console.log(myGrades);

myLogfile.length > 0
  ? console.log("Log file: ")
  : console.log("No anomalies have occurred.");

// show the log file if anything unusual occurred
myLogfile.forEach((item) => {
  console.log(item);
});
```
