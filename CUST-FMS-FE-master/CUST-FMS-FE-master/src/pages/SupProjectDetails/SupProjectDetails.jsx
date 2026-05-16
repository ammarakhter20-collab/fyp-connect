import React, { useEffect, useState } from 'react';
import { Tabs } from 'flowbite-react';
import { initFlowbite } from 'flowbite';
import GroupDetails from "./PartOneDetails/Supgroup_details";
import AttendenceTable from './Stdattendence';
import PanelDetails from './PartOneDetails/SupPanel_Details';
import Evaluation from './Stdevaluation';
// import * as Data from '../SupAttendance/SupAttendanceData';
import * as Data from '../StdProjectDetails/StdProjData/Stddata';
import { useNavigate } from 'react-router-dom';

const ProjectDetails = () => {
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState('SupProjectDetails'); // Set the default active tab
  const [isPanelDetailsOpen, setIsPanelDetailsOpen] = useState(false);

  useEffect(() => {
    initFlowbite();

    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');

    if (tabParam === 'panel_details') {
      setActiveTab('panel_details');
      setIsPanelDetailsOpen(true);
    }
  }, []);

  useEffect(() => {
    // Redirect to the project details when Panel_details is open
    if (isPanelDetailsOpen) {
      navigate('/SupProjectDetails?tab=panel_details');
    }
  }, [isPanelDetailsOpen, navigate]);
  return (
    <div className=' mx-16'>
   <Tabs aria-label="Tabs with underline" style="underline" className='flex justify-around  '>
  <Tabs.Item active title="Part-1" className='border-b-2 border-transparent w-full px-2 '>
    <div className="partOneDetails flex flex-col gap-3">
  <GroupDetails accordionId={1} data={Data.testData} />
        <AttendenceTable accordText={"Attendance"} accordionId={2} data={Data.AttendenceData}/>
        <PanelDetails accordionId={3} data={Data.panelData} isOpen={isPanelDetailsOpen} />
        <Evaluation title =  "Orientation Evaluation" accordionId={4} evaluationData={Data.OrientationEvaluationData} remarksData={Data.sampleRemarksData} />
        <Evaluation title =  "Proposal Evaluation" accordionId={5} evaluationData={Data.proposalEvaluationData} remarksData={Data.proposalRemarksData} />
        <Evaluation title =  "Mid-term Evaluation" accordionId={6} evaluationData={Data.midEvaluationData} remarksData={Data.midRemarksData} />
        <Evaluation title =  "Final-term Evaluation" accordionId={7} evaluationData={Data.finalEvaluationData} remarksData={Data.finalRemarksData} />
        <Evaluation title =  "Overall Evaluation Part-1" accordionId={8} evaluationData={Data.overallEvaluationDataP1} remarksData={null} />
        </div>
  </Tabs.Item>
  <Tabs.Item title="Part-2" className='border-b-2 border-transparent'>
    <div className="partTwoDetails flex flex-col gap-3">
        <AttendenceTable accordText={"Attendance"} accordionId={9} data={Data.AttendenceData}/>
        <Evaluation title =  "Mid-term Evaluation" accordionId={10} evaluationData={Data.midEvaluationData} remarksData={Data.midRemarksData} />
        <Evaluation title =  "Final-term Evaluation" accordionId={11} evaluationData={Data.finalEvaluationData} remarksData={Data.finalRemarksData} />
        <Evaluation title =  "Overall Evaluation Part-2" accordionId={12} evaluationData={Data.overallEvaluationDataP2} remarksData={null} />
        </div>
  </Tabs.Item>
  <Tabs.Item  title="Overall" className='border-b-2 border-transparent'>
    {/* Content for Overall */}

  </Tabs.Item>
</Tabs>
</div>

  );
}
export default ProjectDetails;
