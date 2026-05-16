import React, { useEffect} from 'react';
import GenAccor from '../../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';
//import Group_details from '../tables/groupdetails';

const Group_details = ({ data, accordionId }) => {
  useEffect(() => {
    initFlowbite();
   
  
  }, []);


  return (

<div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text="Group Details" accordionId={accordionId} />
      </h2>
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
                {/* Timetable Table */}
                <div className="table-container overflow-x-auto relative">
                  <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
                    <thead className="text-xs text-indigo-900 uppercase bg-white    ">
                      <tr className='border-b text-center'>
                        <th className="px-6 py-3  w-52">Reg no</th>
                        <th className="px-6 py-3  w-[25rem] text-left">Name</th>
                        <th className="px-6 py-3  w-52">CGPA</th>
                        <th className="px-6 py-3  w-52">Cr.Hrs</th>
                        <th className="px-6 py-3  w-52">Term</th>
                      </tr>
                    </thead>
                    <tbody>
                    {data.map((item, index) => (
                        <tr key={index} className="text-center font-normal">
                          {/* Display the task number based on the counter for the specific filter */}
                          <td className="px-6 py-4  ">{item.regno}</td>
                         
                          <td className="px-6 py-4   text-start">{item.name}</td>
                          <td className="px-6 py-4  ">{item.cgpa}</td>
                          <td className="px-6 py-4  ">{item.crhrs}</td>
                          <td className="px-6 py-4  ">{item.term}</td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>


    // <Accordion collapseAll>
    //   <Accordion.Panel>
    //     <Accordion.Title className='bg-purple-900 text-white hover:bg-0'>Group Details</Accordion.Title>
    //     <Accordion.Content>
       
    //     </Accordion.Content>
    //   </Accordion.Panel>
    // </Accordion>
  );
};

export default Group_details;
