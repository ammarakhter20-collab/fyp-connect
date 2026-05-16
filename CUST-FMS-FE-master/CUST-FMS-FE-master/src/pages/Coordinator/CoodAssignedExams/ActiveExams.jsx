import React, { useState } from 'react';
import GenAccor from '../../../Components/Accordians/GenAccor';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import ExamMarksDetail from './ExamMarksDetail';

const ActiveExams = ({ accordionId, activeExams, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleViewMarks = (exam) => {
    // Toggle: if same exam clicked, close it
    if (selectedExam && selectedExam._id === exam._id) {
      setSelectedExam(null);
    } else {
      setSelectedExam(exam);
    }
  };

  const handleMarkAsFinished = async (examId) => {
    const confirmFinish = window.confirm(
      'Are you sure you want to mark this exam as Completed? It will no longer appear in the active exams list.'
    );
    if (!confirmFinish) return;

    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem('key'));

      const response = await fetch(`/api/ExamCreationRoutes/updateStatus/${examId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Completed' }),
      });

      if (response.ok) {
        alert('Exam marked as Completed successfully!');
        // If the finished exam was the one being viewed, close the detail
        if (selectedExam && selectedExam._id === examId) {
          setSelectedExam(null);
        }
        // Refresh the list
        if (onRefresh) onRefresh();
      } else {
        const errorData = await response.json();
        alert('Failed to update exam status: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error marking exam as finished:', error);
      alert('Error marking exam as finished.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className="mt-2">
            <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
              <GenAccor text="Active Exams" accordionId={accordionId} />
            </h2>
            <div
              id={`accordion-collapse-body-timetable-${accordionId}`}
              className="hidden"
              aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}
            >
              <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
                <div className="table-container overflow-x-auto relative max-h-[25rem] overflow-y-auto">
                  <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50 border-collapse border border-gray-300">
                    <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                      <tr className="border-b text-center">
                        <th className="px-4 py-3">Sr No.</th>
                        <th className="px-4 py-3 text-left">Exam Type</th>
                        <th className="px-4 py-3">Exam For</th>
                        <th className="px-4 py-3">Weightage</th>
                        <th className="px-4 py-3">Exam Date</th>
                        <th className="px-4 py-3">Term</th>
                        <th className="px-4 py-3">Part</th>
                        <th className="px-4 py-3">Groups</th>
                        <th className="px-4 py-3 w-64">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeExams && activeExams.length > 0 ? (
                        activeExams.map((exam, index) => (
                          <tr
                            key={exam._id}
                            className={`text-center ${
                              selectedExam && selectedExam._id === exam._id
                                ? 'bg-indigo-50'
                                : ''
                            }`}
                          >
                            <td className="px-4 py-4 font-semibold">{index + 1}</td>
                            <td className="px-4 py-4 font-semibold text-start">{exam.examName}</td>
                            <td className="px-4 py-4 font-semibold">{exam.examTypeFor}</td>
                            <td className="px-4 py-4 font-semibold">{exam.examWeightage}</td>
                            <td className="px-4 py-4 font-semibold">{formatDate(exam.announcedDate)}</td>
                            <td className="px-4 py-4 font-semibold">{exam.termName}</td>
                            <td className="px-4 py-4 font-semibold">{exam.partStatus}</td>
                            <td className="px-4 py-4 font-semibold">{exam.groups ? exam.groups.length : 0}</td>
                            <td className="px-4 py-4 font-semibold">
                              <div className="flex gap-2 justify-center">
                                <button
                                  className="px-3 py-1 bg-secondary text-white rounded hover:bg-primary text-xs"
                                  onClick={() => handleViewMarks(exam)}
                                >
                                  {selectedExam && selectedExam._id === exam._id ? 'Hide Marks' : 'View Marks'}
                                </button>
                                <button
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                                  onClick={() => handleMarkAsFinished(exam._id)}
                                >
                                  Finish
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center py-4">
                            No active exams found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Show detailed marks view when an exam is selected */}
          {selectedExam && (
            <ExamMarksDetail
              accordionId={accordionId + 1}
              exam={selectedExam}
              onRefresh={onRefresh}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ActiveExams;
