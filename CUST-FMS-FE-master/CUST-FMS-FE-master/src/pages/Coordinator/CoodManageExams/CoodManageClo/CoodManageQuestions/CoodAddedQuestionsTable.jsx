import React from 'react';
import GenAccor from '../../../../../Components/Accordians/GenAccor';

const CoodAddedQuestionsTable = (props) => {
    const { data, handleEditClick, handleDelClick, accordionId } = props;

    console.log("data", data);

    return (
        <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
            <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                <GenAccor text="Questions" accordionId={accordionId} />
            </h2>
            <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
                    <div className="table-container overflow-x-auto relative">
                        <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50   border-collapse border border-gray-300">
                            <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                                <tr className='border-b text-center'>
                                    <th className="px-6 py-3 w-32">Serial no.</th>
                                    <th className="px-6 py-3 w-[51.25rem] text-left">Question</th>
                                    <th className="px-6 py-3 w-48">Short Code</th>
                                    <th className="px-6 py-3 w-48">Marks</th>
                                    <th className="px-6 py-3 w-48">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data && data.length > 0 ? (
                                    data.map((item, index) => (
                                        <tr key={index} className="text-center">
                                            <td className="px-6 py-4 font-semibold">{item.index}</td>
                                            <td className="px-6 py-4 font-semibold text-left">{item.question}</td>
                                            <td className="px-6 py-4 font-semibold">{item.shortCode}</td>
                                            <td className="px-6 py-4 font-semibold">{item.marks}</td>
                                            <td className="px-6 py-4 font-semibold">
                                                <div className='flex flex-row gap-4 justify-center'>
                                                    <div>
                                                        <button
                                                            onClick={() => handleEditClick(item)}
                                                            className="text-black hover:text-gray-400"
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={() => handleDelClick(item._id)}
                                                            className="text-black hover:text-gray-400"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">Data Not Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CoodAddedQuestionsTable;
