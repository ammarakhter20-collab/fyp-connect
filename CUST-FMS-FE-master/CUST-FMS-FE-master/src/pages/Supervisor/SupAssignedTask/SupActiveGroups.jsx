import React, {useState, useEffect} from 'react';
import Table from '../../../TESTING/AccordionTableGeneric';


const SupActiveGroups = (props) => {
    const {groupData, accordionId, AddTaskClick, ViewTaskClick, ViewMarksClick} = props
  return (
    <div> 
        <Table groupData={groupData} headers={[
        'Group no',
        'FYP Title',
        'Members',
        'Term',
        'Status',
      ]} accordionId={accordionId  } buttons={[
        {
          bheading: 'Task',
          text: 'Add Task',
          click: AddTaskClick,
        },
        {
          bheading: 'Uploaded Tasks',
          text: 'View',
          click: ViewTaskClick,
        },
        {
          bheading: 'Marks',
          text: 'View',
          click: ViewMarksClick,
        },
      ]}
      tabheading={'Groups'}
      fields={['groupNo', 'fypTitle', 'members', 'term', 'status']}
      memberFields = {['Name', 'RegistrationNo']}

      /></div>
  )
}

export default SupActiveGroups
