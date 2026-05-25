import React, { useState, useEffect } from 'react';
import { initFlowbite } from 'flowbite';
import GenAccor from '../../../Components/Accordians/GenAccor';

const AttendanceDet = ({ accordionId, groupData, onViewDetailsClick }) => {

  const click = () => {
    onViewDetailsClick();
  }

  useEffect(() => {
    initFlowbite();
    // ... rest of the useEffect code ...
  }, []);

  console.log("groupData", groupData);

  return (
    <>
      <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
        <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
          <GenAccor text="Attendance Details" accordionId={accordionId} />
        </h2>
        <div
          id={`accordion-collapse-body-timetable-${accordionId}`}
          className="hidden"
          aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}
        >
          <div className="relative overflow-x-auto max-h-96 shadow-md sm:rounded-lg">
            <table className="w-full text-sm rtl:text-right text-gray-500 text-center">
              <thead className="text-xs text-indigo-900 uppercase bg-gray-50 ">
                {groupData && (
                  <tr key={groupData.fypGroup[0].groupNo} className="">
                    <th colSpan={2} className="px-6 py-3">
                      FYP Title: {groupData.fypGroup[0].fypgroup.topicData.topic}
                    </th>
                    <th colSpan={2} className="px-6 py-3">
                      Conducted Meetings: {groupData.fypGroup.reduce((total, fypGroup) => total + fypGroup.partStatus.reduce((count, part) => count + part.meetings.length, 0), 0)}
                    </th>
                  </tr>
                )}
                <tr className="">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Registration no.</th>
                  <th className="px-6 py-3">Percentage</th>
                  <th className="px-6 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {groupData && groupData.fypGroup[0].fypgroup.groupMembers.map((member, i) => {
                  const totalConductedMeetings = groupData.fypGroup.reduce((total, fypGroup) => total + fypGroup.partStatus.reduce((count, part) => count + part.meetings.length, 0), 0);
                  const totalAttendedMeetings = groupData.fypGroup.reduce((total, fypGroup) => {
                    return total + fypGroup.partStatus.reduce((meetingsTotal, part) => {
                      return meetingsTotal + part.meetings.reduce((meetings, meeting) => {
                        return meetings + meeting.memberAttendances.reduce((attendanceCount, attendance) => {
                          const attMemberId = attendance.member && (attendance.member._id || attendance.member).toString();
                          return attendanceCount + (attMemberId === member._id.toString() && attendance.status === 'present' ? 1 : 0);
                        }, 0);
                      }, 0);
                    }, 0);
                  }, 0);

                  const percentage = totalConductedMeetings > 0 ? (totalAttendedMeetings / totalConductedMeetings) * 100 : 0;

                  return (
                    <tr key={i} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{member.name}</td>
                      <td className="px-6 py-3">{member.registrationNumber}</td>
                      <td className="px-6 py-3">{percentage.toFixed(2)}%</td>
                      <td className="px-6 py-3">
                        <button type="button" onClick={() => onViewDetailsClick(member._id)}>View</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AttendanceDet;
