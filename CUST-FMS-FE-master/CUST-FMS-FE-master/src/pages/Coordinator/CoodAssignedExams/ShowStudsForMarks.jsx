import React, { useEffect, useState } from 'react';
import GenAccor from '../../../Components/Accordians/GenAccor';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import axios from 'axios';

const ShowStudsForMarks = ({ accordionId, exam, Students, termId, examId, examWeightage }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [marks, setMarks] = useState({});
  const [isEditing, setIsEditing] = useState({});
  
  const maxMarks = examWeightage || 100;

  useEffect(() => {
    if (Students && Students.length > 0) {
      setMarks(Students.reduce((acc, student) => ({ ...acc, [student.studentId]: maxMarks }), {}));
      setIsEditing(Students.reduce((acc, student) => ({ ...acc, [student.studentId]: false }), {}));
    }
    setIsLoading(false);
  }, [Students, maxMarks]);

  const handleMarksChange = (studentId, value) => {
    const marksValue = Math.max(0, Math.min(maxMarks, Number(value))); // Restricting between 0 and maxMarks
    setMarks({ ...marks, [studentId]: marksValue });
  };

  const handleEditToggle = (studentId) => {
    console.log('Checking student id for editing', studentId);
    setIsEditing({ ...isEditing, [studentId]: !isEditing[studentId] });
  };

  const handleDoneClick = async () => {
    try {
        setIsLoading(true);
        const key = JSON.parse(localStorage.getItem("key"));
        const userData = JSON.parse(localStorage.getItem('user'));
        const examinerId = userData?._id;

        if (!key || !examinerId) {
            console.error('Authorization key or examiner ID not found.');
            return;
        }

        const studentMarks = Object.keys(marks).map(studentId => ({ studentId, marks: marks[studentId] }));

        console.log("Exam Data:", exam);
        console.log("Student Marks:", studentMarks);
        console.log("Term ID:", termId);

        const url = `/api/EvaluateExamRoutes/AddOrientationMarks?termId=${termId}&examinerId=${examinerId}&examId=${examId}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ studentMarks })
        });

        if (response.ok) {
            alert('Marks submitted successfully!');
        } else {
            const errorData = await response.json();
            console.error('Failed to submit marks:', errorData);
        }
    } catch (error) {
        console.error('Error submitting marks:', error.message);
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
          <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-2'>
            <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
              <GenAccor text={`Add ${exam} Marks`} accordionId={accordionId} />
            </h2>
            <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
                <div className="table-container overflow-x-auto relative max-h-[20rem] overflow-y-auto">
                  <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50   border-collapse border border-gray-300">
                    <thead className="text-xs text-indigo-900 uppercase bg-gray-50    ">
                      <tr className='border-b text-center'>
                        <th className="px-6 py-3 w-52">Sr No.</th>
                        <th className="px-6 py-3 w-[31.25rem] text-left">Reg No</th>
                        <th className="px-6 py-3 w-52">Name</th>
                        <th className="px-6 py-3 w-52">Marks</th>
                        <th className="px-6 py-3 w-52">Action</th>
                      </tr>
                    </thead>
                    <tbody className="max-h-[14rem] overflow-y-auto">
                      {Students && Students.length > 0 ? (
                        Students.map((item, index) => (
                          <tr key={item._id} className="text-center">
                            <td className="px-6 py-4 font-semibold">{index + 1}</td>
                            <td className="px-6 py-4 font-semibold text-start">{item.registrationNumber}</td>
                            <td className="px-6 py-4 font-semibold">{item.name}</td>
                            <td className="px-6 py-4 font-semibold">
                              {isEditing[item.studentId] ? (
                                <input
                                  type="number"
                                  value={marks[item.studentId]}
                                  onChange={(e) => handleMarksChange(item.studentId, e.target.value)}
                                  className="w-20 text-center"
                                  min="0"
                                  max={maxMarks}
                                />
                              ) : (
                                marks[item.studentId]
                              )}
                            </td>
                            <td className="px-6 py-4 font-semibold">
                              <button
                                className="underline text-black hover:text-gray-500"
                                onClick={() => handleEditToggle(item.studentId)}
                              >
                                {isEditing[item.studentId] ? 'Save' : 'Edit'}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4">Data not Found</td>
                        </tr>
                      )}
                      <tr>
                      </tr>
                    </tbody>
                  </table>
                  
                       
                </div>
                        <div className='flex flex-row justify-end mt-2 sticky bottom-0'>
                          <button
                            className="px-6 py-2 bg-secondary text-white rounded hover:bg-primary"
                            onClick={handleDoneClick}
                          >
                            Done
                          </button>
                          </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShowStudsForMarks;
