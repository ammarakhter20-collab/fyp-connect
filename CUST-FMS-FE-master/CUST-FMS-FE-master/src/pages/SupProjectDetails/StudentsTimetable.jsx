import { Accordion } from 'flowbite-react';
import React from 'react'
//import Timetable from './tables/timetable';
const SupervisorsTimetable = () => {
  return (
    <Accordion collapseAll>
    {/* Evaluation Marks */}
    <Accordion.Panel>
      <Accordion.Title className='bg-primary text-white hover:bg-0 py-4 rounded-md'>Timetable</Accordion.Title>
      <Accordion.Content>
      {/* <Timetable/> */}
      </Accordion.Content>
    </Accordion.Panel>
  </Accordion>
  )
}

export default SupervisorsTimetable;
