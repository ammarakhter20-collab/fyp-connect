import React, { useEffect } from 'react'
import GenAccor from '../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';
const OverAll = ({data, accordionId}) => {

    useEffect(() => {
        initFlowbite();
       
      }, []);
  return (
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text="Overall Evaluation(Part-I & Part-II )" accordionId={accordionId} />
      </h2>
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
                {/* Timetable Table */}
                <div className="table-container overflow-x-auto relative">
                  <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
                    <thead className="text-xs text-indigo-900 uppercase bg-white    ">
                      <tr className='border-b text-center'>
                        <th className="px-6 py-3  w-52">Reg no</th>
                        <th className="px-6 py-3  w-[23.125rem] text-left">Name</th>
                        <th className="px-6 py-3  w-52">Part I %</th>
                        <th className="px-6 py-3  w-52">Part II %</th>
                        <th className="px-6 py-3  w-52">%age(100)</th>
                      </tr>
                    </thead>
                    <tbody>
                    
                        <tr className="text-center font-normal">
                          {/* Display the task number based on the counter for the specific filter */}
                          <td className="px-6 py-4  ">{data.regno}</td>
                         
                          <td className="px-6 py-4   text-start">{data.name}</td>
                          <td className="px-6 py-4 ">{data.PartI}</td>
                          <td className="px-6 py-4 ">{data.PartII}</td>
                          <td className="px-6 py-4 ">{data.percentage}</td>

                          
                        </tr>
                    
                    </tbody>
                  </table>
                
                </div>
              </div>
            </div>
          </div>
  )
}

export default OverAll
