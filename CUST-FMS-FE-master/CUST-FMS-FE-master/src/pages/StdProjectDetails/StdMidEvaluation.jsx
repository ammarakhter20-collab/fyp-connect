import React, { useEffect } from 'react'
import { Tabs } from 'flowbite-react';
import GenAccor from '../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';
import RemarksFile from './StdRemarksFile';
const MidEvaluation = ({ data, accordionId, remarksData,accordText, perc }) => {
    useEffect(() => {
        initFlowbite();
       
      }, []);
  return (
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text={accordText} accordionId={accordionId} />
      </h2>
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
                {/* Timetable Table */}
                <div className="table-container overflow-x-auto relative">
                  <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
                    <thead className="text-xs text-indigo-900 uppercase bg-white    ">
                      <tr className='border-b text-center'>
                        <th className="px-6 py-3  w-52">Reg no</th>
                        <th className="px-6 py-3  w-[250px] text-left">Name</th>
                        <th className="px-6 py-3  w-52">Q1(10)</th>
                        <th className="px-6 py-3  w-52">Q2(10)</th>
                        <th className="px-6 py-3  w-52">Q3(10)</th>
                        <th className="px-6 py-3  w-52">%age{perc} </th>
                      </tr>
                    </thead>
                    <tbody>
                    
                        <tr className="text-center font-normal">
                          {/* Display the task number based on the counter for the specific filter */}
                          <td className="px-6 py-4  ">{data.regno}</td>
                         
                          <td className="px-6 py-4   text-start">{data.name}</td>
                          <td className="px-6 py-4 ">{data.Q1}</td>
                          <td className="px-6 py-4 ">{data.Q2}</td>
                          <td className="px-6 py-4 ">{data.Q3}</td>

                          <td className="px-6 py-4  ">{data.percentage}</td>

                          
                        </tr>
                    
                    </tbody>
                  </table>
                  <RemarksFile data = {remarksData}/>
                </div>
              </div>
            </div>
          </div>
  )
}

export default MidEvaluation
