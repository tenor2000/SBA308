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
  let studentId = 125;

  //Logic
  // get assignments
  let gradebook = setUpGradebook(ag);
  let studentGrades = getStudentAssignments(studentId, submission);
  let mergedGrades = mergeStudentGradebook(studentGrades, gradebook);

  return mergedGrades;

  function mergeStudentGradebook(studentScores, blankGradeBook) {
    let storage = [];

    blankGradeBook.forEach((assignment) => {
      let result;
      studentScores.forEach((assignScore) => {
        if (assignScore.assignId === assignment.assignId) {
          result = { ...assignment, ...assignScore };
        }
      });
      storage.push(result);
    });

    return storage;
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
    // grades are stored in a tuple, earned/total points
    let earnedPoints = 0;
    let totalPoints = 0;

    gradesArray.forEach((assignment) => {
      earnedPoints += assignment.earned;
      totalPoints += assignment.total;
    });

    return earnedPoints / totalPoints;
  }

  function createStudentObject(id, grades = {}) {
    let templateObject = {};

    Object.keys(grades).forEach((key) => {
      // grades are stored in a tuple, earned/total
      const earned = grades[key][0];
      const total = grades[key][1];

      templateObject[key] = earned / total;
    });

    templateObject.id = id;
    templateObject.avg = getWeightedAverage(grades);

    return templateObject;
  }
}

console.log(getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions));
