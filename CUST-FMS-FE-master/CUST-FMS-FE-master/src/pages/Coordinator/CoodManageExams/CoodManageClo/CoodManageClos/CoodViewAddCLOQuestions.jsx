import React from 'react'
import { Link } from 'react-router-dom'
import AccordionGenericTable from '../../../../../TESTING/AccordionTableGeneric'

const CoodViewAddCLOQuestions = (props) => {
    const { data, selectedCLO, handleDetailsClick, handleDeleteClick } = props
    console.log(data, "CLODATA")
    return (
        <div className="pt-0 pb-0  border border-b-0 border-gray-200 ">
            <AccordionGenericTable
                groupData={data}

                accordionId={3}
                tabheading={`${selectedCLO}`}

                headers={['Sr no.', 'Short Code',]}

                buttons={[

                    {
                        bheading: 'Details',
                        text: 'View',
                        click: handleDetailsClick

                    },
                    {
                        bheading: 'Action',
                        text: 'Delete',
                        click: handleDeleteClick

                    }
                ]}

                fields={['index', 'shortCode',]}

            />
        </div>
    )
}

export default CoodViewAddCLOQuestions
