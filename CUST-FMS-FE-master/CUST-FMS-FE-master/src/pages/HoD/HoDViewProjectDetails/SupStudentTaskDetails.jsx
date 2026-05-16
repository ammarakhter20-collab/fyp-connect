import React from 'react'
import GenAccor from '../../../Components/Accordians/GenAccor'
const SupStudentTaskDetails = (props) => {
    const { data, accordionId , handleViewTaskClick, accordText} = props
    console.log('kangaal', data);
    return (
        <>
            <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1 '>
                <GenAccor accordionId={accordionId} text={accordText} />
                <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                    <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
                        <table className='w-full  text-sm rtl:text-right text-gray-500 text-center'>
                            <thead className="text-xs text-indigo-900 uppercase border-b   ">
                                <tr>
                                    <th  colSpan={2}>
                                    FYP Title: {data.fypTitle}
                                    </th>
                                    <th colSpan={2}>
                                        Course: {`Design Part (${data.partStatus})`}
                                    </th>
                                </tr>
                                <tr>
                                    <th>
                                        Reg no
                                    </th>
                                    <th>
                                        Name
                                    </th>
                                    <th>
                                        % age (10)
                                    </th>
                                    <th>
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.members.map((member, index) => (
                                    <tr key={index} className='py-5'>
                                        <td>{member.regNo}</td>
                                        <td>{member.name}</td>
                                        <td>{member.percentage}</td>
                                        <td><button onClick={() => handleViewTaskClick(member._id)} className='underline' >View</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SupStudentTaskDetails
