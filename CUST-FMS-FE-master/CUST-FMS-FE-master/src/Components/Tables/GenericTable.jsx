import React from 'react'

const GenericTable = ({ groupData, headers = [], buttons = [], fields = [], memberFields = [], column, columnbutton }) => {
    console.log('yeh hum main table mei ha',groupData)
    const handleme = () =>{
    }
    return (
        <>
            <div>
                <div className="relative overflow-x-auto max-h-96 shadow-md sm:rounded-lg">
                    {/* <button type="button" onClick={handleme}>click</button> */}
                    
                    <table className="w-full text-sm  rtl:text-right text-gray-500 text-center">
                        <thead className="text-xs text-indigo-900 uppercase bg-gray-50 ">
                            <tr className=' '>
                                {headers.map((header, index) => (
                                    <th key={index} className="px-6 py-3">{header}</th>
                                ))}
                                {buttons.map((button, index) => (
                                    <th key={`button-${index}`} className="px-6 py-3">{button.text}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className=''>
                            {groupData.map((item, index) => (
                                <tr key={index} className="bg-white border-b  hover:bg-gray-50 ">
                                    {fields.map((field, fieldIndex) => (
                                        <td key={fieldIndex} colSpan={column} className="px-6 py-3">
                                            {field === 'members' ? (
                                                item[field].map((member, memberIndex) => (
                                                    <div key={memberIndex}>
                                                        {memberFields.map((memberField, memberFieldIndex) => (
                                                            <span key={memberFieldIndex}>
                                                                {member[memberField]}
                                                                {memberFieldIndex !== memberFields.length - 1 && ','}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ))
                                            ) : (
                                                item[field]
                                            )}
                                        </td>
                                    ))}
                                    {buttons.map((button, buttonIndex) => (
                                        <td key={`button-${index}-${buttonIndex}`} colSpan={columnbutton} className="px-6 py-3">
                                            <button type="button" onClick={() => button.click(index)}>{button.text}</button>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    )
}

export default GenericTable
