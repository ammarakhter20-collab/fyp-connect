import React from 'react';
import Simple from '../../Components/Buttons/Simple';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
const GenericTable = ({ groupData, headers = [], buttons = [], fields = [], memberFields = [], column, columnbutton, componentid }) => {
    console.log('yeh hum main table mei ha', groupData)
    const handleme = () => {
    }
    const handleApproveClick = () => {
    }
    const handleDenialClick = () => {
    }
    return (
        <>
            <div>
                <div className="relative overflow-x-auto  h-full shadow-md sm:rounded-lg block w-full p-6 bg-white border border-gray-200 rounded-2xl  ">
                    {/* This shouldn't be here */}
                    {componentid === 1 && componentid !== null && (groupData.map((item, index) => (
                        <div key={index} className=' pb-5 text-indigo-900 uppercase font-semibold'>
                            {item.fyp}
                        </div>
                    )))}
                    <div>
                        <table className='w-full text-sm  rtl:text-right text-gray-500 text-center'>
                            <thead className='text-xs text-indigo-900 uppercase   border-b border-gray-200'>
                                <th className='px-6 py-3'>FYP Title</th>
                                <th className='px-6 py-3'>Date</th>
                                <th className='px-6 py-3'>Exam Type</th>
                                <th className='px-6 py-3'>Upload At</th>
                                <th className='px-6 py-3'>File</th>
                                <th className='px-6 py-3'>Status</th>
                            </thead>
                            <tbody>
                                {groupData.map((item, index) => (
                                    <tr key={index} className='' >
                                        <td className='px-6 py-3'>{item.fyp}</td>
                                        <td className='px-6 py-3'>{item.examdate}</td>
                                        <td className='px-6 py-3'>{item.examtype}</td>
                                        <td className='px-6 py-3'>{item.fileupload}</td>
                                        <td className='px-6 py-3'><td className=''>{item.file}</td>
                                            <td className=''>
                                                <button type="button" className=''>
                                                    {componentid === 1 && componentid !== null && (<FileDownloadIcon />)}
                                                </button>
                                            </td>
                                        </td>
                                        {componentid === 1 && componentid !== null && (<td className='px-6 py-3 flex justify-center'>
                                            <td>
                                                <Simple text='Approve' onclick={handleApproveClick} bgClass='bg-green-500' />
                                            </td>
                                            <td>
                                                <Simple text='Deny' onclick={handleDenialClick} bgClass='' />
                                            </td>
                                        </td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table className="w-full text-sm  rtl:text-right text-gray-500 text-center">
                            <thead className="text-xs text-indigo-900 uppercase border-b   ">
                                <tr className=' '>
                                    {headers.map((header, index) => (
                                        <th key={index} colSpan={header.colSpan ?? 1} className="px-6 py-3">{header.text}</th>
                                    ))}
                                    {buttons.map((button, index) => (
                                        <th key={`button-${index}`} className="px-6 py-3 text-center" colSpan={buttons.length === 1 && button.bheading ? button.bcolspan : 1}>
                                            {button.bheading}
                                        </th>
                                    ))}

                                </tr>
                            </thead>
                            <tbody className=''>
                                {groupData.map((item, index) => (
                                    <tr key={index} className="bg-white  ">
                                        {fields.map((field, fieldIndex) => (
                                            <td key={fieldIndex} className="px-6 py-3">
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
                                         {componentid === 1 && componentid !== null && (<td className='px-6 py-3 flex justify-center'>
                                            <td>
                                                <Simple text='Approve' onclick={handleApproveClick} bgClass='bg-green-500' />
                                            </td>
                                            <td>
                                                <Simple text='Deny' onclick={handleDenialClick} bgClass='' />
                                            </td>
                                        </td>)}
                                        {buttons.map((button, buttonIndex) => (
                                            <td key={`button-${index}-${buttonIndex}`} className="px-6 py-3" colSpan={buttons.length === 1 && button.bheading ? button.bcolspan : 1}>
                                                <button type="button" onClick={() => button.click(index)}>{button.text}</button>
                                            </td>
                                        ))}

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

export default GenericTable
