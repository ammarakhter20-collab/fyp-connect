// // IN this prop data being displayed is hardcoded, but other table at path:src\TESTING\AccordionTableGeneric.jsx has dynamic data display, even data fields to display/render data are passed as prop.
// import React from 'react';
// import GenAccor from './GenAccor';

// const AccordionGenericTable = ({ groupData, headers = [], accordionId, buttons = [], tabheading}) => {
//   //DON'T neeed any func here
//   const handleClick01 = (groupNo) => {
//     // Your existing code for handleClick01
//   };

//   const handleClick02 = (groupNo) => {
//     // Your existing code for handleClick02
//   };

//   return (
//     <>
//       <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
//         <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
//           <GenAccor text={tabheading} accordionId={accordionId} />
//         </h2>
//         <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
//           <div className="relative overflow-x-auto max-h-96 shadow-md sm:rounded-lg">
//             <table className="w-full text-sm  rtl:text-right text-gray-500 text-center">
//               <thead className="text-xs text-indigo-900 uppercase bg-gray-50 ">
//                 <tr className=' '>
//                   {headers.map((header, index) => (
//                     <th key={index} className="px-6 py-3">{header}</th>
//                   ))}
//                   {buttons.map((button, index) => (
//                     <th key={`button-${index}`} className="px-6 py-3">{button.text}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className=''>
//                 {groupData.map((item, index) => (
//                   <tr key={index} className="bg-white border-b hover:bg-gray-50 ">
//                     <td className="px-6 py-3">{index+1}</td>
//                     <td className="px-6 py-3">{item.fypTitle}</td>
//                     <td className="px-6 py-3">
//                       {item.members.map((member, memberIndex) => (
//                         <div key={memberIndex}>{member.Name} ({member.RegistrationNo})</div>
//                       ))}
//                     </td>
//                     <td className="px-6 py-3">{item.term}</td>
//                     <td className="px-6 py-3">{item.status}</td>
//                     {buttons.map((button, buttonIndex) => (
//                       <td key={`button-${index}-${buttonIndex}`} className="px-6 py-3">
//                         <button type="button" onClick={() => button.click(index)}>{button.text}</button>
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AccordionGenericTable;


// IN this prop data being displayed is hardcoded, but other table at path:src\TESTING\AccordionTableGeneric.jsx has dynamic data display, even data fields to display/render data are passed as prop.
import React from 'react';
import GenAccor from './GenAccor';

const AccordionGenericTable = ({ groupData, headers = [], accordionId, buttons = [], tabheading }) => {
  //DON'T neeed any func here
  const handleClick01 = (groupNo) => {
    // Your existing code for handleClick01
  };

  const handleClick02 = (groupNo) => {
    // Your existing code for handleClick02
  };

  return (
    <>
      <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
        <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
          <GenAccor text={tabheading} accordionId={accordionId} />
        </h2>
        <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
          {groupData ? (<div className="relative overflow-x-auto max-h-96 shadow-md sm:rounded-lg">
            <table className="w-full text-sm  rtl:text-right text-gray-500 text-center">
              <thead className="text-xs text-indigo-900 uppercase bg-gray-50 ">
                <tr className=' '>
                  {headers.map((header, index) => (
                    <th key={index} className="px-6 py-3">{header}</th>
                  ))}
                  {buttons.map((button, index) => (
                    <th key={`button-${index}`} className="px-6 py-3">{button.text}</th>
                  ))}
                </tr>
              </thead>
              <tbody className=''>
                {groupData.map((item, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-gray-50 ">
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3">{item.fypTitle}</td>
                    <td className="px-6 py-3">
                      {item.members.map((member, memberIndex) => (
                        <div key={memberIndex}>{member.Name} ({member.RegistrationNo})</div>
                      ))}
                    </td>
                    <td className="px-6 py-3">{item.term}</td>
                    <td className="px-6 py-3">{item.status}</td>
                    {buttons.map((button, buttonIndex) => (
                      <td key={`button-${index}-${buttonIndex}`} className="px-6 py-3">
                        <button type="button" onClick={() => button.click(item._id)} className='underline'>{button.text}</button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>)
          :(  <div className='relative overflow-x-auto max-h-96 shadow-md sm:rounded-lg   rtl:text-right  text-center  text-xs text-indigo-900 uppercase bg-gray-50 py-10 '>
            No Data Found
          </div>)}
        </div>

      </div>
    </>
  );
};

export default AccordionGenericTable;
