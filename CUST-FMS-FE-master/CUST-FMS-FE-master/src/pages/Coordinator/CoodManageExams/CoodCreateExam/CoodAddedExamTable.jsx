import React from 'react'
import AccordionGenericTable from '../../../../TESTING/AccordionTableGeneric'
import { click } from '@testing-library/user-event/dist/click';
import GenAccor from '../../../../Components/Accordians/GenAccor';

const AddedExamTable = (props) => {
  const { data, handleScheduleCreation, handleCloAssignment, handleDeleteExam, handleStatusUpdate, scheduleData, accordionId } = props;
  let serialCounter = 1;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('en-CA'); // 'en-CA' for the format YYYY-MM-DD
  };

  return (
    <div>
      <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
        <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
          <GenAccor text="Exams" accordionId={accordionId} />
        </h2>
        <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
          <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
            <div className="table-container overflow-x-auto relative">
              <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50 border-collapse border border-gray-300">
                <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                  <tr className='border-b text-center'>
                    <th className="px-6 py-3 w-32">Serial no.</th>
                    <th className="px-6 py-3 w-32">Term</th>
                    <th className="px-6 py-3 w-32">Exam Type</th>
                    <th className="px-6 py-3 w-36">Exam Weightage</th>
                    <th className="px-6 py-3 w-36">Announced Date</th>
                    <th className="px-6 py-3 w-36">Report Deadline</th>
                    <th className="px-6 py-3 w-36">Status</th>
                    <th className="px-6 py-3 w-36">Exam</th>
                    <th className="px-6 py-3 w-40">Schedule</th>
                    <th className="px-6 py-3 w-40">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data && data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td className="px-6 py-4 font-semibold">{serialCounter++}</td>
                        <td className="px-6 py-4 font-semibold">{item.Term?.sessionTerm}</td>
                        <td className="px-6 py-4 font-semibold">{item.ExamType?.examName}</td>
                        <td className="px-6 py-4 font-semibold">{item.ExamWeightage}</td>
                        <td className="px-6 py-4 font-semibold">{formatDate(item.AnnouncedDate)}</td>
                        <td className="px-6 py-4 font-semibold">{formatDate(item.ReportDeadline)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {item.status || 'Active'}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          {item.CLOForExams ? (
                            <span className='text-gray-500'>CLO Assigned</span>
                          ) : (
                            <button className='underline mx-2' onClick={() => handleCloAssignment(item._id)}>
                              Assign CLO
                            </button>
                          )}
                        </td>
                        <td className='px-6 py-4'>
                          <button className='underline mx-2' onClick={() => handleScheduleCreation(item)}>
                            Create Schedule
                          </button>
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex flex-col gap-1'>
                            {item.status !== 'Completed' && (
                              <button className='text-blue-600 hover:underline' onClick={() => handleStatusUpdate(item._id, 'Completed')}>
                                Finish
                              </button>
                            )}
                            <button className='text-red-600 hover:underline' onClick={() => handleDeleteExam(item._id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-4">Data Not Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddedExamTable
