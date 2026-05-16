import React, { useEffect } from 'react'
import { Tabs } from 'flowbite-react';
import GenAccor from '../../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';
const TaskIEvaluation = ({ data, stdData, accordionId, accordText }) => {
    useEffect(() => {
        initFlowbite();
       
      }, []);


      console.log(stdData, "stdData")
  return (
    
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text= {accordText} accordionId={accordionId} />
      </h2>

      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
                {/* Timetable Table */}
                <div className="table-container overflow-x-auto relative">
                <div className='bg-white text-sm'>
              <div className='grid grid-cols-3 gap-[300px] mx-16'>
                <div className='col mt-4 mb-4'> 
                  <div className='flex flex-row space-x-2'>
                    <p className='font-semibold'>Name: </p>
                    <p className='font-normal'>{stdData.name}</p>
                  </div>
                  
                </div>
                <div className='col second mt-4'> 
                <div className='flex flex-row space-x-2 '>
                    <p className='font-semibold'>Reg: </p>
                    <p className='font-normal'>{stdData.regno}</p>
                  </div>
                  
                </div>
                <div className='col third mt-4'> 
                  <div className='flex flex-row space-x-2'>
                    <p className='font-semibold'>Course: </p>
                    <p className='font-normal'> {stdData.course}</p>
                  </div>
                 
                </div>
              </div>
            </div>
                  <table className="w-full text-sm text-left rtl:text-center text-black bg-white border-collapse border border-gray-300">
                    <thead className="text-xs text-indigo-900 uppercase bg-white ">
                      <tr className='border-b text-center'>
                        <th className="px-6 py-3  w-52">Task no</th>
                        <th className="px-6 py-3  w-[15.625rem] text-left">Task Title</th>
                        <th className="px-6 py-3  w-52">%age(10) </th>
                      </tr>
                    </thead>
                    <tbody>
                    
                    {data.map((task, index) => {
                  return (
                    <tr key={index} className="text-center font-normal">

                      <td className="px-6 py-4">{task.task.taskNo}</td>
                      <td className="px-6 py-4 text-left">{task.task.taskTitle}</td>
                      <td className="px-6 py-4">{task.marks[0].obtainedMarks}</td>
                    </tr>
                  );
                })}
                    
                    </tbody>
                  </table>
                 
                </div>
              </div>
            </div>
          </div>
  )
}

export default TaskIEvaluation
