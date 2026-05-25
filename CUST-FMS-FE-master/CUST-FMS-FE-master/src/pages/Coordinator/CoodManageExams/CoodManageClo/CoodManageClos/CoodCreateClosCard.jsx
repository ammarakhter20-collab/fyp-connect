import React, { useState, useRef, useEffect } from 'react';
import Simple from '../../../../../Components/Buttons/Simple';
import Select from 'react-select';

const CoodCreateClosCard = (props) => {
    const { onclose, saveCloClick, programs, departments } = props;
    const [clo, setClo] = useState('');
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [program, setProgram] = useState('');
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [errors, setErrors] = useState({});

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
                // department field can be a populated object or a string ID
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

    const handleTitleChange = e => {
        setTitle(e.target.value);
        if (errors.title) {
            setErrors(prevErrors => ({ ...prevErrors, title: null }));
        }
    };

    const handleCloChange = e => {
        setClo(e.target.value);
        if (errors.clo) {
            setErrors(prevErrors => ({ ...prevErrors, clo: null }));
        }
    };

    const cardRef = useRef(null);

    const handleSubmit = () => {
        const newErrors = {};
        if (!clo) newErrors.clo = 'CLO is required';
        if (!title) newErrors.title = 'Title is required';
        if (!department) newErrors.department = 'Department is required';
        if (!program) newErrors.program = 'Program is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const data = {
            clo,
            title,
            program,
        };

        saveCloClick(data);
        setClo('');
        setDepartment('');
        setProgram('');
        setTitle('');
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
                <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Create CLOs</h4>

                <form>
                    <div className="my-4">
                        <label htmlFor='clo' className="block text-md font-semibold text-gray-700">Short Code
                            <input
                                id='clo'
                                name='clo'
                                type="text"
                                value={clo}
                                onChange={handleCloChange}
                                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 ${errors.clo ? 'border-red-500' : ''}`}
                                placeholder='Enter CLO'
                            />
                            {errors.clo && <p className="text-red-500 text-sm">{errors.clo}</p>}
                        </label>
                    </div>

                    <div className="my-4">
                        <label htmlFor='title' className="block text-md font-semibold text-gray-700">Title
                            <input
                                id='title'
                                name='title'
                                type="text"
                                value={title}
                                onChange={handleTitleChange}
                                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 ${errors.title ? 'border-red-500' : ''}`}
                                placeholder='Enter Title'
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                        </label>
                    </div>

                    <div className="my-4">
                        <label htmlFor='department' className="block text-md font-semibold text-gray-700">Department
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
                        <label htmlFor='program' className="block text-md font-semibold text-gray-700">Program
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

                    <div className="col-span-1 flex justify-center my-2">
                        <Simple text="Add" type="button" onClick={handleSubmit} />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CoodCreateClosCard;
