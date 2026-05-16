import React, { useEffect } from 'react';
import GenAccor from '../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';

const OverAll = ({ data, stdData, accordionId }) => {

console.log("ewrqweqw")
  console.log(data, "daata")
  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text="Overall Evaluation(Part-I & Part-II )" accordionId={accordionId} />
      </h2>
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
        <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
          <div className="table-container overflow-x-auto relative">
            <table className="w-full text-sm text-left rtl:text-center text-black bg-white border-collapse border border-gray-300">
              <thead className="text-xs text-indigo-900 uppercase bg-white">
                <tr className='border-b text-center'>
                  <th className="px-6 py-3 w-52">Reg No</th>
                  <th className="px-6 py-3 w-[23.125rem]">Name</th>
                  <th className="px-6 py-3 w-52">Part I %</th>
                  <th className="px-6 py-3 w-52">Part II %</th>
                  <th className="px-6 py-3 w-52">%age(100)</th>
                </tr>
              </thead>
              <tbody>
                {data.students && data.students.map((member, index) => (
                  <tr key={index} className='text-center font-normal'>
                    <td>{member.registrationNumber || "N/A"}</td>
                    <td>{member.name}</td>
                    <td className="px-6 py-4">{member.part_1_marks.toFixed(2) || '-'}</td>
                    <td className="px-6 py-4">{member.part_2_marks.toFixed(2) || '-'}</td>
                    <td className="px-6 py-4">{`${(member.part_1_marks + member.part_2_marks).toFixed(2)}%` || '-'}</td>
                  </tr>
                ))}
                {!data?.students && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverAll;
