import { Accordion } from 'flowbite-react';
//import Group_details from '../tables/groupdetails';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import GenAccor from '../../../Components/Accordians/GenAccor';
import { useEffect } from 'react';
import { initFlowbite } from 'flowbite';
const Panel_details = ({ data, accordionId }) => {
  useEffect(() => {
    initFlowbite();
  }, []);

 

  return (
//     <div id={`accordion-collapse-group-${accordionId}`} data-accordion="collapse">
//     <h2 id={`accordion-collapse-heading-group-${accordionId}`}>
//       <GenAccor text='Panel Details' accordionId={accordionId} />
//     </h2>
//     <div
//         id={`accordion-collapse-body-timetable-${accordionId}`}
//         className={`relative overflow-x-auto max-h-96 shadow-md sm:rounded-lg `}
//         aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}
//       >
//             <table className="w-full  text-left rtl:text-right text-gray-500  text-xs">
//               <thead className="text-xs text-indigo-900 uppercase  ">
//                 <tr>
//                   <th scope="col" className="px-6 py-3">
//                     Name
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Status
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Date
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Designation
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Department
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Term
//                   </th>
//                   <th scope="col" className="px-6 py-3">
//                     Panel code
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((item, index) => (
//                   <tr key={index} className="bg-white border-b hover:bg-gray-50 ">
                   
//                     <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap  ">
//                         <div className="text-base font-semibold">{item.panelist}</div>
//                     </th>
                   
// <td className="px-6 py-4">
//   <div className='flex items-center'>
//     {item.status === 'Approved' ? (
//       <CheckCircleRoundedIcon style={{ color: 'green', fontSize: '1rem' }} />
//     ) : item.status === 'Disapproved' ? (
//       <CancelRoundedIcon style={{ color: 'red', fontSize: '1rem' }} />
//     ) : (
//       <CancelRoundedIcon style={{ color: 'black', fontSize: '1rem' }} />
//     )}
//     <div className='ps-1'>
//     {item.status}
//     </div>
    
//   </div>
// </td>
//                     <td className="px-6 py-4">{item.date}</td>
//                     <td className="px-6 py-4">{item.designation}</td>
//                     <td className="px-6 py-4">{item.department}</td>
//                     <td className="px-6 py-4">{item.term}</td>
//                     <td className="px-6 py-4">{item.pnlcode}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//     </div>
  
   
  <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text="Panel Details" accordionId={accordionId} />
      </h2>
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
                {/* Timetable Table */}
                <div className="table-container overflow-x-auto relative">
                  <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50   border-collapse border border-gray-300">
                    <thead className="text-xs text-indigo-900 uppercase bg-gray-50    ">
                      <tr className='border-b text-center'>
                        
                        <th className="px-6 py-3  w-[300px] text-left">Name</th>
                        <th className="px-6 py-3  w-52">Designation</th>
                        <th className="px-6 py-3  w-52">Department</th>
                        <th className="px-6 py-3  w-52">Term</th>
                        <th className="px-6 py-3  w-52">Panel Code</th>
                      </tr>
                    </thead>
                    <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="text-center font-normal">
                          {/* Display the task number based on the counter for the specific filter */}
                          
                         
                          <td className="px-6 py-4   text-start">{item.name}</td>
                          <td className="px-6 py-4  ">{item.designation}</td>
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
          </div>
  );
};

export default Panel_details;







