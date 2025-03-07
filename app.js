import { CourseInfo, AssignmentGroup, LearnerSubmissions } from "./testData.js";

function getLearnerData(course, ag, submission) {
  if (ag.course_id !== course.id) {
    throw new Error(
      "CourseInfo id and AssignmentGroup course_id do not match."
    );
  }

  let finalResult = [];
  let logs = [];

  let studentIds = getStudentIds(submission);

  try {
    studentIds.forEach((studentId) => {
      const gradebook = setUpGradebook(ag);
      const studentGrades = getStudentAssignments(studentId, submission);
      const mergedGrades = mergeStudentGradebook(studentGrades, gradebook);

      const result = createStudentObject(studentId, mergedGrades);
      finalResult.push(result);
    });
  } catch {
    logs.push(
      "ERROR: Please check if your data is formatted correctly and try again!"
    );
  }

  return {
    data: finalResult,
    logFile: logs,
  };

  function createStudentObject(id, assignments) {
    let studentObject = {};

    studentObject.id = id;
    studentObject.avg = getWeightedAverage(assignments);

    assignments.forEach((assignment) => {
      const earned = assignment.earned;
      const total = assignment.total;

      studentObject[assignment.assignId] =
        Math.round((earned / total) * 1000) / 1000;
    });

    return studentObject;
  }

  function getStudentIds(objectsArray) {
    let ids = [];
    objectsArray.forEach((obj) => {
      if (!ids.includes(obj.learner_id)) {
        ids.push(obj.learner_id);
      }
    });

    return ids;
  }

  function mergeStudentGradebook(studentScores, blankGradeBook) {
    let storage = [];

    blankGradeBook.forEach((assignment) => {
      let result;
      try {
        studentScores.forEach((assignScore) => {
          if (assignScore.assignId === assignment.assignId) {
            result = { ...assignment, ...assignScore };
          }
        });

        if (!isAssignmentLate(result)) {
          logs.push(
            `Student ${result.studentId} has turned in assignment #${result.assignId} late and will be penalized 10% off the assignment grade.`
          );
          result.earned -= assignment.total * 0.1;
        }
        storage.push(result);
      } catch {
        logs.push(
          `ERROR: There was problem merging a record for assignment ${assignment.assignId}.`
        );
      }
    });

    return storage;
  }

  function isAssignmentLate(assignment) {
    const dateDue = Date.parse(assignment.dueDate);
    const dateSubmit = Date.parse(assignment.submittedAt);

    if (dateDue >= dateSubmit) return true;

    return false;
  }

  function isAssignmentDateReached(assignment) {
    const dateDue = Date.parse(assignment.dueDate);
    const currDate = Date.now();

    if (dateDue <= currDate) return true;

    return false;
  }

  function setUpGradebook(ag) {
    let gradebook = [];

    for (const assignment of ag.assignments) {
      // my second type of loop that is not forEach
      let studentGradeBook = {
        assignId: assignment.id,
        dueDate: assignment.due_at,
        earned: 0.0,
        total: assignment.points_possible,
      };

      if (studentGradeBook.total === 0) {
        logs.push(
          `ERROR: Assignment #${studentGradeBook.assignId} was assigned 0 weighted points and was excluded.`
        );
      } else if (!isAssignmentDateReached(studentGradeBook)) {
        logs.push(
          `Assignment #${studentGradeBook.assignId} is still being collected and will be excluded.`
        );
        continue; // my one and only loop control keyword
      } else {
        gradebook.push(studentGradeBook);
      }
    }

    return gradebook;
  }

  function getStudentAssignments(studentId, submission) {
    let studentGrades = [];

    submission.forEach((submit) => {
      if (submit.learner_id === studentId) {
        const assignObj = {
          studentId: submit.learner_id,
          assignId: submit.assignment_id,
          submittedAt: submit.submission.submitted_at,
          earned: submit.submission.score,
        };

        studentGrades.push(assignObj);
      }
    });
    return studentGrades;
  }

  function getWeightedAverage(gradesArray) {
    let earnedPoints = 0;
    let totalPoints = 0;

    gradesArray.forEach((assignment) => {
      earnedPoints += assignment.earned;
      totalPoints += assignment.total;
    });

    return Math.trunc((earnedPoints / totalPoints) * 1000) / 1000;
  }
}

const finishedResult = getLearnerData(
  CourseInfo,
  AssignmentGroup,
  LearnerSubmissions
);

console.log("Final Result:");
const myGrades = finishedResult.data;
console.log(myGrades);

finishedResult.logFile.length > 0
  ? console.log("Log file: ")
  : console.log("No anomalies have occurred.");

finishedResult.logFile.forEach((item) => {
  console.log(item);
});
