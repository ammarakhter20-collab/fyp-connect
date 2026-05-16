import React from 'react';
import GenAccor from '../Components/Accordians/GenAccor';
import Filter from '../Components/Buttons/FilterButton';
import { useState, useEffect } from "react";
import { initFlowbite } from 'flowbite';
import Simple from '../Components/Buttons/Simple';


const AccordionGenericTable = (props) => {
    const { groupData,
        headers = [],
        accordionId,
        buttons = [],
        tabheading,
        fields = [],
        memberFields = [],
        componentid,
        handleFilterClick,
        dropdownOptions,
        handleSimpleClick,
        simplebuttontext } = props;
    //DON'T neeed any func here
    const handleClick01 = (groupNo) => {
        // Your existing code for handleClick01
    };

    const handleClick02 = (groupNo) => {
        // Your existing code for handleClick02
    };

    useEffect(() => {
        initFlowbite();

    }, []);
    useEffect(() => {
        

    }, []);




    console.log('this is the structure of data being passed', groupData);
    return (
        <>
            <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
                <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                    <GenAccor text={tabheading} accordionId={accordionId} />
                </h2>
                {groupData ? (<div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                    <div className="overflow-x-auto max-h-96 shadow-md sm:rounded-lg">
                        <table className="w-full text-sm  rtl:text-right  text-center bg-white">
                            <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                                {componentid === 1 && (<tr>
                                    <th colSpan={headers.length + buttons.length} className="text-right px-6 py-3">
                                        <div className='flex justify-end'>
                                            <div className=" mt-2 mr-2">
                                                <Filter text={'Filter'} onClick={handleFilterClick} dropdownOptions={dropdownOptions} />
                                            </div>
                                        </div>
                                    </th>
                                </tr>)}
                                {(<tr className=' '>
                                    {headers.map((header, index) => (
                                        <th key={index} className="px-6 py-3">{header}</th>
                                    ))}

                                    {buttons.map((button, index) => (
                                        <React.Fragment key={`button-${index}`}>
                                            {button.bheading && (
                                                <th key={`button-${index}`} className="px-6 py-3">{button.bheading}</th>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tr>)}
                            </thead>
                            <tbody className='text-indigo-950'>
                                {groupData && groupData.map((item, index) => (
                                    <tr key={index} className="bg-white border-b  hover:bg-gray-50 ">
                                        {fields.map((field, fieldIndex) => (
                                            <td key={fieldIndex} className="px-6 py-3">
                                                {(field === 'members' || field === 'PanelMembers') ? (
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
                                        {buttons.map((button, buttonIndex) => (
                                            <td key={`button-${index}-${buttonIndex}`} className="px-6 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        button.click(item._id || item.fypTitle || item.panelcode);
                                                    }}
                                                    className='underline'
                                                >
                                                    {button.text === "Add" && item.evaluationData?.evaluationStatus === "completed"
                                                        ? "View/Edit"
                                                        : button.text}
                                                </button>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                {componentid === 5 && (<tr>
                                    <th colSpan={headers.length + buttons.length} className="text-right px-6 py-3">
                                        <div className='flex justify-end'>
                                            <div className=" mt-2 mr-2">
                                                <Simple text={simplebuttontext} onClick={handleSimpleClick} />
                                            </div>
                                        </div>
                                    </th>
                                </tr>)}
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
        </>
    );
};

export default AccordionGenericTable;
