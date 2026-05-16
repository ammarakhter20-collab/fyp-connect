import React from 'react';
import GenAccor from '../../../Components/Accordians/GenAccor';
const SupViewStdMarks = (props) => {
    const { selectedStudent, accordionId, tasks } = props;

    console.log (tasks)
    return (
        <>
            <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
                <GenAccor accordionId={accordionId} text={'Task Details'} />
                <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                    <div className="relative overflow-x-auto max-h-96 shadow-md sm:rounded-lg">
                        <table className="w-full text-sm  rtl:text-right  text-center bg-white">
                            <thead className="text-xs text-indigo-900 uppercase bg-gray-50 ">
                                <tr>
                                    <th>Name: {selectedStudent.Name}</th>
                                    <th>Reg no: {selectedStudent.RegistrationNo}</th>
                                    <th>Course: {selectedStudent.Course}</th>
                                </tr>
                                <tr>
                                    <th>Task no</th>
                                    <th>Task Title</th>
                                    <th>Percentage % (10) </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks && (tasks.filteredMarks.map((task, index) => (
                                    <tr key={index}>
                                        <td>{task.task.taskNo}</td>
                                        <td>{task.task.taskTitle}</td>
                                        <td>{task.marks[0].obtainedMarks}</td>
                                    </tr>)))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SupViewStdMarks
