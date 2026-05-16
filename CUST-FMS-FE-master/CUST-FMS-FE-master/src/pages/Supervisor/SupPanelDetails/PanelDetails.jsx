import React from 'react';
import AccordionGenericTable from '../../../TESTING/AccordionTableGeneric';
const PanelDetails = (props) => {
  const { groupData, accordionId, handleViewClick } = props;

  console.log('Daim', groupData)
  let num = 1;
  const updateddata = groupData.panels.map(panel => ({
    panelcode: panel.panelCode,
    index: num++,
    _id: panel._id,
    term: panel.term?.sessionTerm || 'N/A',
    PanelMembers: (panel.PanelMembers || []).map(member => ({
      name: member?.member?.name || 'Unknown',
      role: member?.role || 'N/A',
    }))
  }));


  console.log(updateddata);

  return (
    <div>

      {updateddata && (<div>
        <AccordionGenericTable groupData={updateddata}
          tabheading={'Panel Details'}
          accordionId={accordionId}
          headers={['Serial no', 'Panel Code', 'Panel Members', 'Term']}
          buttons={[{ bheading: 'Details', text: 'View', click: handleViewClick }]}
          fields={['index', 'panelcode', 'PanelMembers', 'term']}
          memberFields={['name', 'role']}
        />
      </div>)}
    </div>
  )
}

export default PanelDetails
