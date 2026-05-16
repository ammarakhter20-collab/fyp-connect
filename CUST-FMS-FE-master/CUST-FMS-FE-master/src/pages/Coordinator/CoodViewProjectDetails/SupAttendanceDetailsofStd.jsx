import React from 'react'
import GenAccor from '../../../Components/Accordians/GenAccor'

const SupAttendanceDetailsofStd = (props) => {
    const { data, accordionId , handleViewClick, accordText} = props
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
                                    <th colSpan={2}>
                                        Course: {data[0]?.Course}
                                    </th>
                                    <th  colSpan={2}>
                                        Conducted meetings: {data[0]?.Meetings}
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
                                        % age (15)
                                    </th>
                                    <th>
                                        Details
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data[0]?.members.map((member, index) => (
                                    <tr key={index} className='py-5'>
                                        <td>{member.regNo}</td>
                                        <td>{member.Name}</td>
                                        <td>{member.Percentage}</td>
                                        <td><button onClick={() => handleViewClick(member._id)}>View</button></td>
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

export default SupAttendanceDetailsofStd
