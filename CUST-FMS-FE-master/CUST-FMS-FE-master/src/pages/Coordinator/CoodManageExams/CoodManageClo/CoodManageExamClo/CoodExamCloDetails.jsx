import React from 'react'
import AccordionGenericTable from '../../../../../TESTING/AccordionTableGeneric';

const CoodExamCloDetails = (props) => {

    const { data, handleAddClotoExamClo, handelViewDetailsofExamClo,handleDelCLO, accordionId } = props;

    console.log(data, "dataaaaaaaaaaaaaaaaaaaaa")
    let newData;
    if (data) {
        newData = data.map((fields, index) => ({
            ...fields,
            index: index + 1,
        }))
    }

    return (
        <div>

            <AccordionGenericTable
                groupData={newData}

                accordionId={accordionId}
                tabheading={"Exam CLO"}

                headers={['Sr no.', 'Program', 'ShortCode']}

                buttons={[
                    {
                        bheading: 'Action',
                        text: 'Assign CLO',
                        click: handleAddClotoExamClo

                    },
                    {
                        text: 'Delete',
                        bheading: 'CLO',
                        click: handleDelCLO

                    },
                    {
                        text: 'View',
                        bheading: 'Details',
                        click: handelViewDetailsofExamClo

                    }
                ]}

                fields={['index', 'Program', 'shortCode']}

            />

        </div>
    )
}

export default CoodExamCloDetails
