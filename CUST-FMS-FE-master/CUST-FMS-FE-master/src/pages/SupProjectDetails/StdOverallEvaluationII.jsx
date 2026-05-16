import React, { useEffect } from 'react'
import GenAccor from '../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';

const OverallEvaluationII = ({ data, accordionId, stdData }) => {
  useEffect(() => {
    initFlowbite();

  }, []);
  return (
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text="Overall Evaluation(Part II)" accordionId={accordionId} />
      </h2>
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
        <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
          {/* Timetable Table */}
          <div className="table-container overflow-x-auto relative">
            <table className="w-full text-sm text-left rtl:text-center text-black bg-white   :text-gray-400 border-collapse border border-gray-300">
              <thead className="text-xs text-indigo-900 uppercase bg-white   :bg-gray-700   :text-gray-400">
                <tr className='border-b text-center'>
                  <th className="px-6 py-3  w-52">Reg no</th>
                  <th className="px-6 py-3  w-[370px]">Name</th>
                  <th className="px-6 py-3  w-52">Attendance II(20)</th>
                  <th className="px-6 py-3  w-52">Mid II(30)</th>
                  <th className="px-6 py-3  w-52">Task II(10)</th>
                  <th className="px-6 py-3  w-52">Final II(50)</th>
                  <th className="px-6 py-3  w-52">%age(100)</th>
                </tr>
              </thead>
              <tbody>


                {stdData.members.map((member, index) => (
                  <tr key={index} className='text-center font-normal'>
                    <td>{member.RegistrationNo}</td>
                    <td>{member.Name}</td>
                    <td className="px-6 py-4 ">{data.attendance}</td>
                    <td className="px-6 py-4 ">{data.mid}</td>
                    <td className="px-6 py-4 ">{data.task}</td>
                    <td className="px-6 py-4 ">{data.final}</td>
                    <td className="px-6 py-4  ">{data.percentage}</td>
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

export default OverallEvaluationII
