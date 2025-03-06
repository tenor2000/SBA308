const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

// Script Start

function getLearnerData(course, ag, submission) {
  let finalResult = [];

  let studentIds = [125, 132];

  studentIds.forEach((studentId) => {
    let gradebook = setUpGradebook(ag);
    let studentGrades = getStudentAssignments(studentId, submission);
    let mergedGrades = mergeStudentGradebook(studentGrades, gradebook);

    let result = createStudentObject(studentId, mergedGrades);
    finalResult.push(result);
  });

  return finalResult;

  function createStudentObject(id, assignments) {
    let templateObject = {};

    assignments.forEach((assignment) => {
      const earned = assignment.earned;
      const total = assignment.total;

      templateObject[assignment.assignId] = earned / total;
    });

    templateObject.id = id;
    templateObject.avg = getWeightedAverage(assignments);

    return templateObject;
  }

  function mergeStudentGradebook(studentScores, blankGradeBook) {
    let storage = [];

    blankGradeBook.forEach((assignment) => {
      let result;
      studentScores.forEach((assignScore) => {
        if (assignScore.assignId === assignment.assignId) {
          result = { ...assignment, ...assignScore };
        }
      });

      if (!isAssignmentLate(result)) {
        result.earned -= 15;
      }

      storage.push(result);
    });

    return storage;
  }

  function isAssignmentLate(assignment) {
    const dateDue = Date.parse(assignment.dueDate);
    const dateSubmit = Date.parse(assignment.submittedAt);

    if (dateDue >= dateSubmit) return true;

    return false;
  }

  function setUpGradebook(ag) {
    let gradebook = [];

    ag.assignments.forEach((assignment) => {
      let studentGradeBook = {
        assignId: assignment.id,
        dueDate: assignment.due_at,
        earned: 0,
        total: assignment.points_possible,
      };
      gradebook.push(studentGradeBook);
    });

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

    return earnedPoints / totalPoints;
  }
}

console.log("Final Result:");
console.log(getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions));
