import { Accordion } from 'flowbite-react';
import EvaluationTable from './Stdtables/Stdevaluation_table';
import GenAccor from '../../Components/Accordians/GenAccor';

const YourComponent = ({ title, evaluationData, remarksData, accordionId }) => {
  return (
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
      <GenAccor text= {title} accordionId = {accordionId}/>
    </h2>
           <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
           <EvaluationTable evaluationData={evaluationData} remarksData={remarksData} />
         </div>
         </div>


    // <Accordion collapseAll>
    //   {/* Evaluation Marks */}
    //   <Accordion.Panel>
    //     <Accordion.Title className='bg-purple-900 text-white hover:bg-0'>{title}</Accordion.Title>
    //     <Accordion.Content>
          
    //     </Accordion.Content>
    //   </Accordion.Panel>
    // </Accordion>
  );
};

export default YourComponent;
