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


  );
};

export default YourComponent;
