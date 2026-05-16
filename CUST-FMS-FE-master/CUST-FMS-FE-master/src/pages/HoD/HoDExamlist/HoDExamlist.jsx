import React, { useEffect, useState } from 'react';
import GenAccor from '../../../Components/Accordians/GenAccor';
import axios from 'axios';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

function HoDExamlist({ accordionId }) {
  const [ExamData, setExamData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchAllCreatedHoDExamlist = async () => {
    try {
      setIsLoading(true);
      const key = JSON.parse(localStorage.getItem("key"));
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

      // Construct the URL with partStatus, supervisorId, and coordinatorId
      const url = '/api/ExamCreationRoutes/getAllCreatedExam';

      const response = await axios.get(url, config);

      if (response.status !== 497) {
        if (!response.data || !response.data) {
          console.error('Error fetching Created HoDExamlist:', response.statusText);
          return;
        }
      } else {
        navigate('/login');
      }
      console.log("Examsssssssssssssssss", response.data.exams);

      setExamData(response.data.exams);

    } catch (error) {
      console.error('Error fetching Coordinator ID:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCreatedHoDExamlist();
  }, [])



  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString('en-GB'); // 'en-GB' format is dd/mm/yyyy
  }

  console.log("Checking Created HoDExamlist", ExamData);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className='mt-10 mx-16'>
          <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className=''>
            <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
              <GenAccor text="HoDExamlist" accordionId={accordionId} />
            </h2>
            <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
                {/* Timetable Table */}
                <div className="table-container overflow-x-auto relative max-h-[25rem] overflow-y-auto">
                  <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50   border-collapse border border-gray-300">
                    <thead className="text-xs text-indigo-900 uppercase bg-gray-50    ">
                      <tr className='border-b text-center'>
                        <th className="px-6 py-3  w-52">Sr No.</th>
                        <th className="px-6 py-3  w-52">Term</th>
                        <th className="px-6 py-3  w-[12.5rem] text-left">Exam name</th>
                        <th className="px-6 py-3  w-52">Short code</th>
                        <th className="px-6 py-3  w-52">Weightage</th>
                        <th className="px-6 py-3  w-52">Announced Date</th>
                        <th className="px-6 py-3  w-52">Report Deadline</th>
                        {/* <th className="px-6 py-3  w-52">Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {ExamData && ExamData.length > 0 ? (
                        ExamData.map((item, index) => (
                          <tr key={item._id} className="text-center">
                            <td className="px-6 py-4 font-semibold">{index + 1}</td>
                            <td className="px-6 py-4 font-semibold text-center">{item.Term?.sessionTerm || 'N/A'}</td>
                            <td className="px-6 py-4 font-semibold text-start">{item.ExamType?.examName || 'N/A'}</td>
                            <td className="px-6 py-4 font-semibold">{item.ExamType?.shortCode || 'N/A'}</td>
                            <td className="px-6 py-4 font-semibold">{item.ExamWeightage}</td>
                            <td className="px-6 py-4 font-semibold">{formatDate(item.AnnouncedDate)}</td>
                            <td className="px-6 py-4 font-semibold">{formatDate(item.ReportDeadline)}</td>
                            {/* <td className="px-6 py-4 font-semibold">
                              <button
                                className="underline text-black hover:text-gray-500"
                                onClick={() => handleViewButtonClick(item)}
                              >
                                View
                              </button>
                            </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center py-4">Data not Found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HoDExamlist;
