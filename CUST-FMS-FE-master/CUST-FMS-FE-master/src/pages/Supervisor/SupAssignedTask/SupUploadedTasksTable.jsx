import React, {useState, useEffect} from 'react';
import Table from '../SupAssignedExams/SupTablewWthinCard'; 

const SupUploadedTasksTable = (props) => {
    const { groupData, componentid, viewDetailsClick, group } = props;
    const updatedGroupData = groupData.map(data => {
        const newData = { ...data, ...group, _id: data._id }; // Set _id explicitly
        return newData;
    });

    // Map over updatedGroupData and format dates
    const updatedTasks = updatedGroupData.map(task => {
        const updatedTask = { ...task };
        if (updatedTask.dueDate) {
            updatedTask.dueDate = new Date(updatedTask.dueDate).toLocaleString('en-US');
        }
        if (updatedTask.dueTime) {
            updatedTask.dueTime = new Date(updatedTask.dueTime).toLocaleString('en-US');
        }
        if (updatedTask.closeDate) {
            updatedTask.closeDate = new Date(updatedTask.closeDate).toLocaleString('en-US');
        }
        if (updatedTask.closeTime) {
            updatedTask.closeTime = new Date(updatedTask.closeTime).toLocaleString('en-US');
        }
        if (updatedTask.assignedDate) {
            updatedTask.assignedDate = new Date(updatedTask.assignedDate).toLocaleString('en-US');
        }
        return updatedTask;
    });

    console.log("check this", updatedTasks);

    return (
        <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
            <Table
                groupData={updatedTasks}
                headers={[
                    { text: 'Task no', colSpan: 1 },
                    { text: 'Task Title', colSpan: 1 },
                    { text: 'Group Members', colSpan: 1 },
                    { text: 'Status', colSpan: 1 },
                    { text: 'Assigned Date', colSpan: 1 },
                    { text: 'Details', colSpan: 1 },
                ]}
                buttons={[
                    {
                        text: 'View',
                        click: viewDetailsClick,
                    },
                ]}
                fields={['taskNo', 'taskTitle', 'members', 'taskstatus', 'assignedDate']}
                memberFields={['Name', 'RegistrationNo']}
                //componentid={componentid}
            />
        </div>
    );
}

export default SupUploadedTasksTable;
