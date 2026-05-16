import React, { useState, useEffect } from 'react';
import AccordionGenericTable from '../../../TESTING/AccordionTableGeneric';
import FilterButton from '../../../Components/Buttons/FilterButton';

const CoodPanelDetails = (props) => {
    const { addFacultyClick, accordionId, panelData, editPanelDetailsClick, deletePanelDetailsClick, viewPanelDetailsClick, assignRoleClick, terms } = props;

    console.log("Checking termsssssss", terms);
    console.log(panelData, "panelData");

    const [filteredData, setFilteredData] = useState([]);

    const updatedData = panelData ? panelData.map((data, index) => ({
        ...data,
        index: index + 1,
    })) : [];

    useEffect(() => {
        if (panelData) {
            const initialData = panelData.map((data, index) => ({
                ...data,
                index: index + 1,
            }));
            setFilteredData(initialData);
        }
    }, [panelData]);

    const handleFilterClick = (option) => {
        if (option.value === 'All') {
            // Show all panels when "All" is selected
            setFilteredData(panelData);
        } else {
            // Filter panels based on the selected term
            const filteredData = updatedData.filter(panel => panel.term === option.label);
            setFilteredData(filteredData);
        }
    };

    // Add "All" option to the terms dropdown
    const dropdownOptionsWithAll = [...terms];

    return (
        <div>
            <div className="flex justify-end my-3">
                <FilterButton dropdownOptions={dropdownOptionsWithAll} text="Filter" onClick={handleFilterClick} />
            </div>
            <div className='bg-slate-100 w-full h-full'>
                <AccordionGenericTable
                    groupData={filteredData}
                    accordionId={accordionId}
                    tabheading="Panel Details"
                    headers={[
                        "Sr. no",
                        "Panel Code",
                        "Panel Members",
                        "Term",
                    ]}
                    buttons={[
                        {
                            bheading: "Add Faculty",
                            text: "Add",
                            click: addFacultyClick,
                        },
                        // {
                        //     bheading: "Edit Details",
                        //     text: "Edit",
                        //     click: editPanelDetailsClick,
                        // },
                        {
                            bheading: "Delete Panel",
                            text: "Delete",
                            click: deletePanelDetailsClick,
                        },
                        {
                            bheading: "Details",
                            text: "View",
                            click: viewPanelDetailsClick,
                        },
                        {
                            bheading: "Role",
                            text: "Assign Role",
                            click: assignRoleClick,
                        },
                    ]}
                    fields={['index', 'panelCode', 'PanelMembers', 'term']}
                    memberFields={['member', 'role']}
                />
            </div>
        </div>
    );
};

export default CoodPanelDetails;
