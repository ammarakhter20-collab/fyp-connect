import React, { useState, useEffect } from 'react';
import SupUploadedTasksTable from './SupUploadedTasksTable';
import GenAccor from '../../../Components/Accordians/GenAccor';

const   SupUploadedTasks = (props) => {
  const {groupData, accordionId, viewDetailsClick, group} = props;
  console.log("view rrgiaqwewfdd",groupData )

  return (
    <div>
      <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
        <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
          <GenAccor text={'Uploaded Tasks'} accordionId={accordionId} />
        </h2>
        <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
          <div className="relative overflow-x-auto max-h-96 shadow-md sm:rounded-lg">
      <SupUploadedTasksTable groupData={groupData} group = {group} componentid={5} viewDetailsClick ={viewDetailsClick} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupUploadedTasks
