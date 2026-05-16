import React from 'react';
import Simple from '../../../Components/Buttons/Simple';
import FilterButton from '../../../Components/Buttons/FilterButton';
import { baseUrl } from '../../../Components/config/config';
const GenericTable = (props) => {
    const { groupData,
        headers = [],
        buttons = [],
        fields = [],
        memberFields = [],
     
        componentid,
        handleApprovalClick,
        handlePartialDenyClick,
        handleDenialClick,
        dropdownOptions,
        handleFilterClick,
        tableHeader,
        handleAddClick } = props;
        console.log('inside', groupData)
        
    const handleApproveClick = (index) => {
        handleApprovalClick(index);
    }
    const handlePrtDenyClick = (index) => {
        if(handlePartialDenyClick) handlePartialDenyClick(index);
    }
    const handleDenyClick = (index) => {
        handleDenialClick(index);
    }

    console.log('yeh hum suptable mei ha ', groupData);
    return (
        <>
            <div>
               {groupData ?( <div className="relative overflow-x-auto h-full shadow-md sm:rounded-lg block w-full p-6 bg-white border border-gray-200 rounded-2xl  ">
                    {/* This shouldn't be here */}
                    {(componentid === 1 || componentid === 5) && componentid !== null && groupData.length > 0 && (
                        <div className=' pb-5 text-indigo-900 uppercase font-semibold'>
                            {groupData[0].mainhead ? groupData[0].mainhead : groupData[0].Course}
                        </div>
                    )}
                    {(componentid === 3) && componentid !== null && (
                        <div className=' pb-5 text-indigo-900 uppercase font-semibold'>
                            {tableHeader}
                        </div>
                    )}
                    <div>
                        <table className="w-full text-sm  rtl:text-right text-gray-500 text-center">
                            <thead className="text-xs text-indigo-900 uppercase border-b   ">
                                {(componentid === 3 || componentid === 4) && (<tr>
                                    <th colSpan={headers.length + buttons.length} className="text-right px-6 py-3">
                                        <div className='flex justify-end'>
                                            <div className=" mt-2 mr-2">
                                                <FilterButton text={'Filter'} onClick={handleFilterClick} dropdownOptions={dropdownOptions} />
                                            </div>
                                        </div>
                                    </th>
                                </tr>)}
                                <tr className=' '>
                                    {headers.map((header, index) => (
                                        <th key={index} colSpan={header.colSpan ?? 1} className="px-6 py-3">{header.text}</th>
                                    ))}
                                    {buttons.map((button, index) => (
                                        <React.Fragment key={`button-${index}`}>
                                            {button.bheading && (
                                                <th className="px-6 py-3 text-center" colSpan={buttons.length === 1 && button.bheading ? button.bcolspan : 1}>
                                                    {button.bheading}
                                                </th>
                                            )}
                                        </React.Fragment>
                                    ))}

                                </tr>
                            </thead>
                            <tbody className=''>
                                {groupData.map((item, index) => (
                                    <tr key={index} className="bg-white">
                                        {fields.map((field, fieldIndex) => (
                                            <td key={fieldIndex} className="px-6 py-3">
                                                {field === 'file' && item[field] ? (
                                                    <a
                                                        href={`${baseUrl}/${item[field].replace(/\\/g, '/')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 underline hover:text-blue-800 font-medium"
                                                    >
                                                        View Report
                                                    </a>
                                                ) : field === 'members' ? (
                                                    item[field].map((member, memberIndex) => (
                                                        <div key={memberIndex}>
                                                            {memberFields.map((memberField, memberFieldIndex) => (
                                                                <span key={memberFieldIndex}>
                                                                    {member[memberField] != null && (memberField === 'RegistrationNo' ? ` (${member[memberField]}) ` : (memberField === 'role' ? ` (${member[memberField]}) ` : member[memberField]))}
                                                                    {memberFieldIndex !== memberFields.length - 1}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ))
                                                ) : (
                                                    item[field]
                                                )}
                                            </td>
                                        ))}
                                        {(componentid === 1 || componentid === 2) && componentid !== null && (
                                            <td colSpan={1} className="flex justify-center border-none">
                                                {item.status === 'pending' || item.status === 'submitted' || !item.status ? (
                                                    <div className='px-6 py-3 gap-3 flex items-center justify-between'>
                                                        <Simple text='Approve' onClick={() => handleApproveClick(item._id)} bgClass='bg-green-500' />
                                                        {componentid === 2 && (
                                                            <Simple text='Partial Deny' onClick={() => handlePrtDenyClick(item._id)} bgClass='bg-yellow-500' />
                                                        )}
                                                        <Simple text='Deny' onClick={() => handleDenyClick(item._id)} bgClass='bg-red-500' />
                                                    </div>
                                                ) : (
                                                    <div className={`px-6 py-3 font-bold uppercase ${item.status === 'approved' ? 'text-green-500' : item.status === 'partial-deny' ? 'text-yellow-500' : 'text-red-500'}`}>
                                                        {item.status === 'approved' ? 'Approved' : item.status === 'partial-deny' ? 'Partial Denied' : 'Denied'}
                                                    </div>
                                                )}
                                            </td>
                                        )}

                                        {buttons.map((button, buttonIndex) => (
                                            <td key={`button-${index}-${buttonIndex}`} className="px-6 py-3" colSpan={buttons.length === 1 && button.bheading ? button.bcolspan : 1}>
                                                <button type="button" onClick={() => button.click(item._id || item.fypTitle || item.panelcode || item.acid)} className='underline'>{button.text}</button>
                                            </td>
                                        ))}

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                    <label htmlFor="descbox"></label>
                    {componentid === 2 && (<textarea
                        id='description'
                        name='description'
                        className={`mt-1 p-2 border rounded-md w-[100%] h-24 border-slate-300 `}
                        placeholder='Add your Ideas Here'
                    />)}
                    {componentid === 8 && (
                        <div className='flex justify-end'>
                            <div className=" mt-2 mr-8">
                                <Simple text='Add' onClick={handleAddClick} /></div>
                        </div>
                    )}

                </div>): (    
                      <div className='relative overflow-x-auto max-h-96 shadow-md sm:rounded-lg   rtl:text-right  text-center  text-xs text-indigo-900 uppercase bg-gray-50 py-10 '>
                            No Data Found
                        </div>)}
            </div>

        </>
    )
}

export default GenericTable
