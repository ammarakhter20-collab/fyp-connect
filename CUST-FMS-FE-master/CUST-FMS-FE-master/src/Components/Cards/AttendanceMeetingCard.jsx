// import React, { useState } from 'react';
// import Simple from '../Buttons/Simple';

// const AttendanceMeetingCard = ({ groupData, onClose }) => {
//     const [meetingNo, setMeetingNo] = useState('');
//     const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
//     const [startTime, setStartTime] = useState('');
//     const [endTime, setEndTime] = useState('');
//     const [attendance, setAttendance] = useState('P'); // 'P' for present, 'A' for absent
//     const [groupData1, setGroupData1] = useState('null');

//     const handleAttendanceClick = () => {
//         setAttendance(attendance === 'P' ? 'A' : 'P');
//     };
//     const handleSaveClick = () => {
//         // Add your save functionality here
//     };
//     const handleCancelClick = () => {
//         onClose(); // Call the onClose prop to close the modal
//     };

//     return (
//         <div className="bg-white shadow-md rounded-lg p-6 w-[43.3%]">
//             <h2 className="text-center font-bold text-xl mb-4">Add Details</h2>
//             <form>
//                 <div className="mb-4">
//                     <label htmlFor='meetingNo' className="block text-sm font-medium text-gray-700">Meeting Number</label>
//                     <input
//                         id='meetingNo'
//                         type="text"
//                         value={meetingNo}
//                         onChange={(e) => setMeetingNo(e.target.value)}
//                         className="border h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor='date' className="block text-sm font-medium text-gray-700">Date</label>
//                     <input
//                         id='date'
//                         type="date"
//                         value={date}
//                         onChange={(e) => setDate(e.target.value)}
//                         className="border h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor='time' className="block text-sm font-medium text-gray-700">Meeting Time</label>
//                     <div className="flex space-x-4">
//                         <input
//                             id='time'
//                             type="time"
//                             value={startTime}
//                             onChange={(e) => setStartTime(e.target.value)}
//                             className="border h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-[50%] sm:text-sm"
//                         />
//                         <input
//                             type="time"
//                             id='time'
//                             value={endTime}
//                             onChange={(e) => setEndTime(e.target.value)}
//                             className="border h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-[50%] sm:text-sm"
//                         />
//                     </div>
//                 </div>
//             </form>

//             <table className="w-full text-sm text-left border-collapse border border-gray-300">
//                 <thead className="bg-gray-50">
//                     <tr>
//                         <th className="px-4 py-2">Name</th>
//                         <th className="px-4 py-2">Registration No.</th>
//                         <th className="px-4 py-2">Attendance</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {groupData && groupData.map((member, index) => (
//                         <tr key={index}>
//                             <td className="border px-4 py-2">{member.Name}</td>
//                             <td className="border px-4 py-2">{member.RegistrationNo}</td>
//                             <td className="border px-4 py-2">
//                                 <button
//                                     className={`rounded-full px-3 py-1 ${attendance === 'P' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
//                                         }`}
//                                     onClick={() => handleAttendanceClick()}
//                                 >
//                                     {attendance}
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             <div className='grid grid-cols-2 mt-5 '>
//                 <div className="col-span-1 flex justify-center ">
//                     {/* Cancel Button colour is to be adjusted */}
//                     <Simple text="Cancel" onClick={handleCancelClick} style={{ backgroundColor: '#A3AED0' }} />
//                 </div>
//                 <div className="col-span-1 flex justify-center ">
//                     <Simple text="Save" type = "Submit" onClick={handleSaveClick} />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AttendanceMeetingCard;

import React, { useState, useEffect } from 'react';
import Simple from '../Buttons/Simple';

const AttendanceMeetingCard = ({ groupData, onClose, handleSaveClick }) => {
    const [meetingNo, setMeetingNo] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [attendance, setAttendance] = useState('P');
    const [groupData1, setGroupData1] = useState('null');

    const [attendanceStatus, setAttendanceStatus] = useState({});

    //const meetingDate = new Date(date).toJSON();
    const meetingDate = new Date(`${date}T${startTime}:00.000Z`).toJSON();
    //const meetingStartTime = new Date(startTime).toJSON();
    const meetingStartTime = new Date(`${date}T${startTime}:00.000Z`).toJSON();
    //const meetingEndTime = new Date(endTime).toJSON();
    const meetingEndTime = new Date(`${date}T${endTime}:00.000Z`).toJSON();

    console.log(meetingDate)
    console.log(meetingEndTime)
    console.log(meetingStartTime)
    const memberids = groupData.map(members => ({
        _id: members._id,
    }));

    const handleSave = () => {
        console.log(groupData)
        const meetingDetails = {
            meetingNo,
            meetingDate,
            meetingStartTime,
            meetingEndTime,
            attendanceStatus,
        };
        handleSaveClick(meetingDetails);
        onClose()
    };
    const handleCancelClick = () => {
        onClose();
    };
    useEffect(() => {
        if (groupData) {
            const initialAttendanceStatus = {};
            groupData.forEach((member) => {
                initialAttendanceStatus[member._id] = {
                    _id: member._id,
                    registrationNumber: member.RegistrationNo,
                    name: member.Name,
                    attendance: 'P',

                };
            });
            setAttendanceStatus(initialAttendanceStatus);
        }
    }, [groupData]);


    console.log("attendancegroup", groupData)

    const handleAttendanceClick = (_id) => {
        setAttendanceStatus((prevStatus) => ({
            ...prevStatus,
            [_id]: {
                ...prevStatus[_id],
                attendance: prevStatus[_id].attendance === 'P' ? 'A' : 'P',
            },
        }));
    };



    return (
        <div className=" bg-white shadow-md rounded-lg p-6 w-full  sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4 mx-auto">
            <h2 className="text-center font-bold text-xl mb-4">Add Details</h2>
            <form>
                <div className="mb-4">
                    <label htmlFor='meetingNo' className="block text-sm font-medium text-gray-700">Meeting Number</label>
                    <input
                        id='meetingNo'
                        type="text"
                        value={meetingNo}
                        onChange={(e) => setMeetingNo(e.target.value)}
                        className="border h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm p-5"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor='date' className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        id='date'
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm p-5"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor='time' className="block text-sm font-medium text-gray-700">Meeting Time</label>
                    <div className="flex space-x-4">
                        <input
                            id='time'
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="border h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-[50%] sm:text-sm p-5"
                        />
                        <input
                            type="time"
                            id='time'
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="border h-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-[50%] sm:text-sm p-5"
                        />
                    </div>
                </div>
            </form>

            <table className="w-full text-sm text-left border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Registration No.</th>
                        <th className="px-4 py-2">Attendance</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(attendanceStatus).map((_id) => (
                        <tr key={_id}>
                            <td className="border px-4 py-2">{attendanceStatus[_id].name}</td>
                            <td className="border px-4 py-2">{attendanceStatus[_id].registrationNumber}</td>
                            <td className="border px-4 py-2">
                                <button
                                    className={`rounded-full px-3 py-1 ${attendanceStatus[_id].attendance === 'P'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white'
                                        }`}
                                    onClick={() => handleAttendanceClick(_id)}
                                >
                                    {attendanceStatus[_id].attendance}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='grid grid-cols-2 mt-5 '>
                <div className="col-span-1 flex justify-center ">
                    {/* Cancel Button colour is to be adjusted */}
                    <Simple text="Cancel" onClick={handleCancelClick} bgClass={'bg-gray-400'} />
                </div>
                <div className="col-span-1 flex justify-center ">
                    <Simple text="Save" type="Submit" onClick={handleSave} />
                </div>
            </div>
        </div>
    );
};

export default AttendanceMeetingCard;
