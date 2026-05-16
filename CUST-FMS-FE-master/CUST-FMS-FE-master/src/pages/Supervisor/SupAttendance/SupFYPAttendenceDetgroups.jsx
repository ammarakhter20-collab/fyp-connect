import React, { useState, useEffect } from 'react';
import { initFlowbite } from 'flowbite';
import Table from '../../../TESTING/AccordionTableGeneric';
const FYPAttendenceDetgroups = ({ accordionId, groupData, onMarkAttendanceClick, onViewDetailsClick }) => {

  console.log('we aare inside fyp group attendence details', groupData)

  let serialNum = 1;
  const reqData = groupData.fypRequests.map(data => ({
    _id: data._id,
    groupNo: serialNum++,
    fypTitle: data.topicData.topic,
    members: data.groupMembers.map(member => ({
      Name: member.name,
      RegistrationNo: member.registrationNumber,
      term : member.term.sessionTerm,
    })),
    SuprvisionRequest: data.reqDate,
    term : data.groupMembers[0].term.sessionTerm,
    status: data.reqStatus,
  }));

  const handleClick01 = (groupNo) => {

    if (groupNo >= 0 && groupNo < groupData.length) {
      const group = groupData[groupNo];
      if (group) {
        const membersInfo = group.members.map((member) => ({
          Name: member.Name,
          RegistrationNo: member.RegistrationNo,
          Percentage: member.Percentage,
        }));
        //console.log(membersInfo);
        onMarkAttendanceClick(membersInfo);
      }
    }
  };
  const handleClick02 = (groupNo) => {

    const group = groupData[groupNo];
    //console.log(group)
    if (group) {
      onViewDetailsClick(group);
    }
  };
  return (
    <>
      <div>

        <Table groupData={reqData} headers={[
          'Group no',
          'FYP Title',
          'Members',
          'Term',
          'Status',
        ]} accordionId={accordionId} buttons={[
          {
            bheading: 'Mark Attendence',
            text: 'Mark Attendance',
            click: onMarkAttendanceClick,
          },
          {
            bheading: 'View Details',
            text: 'View',
            click: onViewDetailsClick,
          },
        ]}
          tabheading={'FYP Groups'}
          fields={['groupNo', 'fypTitle', 'members', 'term', 'status']}
          memberFields={['Name', 'RegistrationNo']}

        />


      </div>
    </>
  );
};

export default FYPAttendenceDetgroups;
