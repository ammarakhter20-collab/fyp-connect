import React, { useState, useEffect, useRef } from 'react';
import CardOneButton from '../../../../Components/Cards/CardOnebutton';
import LoadingSpinner from '../../../../Components/LoadingSpinner/LoadingSpinner';
import Simple from '../../../../Components/Buttons/Simple';
import Select from 'react-select';
import AccordionGenericTable from '../../../../TESTING/AccordionTableGeneric';
import { baseUrl } from '../../../../Components/config/config';

const isEmpty = (value) => value.trim() === '';

const CoodCreateExamSchedule = (props) => {
    const { onclose, idofExam, termOfExam, ExamName } = props;
    const [showScheduleCard, setShowScheduleCard] = useState(false);
    const [panel, setPanel] = useState('');
    const [examDate, setExamDate] = useState('');
    const [examTime, setExamTime] = useState('');
    const [venue, setVenue] = useState('');
    const [examSchedule, setExamSchedule] = useState([]);
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [panelData, setPaneldata] = useState([]);
    const [examScheduleData, setExamScheduledata] = useState([]);
    const [errors, setErrors] = useState({});

    // Validation function to check if all fields are filled
    const validateForm = () => {
        const errors = {};
        if (isEmpty(panel.value)) {
            errors.panel = 'Panel is required';
        }
        if (isEmpty(examDate)) {
            errors.examDate = 'Exam Date is required';
        }
        if (isEmpty(examTime)) {
            errors.examTime = 'Exam Time is required';
        }
        if (isEmpty(venue)) {
            errors.venue = 'Venue is required';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    console.log("Term of Exam", termOfExam);

    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        let day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return `${year}-${month}-${day}`;
    };

    const convertToNormalDateFormat = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const cardRef = useRef(null);

    const handlePanelChange = (selectedOption) => {
        setPanel(selectedOption);
        setErrors((prevErrors) => ({ ...prevErrors, panel: '' }));
    };
    const handleExamDateChange = (e) => {
        setExamDate(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, examDate: '' }));
    };
    const handleExamTimeChange = (e) => {
        setExamTime(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, examTime: '' }));
    };
    const handleVenueChange = (e) => {
        setVenue(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, venue: '' }));
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        // Check if panel is defined
        if (!panel) {
            alert('Select Panel');
            return; // Exit the function early
        }

        // Validate the form
        const isValid = validateForm();

        // If the form is valid, proceed with submitting the data
        if (isValid) {
            const panel1 = panel.value;
            CreateExamSchedule(panel1, examDate, examTime, venue, idofExam);
            setPanel('');
            setExamTime('');
            setExamDate('');
            setVenue('');
            setShowScheduleCard(false);
        }
    };

    const handleScheduleCreation = () => {
        setShowScheduleCard(true);
    };

    const updatedData = examSchedule.map((schedule, index) => ({
        ...schedule,
        index: index + 1
    }))

    const handleDeleteClick = async (id) => {
        if (!window.confirm("Are you sure you want to delete this schedule?")) return;

        try {
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            console.log("Deleting schedule with ID:", id);

            const response = await fetch(`${baseUrl}/api/ScheduleExamRoutes/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log("Schedule deleted successfully");
                fetchExamSchedule(); // Refresh the list
            } else {
                console.error("Failed to delete schedule");
                alert("Failed to delete schedule");
            }
        } catch (error) {
            console.error("Error deleting schedule:", error);
        }
    };

    // ...

    const CreateExamSchedule = async (panel, ExamDate, ExamTime, Venue, CreatedExam) => {
        try {
            setLoadingSpinner(true);
            const userData = localStorage.getItem('user');
            const parsedUserData = JSON.parse(userData);
            const coordinatorId = parsedUserData._id;

            const apiUrl = `${baseUrl}/api/ScheduleExamRoutes/createExamSchedule`;
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    panel,
                    ExamDate,
                    ExamTime,
                    Venue,
                    CreatedExam,
                    coordinatorId,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message || 'Exam schedule created successfully!');
                fetchExamSchedule();
            } else {
                alert(data.error || 'Failed to create schedule');
            }
        }
        catch (error) {
            console.error('Error Creating Schedule: ', error);
            alert('An error occurred while creating schedule');
        } finally {
            setLoadingSpinner(false);
        }
    };

    const fetchPanels = async () => {
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);

            const response = await fetch(`${baseUrl}/api/manageexampanels/get-all-panels`, {
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
            console.log(data, 'fetched Panels');

            // Robust filtering: Match Term Name OR startsWith as fallback
            const filteredPanels = data.panels.filter(panel => {
                const panelTerm = panel.term?.sessionTerm;
                // Match if panel term equals exam term OR if panel name starts with exam term
                return (panelTerm === termOfExam) || (panel.panelName.startsWith(termOfExam));
            });

            const deptData = filteredPanels.map((data, index) => ({
                index: index + 1,
                PanelMembers: data.PanelMembers.map(member => ({
                    member: member.member?.name,
                    role: member.role,
                    department: member.member?.department?.departmentName,
                    designation: member.member?.designation,
                    _id: member.member?._id
                })),
                term: data.term?.sessionTerm,
                panelCode: data.panelCode,
                panelName: data.panelName,
                label: data.panelName,
                value: data._id,
                _id: data._id,
            }));
            setPaneldata(deptData);

        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };

    // ...

    const fetchExamSchedule = async () => {
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);

            const response = await fetch(`${baseUrl}/api/ScheduleExamRoutes/getting-scheduled-exams`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            // ...
            if (!response.ok) {
                throw new Error('Failed to fetch Data');
            }
            const data = await response.json();
            //Fetched  Data
            console.log(data, 'fetched Exams Schedule')
            console.log("Filtering by ID:", idofExam);
            // const deptData = data.exams.map((examData, index) => {
            // Use loose comparison and handle potential missing CreatedExam for resilience
            const filteredData = data.exams.filter(examData => {
                // Debug each item
                // console.log(`Checking Schedule ${examData._id}: CreatedExam ID: ${examData.CreatedExam?._id} vs Target: ${idofExam}`);
                return String(examData.CreatedExam?._id) === String(idofExam);
            });
            console.log("Filtered Data Length:", filteredData.length);
            const deptData = filteredData.map((examData, index) => {
                const newDate = convertToNormalDateFormat(examData.ExamDate);
                return {
                    index: index + 1,
                    examDate: newDate, // Use the converted date here
                    examTime: examData.ExamTime,
                    venue: examData.Venue,
                    PanelMembers: examData.panel?.PanelMembers?.map(member => ({
                        member: member?.member?.name,
                        role: member?.role,
                        _id: member?.member?._id
                    })) || [],
                    panelCode: examData.panel?.panelCode || "N/A",
                    panelName: examData.panel?.panelName || "N/A",
                    examName: examData.CreatedExam?.ExamType?.examName || "N/A",
                    ExamId: examData.CreatedExam?._id || "N/A",
                    _id: examData._id
                };
            });
            console.log("Depttttttttttttt Data", deptData);

            setExamScheduledata(deptData);
        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };

    useEffect(() => {
        fetchPanels();
        fetchExamSchedule();
    }, []);

    return (
        <>
            {loadingSpinner ? ( // Show loading spinner while loading is true
                <LoadingSpinner />
            ) : (
                <div className="gap-3">
                    <div className='grid grid-cols-1, grid-flow-col w-[21%]'>
                        <div id="cardOneButton">
                            <CardOneButton title={"Create Schedule"} butText={"Add"} onClick={handleScheduleCreation} />
                        </div>
                    </div>
                    {showScheduleCard && (
                        <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
                            <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative" /*ref={cardRef}*/>
                                <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setShowScheduleCard(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    {/* <RxCross2 /> */}
                                </button>
                                <div>
                                    <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Create Schedule</h4>
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <div className="my-4">
                                            <label className="block text-md font-semibold text-gray-700">Panel
                                                <Select
                                                    id='panel'
                                                    name='panel'
                                                    className={`bg-white border ${errors.panel ? 'border-red-500' : 'border-gray-300'} text-black text-sm rounded-2xl block w-full p-2.5`}
                                                    options={panelData}
                                                    isSearchable
                                                    onChange={handlePanelChange}
                                                    value={panel}
                                                    placeholder='Select or type'
                                                />
                                                {errors.panel && <p className="text-red-500 text-sm">{errors.panel}</p>}
                                            </label>
                                        </div>
                                        <div className="my-4">
                                            <label className="block text-md font-semibold text-gray-700">Exam Date
                                                <input
                                                    id='examDate'
                                                    name='examDate'
                                                    type="date"
                                                    value={examDate}
                                                    min={getCurrentDate()} // Set the min attribute to the current date
                                                    onChange={handleExamDateChange}
                                                    className={`bg-white border ${errors.examDate ? 'border-red-500' : 'border-gray-300'} text-black text-sm rounded-2xl block w-full p-2.5`}
                                                />
                                                {errors.examDate && <p className="text-red-500 text-sm">{errors.examDate}</p>}
                                            </label>
                                        </div>
                                        <div className="my-4">
                                            <label className="block text-md font-semibold text-gray-700">Exam Time
                                                <input
                                                    id='examTime'
                                                    name='examTime'
                                                    type="time"
                                                    value={examTime}
                                                    onChange={handleExamTimeChange}
                                                    className={`bg-white border ${errors.examTime ? 'border-red-500' : 'border-gray-300'} text-black text-sm rounded-2xl block w-full p-2.5`}
                                                />
                                                {errors.examTime && <p className="text-red-500 text-sm">{errors.examTime}</p>}
                                            </label>
                                        </div>
                                        <div className="my-4">
                                            <label className="block text-md font-semibold text-gray-700">Venue
                                                <input
                                                    id='venue'
                                                    name='venue'
                                                    type="text"
                                                    value={venue}
                                                    onChange={handleVenueChange}
                                                    className={`bg-white border ${errors.venue ? 'border-red-500' : 'border-gray-300'} text-black text-sm rounded-2xl block w-full p-2.5`}
                                                />
                                                {errors.venue && <p className="text-red-500 text-sm">{errors.venue}</p>}
                                            </label>
                                        </div>
                                        <div className="col-span-1 flex justify-center my-2">
                                            <Simple text="Add" type="button" onClick={handleSubmit} />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {examScheduleData && (
                        <div className="mt-5">
                            <AccordionGenericTable
                                groupData={examScheduleData}
                                accordionId={3}
                                tabheading={"Added Schedules"}
                                headers={['Sr no.', 'Panel', 'Exam Date', 'Exam Time', 'Venue']}
                                buttons={[
                                    // {text: 'Edit', click: handleEditClick},
                                    { bheading: 'Action', text: 'Delete', click: handleDeleteClick }
                                ]}
                                fields={['index', 'panelName', 'examDate', 'examTime', 'venue']}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default CoodCreateExamSchedule;
