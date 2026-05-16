import React, { useEffect, useState } from 'react';

const Attendance = ({ data, GroupAttendanceData }) => {
  const [AttenData, setAttenData] = useState('');
  const [currentUserId, setUserId] = useState('');
  const [AttendedMeetings, setAttendedMeetings] = useState('');
  const [Conducted, setConducted] = useState('');
  const [Percentage, setTotalPercentage] = useState('');
  useEffect(() => {
    const updateAttendanceData = () => {
      const Attdata = JSON.parse(localStorage.getItem("AttendanceData"));
      if (Attdata && Attdata.length > 0) {
        setAttenData(Attdata);
        const user = JSON.parse(localStorage.getItem("user"));
        setUserId(user._id);
  
        let totalAttendedMeetings = 0;
        let totalConductedMeetings = 0;
  
        Attdata.forEach(meeting => {
          const currentUserAttendance = meeting.memberAttendances.find(attendance => attendance.member === currentUserId);
          console.log("CHecking current user Attendance", currentUserAttendance);
          if (currentUserAttendance && currentUserAttendance.status === "present") {
            totalAttendedMeetings++;
          }
          totalConductedMeetings++;
        });
  
        setAttendedMeetings(totalAttendedMeetings);
        setConducted(totalConductedMeetings);
  
        const percentage = totalConductedMeetings > 0 ? (totalAttendedMeetings / totalConductedMeetings) * 100 : 0;
        setTotalPercentage(percentage.toFixed(2)); 
      }
    };
  
    // Call the update function when the component mounts
    updateAttendanceData();
  
    // Subscribe to changes in local storage and update the state accordingly
    window.addEventListener("storage", updateAttendanceData);
  
    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("storage", updateAttendanceData);
    };
  }, [currentUserId]); // Depend on currentUserId to trigger re-renders when it changes
  
  
  
   console.log("Atendedddddddddddddddddddddddddddddddddd", AttenData);
  console.log("Attendeddddddddddddddddd", AttendedMeetings);
  console.log("Conducteddddddddddddddd ", Conducted);
  console.log("Percentageeee ", Percentage);
  console.log("Checking Current userrrrrrrrrrrrrrr idddddddddd ", currentUserId);
  return (
    <>
      <div className='mt-7 '>
        <h1 className='text-black text-2xl font-semibold'>Attendance</h1>
        <div className="relative max-h-52 overflow-auto shadow-md sm:rounded-lg w-[60%] ">
          <table className="w-full text-sm text-center rtl:text-right text-gray-500  ">
          <div className='bg-white'>
            {/* {Conducted && AttendedMeetings && Percentage && ( */}
              <div className='grid grid-cols-3 gap-[150px] mx-16'>
                <div className='col mt-4 mb-4'> 
                 
                  <div className='flex flex-row space-x-2 mt-2'>
                    <p className='font-semibold text-sm'>Conducted: </p>
                    <p className='font-normal'>{Conducted}</p>
                  </div>
                </div>
                <div className='col second mt-4'> 
                  
                  <div className='flex flex-row space-x-2 mt-2'>
                    <p className='font-semibold text-sm'>Attended:  </p>
                    <p className='font-normal'>{AttendedMeetings}</p>
                  </div>
                </div>
                <div className='col third mt-4'> 
                  
                  <div className='flex flex-row space-x-2 mt-2'>
                    <p className='font-semibold text-sm'>Percentage:  </p>
                    <p className='font-normal'>{Percentage} %</p>
                  </div>
                </div>
              </div>
              {/* )} */}
            </div>
            {AttenData.length > 0 ? (
             <div>
            <thead className="text-xs text-indigo-900 uppercase bg-gray-50    ">
            <tr className='border-b text-center'>
                  <th className="px-6 py-3  w-52">Meeting no</th>
                  <th className="px-6 py-3  w-52 text">Status</th>
                  <th className="px-6 py-3  w-52">% age (100)</th>
                  <th className="px-6 py-3  w-52">Date</th>
                  <th className="px-6 py-3  w-72">Slots</th>
                </tr>
            </thead>
            <tbody>
            {AttenData.map((item, index) => {
    const currentUserAttendance = item.memberAttendances.find(attendance => attendance.member === currentUserId);
    const attendanceStatus = currentUserAttendance ? (currentUserAttendance.status === 'present' ? 'P' : currentUserAttendance.status) : 'absent';

    const meetingNumber = index + 1;

    let meetingAttended = 0; // Initialize meetingAttended variable
    let meetingConducted = 0; // Initialize meetingConducted variable

    // Calculate meetingAttended and meetingConducted up to the current meeting index
    for (let i = 0; i <= index; i++) {
        const attendance = AttenData[i].memberAttendances.find(attendance => attendance.member === currentUserId);
        if (attendance && attendance.status === 'present') {
            meetingAttended++;
        }
        meetingConducted++;
    }

    const formattedDate = new Date(item.meetingDate).toLocaleDateString('en-US', { timeZone: 'UTC' });
    const formattedStartTime = new Date(item.meetingStartTime).toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false });
    const formattedEndTime = new Date(item.meetingEndTime).toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false });

    // Calculate meetingPercentage for each meeting
    const meetingPercentage = meetingConducted > 0 ? (meetingAttended / meetingConducted) * 100 : 0;

    return (
        <tr key={index} className="text-center font-normal bg-white">
            <td className="px-6 py-4">{meetingNumber}</td>
            <td className="px-6 py-4">{currentUserAttendance.status === 'present' ? (
                <span className="bg-green-500 text-white p-2 rounded">P</span>
            ) : (
                <span className="bg-red-500 text-white p-2 rounded">A</span>
            )}</td>
            <td className="px-6 py-4">{meetingPercentage.toFixed(2)}%</td>
            <td className="px-6 py-4">{formattedDate}</td>
            <td className="px-6 py-4">{`${formattedStartTime} - ${formattedEndTime}`}</td>
        </tr>
    );
})}


            </tbody>
            </div>
            

                ) : (
                  <p className="text-center mt-5">Meetings are not scheduled yet</p>
)}
                
          </table>
        </div>
      </div>
    </>
  );
}

export default Attendance;
