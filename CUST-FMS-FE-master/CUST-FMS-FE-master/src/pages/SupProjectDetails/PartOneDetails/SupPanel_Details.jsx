import { Accordion } from 'flowbite-react';
//import Group_details from '../tables/groupdetails';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import GenAccor from '../../../Components/Accordians/GenAccor';
import { useEffect } from 'react';
import { initFlowbite } from 'flowbite';
const SupPanel_details = ({ data, accordionId }) => {
  useEffect(() => {
    initFlowbite();
  }, []);
  console.log("seeeeeeeee", data)


  return (

    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text="Panel Details" accordionId={accordionId} />
      </h2>
      {data ? (<div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
        <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
          {/* Timetable Table */}
          <div className="table-container overflow-x-auto relative">
            <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50   :text-gray-400 border-collapse border border-gray-300">
              <thead className="text-xs text-indigo-900 uppercase bg-gray-50   :bg-gray-700   :text-gray-400">
                <tr className='border-b text-center'>

                  <th className="px-6 py-3">Serial No</th>
                  <th className="px-6 py-3  w-52">Name</th>
                  <th className="px-6 py-3  w-52">Designation</th>
                  <th className="px-6 py-3  w-52">Role</th>
                  <th className="px-6 py-3  w-52">Department</th>
                  <th className="px-6 py-3  w-52">Term</th>
                  <th className="px-6 py-3  w-52">Panel Code</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="text-center font-normal">
                    {/* Display the task number based on the counter for the specific filter */}


                    <td className="px-6 py-4 ">{index + 1}</td>
                    <td className="px-6 py-4   text-start">{item.name}</td>
                    <td className="px-6 py-4  ">{item.designation}</td>
                    <td className="px-6 py-4  ">{item.role}</td>
                    <td className="px-6 py-4  ">{item.department}</td>
                    <td className="px-6 py-4  ">{item.term}</td>
                    <td className="px-6 py-4  ">{item.panelcode}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      ) : (
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
        <div className='relative overflow-x-auto max-h-96 shadow-md sm:rounded-lg   rtl:text-right  text-center  text-xs text-indigo-900 uppercase bg-gray-50 py-10 '>
          No Data Found
        </div>
      </div>)}    </div>
  );
};

export default SupPanel_details;







