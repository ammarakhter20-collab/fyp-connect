import React, { useState, useRef, useEffect } from 'react';
import Simple from '../../../Components/Buttons/Simple';
import { MdFileUpload } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const SupAddTask = ({ selectedGroup, onclose, handleAddTasks }) => {
    const [title, setTitle] = useState('');
    const[index, setIndex] = useState(1);
    const [dueTimeO, setDueTime] = useState('');
    const [dueDateO, setDueDate] = useState('');
    const [closeDateO, setCloseDate] = useState('');
    const [closeTimeO, setCloseTime] = useState('');
    const [taskStatus, setTaskStatus] = useState('UnSubmitted');
    const [instructions, setInstructions] = useState('');
    const [taskno, setTaskno] = useState(null);
    const [assignedDate, setAssignedDate] = useState(null);
    const [points, setPoints] = useState(null);
    const [attachPdf, setAttachPdf] = useState([]);
    const [feedback, setFeedback] = useState(null);

    const dueTime = new Date(`${dueDateO}T${dueTimeO}:00.000Z`).toJSON();
    const dueDate = new Date(`${dueDateO}T00:00:00.000Z`).toJSON();
    const closeDate = new Date(`${closeDateO}T00:00:00.000Z`).toJSON();
    const closeTime = new Date(`${closeDateO}T${closeTimeO}:00.000Z`).toJSON();
    
const group = selectedGroup;
console.log("tihs is our selected", group)
    const handleSaveClick = () => {
        const data = { title, assignedDate, dueTime, dueDate, closeDate, closeTime, instructions, taskno, points, taskStatus, attachPdf, group, };
        handleAddTasks(data);
        setTitle('');
        setAssignedDate(new Date().toISOString().slice(0, 10));
        setDueTime('');
        setDueDate('');
        setInstructions('');
        setTaskno();
        setPoints('');
        setAttachPdf([]);
        setCloseDate('');

    };   
    const handleFileChange = (event) => {
        const newFile = event.target.files[0];
        setAttachPdf([...attachPdf, newFile]);
    };

    const handleDeleteFile = (index) => {
        const newFiles = [...attachPdf];
        newFiles.splice(index, 1);
        setAttachPdf(newFiles);
    };

    const cardRef = useRef(null);
    const handleClick1 = () => {
        onclose();
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                handleClick1();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-[33.3%]">
            <div className='justify-center'>


                <h2 className="text-center font-bold text-2xl mb-4 text-indigo-950">Add Task</h2>

            </div>

            <form required > 
                <div className="my-4">
                    <label htmlFor='title' className="block text-md font-semibold text-gray-700">Task Title</label>
                    <input
                        id='title'
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-4 h-10 border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                        placeholder='Poposal'

                    />
                </div>
                <div className="my-4">
                    <label htmlFor='taskno' className="block text-md font-semibold text-gray-700">Task no</label>
                    <input
                        id='taskno'
                        type="number"
                        value={taskno}
                        onChange={(e) => setTaskno(e.target.value)}
                        className="border p-4 h-10 border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                        placeholder='Task no'

                    />
                </div>
                <div className="my-4">
                    <label htmlFor='points' className="block text-md font-semibold text-gray-700">Points</label>
                    <input
                        id='points'
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        className="border p-4 h-10 border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                        placeholder='Points'

                    />
                </div>

                <div className="my-4">
                    <div className='grid grid-cols-2  gap-x-10'>
                        <div className="col-span-1">
                            <label htmlFor='date' className="block text-md font-semibold text-gray-700">Due Date</label>
                            <input
                                id='date'
                                type="date"
                                value={dueDateO}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="border h-10 p-4 border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-[100%] sm:text-sm"
                            />

                        </div>
                        <div className="col-span-1">
                            <label htmlFor='time' className="block text-md font-semibold text-gray-700">Due Time</label>
                            <input
                                type="time"
                                id='time'
                                value={dueTimeO}
                                onChange={(e) => setDueTime(e.target.value)}
                                className="border h-10 p-4 border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-[100%] sm:text-sm"
                            />
                        </div>
                        {/* <div className="col-span-1">
                            <label htmlFor='closedate' className="block text-md font-semibold text-gray-700">Close Date</label>
                            <input
                                id='closedate'
                                type="date"
                                value={closeDateO}
                                onChange={(e) => setCloseDate(e.target.value)}
                                className="border h-10 p-4 border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-[100%] sm:text-sm"
                            />

                        </div>
                        <div className="col-span-1">
                            <label htmlFor='closetime' className="block text-md font-semibold text-gray-700">Close Time</label>
                            <input
                                id='closetime'
                                type="time"
                                value={closeTimeO}
                                onChange={(e) => setCloseTime(e.target.value)}
                                className="border h-10 p-4 border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-[100%] sm:text-sm"
                            />

                        </div> */}
                    </div>
                </div>
                <div className="my-4">
                    <label htmlFor='instructions' className="block text-md font-semibold text-gray-700">Instructions</label>
                    <textarea
                        type="text"
                        id='instructions'
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="border p-4 border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-[100%] h-32 sm:text-sm"
                    />
                </div>
                <div className="grid grid-cols-12 text-green-700 my-4 gap-x-4">
                    <button type='button'
                        onClick={() => document.getElementById('fileInput').click()}
                        className='flex flex-col items-center bg-slate-50 p-2 border border-gray-50 rounded-lg col-span-3'>
                        <MdFileUpload className='text-3xl mb-1' />
                        <span className='font-semibold text-xs'>Upload File</span>
                        <input
                            id="fileInput"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </button>
                    <div className="flex flex-col h-20 overflow-y-auto col-span-9">
                        {attachPdf && (attachPdf.map((attachPdf, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <span className="mr-2">{attachPdf.name}</span>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteFile(index)}
                                    className="text-red-500"
                                >
                                    <RxCross2/>
                                </button>
                            </div>
                        )))}
                    </div>

                </div>
            </form>


            <div className='grid grid-cols-2 mt-5 '>
                <div className="col-span-1 flex justify-center ">
                    {/* Cancel Button colour is to be adjusted */}
                    <Simple text="Cancel" onClick={handleClick1} bgClass={'bg-gray-400'} />
                </div>
                <div className="col-span-1 flex justify-center ">
                    <Simple text="Save" type="Submit" onClick={handleSaveClick} />
                </div>
            </div>
        </div>
    );
};

export default SupAddTask;
