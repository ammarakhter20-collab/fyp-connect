const fs = require('fs');
const path = require('path');

const filePath = 'd:\\FYP\\FYP PORTAL CODE\\BE-BackUpBeforeWholeIntegration\\BE-BackUpBeforeWholeIntegration\\server\\controllers\\CoordinatorController\\EvaluateExamCont.js';
let content = fs.readFileSync(filePath, 'utf8');

// Fix handleEvaluationWithCLOs (Optional, since it seems to be working, but let's be sure)
// Wait, I saw it was working in Step Id: 239.

// Fix storeMarksForAttendance
const attendanceBlockOld = `    if (!term) {
      term = new Evaluation({
        supervisorId,
        terms: [
          {
            termId,
            exams: [
              {
                examId,
                examName,
                examTypeFor,
                fypGroups: [
                  {
                    groupId,
                    students: marks.map((mark) => ({
                      studentId: mark.studentId,
                      evaluationsByExaminers: [
                        {
                          examinerId,
                          marks: mark.marks,
                          totalWeightage: examWeightage,
                        },
                      ],
                    })),
                  },
                ],
              },
            ],
          });`;

const attendanceBlockNew = `    if (!term) {
      term = new Evaluation({
        supervisorId,
        terms: [
          {
            termId,
            exams: [
              {
                examId,
                examName,
                examTypeFor,
                fypGroups: [
                  {
                    groupId,
                    students: marks.map((mark) => ({
                      studentId: mark.studentId,
                      evaluationsByExaminers: [
                        {
                          examinerId,
                          marks: mark.marks,
                          totalWeightage: examWeightage,
                        },
                      ],
                    })),
                  },
                ],
              },
            ],
          },
        ],
      });`;

// Fix storeMarksForOrientation
const orientationBlockOld = `    if (!term) {
      term = new Evaluation({
        supervisorId,
        terms: [
          {
            termId,
            exams: [
              {
                examId,
                examName,
                examTypeFor,
                fypGroups: [
                  {
                    groupId,
                    students: marks.map((mark) => ({
                      studentId: mark.studentId,
                      evaluationsByExaminers: [
                        {
                          examinerId,
                          marks: mark.marks,
                          totalWeightage: examWeightage,
                        },
                      ],
                    })),
                  },
                ],
              },
            ],
          });`;

const orientationBlockNew = `    if (!term) {
      term = new Evaluation({
        supervisorId,
        terms: [
          {
            termId,
            exams: [
              {
                examId,
                examName,
                examTypeFor,
                fypGroups: [
                  {
                    groupId,
                    students: marks.map((mark) => ({
                      studentId: mark.studentId,
                      evaluationsByExaminers: [
                        {
                          examinerId,
                          marks: mark.marks,
                          totalWeightage: examWeightage,
                        },
                      ],
                    })),
                  },
                ],
              },
            ],
          },
        ],
      });`;

// Replace using more robust search if exact match fails
if (content.includes(attendanceBlockOld)) {
    console.log('Found attendance block, replacing...');
    content = content.replace(attendanceBlockOld, attendanceBlockNew);
} else {
    console.log('Attendance block not found exactly. Trying partial match.');
    // Fallback: replace the specific broken ending
    content = content.replace(/fypGroups: \[\s+\{\s+groupId,\s+students: marks\.map\(\(mark\) => \(\{\s+studentId: mark\.studentId,\s+evaluationsByExaminers: \[\s+\{\s+examinerId,\s+marks: mark\.marks,\s+totalWeightage: examWeightage,\s+\},\s+\],\s+\}\)\),\s+\},\s+\],\s+\},\s+\]\s+\}\);/g,
        (match) => match.replace('],', '],},'));
}

if (content.includes(orientationBlockOld)) {
    console.log('Found orientation block, replacing...');
    content = content.replace(orientationBlockOld, orientationBlockNew);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('File updated.');
