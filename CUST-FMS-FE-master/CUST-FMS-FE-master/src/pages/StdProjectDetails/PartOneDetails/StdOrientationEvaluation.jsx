import React, { useEffect } from 'react'
import GenAccor from '../../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';
const OrientationEvaluation = ({ data, accordionId }) => {
      useEffect(() => {
    initFlowbite();
   
  }, []);

  const { regno, name, percentage } = data;
  return (
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text="Orientation Evaluation" accordionId={accordionId} />
      </h2>
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
                {/* Timetable Table */}
                <div className="table-container overflow-x-auto relative">
                  <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
                    <thead className="text-xs text-indigo-900 uppercase bg-white    ">
                      <tr className='border-b text-center'>
                        <th className="px-6 py-3  w-52">Reg no</th>
                        <th className="px-6 py-3  w-[15.625rem] text-left">Name</th>
                        <th className="px-6 py-3  w-52">%age(5) </th>
                      </tr>
                    </thead>
                    <tbody>
                    
                        <tr className="text-center font-normal">
                          {/* Display the task number based on the counter for the specific filter */}
                          <td className="px-6 py-4  ">{regno}</td>
                         
                          <td className="px-6 py-4   text-start">{name}</td>
                          <td className="px-6 py-4  ">{percentage}</td>

                          
                        </tr>
                    
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>


  )
}

export default OrientationEvaluation
