import React, { useEffect, useState } from 'react'
import GenAccor from '../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';

const ProjectInfo = ({ data, accordionId }) => {
  const [FypData, setFypData] = useState(null); 

    useEffect(() => {
        initFlowbite();
       
      
      }, []);
      useEffect(() => {
        const fetchFYPData = async () => {
          try {
            // Fetch data from localStorage
            const fypData = JSON.parse(localStorage.getItem("FYPData"));;
            
              
              console.log("parsed FYP data checkinggggggggggggggggggggggggggggggggggggggg", fypData);
              // Set data in state
              setFypData(fypData);
            
          } catch (error) {
            console.error('Error fetching data from localStorage:', error);
          }
        };
    
        fetchFYPData();
      }, []); 
console.log("Checking FYP Details in project details tab", FypData );
  return (
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-2'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text="Project Info" accordionId={accordionId} />
      </h2>
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
                {/* Timetable Table */}
                <div className="table-container overflow-x-auto relative">
                  <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50   border-collapse border border-gray-300">
                    <thead className="text-xs text-indigo-900 uppercase bg-gray-50    ">
                      <tr className='border-b text-center'>
                        <th className="px-6 py-3  w-52 text-left">FYP Title</th>
                        <th className="px-6 py-3  w-40 text-left">Supervisor</th>
                        <th className="px-6 py-3  w-32">Panel</th>
                        <th className="px-6 py-3  w-32">Term</th>
                        <th className="px-6 py-3  w-32">Category</th>
                        <th className="px-6 py-3  w-32">Platform</th>
                        <th className="px-6 py-3  w-32">Technology</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FypData && (
                    <tr className="text-center font-normal bg-white">
        <td className="px-6 py-4 text-start">{FypData.topicData.topic}</td>
        {/* Conditional rendering of table data based on reqStatus */}
        {FypData.reqStatus === "pending" || FypData.reqStatus === "rejected" ? (
          <td className="px-6 py-4 text-start">{FypData.selectedOption.name}</td>
        ) : (
          <>
            <td className="px-6 py-4">{FypData.selectedOption.name}</td>
            <td className="px-6 py-4">Not assigned yet</td>
          </>
        )}
        <td className="px-6 py-4">{FypData.groupMembers[0].term.sessionTerm}</td>
        <td className="px-6 py-4">{FypData.topicData.category}</td>
        <td className="px-6 py-4">{FypData.selectedPlatform.platformName}</td>
        <td className="px-6 py-4">{FypData.selectedTechnology.techName}</td>
      </tr>
      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
  )
}

export default ProjectInfo
