import React, { useEffect, useState } from 'react';
import { initFlowbite } from 'flowbite';
import groupData from '../Attendance/AttendanceData';
import GenAccor from '../../Components/Accordians/GenAccor';
const StudentTimetable = ({ stdtimetable, accordionId }) => {
  const [timetableAdded, setTimetableAdded] = useState(false);

  useEffect(() => {
    initFlowbite();
    // Additional logic or side effects if needed
  }, []);

  useEffect(() => {
    // Additional logic after the accordion is initialized
  }, [timetableAdded]);
// 
return (
  <table className="border-collapse w-full">
    <thead>
      <tr className="bg-gray-200">
        <th className="px-6 py-4 border-r">Day</th>
        {stdtimetable.weeklyTimetable[0].slots.map((slot, index) => (
          <th key={index} className="px-6 py-4 border-r">{`Slot ${index + 1}`}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {stdtimetable.weeklyTimetable.map((day, dayIndex) => (
        <tr key={dayIndex} className="border-b">
          <td className="px-6 py-4 border-r font-semibold">{day.day}</td>
          {day.slots.map((slot, slotIndex) => (
            <td key={slotIndex} className="px-6 py-4 border-r">
              {slot}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
};







           {/* <tr className="border-b">
  <td className="px-6 py-4 border-r font-semibold">Monday</td>
  {stdtimetable.weeklyTimetable.map((slot, index) => (
    slot.day === 'Monday' && (
      <td key={index} className="px-6 py-4 text-center border-r">
        {slot.slots.map((s, idx) => (
          <td key={idx}>{s}</td>
        ))}
      </td>
    )
  ))}
</tr> */}

{/*                 
                <tr className="border-b">
                  <td className="px-6 py-4 border-r font-semibold">Tuesday</td>
                  {stdtimetable.tuesday.map((slot, index) => (
                    <td
                      key={index}
                      className="px-6 py-4 text-center border-r"
                    >
                      {slot}
                    </td>
                  ))}
                   
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 border-r font-semibold">Wednesday</td>
                  {stdtimetable.Wednesday.map((slot, index) => (
                    <td
                      key={index}
                      className="px-6 py-4 text-center border-r"
                    >
                      {slot}
                    </td>
                  ))}
                   
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 border-r font-semibold">Thursday</td>
                  {stdtimetable.Thursday.map((slot, index) => (
                    <td
                      key={index}
                      className="px-6 py-4 text-center border-r"
                    >
                      {slot}
                    </td>
                  ))}
                   
                </tr>
                <tr className="border-b">
                  <td className="px-6 py-4 border-r font-semibold">Friday</td>
                  {stdtimetable.Friday.map((slot, index) => (
                    <td
                      key={index}
                      className="px-6 py-4 text-center border-r"
                    >
                      {slot}
                    </td>
                  ))}
                   
                </tr> */}
                {/* Add other days */}









export default StudentTimetable;






