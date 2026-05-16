import React, { useEffect, useState } from 'react';
import { Tabs } from 'flowbite-react';
import { initFlowbite } from 'flowbite';
import Group_details from "./PartOneDetails/Stdgroup_details";
import Attendence_table from './Stdattendence';
import Panel_details from './PartOneDetails/Stdpanel_details';
import Evaluation from './Stdevaluation';
import * as Data from './StdProjData/Stddata';
import { useNavigate } from 'react-router-dom';
import ProjectInfo from './StdProjectInfo';
import OrientationEvaluation from './PartOneDetails/StdOrientationEvaluation';
import ProposalEvaluation from './PartOneDetails/StdProposalEvaluation';
import TaskIEvaluation from './PartOneDetails/StdTaskIEvaluation';
import MidEvaluation from './StdMidEvaluation';
import FinalEvaluation from './StdFinalEvaluation';
import OverallEvaluationI from './StdOverallEvaluationI';
import OverallEvaluationII from './StdOverallEvaluationII';
import OverAll from './StdOverAll';
import StudentProjectDetails from './StdStudentProjectDetails';
import ButbgPrimary from '../../Components/Buttons/ButbgPrimary';

const ProjectDetails = ({ data }) => {
  const navigate = useNavigate(); 
  const [ReportClick, setReportClick] = useState(false);
  const [DetailsViewClick, setDetailsViewClick] = useState(false);
  const [UploadReport, setUploadReport] = useState(true);
  // const [activeTab, setActiveTab] = useState('ProjectDetails'); // Set the default active tab
  // const [isPanelDetailsOpen, setIsPanelDetailsOpen] = useState(false);

  useEffect(() => {
   
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');

  }, []);



  useEffect(() => {
    initFlowbite();
    if(!localStorage.getItem('key')){
      navigate('/login');
    }
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'ProjectDetails';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  const handleOptSelect = (val) => {
    setDetailsViewClick(val);
  }

  const handleReportClick = (val) => {
    setReportClick(val);
  }

  
  
  const handleGoBack = () => {
    setDetailsViewClick(false);
  }

  console.log("Check Click Report icon", ReportClick);

  return (
    <div className=' mx-16'>



      
     
      {DetailsViewClick ? (
 <Tabs aria-label="Tabs with underline" style="underline" className='flex justify-around border-b-4 border-gray-300 '>
 <Tabs.Item active title="Part-1" className='border-b-2 border-white w-full px-2 hover:border-gray-200 '>
   <div className="partOneDetails flex flex-col gap-3">
 <ProjectInfo accordionId={71} data={Data.projectInfoData} />
 <Group_details accordionId={1} data={Data.testData} />
       <Attendence_table accordionId={2} data={Data.AttendenceData} accordText = "Attendance I Details"/>
       <Panel_details accordionId={3} data={Data.panelData} />
       <OrientationEvaluation accordionId={4} data={Data.OrientationEvaluationData} />
       <ProposalEvaluation accordionId={5} data={Data.proposalEvaluationData} remarksData={Data.proposalRemarksData} />
       <TaskIEvaluation accordionId={6} data={Data.TaskIData} />
       <MidEvaluation accordionId={7} data={Data.midEvaluationData} remarksData={Data.proposalRemarksData} accordText = "Mid I Evaluation" perc = "(20)"/>
       <FinalEvaluation accordionId={8} data={Data.finalEvaluationData} remarksData={Data.proposalRemarksData} accordText = "Final I Evaluation"/>
       <OverallEvaluationI accordionId={9} data={Data.overallEvaluationDataP1} />
       <div className='flex flex-row justify-end mr-5 mt-5'>

<ButbgPrimary text="Back" onClick={handleGoBack}/>
</div>
       {/* <Evaluation title =  "Orientation Evaluation" accordionId={4} evaluationData={Data.OrientationEvaluationData} /> */}
       {/* <Evaluation title =  "Proposal Evaluation" accordionId={5} evaluationData={Data.proposalEvaluationData} remarksData={Data.proposalRemarksData} /> */}
       {/* <Evaluation title =  "Mid-term Evaluation" accordionId={6} evaluationData={Data.midEvaluationData} remarksData={Data.midRemarksData} />
       <Evaluation title =  "Final-term Evaluation" accordionId={7} evaluationData={Data.finalEvaluationData} remarksData={Data.finalRemarksData} />
       <Evaluation title =  "Overall Evaluation Part-1" accordionId={8} evaluationData={Data.overallEvaluationDataP1} remarksData={null} /> */}
       </div>
 </Tabs.Item>
 <Tabs.Item title="Part-2" className='border-b-2 border-transparent'>
   <div className="partTwoDetails flex flex-col gap-3">
       <Attendence_table accordionId={10} data={Data.AttendenceData} accordText = "Attendance II Details"/>
       <MidEvaluation accordionId={11} data={Data.midIIEvaluationData} remarksData={Data.proposalRemarksData} accordText = "Mid II Evaluation" perc = "(30)"/>
       <FinalEvaluation accordionId={12} data={Data.finalEvaluationData} remarksData={Data.proposalRemarksData} accordText = "Final II Evaluation"/>
       <OverallEvaluationII accordionId={13} data={Data.overallEvaluationDataP2}  />
       <div className='flex flex-row justify-end mr-5 mt-5'>

<ButbgPrimary text="Back" onClick={handleGoBack}/>
</div>
       {/* <Evaluation title =  "Mid-term Evaluation" accordionId={11} evaluationData={Data.midEvaluationData} remarksData={Data.midRemarksData} /> */}
       {/* <Evaluation title =  "Final-term Evaluation" accordionId={12} evaluationData={Data.finalEvaluationData} remarksData={Data.finalRemarksData} /> */}
       {/* <Evaluation title =  "Overall Evaluation Part-2" accordionId={13} evaluationData={Data.overallEvaluationDataP2} remarksData={null} /> */}
       </div>
 </Tabs.Item>

 <Tabs.Item title="Over All" className='border-b-2 border-transparent'>
   <div className="OverallEvaluationDetails flex flex-col gap-3">
       <OverAll accordionId={14} data={Data.OverAllData}  />
       </div>
       <div className='flex flex-row justify-end mr-5 mt-5'>

<ButbgPrimary text="Back" onClick={handleGoBack}/>
</div>
 </Tabs.Item>
 
      </Tabs> 
      ):(
        //  UploadReport ? (
        //   <p>This is Upload Report pop up</p>
        //  ):(

           <StudentProjectDetails accordionId={15} data={Data.StudentProjectDetailsData} onOptSelect = {handleOptSelect} onReportSelect= {handleReportClick}/>
      // )
        )}
      
  



  {/* <Tabs.Item disabled title="Overall" className='border-b-2 border-transparent'>
    
  </Tabs.Item> */}
</div>

  );
}
export default ProjectDetails;
