import React, { useState, useEffect } from 'react'
import CardOneButton from '../../../../../Components/Cards/CardOnebutton'
import LoadingSpinner from '../../../../../Components/LoadingSpinner/LoadingSpinner';
import { initFlowbite, } from 'flowbite';
import ButbgPrimary from '../../../../../Components/Buttons/ButbgPrimary';
import CoodAddedClosDetailsTable from './CoodAddedClosDetailsTable';
import CoodCreateClosCard from './CoodCreateClosCard';
import AssignQuestions from './AssignQuestions';
import CoodViewAddCLOQuestions from './CoodViewAddCLOQuestions';
import CoodViewQuestion from './CoodViewQuestion';

const CoodManageClos = () => {

    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [showCloQuestionDetails, setshowCloQuestionDetails] = useState(false);
    const [showAssignQuestions, setShowAssignQuestions] = useState(false);
    const [showAddClo, setShowAddClo] = useState(false);

    const [CloData, setCloData] = useState([]);
    const [programsData, setProgramsData] = useState([]);
    const [departmentsData, setDepartmentsData] = useState([]);
    const [addedQuestions, setAddedQuestions] = useState([]);
    const [questionsofSelectedCLO, setQuestionsofSelectedCLO] = useState([]);
    const [selectedCLOtoAddQues, setSelectedCLOtoAddQues] = useState(null);
    const [selectedCLOCODE, setselectedCLOCODE] = useState(null);
    const [selectedQuestion, setselectedQuestion] = useState(null);
    const [CLOIDToRemQues, setCLOIDToRemQues] = useState('');
    





    const handleCreateClo = () => {

        setShowAddClo(true)

    }
    const handleDeleteClickinCLOTable = async (id) => {
console.log("Deleting iddddddd", id);
try {
    setLoadingSpinner(true);
    const nkey = localStorage.getItem('key');
    const token = JSON.parse(nkey);
    const apiUrl = `/api/ManageCLOs/removeQuestionInsideCLO`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            CLOIdToRemove: CLOIDToRemQues,
            questionIdRemove: id,
        }),
    });

    if (response.ok) {
        console.log('Question deleted inside CLO successfully');
        window.location.reload();
    } else {
        console.log('Failed to delete question insdie CLO');
    }
} catch (error) {
    console.error('Error deleting question:', error);
} finally {
    setLoadingSpinner(false);
}

    }

    const handleDetailsClickinCLOTable = async (id) => {
        const selectedQues = questionsofSelectedCLO.find(question => (question._id === id))
        await setselectedQuestion(selectedQues);
        setshowCloQuestionDetails(true)



    }

    const handleAssignQuestions = (questionIds) => {
        console.log(questionIds, "Added Questions")
        AssignQuestiontoCLO(selectedCLOtoAddQues, questionIds)
        fetchCLOs()

    }


    const handleSaveAddedClos = async (data) => {
        console.log("Checking Dataaaaaaaa", data);
        const Program = programsData.find(data => data._id === data.program)?.programTitle
        console.log("Checking Programmmmmmmmmmmmmmmmm", Program);
        await CreateCLOs(data.clo, data.title,data.program.value);
        fetchCLOs()



        const newData = [...CloData, data]
        // setCloData(newData);

        console.log(data, "added CLOs")
    }



    const handleCloseAddedClo = () => {
        setShowAddClo(false)
    }
    const handleCloseAssignQuestion = () => {
        setShowAssignQuestions(false)
    }



    const handleViewDetailsClick = (id) => {
        setCLOIDToRemQues(id);
        const CLOC = CloData.find(clo => clo._id === id)?.CLOCode;
        console.log("Checkingggggggg CLOCCCCCCCCCCCCCCCC", CLOC);
        setselectedCLOCODE(CLOC)
        const CLO = CloData.find(clo => (clo._id === id))
        const Questions = CLO.Questions.map((data, index) => ({
            index: index + 1,
            ...data,

        }))
        setQuestionsofSelectedCLO(Questions)
        console.log("CLo Questions ", Questions)

    }

    const handleDeleteCLOFunc = async(id) => {
        console.log("Delete CLO Called", id);
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const apiUrl = `/api/ManageCLOs/deleteClo/${id}`;
        
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    // 'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
        
            if (response.ok) {
                console.log('CLO deleted successfully');
                window.location.reload();
            } else {
                console.log('Failed to delete clo');
            }
        } catch (error) {
            console.error('Error deleting clo:', error);
        } finally {
            setLoadingSpinner(false);
        }
    }
    const handleAssignQuestionClick = (id) => {

        setSelectedCLOtoAddQues(id);
        setShowAssignQuestions(true)
    }






    const fetchCLOs = async () => {
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const userData = localStorage.getItem('user');
            // const parsedUserData = JSON.parse(userData);
            // const userid = parsedUserData._id;
            const response = await fetch(`/api/ManageCLOs/getAllClos`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'

                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Data');
            }
            const data = await response.json();
            //Fetched  Data
            console.log(data, 'fetched CLOs')
            const cloData = data.CLOs.map((data, index) => ({
                index: index + 1,
                ...data,

            }));

            setCloData(cloData);
        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };


    const CreateCLOs = async (CLOCode, Title, Program) => {

        try {
            console.log("Checking CLOCode", CLOCode);
            console.log("Checking Title", Title);
            console.log("Checking Program", Program);
            setLoadingSpinner(true); // Show loading spinner while processing
            const userData = localStorage.getItem('user');
            // const parsedUserData = JSON.parse(userData);
            // const userid = parsedUserData._id;

            const apiUrl = `/api/ManageCLOs/CreateCLO`;
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    CLOCode, Title, Program
                }),
            });
            if (response.ok) {
                // Handle successful response
                console.log(' ExamCLo Created successfully');
                window.location.reload();
            } else {
                console.log('Failed to Create ExamCLo ');
            }
        }
        catch (error) {
            console.error('Error creating ExamCLo :', error);
            // Handle network errors or other exceptions
        } finally {
            setLoadingSpinner(false); // Hide loading spinner after processing
        }
    }
    const AssignQuestiontoCLO = async (CLOId, questionIds) => {

        try {
            setLoadingSpinner(true); // Show loading spinner while processing
            const userData = localStorage.getItem('user');
            // const parsedUserData = JSON.parse(userData);
            // const userid = parsedUserData._id;

            const apiUrl = `/api/ManageCLOs/assign-questions`;
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);

            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    CLOId, questionIds
                }),
            });
            if (response.ok) {
                // Handle successful response
                console.log(' ExamCLo Created successfully');
                window.location.reload();
            } else {
                console.log('Failed to Create ExamCLo ');
            }
        }
        catch (error) {
            console.error('Error creating ExamCLo :', error);
            // Handle network errors or other exceptions
        } finally {
            setLoadingSpinner(false); // Hide loading spinner after processing
        }
    }







    const fetchPrograms = async () => {
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const userData = localStorage.getItem('user');
            // const parsedUserData = JSON.parse(userData);
            // const userid = parsedUserData._id;
            const response = await fetch(`/api/auth/fetchProgramData`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'

                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Data');
            }
            const data = await response.json();
            //Fetched  Data
            console.log(data, 'fetched Programs')
            const progrmData = data.programs.map((data, index) => ({
                value: data._id,
                index: index + 1,
                label: data.programTitle,
                ...data,

            }));
            setProgramsData(progrmData);
        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };


    const fetchQuestions = async () => {
        try {
            setLoadingSpinner(true);
             const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const userData = localStorage.getItem('user');
            // const parsedUserData = JSON.parse(userData);
            // const userid = parsedUserData._id;
            const response = await fetch(`/api/QuesForClo/getAllQuestions`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'

                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Data');
            }
            const data = await response.json();
            //Fetched  Data
            console.log(data, 'fetched Questions')
            const quesData = data.questionsForCLO.map((data, index) => ({
                index: index + 1,
                ...data,

            }));
            setAddedQuestions(quesData);
        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const response = await fetch(`/api/auth/fetchDepartmentData`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch Departments');
            }
            const data = await response.json();
            console.log(data, 'fetched Departments');
            const deptData = data.departments.map((dept, index) => ({
                value: dept._id,
                label: dept.departmentName,
                ...dept,
            }));
            setDepartmentsData(deptData);
        } catch (error) {
            console.error('Error fetching Departments:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };


    useEffect(() => {
        fetchDepartments();
        fetchPrograms();
        fetchCLOs();
        fetchQuestions();
    }, [])



    useEffect(() => {
        initFlowbite();
        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
            const tabName = 'CoodManageClos';
            const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
            const topOffset = selectedTab.offsetTop;
            indicator.style.top = `${topOffset}px`;
        }
    }, []);

    const handleQuestionDescClose = () => {
        setshowCloQuestionDetails(false)
    }


    return (
        <>
            {loadingSpinner ? ( // Show loading spinner while loading is true
                <LoadingSpinner />
            ) : (
                <div className='bg-slate-100 w-full h-full'>
                    <div className="mx-10 pt-12 flex flex-col gap-3">
                        {(<div className='grid grid-cols-1, grid-flow-col w-[21%]'>
                            <div id="cardOneButton ">
                                <CardOneButton title={"Create CLOs"} butText={"Create"} onClick={handleCreateClo} />
                            </div>
                        </div>)}

                        {showAddClo && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
                            <CoodCreateClosCard
                                onclose={handleCloseAddedClo}
                                saveCloClick={handleSaveAddedClos}
                                //dataToEdit={examCloDataToEdit}
                                //optionsData={optionsData}
                                programs={programsData}
                                departments={departmentsData}
                            />
                        </div>)}

                        {showAssignQuestions && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
                            <AssignQuestions
                                onClose={handleCloseAssignQuestion}
                                //dataToEdit={examCloDataToEdit}
                                //optionsData={optionsData}

                                questions={addedQuestions} handleAssignQuestions={handleAssignQuestions}
                            />
                        </div>)}

                        {(<div>

                            <CoodAddedClosDetailsTable
                                data={CloData}
                                handleAssignQuestionClick={handleAssignQuestionClick}
                                handleViewDetailsClick={handleViewDetailsClick}
                                handleDeleteCLO = {handleDeleteCLOFunc}
                                accordionId={2}
                            />
                        </div>)}

                        {questionsofSelectedCLO.length > 0 && (<div>
                            <CoodViewAddCLOQuestions
                                data={questionsofSelectedCLO} selectedCLO={selectedCLOCODE} handleDetailsClick={handleDetailsClickinCLOTable} handleDeleteClick={handleDeleteClickinCLOTable}
                            />

                        </div>)}

                        {showCloQuestionDetails && selectedQuestion && (<div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
                            <CoodViewQuestion
                                question={selectedQuestion}
                                onclose={handleQuestionDescClose}
                            />

                        </div>)}




                        {/* 
                        {(<div></div>)} */}



                    </div></div>
            )}
        </>
    )
}

export default CoodManageClos
