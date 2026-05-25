import React, { useState, useEffect } from 'react';
import TestTable from '../../../TESTING/AccordionTableGeneric'
import { baseUrl } from '../../../Components/config/config';

const ExamAssignmentAsSupervisor = ({ accordionId, groupData, onReportClick, onMarksClick, onDetailsClick, settingExamWeightage }) => {
  const [updatedData, setUpdatedData] = useState([]);
  const [examWeightage, setExamWeightage] = useState(null);
  const [examData, setExamData] = useState(null);
  const [newGroupData, SetNewGroupData] = useState(null);

  /* 
   * FIX: Modified to just return data, avoiding side-effects (state updates) 
   * within a loop or helper.
   */
  const convertToNormalDateFormat = React.useCallback((isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }, []);

  const fetchCreatedExam1Details = React.useCallback(async (termId, programId) => {
    try {
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      let role = parsedUserData.role;
      if (role === "faculty") {
        role = "Supervisor"
      }

      console.log(role, "Roleeeeee");
      console.log("Checking Term", termId);

      const response = await fetch(`${baseUrl}/api/ExamCreationRoutes/getParticularExam?role=${role}&termId=${termId}&programId=${programId || ''}`, {
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
      console.log("Fetched Createdexams for term", termId, ":", data);

      // Removed setExamData(data) to prevent overwriting in loop

      if ((!data.exams || !Array.isArray(data.exams)) || (data.schedule && (!data.schedule || !Array.isArray(data.schedule)))) {
        // Return empty structure rather than throwing hard error to allow other items to process
        console.warn('Unexpected data structure for term', termId);
        return [];
      }

      const ExamsData = data.exams.map(exm => {
        const examTypeName = exm.ExamType?.examName || '';
        const isAttendance = examTypeName.toLowerCase().includes('attendance');

        let DateStr = "N/A";
        let scheduledDateTime = null;

        if (data.schedule && data.schedule.length > 0) {
          DateStr = convertToNormalDateFormat(data.schedule[0].ExamDate);

          // Parse scheduled date + time into a single Date object
          const rawDate = new Date(data.schedule[0].ExamDate);
          const rawTime = data.schedule[0].ExamTime || ''; // e.g. "10:30 AM"
          const timeMatch = rawTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
          if (timeMatch) {
            let hours = parseInt(timeMatch[1], 10);
            const minutes = parseInt(timeMatch[2], 10);
            const period = timeMatch[3].toUpperCase();
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            scheduledDateTime = new Date(rawDate);
            scheduledDateTime.setHours(hours, minutes, 0, 0);
          } else {
            // No time parseable — treat as start of scheduled day
            scheduledDateTime = new Date(rawDate);
            scheduledDateTime.setHours(0, 0, 0, 0);
          }
        }

        const examWeightage = exm?.ExamWeightage || null;
        const now = new Date();

        // For Attendance: always visible (no schedule required)
        // For others: only visible if schedule exists AND scheduled datetime has arrived
        if (!isAttendance) {
          if (!scheduledDateTime || now < scheduledDateTime) {
            // Not yet time — exclude from list
            return null;
          }
        }

        return {
          _id: exm._id,
          examType: examTypeName,
          examDate: DateStr,
          examWeightage: examWeightage,
          rawExamData: data
        };
      }).filter(Boolean); // Remove nulls (exams not yet due)

      return ExamsData;
    } catch (error) {
      console.error('Error fetching Data:', error.message);
      return [];
    }
  }, [convertToNormalDateFormat]);



  const fetchAllExamDetails = React.useCallback(async (groups) => {
    if (!groups) return;
    try {
      const updatedDataPromises = groups.map(async (group) => {
        const CreatedExam = await fetchCreatedExam1Details(group.termId, group.programId);
        console.log(CreatedExam, "createdexamdata fetched by group termId");

        // If we have exam data, use the first one found
        const firstExam = CreatedExam.length > 0 ? CreatedExam[0] : null;

        // Side-effect: If this is the active group or just to set a default, 
        // we might still want to trigger state, but safer to do it on interaction.
        // For now, we attach specific exam data to the group object.

        return {
          ...group,
          examType: firstExam ? firstExam.examType : "No Exam",
          examDate: firstExam ? firstExam.examDate : "N/A",
          examId: firstExam ? firstExam._id : null,       // Store ID here
          examWeightage: firstExam ? firstExam.examWeightage : null,
          fullExamData: firstExam ? firstExam.rawExamData : null
        };
      });

      const updatedData = await Promise.all(updatedDataPromises);
      
      // Filter out groups that don't have an active exam to evaluate
      const filteredData = updatedData.filter(group => group.examType !== "No Exam");
      setUpdatedData(filteredData);

      // FIX: Set global exam state based on the first available exam if needed for initial view,
      // but ideally this should be driven by user selection.
      // preserving existing behavior roughly:
      const firstValid = updatedData.find(d => d.fullExamData);
      if (firstValid) {
        setExamData(firstValid.fullExamData);
        setExamWeightage(firstValid.examWeightage);
      }

    } catch (error) {
      console.error('Error fetching all exam details:', error.message);
    }
  }, [fetchCreatedExam1Details]);








  /*
   * FIX: `fetchEvalStat` now checks for `examId` on the group object itself.
   */
  const fetchEvalStat = React.useCallback(async (currentUpdatedData) => {
    try {
      // setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData._id;
      // console.log(groupData, "Data from exam");

      // Array to store the evaluation data for each group
      const groupEval = [];

      // Iterate over each group and fetch the evaluation data
      for (const group of currentUpdatedData) {

        // Use ID stored in group from fetchAllExamDetails, falling back to global if necessary (though global is flaky here)
        // If no examId found on group, skip or handle error.
        const examId = group.examId || (examData && examData.exams && examData.exams[0] ? examData.exams[0]._id : null);

        if (!examId) {
          console.warn(`No exam ID found for group ${group._id}, skipping stats fetch.`);
          groupEval.push(group);
          continue;
        }

        let response = await fetch(`${baseUrl}/api/manageexampanels/getEvaluationStatofexminer/${group.termId}/${examId}?groupId=${group._id}&examinerId=${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // If 404 or other, maybe just push group without stats?
          // throw new Error('Failed to fetch Data');
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
    }
  }, [examData]);

  useEffect(() => {
    if (groupData && updatedData.length > 0) {
      console.log("Dependencies changed, fetching eval stats...", { groupData, updatedData });
      fetchEvalStat(updatedData);
    }
  }, [groupData, updatedData, fetchEvalStat]);





  const MarksClick = (id) => {
    // Find the specific group data to get the correct exam details
    const group = updatedData.find(g => g._id === id);
    if (group && group.fullExamData) {
      settingExamWeightage(group.examWeightage, group.fullExamData);
    } else {
      console.warn("No exam data found for this group, using fallback");
      settingExamWeightage(examWeightage, examData);
    }
    onMarksClick(id);
  }



  useEffect(() => {
    if (groupData) {
      fetchAllExamDetails(groupData);
    }
  }, [groupData, fetchAllExamDetails]);


  return (
    <>
      {(<div>
        <TestTable groupData={newGroupData} headers={[
          'Serial no',
          'FYP Title',
          'Program',
          'Exam Type',
          'Exam Date',
          'Term',
          'Status',
        ]} accordionId={accordionId} buttons={[
          {
            bheading: 'Report',
            text: 'Report',
            click: onReportClick, // initialized with click handler function
          },
          {
            bheading: 'Marks',
            text: 'Add',
            click: MarksClick, // initialized with click handler function
          },
          {
            bheading: 'Details',
            text: 'View',
            click: onDetailsClick, // initialized with click handler function
          },
        ]}
          tabheading={'As Supervisor'}
          fields={['groupNo', 'fypTitle', 'Program', 'examType', 'examDate', 'term', 'status']}
        />
      </div>)}
    </>
  );
};

export default ExamAssignmentAsSupervisor;
