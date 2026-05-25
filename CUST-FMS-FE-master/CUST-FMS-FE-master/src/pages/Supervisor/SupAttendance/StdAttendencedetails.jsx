import React, { useEffect } from 'react';
import { initFlowbite } from 'flowbite';
import GenAccor from '../../../Components/Accordians/GenAccor';

const StdAttendancedetails = ({ accordionId, groupData, memberId }) => {

    const member = groupData && groupData.fypGroup && groupData.fypGroup[0] && groupData.fypGroup[0].fypgroup && groupData.fypGroup[0].fypgroup.groupMembers
        ? groupData.fypGroup[0].fypgroup.groupMembers.find((member) => member._id === memberId)
        : null;

    console.log(groupData, "attendence groupdata")

    useEffect(() => {
        initFlowbite();
   
    }, []);

    useEffect(() => {

    }, [groupData]);
  
    const totalAttendedMeetings = groupData && groupData.fypGroup && groupData.fypGroup[0] && groupData.fypGroup[0].partStatus
        ? groupData.fypGroup[0].partStatus.reduce((total, part) => {
            return total + (part.meetings ? part.meetings.reduce((meetings, meeting) => {
                return meetings + (meeting.memberAttendances ? meeting.memberAttendances.reduce((attendanceCount, attendance) => {
                    const attMemberId = attendance.member && (attendance.member._id || attendance.member).toString();
                    return attendanceCount + (attMemberId === memberId.toString() && attendance.status === 'present' ? 1 : 0);
                }, 0) : 0);
            }, 0) : 0);
        }, 0)
        : 0;
    
    const totalConductedMeetings = groupData && groupData.fypGroup && groupData.fypGroup[0] && groupData.fypGroup[0].partStatus
        ? groupData.fypGroup[0].partStatus.reduce((total, part) => {
            return total + (part.meetings ? part.meetings.length : 0);
        }, 0)
        : 0;
    const Percentage = totalConductedMeetings > 0 ? (totalAttendedMeetings / totalConductedMeetings) * 100 : 0; 

    return (
        <>
            <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
                <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                    <GenAccor text="Student's Attendance Details" accordionId={accordionId} />
                </h2>
                <div
                    id={`accordion-collapse-body-timetable-${accordionId}`}
                    className="hidden"
                    aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}
                >
                    <div className="relative overflow-x-auto max-h-96 shadow-md sm:rounded-lg">
                        <table className="w-full text-sm rtl:text-right text-gray-500 text-center">
                            <thead className="text-xs text-indigo-900 uppercase bg-gray-50 ">
                                <tr>
                                    <th colSpan="2" className="px-6 py-3">
                                        Student Name: {member ? member.name : ''}
                                    </th>
                                    <th colSpan="2" className="px-6 py-3">
                                        Registration No.: {member ? member.registrationNumber : ''}
                                    </th>
                                    <th colSpan="2" className="px-6 py-3">
                                        Course: {member ? member.course : ''}
                                    </th>
                                </tr>
                                <tr>
                                    <th colSpan="2" className="px-6 py-3">
                                        Total Conducted Meetings: {totalConductedMeetings}
                                    </th>
                                    <th colSpan="2" className="px-6 py-3">
                                        Attended Meetings: {totalAttendedMeetings}
                                    </th>
                                    <th colSpan="2" className="px-6 py-3">
                                        Total Percentage: {Percentage}%
                                    </th>
                                </tr>
                                <tr>
                                    <th className="px-6 py-3">Meeting No.</th>
                                    <th className="px-6 py-3">Percentage</th>
                                    <th className="px-6 py-3">Attendance</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Slot</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupData.fypGroup[0].partStatus.map((part, partIndex) => (
                                    part.meetings.map((meeting, meetingIndex) => {
                                        const meetingNumber = meetingIndex + 1;
                                        const meetingAttended = meeting.memberAttendances.filter(attendance => {
                                            const attMemberId = attendance.member && (attendance.member._id || attendance.member).toString();
                                            return attMemberId === memberId.toString() && attendance.status === 'present';
                                        }).length;
                                        const meetingConducted = meetingNumber;
                                        const meetingPercentage = meetingConducted > 0 ? (meetingAttended / meetingConducted) * 100 : 0;
                                        const date = new Date(meeting.meetingDate);
                                        const formattedDate = date.toISOString().slice(0, 10);
                                        const meetingStartTime = new Date(meeting.meetingStartTime);
                                        const formattedMeetingStartTime = meetingStartTime.toISOString().slice(11, 16);
                                        const meetingEndTime = new Date(meeting.meetingEndTime);
                                        const formattedMeetingEndTime = meetingEndTime.toISOString().slice(11, 16);
                                        return (
                                            <tr key={`${partIndex}-${meetingIndex}`} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-3">{meetingNumber}</td>
                                                <td className="px-6 py-3">{meetingPercentage.toFixed(2)}</td>
                                                <td className="px-6 py-3">
                                                    {meeting.memberAttendances.find(attendance => {
                                                        const attMemberId = attendance.member && (attendance.member._id || attendance.member).toString();
                                                        return attMemberId === memberId.toString() && attendance.status === 'present';
                                                    }) ? (
                                                        <span className="bg-green-500 text-white p-2 rounded">P</span>
                                                    ) : (
                                                        <span className="bg-red-500 text-white p-2 rounded">A</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3">{formattedDate}</td>
                                                <td className="px-6 py-3">{formattedMeetingStartTime} - {formattedMeetingEndTime}</td>
                                            </tr>
                                        );
                                    })
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StdAttendancedetails;









// <td className="px-6 py-3">
                                                
// <span className={`rounded-full px-3 py-1 ${meeting.memberAttendances
//         .filter(member => member.member._id === memberId)
//         .map(member => member.status ) === 'present'  ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
//     {meeting.memberAttendances
//         .filter(member => member.member._id === memberId)
//         .map(member => member.status.charAt(0).toUpperCase())}
// </span>
// </td>
