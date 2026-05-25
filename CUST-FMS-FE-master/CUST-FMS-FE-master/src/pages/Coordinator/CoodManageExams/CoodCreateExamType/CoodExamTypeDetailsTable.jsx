import React from 'react'
import AccordionGenericTable from '../../../../TESTING/AccordionTableGeneric'
import { click } from '@testing-library/user-event/dist/click';

const CoodExamTypeDetailsTable = (props) => {

const {data, handleEditClick, handleDeleteClick, accordionId} = props;

console.log(data, "data")
let newData;
if(data){ newData = data.map((fields, index) => ({
    ...fields,
    index: index+1, 
    examTypeFor: fields.examTypeFor === 'All' ? 'Panel Members' : fields.examTypeFor
}) )}

  return (
    <div>

        <AccordionGenericTable 
         groupData = {newData}

         accordionId={accordionId}
         tabheading={"Exam Type"} 

         headers = {['Sr no.', 'Exam Name', 'ShortCode', 'Exam For', 'Action']}

         buttons = {[
            // {text: 'Edit',
            // click: handleEditClick

            // },
            {text: 'Delete',
            click: handleDeleteClick

            }
         ]}

         fields = {['index', 'examName', 'shortCode', 'examTypeFor']}
        
        />
        
    </div>
  )
}

export default CoodExamTypeDetailsTable
