import React from 'react';
import GenAccor from '../../../Components/Accordians/GenAccor';
const StudentTimetable = ({ stdtimetable, accordionId, selectedStd }) => {


  let user;
  let stdtimetableWithoutUser;
  if (stdtimetable){
   user = stdtimetable.user;
   stdtimetableWithoutUser = { ...stdtimetable };
  delete stdtimetableWithoutUser.user;

}
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


  console.log(selectedStd, "stdTimetable");
  console.log(user, "user");
  return (
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text="Student's Timetable" accordionId={accordionId} />
      </h2>
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
        {(stdtimetable && selectedStd ) ? (
          <div className="table-container overflow-x-auto max-h-96 shadow-md relative border rounded-lg">
            <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50  border-collapse border border-gray-300    font-semibold" >
              <thead className="text-xs text-indigo-900 uppercase bg-gray-50 ">
                <tr>
                  <th colSpan={4} className='px-6 py-3 '>
                    FYP title: {selectedStd.fypGroupTitle}
                  </th>
                  <th colSpan={3} className='px-6 py-3 '>
                    Name: {selectedStd.name}
                  </th>
                  <th colSpan={3} className='px-6 py-3 '>
                    Registration no: {selectedStd.registrationNo}
                  </th>
                </tr>
                <tr className='border-b text-center'>
                  <th className="px-6 py-3 border-r">Slots</th>
                  <th className="px-6 py-3 border-r">8:00AM - 8:50AM</th>
                  <th className="px-6 py-3 border-r">9:00AM - 9:50AM</th>
                  <th className="px-6 py-3 border-r">10:00AM - 10:50AM</th>
                  <th className="px-6 py-3 border-r">11:00AM - 11:50AM</th>
                  <th className="px-6 py-3 border-r">12:00PM - 12:50PM</th>
                  <th className="px-6 py-3 border-r">1:20PM-2:10PM</th>
                  <th className="px-6 py-3 border-r">2:20PM - 3:10PM</th>
                  <th className="px-6 py-3 border-r">3:20PM - 4:10PM</th>
                  <th className="px-6 py-3 ">4:20PM - 5:10PM</th>
                  {/* Add other time slots  */}
                </tr>
              </thead>

              <tbody className='bg-white border-b hover:bg-gray-50'>
                {daysOfWeek.map((day) => (
                  <tr key={day} className="border-b">
                    <td className="px-6 py-4 border-r font-semibold text-left">{day}</td>
                    {stdtimetableWithoutUser[day].map((slot, idx) => (
                      <td key={idx} className="px-6 py-4 text-center border-r">
                        {slot.class === 'FREE' || slot.class === '' ? '-' : slot.class}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


        ) : (<div className='relative overflow-x-auto max-h-96 shadow-md sm:rounded-lg   rtl:text-right  text-center  text-xs text-indigo-900 uppercase bg-gray-50 py-10 '>
          No Data Found
        </div>)}      </div>
    </div>
  );
};

export default StudentTimetable;






