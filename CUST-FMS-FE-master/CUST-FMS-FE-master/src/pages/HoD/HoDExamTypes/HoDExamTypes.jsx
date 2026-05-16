import React, { useState, useEffect } from 'react'

import { initFlowbite, } from 'flowbite';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import GenAccor from '../../../Components/Accordians/GenAccor';



const HoDExamTypes = ({accordionId}) => {

  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [showCreateExamCard, setShowCreateExamCard] = useState(false);
  const [examTypes, setExamTypes] = useState([]);


  const fetchExamTypes = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      // const parsedUserData = JSON.parse(userData);
      // const userid = parsedUserData._id;
      const response = await fetch(`/api/ExamType/GetCreatedExamType`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'

        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Data');
      }
      const data = await response.json();
      //Fetched  Data
      console.log(data.examTypes, 'fetched Exam Types')
     
      setExamTypes(data.examTypes);
    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };



  useEffect(() => {
    fetchExamTypes();
  }, [])








  useEffect(() => {
    initFlowbite();
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'HoDExamTypes';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);









  return (
    <>
      {loadingSpinner ? ( // Show loading spinner while loading is true
        <LoadingSpinner />
      ) : (
        <div className='bg-slate-100 w-full h-full'>
          <div className="mx-16 mt-10">
             
          
             <div id={`accordion-collapse-${accordionId}`} data-accordion='collapse' className={`mt-5`}>
                         <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                           <GenAccor text='Exam Types' accordionId={accordionId} />
                         </h2>
                         <div id={`accordion-collapse-body-timetable-${accordionId}`} className={` transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                           <div className='pt-0 pb-0 border border-b-0 border-gray-200 relative'>
                             {/* Faculty Table */}
                             <div className='table-container overflow-x-auto relative'>
                               <div className='bg-white text-sm'>
                               {/* <p className='text-base font-semibold ml-7 mb-4'>Term: {TermForAccor}</p> */}
                               <table className='w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300'>
                                 <thead className='text-xs text-indigo-900 uppercase bg-white   dark:text-gray-400'>
                                   <tr className='border-b text-center'>
                                     <th className='px-20 py-3'>Sr. No</th>
                                     <th className='px-20 py-3'>Exam Name</th>
                                     <th className='px-20 py-3'>Short Code</th>
                                     <th className='px-20 py-3'>Exam Type for</th>
                                   </tr>
                                 </thead>
                                 <tbody>
                                 
             
             
             {Array.isArray(examTypes) && examTypes.length > 0 ? (
               examTypes.map((et, index) => (
                 <tr key={et._id} className='text-center font-normal'>
                   <td className='px-6 py-4'>{index + 1}</td>
                   <td className='px-6 py-4'>{et.examName}</td>
                   <td className='px-6 py-4'>{et.shortCode}</td>
                   <td className='px-6 py-4'>{et.examTypeFor}</td>
              
                 </tr>
               ))
             ) : (
               <tr>
                 <td colSpan='9' className='text-center py-4'>No Exam Types found</td>
               </tr>
             )}
             
             
             
             
                                 </tbody>
                               </table>
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
             
                         </div>
          </div>
      )
      }
    </>
  )
}

export default HoDExamTypes
