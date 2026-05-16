import React from 'react';
import AccordionGenericTable from '../../../TESTING/AccordionTableGeneric';
import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary';


const SupUpdatedProject = (props) => {
  const { accordionId, groupData, handleSimpleClick, handleGoBack } = props;
  console.log('yeh humara khali group data hai', groupData);
  return (
    <>
      <div>
        <AccordionGenericTable groupData={groupData} headers={[
          'FYP Title',
          'Term',
          'Category',
          'Platform',
          'Technology',
          'Supervisor',
        ]} accordionId={accordionId}
          tabheading={'Change Requests'}
          fields={['fypTitle', 'term', 'category', 'platform', 'technology', 'supervisor']}
          componentid={5}
          simplebuttontext={'Update'}
          handleSimpleClick={handleSimpleClick}

        />
      </div>
      <div className='flex flex-row justify-end  mt-5'>
        <ButbgPrimary text="Back" onClick={handleGoBack} />
      </div>
    </>
  )
}

export default SupUpdatedProject
