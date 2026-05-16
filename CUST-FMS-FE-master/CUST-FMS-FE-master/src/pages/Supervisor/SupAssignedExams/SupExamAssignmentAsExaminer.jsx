import React, { useState, useEffect } from 'react';
import GenAccor from '../../../Components/Accordians/GenAccor';
import AccordionGenericTable from '../../../TESTING/AccordionTableGeneric';
import { baseUrl } from '../../../Components/config/config';

const ExamAssignmentAsExaminer = ({ accordionId, groupData, onReportClick, onDetailsClick, onMarksClick, settingExamWeightage }) => {
  const [updatedData, setUpdatedData] = useState([]);
  const [examWeightage, setExamWeightage] = useState(null);
  const [examData, setExamData] = useState(null);
  const [newGroupData, SetNewGroupData] = useState(null);


  const fetchCreatedExam1Details = async (termId) => {
    try {
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      let role = parsedUserData.role;
      // Note: We do NOT override role to "Supervisor" here because this is the EXAMINER view.
      // Keeping it as "faculty", "Coordinator", etc. ensures the backend only returns exams 
      // marked for "All" (or for their specific role if applicable).

      console.log(role, "Roleeeeee");
      console.log("Checking Term", termId);

      const response = await fetch(`${baseUrl}/api/ExamCreationRoutes/getParticularExam?role=${role}&termId=${termId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Data');
      }

      const data = await response.json();
      console.log("Fetched Createdexams:", data);
      setExamData(data)

      if ((!data.exams || !Array.isArray(data.exams)) || (data.schedule && (!data.schedule || !Array.isArray(data.schedule)))) {
        // Return without error to allow continuation
        return [];
      }


      const ExamsData = data.exams.map(exm => {
        let DateStr;
        if (data.schedule && data.schedule.length > 0) {
          DateStr = convertToNormalDateFormat(data.schedule[0].ExamDate);
        }
        else {
          DateStr = "N/A"
        }
        const examType = exm.ExamType.examName
        const examWeightage = exm?.ExamWeightage || null;

        setExamWeightage(examWeightage)
        return {
          examType: examType,
          examDate: DateStr
        }
      })

      return ExamsData;
    } catch (error) {
      console.error('Error fetching Data:', error.message);
      return [];
    } finally {
    }
  };


  const fetchEvalStat = async () => {
    try {
      // setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData._id;
      console.log(groupData, "Data from exam");

      // Check if examData exists and has exams
      if (!examData || !examData.exams || examData.exams.length === 0) {
        console.warn("No exam data available for stats.");
        SetNewGroupData(updatedData); // Fallback to basic data
        return;
      }

      const examId = examData.exams[0]._id;
      let response = '';

      // Array to store the evaluation data for each group
      const groupEval = [];

      // Iterate over each group and fetch the evaluation data
      for (const group of updatedData) {
        console.log(group);

        response = await fetch(`${baseUrl}/api/manageexampanels/getEvaluationStatofexminer/${group.termId}/${examId}?groupId=${group._id}&examinerId=${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch evaluation stats for group", group._id);
          groupEval.push(group);
          continue;
        }

        const data = await response.json();

        // Create a new object with the group data and the fetched evaluation data
        const groupWithEval = {
          ...group,
          evaluationData: data,
        };

        // Push the structured group data into the groupEval array
        groupEval.push(groupWithEval);
        console.log("Exam Eval data", data);
      }

      SetNewGroupData(groupEval);

      // Use the structured groupEval array as needed
      console.log("Structured Group Eval Data", groupEval);

    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      // setLoadingSpinner(false); // Uncomment if you are using a loading spinner
    }
  };

  useEffect(() => {
    if (groupData && examData) {
      console.log("groupData changed or component mounted", groupData);
      fetchEvalStat(groupData);
    } else if (groupData && updatedData && updatedData.length > 0) {
      // Fallback: If examData is not available, use updatedData directly
      console.log("No examData, falling back to updatedData", updatedData);
      SetNewGroupData(updatedData);
    }
  }, [groupData, examData, updatedData]);




  const convertToNormalDateFormat = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };



  const fetchAllExamDetails = async (groups) => {
    try {
      if (!groups) return;
      // Map over the groups and fetch exam details for each termId
      const updatedDataPromises = groups.map(async (group) => {
        // Fetch created exam details for the given termId
        const CreatedExam = await fetchCreatedExam1Details(group.termId);
        console.log(CreatedExam, "createdexamdata fetched by group termId");

        return {
          ...group,
          examType: CreatedExam && CreatedExam.length > 0 ? CreatedExam[0].examType : "No Exam", // Fix the property name
          examDate: CreatedExam && CreatedExam.length > 0 ? CreatedExam[0].examDate : "N/A" // Fix the property name
        };
      });

      // Wait for all promises to resolve
      const updatedData = await Promise.all(updatedDataPromises);
      // Filter out rows where no exam is assigned for this role
      const filteredData = updatedData.filter(item => item.examType !== "No Exam");
      setUpdatedData(filteredData);
    } catch (error) {
      console.error('Error fetching all exam details:', error.message);
    }
  };

  const MarksClick = (id) => {
    settingExamWeightage(examWeightage, examData);
    onMarksClick(id);
  }
  useEffect(() => {
    if (groupData && groupData.length > 0) {
      fetchAllExamDetails(groupData);
    }
  }, [groupData]);
  return (
    <>
      <div className=''>
        <AccordionGenericTable
          groupData={newGroupData}
          headers={[
            'Serial no',
            'FYP Title',
            'Program',
            'Supervisor',
            'Exam Type',
            'Exam Date',
            'Term',
            'Status',
          ]}
          accordionId={accordionId}
          buttons={[
            {
              bheading: 'Report',
              text: 'Report',
              click: onReportClick,
            },
            {
              bheading: 'Marks',
              text: 'Add',
              click: MarksClick,
            },
            {
              bheading: 'Details',
              text: 'View',
              click: onDetailsClick,
            },
          ]}
          tabheading={'As Examiner'}
          fields={['groupNo', 'fypTitle', 'Program', 'supervisor', 'examType', 'examDate', 'term', 'status']}
        />
      </div>
    </>
  );
};
export default ExamAssignmentAsExaminer;
