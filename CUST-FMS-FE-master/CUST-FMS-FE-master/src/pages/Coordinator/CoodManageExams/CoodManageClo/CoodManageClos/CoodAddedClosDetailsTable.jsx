import React from 'react'
import AccordionGenericTable from '../../../../../TESTING/AccordionTableGeneric'
import { click } from '@testing-library/user-event/dist/click';
const CoodAddedClosDetailsTable = (props) => {

    const { data, handleAssignQuestionClick, handleViewDetailsClick,handleDeleteCLO, accordionId } = props;

    console.log(data, "dataaaaaaaaaaaaa")
    let newData;
    if (data) {
        newData = data.map((fields, index) => ({
            ...fields,
            Program: fields?.Program?.programTitle,
            index: index + 1,
        }))
    }

    

    return (
        <div>

            <AccordionGenericTable
                groupData={newData}

                accordionId={accordionId}
                tabheading={"CLO's"}

                headers={['Sr no.', 'Title', 'clo', 'Program']}

                buttons={[
                    {
                        bheading: 'Action',
                        text: 'Assign Question',
                        click: handleAssignQuestionClick

                    },
                    {
                        bheading: 'Del CLO',
                        text: 'Delete',
                        click: handleDeleteCLO

                    },
                    {
                        bheading: 'Details',
                        text: 'View',
                        click: handleViewDetailsClick
                    }
                ]}

                fields={['index', 'Title', 'CLOCode', 'Program']}

            />

        </div>
    )
}

export default CoodAddedClosDetailsTable
