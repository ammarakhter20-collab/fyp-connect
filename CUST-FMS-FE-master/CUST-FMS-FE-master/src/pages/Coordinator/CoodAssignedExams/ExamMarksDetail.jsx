import React, { useState } from 'react';
import GenAccor from '../../../Components/Accordians/GenAccor';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';

const ExamMarksDetail = ({ accordionId, exam, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editingRow, setEditingRow] = useState(null); // key: `${groupId}-${studentId}`
  const [editedMarks, setEditedMarks] = useState({}); // { examinerId: newMarks }

  const maxMarks = exam.examWeightage || 100;

  // Get all unique examiner names across all students in all groups for column headers
  const getAllExaminerNames = (groups) => {
    const examinerMap = new Map();
    for (const group of groups) {
      for (const student of group.students) {
        for (const ex of student.examiners) {
          if (!examinerMap.has(ex.examinerId?.toString() || ex.examinerId)) {
            examinerMap.set(ex.examinerId?.toString() || ex.examinerId, ex.examinerName);
          }
        }
      }
    }
    return Array.from(examinerMap.entries()); // [[id, name], ...]
  };

  const handleEditClick = (groupId, student) => {
    const rowKey = `${groupId}-${student.studentId}`;
    if (editingRow === rowKey) {
      // Cancel editing
      setEditingRow(null);
      setEditedMarks({});
    } else {
      // Start editing — pre-fill with current marks
      const currentMarks = {};
      student.examiners.forEach((ex) => {
        currentMarks[ex.examinerId?.toString() || ex.examinerId] = ex.marks;
      });
      setEditingRow(rowKey);
      setEditedMarks(currentMarks);
    }
  };

  const handleMarksChange = (examinerId, value) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9.]/g, '');
    const marksValue = Math.max(0, Math.min(maxMarks, Number(numericValue) || 0));
    setEditedMarks((prev) => ({ ...prev, [examinerId]: marksValue }));
  };

  const handleSaveClick = async (group, student) => {
    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem('key'));

      // Find which examiner marks actually changed
      const updatePromises = [];
      for (const examiner of student.examiners) {
        const exId = examiner.examinerId?.toString() || examiner.examinerId;
        const newMarks = editedMarks[exId];

        // Skip CLO-based examiners
        if (examiner.hasCLOData) continue;

        // Only update if marks actually changed
        if (newMarks != null && Number(newMarks) !== Number(examiner.marks)) {
          updatePromises.push(
            fetch('/api/EvaluateExamRoutes/update-examiner-marks', {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                supervisorId: group.supervisorId,
                termId: exam.termId,
                examId: exam._id,
                groupId: group.groupId,
                studentId: student.studentId,
                examinerId: exId,
                newMarks: Number(newMarks),
              }),
            })
          );
        }
      }

      if (updatePromises.length === 0) {
        alert('No changes to save.');
        setEditingRow(null);
        setEditedMarks({});
        return;
      }

      const results = await Promise.all(updatePromises);
      const allOk = results.every((r) => r.ok);

      if (allOk) {
        alert('Marks updated successfully!');
        setEditingRow(null);
        setEditedMarks({});
        // Refresh the parent data
        if (onRefresh) onRefresh();
      } else {
        // Collect error messages
        const errors = [];
        for (const r of results) {
          if (!r.ok) {
            const errData = await r.json();
            errors.push(errData.error || 'Unknown error');
          }
        }
        alert('Some marks failed to update:\n' + errors.join('\n'));
      }
    } catch (error) {
      console.error('Error saving marks:', error);
      alert('Error saving marks: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!exam.groups || exam.groups.length === 0) {
    return (
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center text-gray-600">
        No marks have been submitted for this exam yet.
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-2">
          <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className="mt-2">
            <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
              <GenAccor text={`Marks Detail — ${exam.examName}`} accordionId={accordionId} />
            </h2>
            <div
              id={`accordion-collapse-body-timetable-${accordionId}`}
              className="hidden"
              aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}
            >
              <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
                {exam.groups.map((group, groupIndex) => {
                  // Get all unique examiners for this group
                  const groupExaminerMap = new Map();
                  group.students.forEach((student) => {
                    student.examiners.forEach((ex) => {
                      const exId = ex.examinerId?.toString() || ex.examinerId;
                      if (!groupExaminerMap.has(exId)) {
                        groupExaminerMap.set(exId, {
                          name: ex.examinerName,
                          hasCLOData: ex.hasCLOData,
                        });
                      }
                    });
                  });
                  const groupExaminers = Array.from(groupExaminerMap.entries()); // [[id, {name, hasCLOData}], ...]

                  return (
                    <div key={group.groupId || groupIndex} className="mb-4">
                      {/* Group Header */}
                      <div className="bg-indigo-100 px-4 py-2 border-b border-gray-300">
                        <span className="font-bold text-indigo-900">
                          Group {groupIndex + 1}: {group.projectName}
                        </span>
                      </div>

                      {/* Marks Table */}
                      <div className="table-container overflow-x-auto relative max-h-[20rem] overflow-y-auto">
                        <table className="w-full text-sm text-left rtl:text-center text-black bg-white border-collapse border border-gray-300">
                          <thead className="text-xs text-indigo-900 uppercase bg-gray-50 sticky top-0">
                            <tr className="border-b text-center">
                              <th className="px-3 py-3">Sr No.</th>
                              <th className="px-3 py-3 text-left">Reg No</th>
                              <th className="px-3 py-3">Name</th>
                              {groupExaminers.map(([exId, exInfo]) => (
                                <th key={exId} className="px-3 py-3">
                                  {exInfo.name}
                                  {exInfo.hasCLOData && (
                                    <span className="text-[10px] block text-gray-400">(CLO)</span>
                                  )}
                                </th>
                              ))}
                              <th className="px-3 py-3">Average</th>
                              <th className="px-3 py-3">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.students.map((student, studentIndex) => {
                              const rowKey = `${group.groupId}-${student.studentId}`;
                              const isEditing = editingRow === rowKey;

                              // Calculate average from current data or edited marks
                              let avgMarks = student.obtainedAverage || 0;
                              if (isEditing) {
                                const examinerCount = student.examiners.length || 1;
                                let total = 0;
                                student.examiners.forEach((ex) => {
                                  const exId = ex.examinerId?.toString() || ex.examinerId;
                                  total += Number(editedMarks[exId] != null ? editedMarks[exId] : ex.marks) || 0;
                                });
                                avgMarks = total / examinerCount;
                              }

                              return (
                                <tr key={student.studentId || studentIndex} className="text-center border-b">
                                  <td className="px-3 py-3 font-semibold">{studentIndex + 1}</td>
                                  <td className="px-3 py-3 font-semibold text-start">
                                    {student.registrationNumber}
                                  </td>
                                  <td className="px-3 py-3 font-semibold">{student.studentName}</td>

                                  {/* Examiner marks columns */}
                                  {groupExaminers.map(([exId, exInfo]) => {
                                    // Find this examiner's marks for this student
                                    const examinerData = student.examiners.find(
                                      (e) => (e.examinerId?.toString() || e.examinerId) === exId
                                    );
                                    const marks = examinerData ? examinerData.marks : '-';
                                    const isCLO = examinerData?.hasCLOData || false;

                                    return (
                                      <td key={exId} className="px-3 py-3 font-semibold">
                                        {isEditing && !isCLO ? (
                                          <input
                                            type="number"
                                            value={editedMarks[exId] != null ? editedMarks[exId] : marks}
                                            onChange={(e) => handleMarksChange(exId, e.target.value)}
                                            className="w-16 text-center border border-gray-300 rounded px-1 py-1"
                                            min="0"
                                            max={maxMarks}
                                          />
                                        ) : (
                                          <span className={isCLO ? 'text-gray-500 italic' : ''}>
                                            {marks != null ? Number(marks).toFixed(1) : '-'}
                                          </span>
                                        )}
                                      </td>
                                    );
                                  })}

                                  {/* Average column */}
                                  <td className="px-3 py-3 font-bold text-indigo-700">
                                    {avgMarks != null ? Number(avgMarks).toFixed(2) : '-'}
                                  </td>

                                  {/* Action column */}
                                  <td className="px-3 py-3 font-semibold">
                                    {isEditing ? (
                                      <div className="flex gap-1 justify-center">
                                        <button
                                          className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                          onClick={() => handleSaveClick(group, student)}
                                        >
                                          Save
                                        </button>
                                        <button
                                          className="px-2 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                                          onClick={() => {
                                            setEditingRow(null);
                                            setEditedMarks({});
                                          }}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        className="px-3 py-1 bg-secondary text-white rounded text-xs hover:bg-primary"
                                        onClick={() => handleEditClick(group.groupId, student)}
                                      >
                                        Edit
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamMarksDetail;
