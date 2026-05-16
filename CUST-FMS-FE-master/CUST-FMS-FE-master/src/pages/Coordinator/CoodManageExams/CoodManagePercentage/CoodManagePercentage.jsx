import React, { useState, useEffect, useRef } from 'react'
import CardOneButton from '../../../../Components/Cards/CardOnebutton'
import LoadingSpinner from '../../../../Components/LoadingSpinner/LoadingSpinner';
import Simple from '../../../../Components/Buttons/Simple';
import Select from 'react-select';
import AccordionGenericTable from '../../../../TESTING/AccordionTableGeneric';
import { initFlowbite, } from 'flowbite';







const CoodManagePercentage = (props) => {
    // const { onclose, handleSaveSchedule } = props;
    const [showAddPercentage, setShowAddPercentageCard] = useState(false);
    const [term, setTerm] = useState('');
    const [program, setProgram] = useState('');
    const [supervisorPercentage, setSupervisorPercentage] = useState('');
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [examPercentage, setExamPercentage] = useState([]);
    const [termData, setTermData] = useState([]);
    const [programsData, setProgramsData] = useState([]);








    const cardRef = useRef(null);




    const fetchTermData = async () => {
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            // const userData = localStorage.getItem('user');
            // const parsedUserData = JSON.parse(userData);
            // const userid = parsedUserData._id;
            const response = await fetch(`/api/auth/getTermdata`, {
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
            console.log(data, 'fetched Term Data')
            const dataofterm = data.fypTerms.map((term, index) => ({
                ...term,
                label: term.sessionTerm,
                value: term._id,
            }))
            setTermData(dataofterm);
        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };







    const AssignPercentage = async (term, program, supervisorPercentage,) => {

        try {
            setLoadingSpinner(true); // Show loading spinner while processing
            // const userData = localStorage.getItem('user');
            // const parsedUserData = JSON.parse(userData);
            // const userid = parsedUserData._id;

            const apiUrl = `/api/ManagePercentage/AddSupPercentage`;
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    term,
                    program,
                    supervisorPercentage,
                }),
            });
            if (response.ok) {
                // Handle successful response
                console.log(' Percentage Assigned successfully');
            } else {
                console.log('Failed to Percentage Assigned ');
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
            // const userData = localStorage.getItem('user');
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




    const fetchPercentage = async () => {
        try {
            setLoadingSpinner(true);
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            // const userData = localStorage.getItem('user');
            // const parsedUserData = JSON.parse(userData);
            // const userid = parsedUserData._id;
            const response = await fetch(`/api/ManagePercentage/getSupPercentage`, {
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
            console.log(data, 'fetched Exam Percentages')
            const percentageData = data.supervisorPercentage.map((data, index) => ({
                index: index + 1,
                Term: data.term.sessionTerm,
                Program: data.program.programTitle,
                ...data,

            }));
            setExamPercentage(percentageData);
        } catch (error) {
            console.error('Error fetching Data:', error.message);
        } finally {
            setLoadingSpinner(false);
        }
    };


    useEffect(() => {
        fetchTermData();
        fetchPercentage();
        fetchPrograms();
    }, [])




    const handletermChange = (selectedOption) => {
        setTerm(selectedOption);
    };
    const handleprogramChange = (selectedOption) => {

        setProgram(selectedOption);

    };
    const handlesupervisorPercentageChange = (e) => {
        setSupervisorPercentage(e.target.value);
    };

    const handleSubmit = () => {

        const Term = term._id
        const Program = program._id
        const SupervisorPercentage = supervisorPercentage
        AssignPercentage(Term, Program, SupervisorPercentage)

        //handleSaveSchedule(data);
        setTerm('');
        setSupervisorPercentage('');
        setProgram('');
        setShowAddPercentageCard(false);
        fetchPercentage()
        //onclose();
    };

    const handleDeleteClick = (id) => {

    }

    const handleAddPercentage = () => {
        setShowAddPercentageCard(true);
    };

    const handleClickOutside = (event) => {
        if (cardRef.current && !cardRef.current.contains(event.target)) {
            setShowAddPercentageCard(false);
            //onclose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);





    useEffect(() => {
        initFlowbite();
        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
            const tabName = 'CoodManagePercentage';
            const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
            const topOffset = selectedTab.offsetTop;
            indicator.style.top = `${topOffset}px`;
        }
    }, []);

    return (
        <>
            {loadingSpinner ? ( // Show loading spinner while loading is true
                <LoadingSpinner />
            ) : (
                <div className='bg-slate-100 w-full h-full'>
                    <div className="mx-10 pt-12 flex flex-col gap-3">
                        {((
                            <div className='grid grid-cols-1, grid-flow-col w-[21%]'>
                                <div id="cardOneButton">
                                    <CardOneButton title={"Add Percentage"} butText={"Add"} onClick={handleAddPercentage} />
                                </div>
                            </div>
                        ))}

                        {showAddPercentage && (
                            <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
                                <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative" /*ref={cardRef}*/>
                                    <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setShowAddPercentageCard(false)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        {/* <RxCross2 /> */}
                                    </button>
                                    <div>
                                        <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Add Percentage</h4>
                                        <form>
                                            <div className="my-4">
                                                <label htmlFor='term' className="block text-md font-semibold text-gray-700">Term
                                                    <Select
                                                        id='term'
                                                        name='term'
                                                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                                                        options={termData}
                                                        isSearchable
                                                        onChange={handletermChange}
                                                        value={term}
                                                        placeholder='Select or type'
                                                    />
                                                </label>
                                            </div>
                                            <div className="my-4">
                                                <label htmlFor='program' className="block text-md font-semibold text-gray-700">Program
                                                    <Select
                                                        id='program'
                                                        name='program'
                                                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                                                        //className="border p-4 h-14 border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"

                                                        options={programsData}
                                                        isSearchable
                                                        onChange={handleprogramChange} // Use handleDepartmentChange instead of handleDepartmentNameChange
                                                        value={program}
                                                        placeholder='Select or type'
                                                    //isDisabled={modalMode === 'view'}
                                                    />
                                                </label>
                                            </div>

                                            <div className="my-4">
                                                <label htmlFor='supervisorPercentage' className="block text-md font-semibold text-gray-700">Supervisor Percentage
                                                    <input
                                                        id='supervisorPercentage'
                                                        name='supervisorPercentage'
                                                        type="number"
                                                        value={supervisorPercentage}
                                                        onChange={handlesupervisorPercentageChange}
                                                        className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
                                                    />
                                                </label>
                                            </div>
                                            <div className="col-span-1 flex justify-center my-2">
                                                <Simple text="Add" type="Submit" onClick={handleSubmit} />
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}





                        {examPercentage && (<div className="mt-5">

                            <AccordionGenericTable
                                groupData={examPercentage}

                                accordionId={3}
                                tabheading={"Added Percentage"}

                                headers={['Sr no.', 'term', 'Program', 'Supervisor Percentage']}

                                buttons={[
                                    //     {text: 'Edit',
                                    //    // click: handleEditClick

                                    //     },
                                    {
                                        bheading: 'Action',
                                        text: 'Delete',
                                        click: handleDeleteClick

                                    }
                                ]}

                                fields={['index', 'Term', 'Program', 'supervisorPercentage',]}

                            />

                        </div>)}
                    </div>
                </div>)}
        </>
    );
};

export default CoodManagePercentage;
