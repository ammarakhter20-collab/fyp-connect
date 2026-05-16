import React, { useEffect, useState } from 'react'
import GenAccor from '../../../Components/Accordians/GenAccor'
import axios from 'axios';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import { Navigate } from 'react-router-dom';

function Exams({accordionId, handleViewExamButtonClick}) {
const [ExamData, setExamData] = useState('');
const [isLoading, setIsLoading] = useState(false);
    const fetchAllCreatedExams = async () => {

        try{
          setIsLoading(true);
          const key = JSON.parse(localStorage.getItem("key"));
        const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
          
        // Construct the URL with partStatus, supervisorId, and coordinatorId
        const url = '/api/ExamCreationRoutes/getAllCreatedExam';
    
        const response = await axios.get(url, config);
    
        if (response.status !== 497) {
          if (!response.data || !response.data) {
            console.error('Error fetching Created Exams:', response.statusText);
            return;
          }
        } else {
          Navigate('/login');
        }
    
        setExamData(response.data.exams);
    
      } catch (error) {
        console.error('Error fetching Coordinator ID:', error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
        fetchAllCreatedExams();
    }, [])

 
    console.log("Checking Created Exams", ExamData);

  return (
    <>
       
       {isLoading ? (
       
       <LoadingSpinner />
     ) : (
      <div className='relative'>
          <p className='font-bold text-2xl mb-4'>Exam Details</p>
         
            <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
              {/* Timetable Table */}
              <div className="table-container overflow-x-auto relative">
                <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
                  <thead className="text-xs text-indigo-900 uppercase bg-gray-50    ">
                    <tr className='border-b text-center'>
                      <th className="px-6 py-3 w-52">Sr no</th>
                      <th className="px-6 py-3 w-80 text">Exam Name</th>
                      <th className="px-6 py-3 w-80">Short Code</th>
                      <th className="px-6 py-3 w-52">Exam For</th>
                      <th className="px-6 py-3 w-52">Action</th>
                      
                    </tr>
                  </thead>
                  <tbody className="exam-table-body overflow-y-auto max-h-96">
             

{Array.isArray(ExamData) && ExamData.length > 0 ? (
  ExamData.map((item, index) => (
    <tr key={item._id} className="text-center">
          <td className="px-6 py-4 font-semibold">{index + 1}</td> 
          <td className="px-6 py-4 font-semibold text-start">{item.ExamType?.examName}</td>
          <td className="px-6 py-4 font-semibold">{item.ExamType?.shortCode}</td>
          <td className="px-6 py-4 font-semibold">{item.ExamType?.examTypeFor}</td>
          
          <td className="px-6 py-4 font-semibold">
            <button
              className="underline text-black hover:text-gray-500"
              onClick={() => handleViewExamButtonClick(item)}
            >
              View
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
                     
            
  
     )}
    </>
  )
}

export default Exams
