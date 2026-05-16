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
import ReportSubmissionComponent from './ReportSubmissionComponent'; // Import the new component
import axios from 'axios';
import LoadingSpinner from '../../Components/LoadingSpinner/LoadingSpinner';

const ProjectDetails = ({ data }) => {
  const navigate = useNavigate(); 
  const [ReportClick, setReportClick] = useState(false);
  const [DetailsViewClick, setDetailsViewClick] = useState(false);
  const [UploadReport, setUploadReport] = useState(true);
  const [isPart2Disabled, setIsPart2Disabled] = useState(false);
  const [createdExam, setCreatedExam] = useState('');
  const [showReportInstance, setShowReportInstance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [FetchedGroupReports, setFetchedGroupReports] = useState('');
  const [ReportDeadline, setReportDeadline] = useState('');
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [isReportRejected, setIsReportRejected] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
  }, []);

  useEffect(() => {
    initFlowbite();
    if (!localStorage.getItem('key')) {
      navigate('/login');
    }
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'ProjectDetails';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      if (selectedTab) { // Ensure selectedTab is not null
        const topOffset = selectedTab.offsetTop;
        indicator.style.top = `${topOffset}px`;
      }
    }
  }, []);

  useEffect(() => {
    const fypData = JSON.parse(localStorage.getItem("FypData"));
    if (fypData && fypData.partStatus !== "part-II") {
      setIsPart2Disabled(true);
    } else {
      setIsPart2Disabled(false);
    }
  }, [localStorage.getItem("FypData")]);

  useEffect(() => {
    fetchCreatedExamReport();
  }, [])
  useEffect(() => {
    CheckReportExist();
  }, [createdExam])
  useEffect(() => {
    fetchUploadedReports();
  }, [])

  // useEffect(() => {
  //   // Your logic here to compare ReportDeadline with the current date
  //   const currentDate = new Date(); // Current date

  //   if (ReportDeadline) {
  //     const ReportDeadlineDate = new Date(ReportDeadline); // Convert ReportDeadline to Date object
  //     console.log("First Checkign Report Deadline", ReportDeadlineDate);
  //     console.log("First Checking Current Date", currentDate);
  //     if (ReportDeadlineDate < currentDate) {
  //       console.log("Not running Report Deadline if statement");
  //       setShowReportInstance(false);
  //     }
  //   }
  // }, [ReportDeadline]);

  useEffect(() => {
    const currentDate = new Date();

    if (ReportDeadline) {
      const ReportDeadlineDate = new Date(ReportDeadline);

      currentDate.setHours(0, 0, 0, 0);
      ReportDeadlineDate.setHours(0, 0, 0, 0);

      if (ReportDeadlineDate < currentDate) {
        // Only hide the form if the report is NOT in rejected state
        if (!isReportRejected) {
          console.log("Deadline passed and not rejected — hiding form");
          setShowReportInstance(false);
        } else {
          console.log("Deadline passed but report rejected — keeping form open");
        }
      }
    }
  }, [ReportDeadline, isReportRejected]);


  console.log("Checking is Part 2 status enabled", isPart2Disabled);

  const handleOptSelect = (val) => {
    setDetailsViewClick(val);
  };

  console.log("CHecking Reporttttttt Deaddddddddddddlineeeeeeeee", ReportDeadline && ReportDeadline);

  const handleRepInstance = () => {
    console.log("Hanlde SUccess Responseeeeeeeeeeee Calleddddddddddddddddddddd");
    setShowReportInstance(false);
  };

  // const fetchAssignedPanelId = async () => {
  //   const key = JSON.parse(localStorage.getItem("key"));
  //   try {
      
  //     const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
  //     console.log("Request Sent");
  //     const response = await axios.get(`/api/ScheduleExamRoutes/scheduled/specific/${termId}?role=${user.role}`, config);
  //     if(response.status === 200) {

  //     }else{

  //     }
  //   } catch (error) {
  //     console.error('Error fetching Exam data:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const convertToDDMMYYYY = (isoDate) => {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
};

  const fetchCreatedExamReport = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const FYPData = JSON.parse(localStorage.getItem("FYPData"));
      console.log("Userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", FYPData);
      const panelId = FYPData.assignedPanel;
      console.log("PanelIddddddddddddddddddddddddddddd", panelId);
      console.log("Checking User Role", user.role);
      
      // Extract the term from user.term
      const termId = user.term;
      console.log("Checking Term", termId);
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
      console.log("Request Sent");
      const response = await axios.get(`/api/ScheduleExamRoutes/scheduled/specific/${panelId}?role=${user.role}`, config);
  
      if (response.status === 200) {
        console.log("Fetched Examsssssssssssssssssss", response.data.exams[0].CreatedExam);
        setCreatedExam(response.data.exams[0].CreatedExam);
        // setReportDeadline(response.data.exams[0].CreatedExam.AnnouncedDate)
        // console.log("Checking Announced Date", response.data.exams[0].CreatedExam.AnnouncedDate);
        // console.log("Checking Report Deadline", response.data.exams[0].CreatedExam.ReportDeadline);
        // console.log("CHecking Deeeeeeeeeeeeaaaaaaaaaaadlddddddddlineeeeeee", response.data.exams[0].ReportDeadline)
        // setReportDeadline(response.data.exams[0].CreatedExam.ReportDeadline)
        // const formattedReportDeadline = response.data.exams[0].CreatedExam.ReportDeadline.split('T')[0];
        const formattedReportDeadline = convertToDDMMYYYY(response.data.exams[0].CreatedExam.ReportDeadline.split('T')[0]); // Assuming ReportDeadline is an ISO date string

        console.log("formattedReportDeadline", formattedReportDeadline)
    setReportDeadline(formattedReportDeadline);

    const formattedAnnouncedDate = response.data.exams[0].CreatedExam.AnnouncedDate.split('T')[0];
    const currentDate = new Date().toLocaleDateString('en-GB');
console.log("Checking Current Date:", currentDate);
    

    console.log("Checking Announced Date", formattedAnnouncedDate);
    console.log("Checking Report Deadline Date", formattedReportDeadline);
    // console.log("Checking Current Date", currentDate);
    // const currentDate = new Date();
    // const currentDate = new Date();
// const localDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
// console.log("Checking Current Date", localDate);

// // If you need the date in DD/MM/YYYY format
// const [year, month, day] = localDate.split('-');
// const formattedDate = `${day}/${month}/${year}`;
// console.log("Checking Current Date (Formatted)", formattedDate);



// Split the ISO date and rearrange it to 'DD/MM/YYYY' format
const [year, month, day] = formattedAnnouncedDate.split('-');
const formattedDate = `${day}/${month}/${year}`;
console.log("Checking FormattedDate", formattedDate);
console.log("Again Checking current Date", currentDate);

console.log("Formatted Report Deadline Newly", formattedReportDeadline);

// Compare the dates
if ((formattedDate === currentDate || formattedDate < currentDate) && formattedReportDeadline >= currentDate) {
    console.log("Show Report Check Running");
    setShowReportInstance(true);
}
      } else {
        console.log('Error fetching Exam data');
      }
    } catch (error) {
      console.error('Error fetching Exam data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Reporrrrt Instance Showing ", showReportInstance);

  const CheckReportExist = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    try {
      setIsLoading(true);
      const fyp = JSON.parse(localStorage.getItem("FYPData"));
      if (!fyp || !createdExam || !createdExam.ExamType) return;
      const groupId = fyp._id;
      const examId = createdExam.ExamType._id;
      console.log("Checking Exam", examId);
      console.log("Checking Group ID", groupId);

      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };

      // Fetch full report to check its status (not just existence)
      const response = await axios.get(`/api/StudentReport/gettingGroupReports/${groupId}`, config);

      if (response.status === 200) {
        const reports = response.data.reports || [];
        const matchingReport = reports.find(r => r.Exam?._id === examId || r.Exam === examId);

        if (matchingReport) {
          if (matchingReport.status === 'rejected') {
            console.log("Report REJECTED — re-opening submission form");
            setRejectionFeedback(matchingReport.supervisorFeedback || 'Your report was denied. Please fix the issues and resubmit.');
            setIsReportRejected(true);
            setShowReportInstance(true);
          } else {
            console.log("Report exists with status:", matchingReport.status, "— hiding form");
            setRejectionFeedback('');
            setIsReportRejected(false);
            setShowReportInstance(false);
          }
        } else {
          console.log('No matching report for this exam — form stays visible if within deadline');
          setIsReportRejected(false);
        }
      }
    } catch (error) {
      console.error('Error fetching Reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUploadedReports = async () => {
    const key = JSON.parse(localStorage.getItem("key"));
    try {
      setIsLoading(true);
      const fyp = JSON.parse(localStorage.getItem("FYPData"));
      const groupId = fyp._id;
      
      // Extract the term from user.term
      // const termId = user.term;
      // console.log("Checking Term", termId);
      const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
      console.log("Request Sent");
      const response = await axios.get(`/api/StudentReport/gettingGroupReports/${groupId}`, config);
  
      if (response.status === 200) {
        console.log("Fetched Reportsssssssssssssss", response.data);
        setFetchedGroupReports(response.data.reports);
        // setShowReportInstance(false);
        
      } else {
        console.log('Error fetching Uploaded Reports');
      }
    } catch (error) {
      console.error('Error fetching Reports:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReportClick = (val) => {
    setReportClick(val);
    setShowReportInstance(true); // Set showReportInstance to true when the report icon is clicked
  };

  const handleGoBack = () => {
    setDetailsViewClick(false);
    setShowReportInstance(false); // Reset showReportInstance to false when going back
  };

  
  console.log("Check Click Report icon", ReportClick);

  return (
    <>
    {isLoading ? (
      <LoadingSpinner />
    ) : (
    <div className='mx-16'>
      {DetailsViewClick ? (
        <Tabs aria-label="Tabs with underline" style="underline" className='flex justify-around border-b-4 border-gray-300 '>
          <Tabs.Item active title="Part-1" className='border-b-2 border-white w-full px-2 hover:border-gray-200 '>
            <div className="partOneDetails flex flex-col gap-3">
              <ProjectInfo accordionId={71} data={Data.projectInfoData} />
              <Group_details accordionId={1} data={Data.testData} />
              <Panel_details accordionId={3} data={Data.panelData} />
              <OrientationEvaluation accordionId={4} data={Data.OrientationEvaluationData} />
              <ProposalEvaluation accordionId={5} data={Data.proposalEvaluationData} remarksData={Data.proposalRemarksData} />
              <TaskIEvaluation accordionId={6} data={Data.TaskIData} />
              <MidEvaluation accordionId={7} data={Data.midEvaluationData} remarksData={Data.proposalRemarksData} accordText="Mid I Evaluation" perc="(20)" />
              <FinalEvaluation accordionId={8} data={Data.finalEvaluationData} remarksData={Data.proposalRemarksData} accordText="Final I Evaluation" />
              <OverallEvaluationI accordionId={9} data={Data.overallEvaluationDataP1} />
              <div className='flex flex-row justify-end mr-5 mt-5'>
                <ButbgPrimary text="Back" onClick={handleGoBack} />
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Part-2" className='border-b-2 border-transparent' disabled={!isPart2Disabled}>
            <div className="partTwoDetails flex flex-col gap-3">
              <MidEvaluation accordionId={11} data={Data.midIIEvaluationData} remarksData={Data.proposalRemarksData} accordText="Mid II Evaluation" perc="(30)" />
              <FinalEvaluation accordionId={12} data={Data.finalEvaluationData} remarksData={Data.proposalRemarksData} accordText="Final II Evaluation" />
              <OverallEvaluationII accordionId={13} data={Data.overallEvaluationDataP2} />
              <div className='flex flex-row justify-end mr-5 mt-5'>
                <ButbgPrimary text="Back" onClick={handleGoBack} />
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Over All" className='border-b-2 border-transparent' disabled={!isPart2Disabled}>
            <div className="OverallEvaluationDetails flex flex-col gap-3">
              <OverAll accordionId={14} data={Data.OverAllData} />
            </div>
            <div className='flex flex-row justify-end mr-5 mt-5'>
              <ButbgPrimary text="Back" onClick={handleGoBack} />
            </div>
          </Tabs.Item>
        </Tabs>
      ) : showReportInstance ? (
        <ReportSubmissionComponent accordionId={202} onGoBack={handleGoBack} createdExam={createdExam} ReportInst={handleRepInstance} rejectionFeedback={rejectionFeedback} />
      ) : (
        <StudentProjectDetails accordionId={15} data={Data.StudentProjectDetailsData} onOptSelect={handleOptSelect} onReportSelect={handleReportClick} FetchedGroupReports={FetchedGroupReports}/>
      )}
    </div>
    )}
    </>
  );
};

export default ProjectDetails;
