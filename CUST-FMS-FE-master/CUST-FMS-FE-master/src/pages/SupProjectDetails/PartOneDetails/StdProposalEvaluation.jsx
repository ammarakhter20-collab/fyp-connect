import React, { useEffect } from 'react';
import GenAccor from '../../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';
import RemarksFile from '../StdRemarksFile';

const ProposalEvaluation = ({ data, accordionId, accordText }) => {
  console.log(data, "ProposalData");

  useEffect(() => {
    initFlowbite();
  }, []);

  if (!data || !data.students || data.students.length === 0) {
    return (
      <div>
        No data available.
      </div>
    );
  }

  return (
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text={accordText} accordionId={accordionId} />
      </h2>
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
        <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
          {/* Timetable Table */}
          <div className="table-container overflow-x-auto relative">
            <table className="w-full text-sm text-left rtl:text-center text-black bg-white border-collapse border border-gray-300">
              <thead className="text-xs text-indigo-900 uppercase bg-white">
                <tr className='border-b text-center'>
                  <th className="px-6 py-3 w-52">Reg no</th>
                  <th className="px-6 py-3 w-[15.625rem] text-left">Name</th>
                  {data.students[0]?.exam[0]?.obtainedCLOAverage?.map((clo, cloIndex) => (
                    <th className="px-6 py-3 w-52" key={cloIndex}>CLO {cloIndex + 1}(10)</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.students.map((student, studentIndex) => (
                  <tr key={studentIndex}>
                    <td className="px-6 py-4 w-52 text-center">{student.regNo}</td>
                    <td className="px-6 py-4 w-52">{student.studentName}</td>
                    {student.exam[0]?.obtainedCLOAverage?.map((clo, cloIndex) => (
                      <td className="w-52 text-center" key={cloIndex}>{clo.averageCLOPercentage}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <RemarksFile data={data.students[0]?.exam[0]?.feedback} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProposalEvaluation;
