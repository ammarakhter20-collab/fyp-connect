import React from 'react'
import GenAccor from '../../../Components/Accordians/GenAccor'

const SupExamCLO = (props) => {
    const { accordionId, examCloData } = props

    console.log(examCloData, "ExamData")
    return (
        <>
            <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
                <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                    <GenAccor text="Exam CLOs" accordionId={accordionId} />
                </h2>
                <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                    {examCloData ? (
                        <div className="pt-0 pb-0 max-h-52 h-52 bg-white border border-b-0 border-gray-200 relative">
                            <p className='pl-4 mt-1'></p>
                            <div className="overflow-x-auto max-h-96 shadow-md sm:rounded-lg">
                                <table className="w-full text-sm  rtl:text-right  text-center bg-white">
                                    <thead className="text-xs text-indigo-900 uppercase bg-gray-50 ">
                                        <tr>
                                            <th className='flex justify-start text-lg'>
                                                {examCloData[0].CreatedExam.CLOForExams.shortCode}

                                            </th>
                                        </tr>
                                        <tr>
                                            <th>
                                                Sr. No
                                            </th>
                                            <th>
                                                CLOs
                                            </th>
                                            <th>
                                               
                                            </th>
                                            <th>
                                                Sr. No
                                            </th>
                                            <th>
                                                Sr. No
                                            </th>
                                        </tr>

                                    </thead>
                                    <tbody className='text-indigo-950'>

                                    </tbody>
                                </table>
                            </div>
                        </div>) : (

                        <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                            <div className=' overflow-x-auto max-h-96 shadow-md sm:rounded-lg   rtl:text-right  text-center  text-xs text-indigo-900 uppercase bg-gray-50 py-10 '>
                                No Data Found
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default SupExamCLO
