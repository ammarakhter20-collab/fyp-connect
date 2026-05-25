import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner'
import GenAccor from '../../../Components/Accordians/GenAccor'
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import ShowStudsForMarks from './ShowStudsForMarks';

const AsCoordinator = ({accordionId, CoodExam}) => {
  console.log(CoodExam, "yehKyaa hai ")
    const [isLoading, setIsLoading] = useState(false);
    const [AllStudents , setAllStudents] = useState('');
    const [ShowStuds , setShowStuds] = useState(false);
    const [selectedTermId, setSelectedTermId] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);

    const handleAddMarks = async (item) => {
      console.log("Hanlde Add marks Calleddddddddddddddd", item);
        await fetchTermStudentsForMarks(item.Term._id);
        setSelectedTermId(item.Term._id);
        setSelectedExam(item);
        setShowStuds(true);
    }
    
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const fetchTermStudentsForMarks = async (termId) => {
      try {
        setIsLoading(true);
        console.log("2nd layer check termIddddddddddddddddd", termId);
        const key = JSON.parse(localStorage.getItem("key"));
        const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
        console.log("TermIdddddddd", termId);
        
        const url = `/api/fyp/GetStudentOfTerm/${termId}`;
        console.log(`Fetching students with termId: ${termId}`);
        
        const response = await axios.get(url, config);
        
        if (response.status !== 497) {
          if (!response.data || !response.data.students) {
            console.error('Error fetching Students Details:', response.statusText);
            return;
          }
        } else {
          Navigate('/login');
        }

        console.log("I am checking response of Studs on 2nd layer", response.data.students);
        setAllStudents(response.data.students);
        
      } catch (error) {
        console.error('Error fetching Students Data:', error.response ? error.response.data : error.message);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
        fetchTermStudentsForMarks();
    }, [])
    
    return (
        <>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className=''>
              <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-2'>
                <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                  <GenAccor text="As Coordinator" accordionId={accordionId} />
                </h2>
                <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                  <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
                    <div className="table-container overflow-x-auto relative max-h-[25rem] overflow-y-auto">
                      <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50   border-collapse border border-gray-300">
                        <thead className="text-xs text-indigo-900 uppercase bg-gray-50    ">
                          <tr className='border-b text-center'>
                            <th className="px-6 py-3 w-52">Sr No.</th>
                            <th className="px-6 py-3 w-[31.25rem] text-left">Exam Type</th>
                            <th className="px-6 py-3 w-52">Exam For</th>
                            <th className="px-6 py-3 w-52">Exam Date</th>
                            <th className="px-6 py-3 w-52">Term</th>
                            <th className="px-6 py-3 w-52">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {CoodExam && CoodExam.length > 0 ? (
                            CoodExam.map((item, index) => (
                              <tr key={item._id} className="text-center">
                                <td className="px-6 py-4 font-semibold">{index + 1}</td>
                                <td className="px-6 py-4 font-semibold text-start">{item.ExamType.examName}</td>
                                <td className="px-6 py-4 font-semibold">{item.ExamType.examTypeFor}</td>
                                <td className="px-6 py-4 font-semibold">{formatDate(item.AnnouncedDate)}</td>
                                <td className="px-6 py-4 font-semibold">{item.Term.sessionTerm}</td>
                                <td className="px-6 py-4 font-semibold">
                                  <button
                                    className="underline text-black hover:text-gray-500"
                                    onClick={() => handleAddMarks(item)}
                                  >
                                    Add Marks
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center py-4">Data not Found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {ShowStuds && selectedExam && (
                  <ShowStudsForMarks 
                    accordionId={365} 
                    exam={selectedExam.ExamType.examName} 
                    Students={AllStudents} 
                    termId={selectedTermId} 
                    examId={selectedExam._id} 
                    examWeightage={selectedExam.ExamWeightage} 
                    examStatus={selectedExam.status}
                  />
                )}
              </div>
            </div>
          )}
        </>
    )
}

export default AsCoordinator;
