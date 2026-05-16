import React, { useEffect } from 'react'
import GenAccor from '../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';

const ProjectInfo = ({ data, accordionId }) => {

    useEffect(() => {
        initFlowbite();
       
      
      }, []);

  return (
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-2'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text="Project Details" accordionId={accordionId} />
      </h2>
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
                {/* Timetable Table */}
                <div className="table-container overflow-x-auto relative">
                  <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50   :text-gray-400 border-collapse border border-gray-300">
                    <thead className="text-xs text-indigo-900 uppercase bg-gray-50   :bg-gray-700   :text-gray-400">
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
                    {data.map((item, index) => (
                        <tr key={index} className="text-center font-normal">
                          {/* Display the task number based on the counter for the specific filter */}
                          <td className="px-6 py-4 text-start ">{item.fyptitle}</td>
                         
                          <td className="px-6 py-4   text-start">{item.supervisor}</td>
                          <td className="px-6 py-4  ">{item.panel}</td>
                          <td className="px-6 py-4  ">{item.term}</td>
                          <td className="px-6 py-4  ">{item.category}</td>
                          <td className="px-6 py-4  ">{item.platform}</td>
                          <td className="px-6 py-4  ">{item.technology}</td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
  )
}

export default ProjectInfo
