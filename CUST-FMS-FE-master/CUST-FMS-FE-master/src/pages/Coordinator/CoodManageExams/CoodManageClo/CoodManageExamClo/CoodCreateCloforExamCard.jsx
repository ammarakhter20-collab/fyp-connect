import React, { useState, useRef, useEffect } from 'react';
import Simple from '../../../../../Components/Buttons/Simple';
import Select from 'react-select';

const CoodCreateCloforExamCard = ({ onclose, saveExamClick, dataToEdit, programs, examTypes, departments }) => {
    const [exam, setExam] = useState(dataToEdit ? dataToEdit.exam : '');
    const [shortCode, setShortCode] = useState(dataToEdit ? dataToEdit.shortCode : '');
    const [department, setDepartment] = useState('');
    const [program, setProgram] = useState(dataToEdit ? dataToEdit.program : '');
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [errors, setErrors] = useState({});

    const handleExamChange = (selectedOption) => {
        setExam(selectedOption);
        if (errors.exam) {
            setErrors(prevErrors => ({ ...prevErrors, exam: null }));
        }
    };

    const handleDepartmentChange = (selectedOption) => {
        setDepartment(selectedOption);
        // Reset program selection when department changes
        setProgram('');
        if (errors.department) {
            setErrors(prevErrors => ({ ...prevErrors, department: null }));
        }

        // Filter programs that belong to the selected department
        if (selectedOption) {
            const filtered = programs.filter(prog => {
                const progDeptId = prog.department?._id || prog.department;
                return progDeptId === selectedOption.value;
            });
            setFilteredPrograms(filtered);
        } else {
            setFilteredPrograms([]);
        }
    };

    const handleProgramChange = (selectedOption) => {
        setProgram(selectedOption);
        if (errors.program) {
            setErrors(prevErrors => ({ ...prevErrors, program: null }));
        }
    };

    const handleShortCodeChange = e => {
        setShortCode(e.target.value);
        if (errors.shortCode) {
            setErrors(prevErrors => ({ ...prevErrors, shortCode: null }));
        }
    };

    const cardRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newErrors = {};
        if (!shortCode) newErrors.shortCode = 'Short Code is required';
        if (!department) newErrors.department = 'Department is required';
        if (!program) newErrors.program = 'Program is required';
        // Uncomment this if exam field is required
        // if (!exam) newErrors.exam = 'Exam is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const data = {
            exam,
            shortCode,
            program,
        };

        saveExamClick(data);
        setExam('');
        setDepartment('');
        setProgram('');
        setShortCode('');
        setFilteredPrograms([]);
        onclose();
    };

    // const handleClickOutside = (event) => {
    //     if (cardRef.current && !cardRef.current.contains(event.target)) {
    //         onclose();
    //     }
    // };

    // useEffect(() => {
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, []);

    return (
        <div ref={cardRef} className="relative bg-white shadow-md rounded-lg p-6 w-[30%] h-auto z-50">
            <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={onclose}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div>
                <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Create CLO for Exam</h4>
                <form>
                    <div className="my-4">
                        <label htmlFor='examShortCode' className="block text-md font-semibold text-gray-700">
                            Short Code
                            <input
                                id='examShortCode'
                                name='examShortCode'
                                type="text"
                                value={shortCode}
                                onChange={handleShortCodeChange}
                                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 ${errors.shortCode ? 'border-red-500' : ''}`}
                                placeholder='Enter Short Code'
                            />
                            {errors.shortCode && <p className="text-red-500 text-sm">{errors.shortCode}</p>}
                        </label>
                    </div>
                    <div className="my-4">
                        <label htmlFor='department' className="block text-md font-semibold text-gray-700">
                            Department
                            <Select
                                id='department'
                                name='department'
                                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 ${errors.department ? 'border-red-500' : ''}`}
                                options={departments}
                                isSearchable
                                onChange={handleDepartmentChange}
                                value={department}
                                placeholder='Select Department'
                            />
                            {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                        </label>
                    </div>
                    <div className="my-4">
                        <label htmlFor='program' className="block text-md font-semibold text-gray-700">
                            Program
                            <Select
                                id='program'
                                name='program'
                                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 ${errors.program ? 'border-red-500' : ''}`}
                                options={filteredPrograms}
                                isSearchable
                                onChange={handleProgramChange}
                                value={program}
                                placeholder={department ? 'Select Program' : 'Select Department first'}
                                isDisabled={!department}
                            />
                            {errors.program && <p className="text-red-500 text-sm">{errors.program}</p>}
                        </label>
                    </div>
                    {/* Uncomment this if exam field is required
                    <div className="my-4">
                        <label htmlFor='exam' className="block text-md font-semibold text-gray-700">
                            Exam Name
                            <Select
                                id='examDropdown'
                                name='examDropdown'
                                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 ${errors.exam ? 'border-red-500' : ''}`}
                                options={examTypes}
                                isSearchable
                                onChange={handleExamChange}
                                value={exam}
                                placeholder='Select or type Exam'
                            />
                            {errors.exam && <p className="text-red-500 text-sm">{errors.exam}</p>}
                        </label>
                    </div>
                    */}
                    <div className="col-span-1 flex justify-center my-2">
                        <Simple text="Add" type="submit" onClick={handleSubmit}/>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CoodCreateCloforExamCard;
