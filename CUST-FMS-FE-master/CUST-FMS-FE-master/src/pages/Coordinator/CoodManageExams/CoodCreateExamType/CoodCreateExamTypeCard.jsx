import React, { useState, useRef, useEffect } from 'react';
import Simple from '../../../../Components/Buttons/Simple';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

const CoodCreateExamTypeCard = (props) => {
    const { onclose, saveExamClick, dataToEdit } = props;
    const [examName, setExam] = useState(dataToEdit ? dataToEdit.examName : '');
    const [shortCode, setShortCode] = useState(dataToEdit ? dataToEdit.shortCode : '');
    const [examTypeFor, setExamTypeFor] = useState(dataToEdit ? dataToEdit.examTypeFor : '');
    const [errors, setErrors] = useState({});

    const handleExamChange = (selectedOption) => {
        setExam(selectedOption);
        if (errors.examName) {
            setErrors(prevErrors => ({ ...prevErrors, examName: null }));
        }
    };

    const handleExamTypeForChange = (selectedOption) => {
        setExamTypeFor(selectedOption);
        if (errors.examTypeFor) {
            setErrors(prevErrors => ({ ...prevErrors, examTypeFor: null }));
        }
    };

    const handleShortCodeChange = (e) => {
        setShortCode(e.target.value);
        if (errors.shortCode) {
            setErrors(prevErrors => ({ ...prevErrors, shortCode: null }));
        }
    };

    const cardRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!examName) newErrors.examName = 'Exam Name is required';
        if (!shortCode) newErrors.shortCode = 'Short Code is required';
        if (!examTypeFor) newErrors.examTypeFor = 'Exam Type For is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const data = {
            examName: examName.value,
            shortCode,
            examTypeFor: examTypeFor.value,
        };
        
        saveExamClick(data);
        setExam('');
        setShortCode('');
        setExamTypeFor('');
        onclose();
    };

    return (
        <>
                   

                   <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>

        <div ref={cardRef} className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative z-50">
            <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={onclose}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div className=''>
                <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Exam Type Creation</h4>
                <form>
                    <div className="my-4">
                        <label htmlFor='exam' className="block text-md font-semibold text-gray-700">
                            Exam Name
                            <CreatableSelect
                                id='examDropdown'
                                name='examDropdown'
                                className={`bg-white border ${errors.examName ? 'border-red-500' : 'border-gray-300'} text-black text-sm rounded-2xl block w-full p-2.5`}
                                options={[
                                    { value: 'Orientation', label: 'Orientation' },
                                    { value: 'Proposal', label: 'Proposal' },
                                    { value: 'Mid-I', label: 'Mid-I' },
                                    { value: 'Final-I', label: 'Final-I' },
                                    { value: 'Mid-II', label: 'Mid-II' },
                                    { value: 'Final-II', label: 'Final-II' },
                                    { value: 'Attendance-I', label: 'Attendance-I' },
                                    { value: 'Attendance-II', label: 'Attendance-II' },
                                ]}
                                isSearchable
                                onChange={handleExamChange}
                                value={examName}
                                placeholder='Select or type Exam type'
                            />
                            {errors.examName && <p className="text-red-500 text-sm">{errors.examName}</p>}
                        </label>
                    </div>
                    <div className="my-4">
                        <label htmlFor='examShortCode' className="block text-md font-semibold text-gray-700">
                            Short Code
                            <input
                                id='examShortCode'
                                name='examShortCode'
                                type="text"
                                value={shortCode}
                                onChange={handleShortCodeChange}
                                className={`bg-white border ${errors.shortCode ? 'border-red-500' : 'border-gray-300'} text-black text-sm rounded-2xl block w-full p-2.5`}
                                placeholder='Enter Short Code'
                            />
                            {errors.shortCode && <p className="text-red-500 text-sm">{errors.shortCode}</p>}
                        </label>
                    </div>
                    <div className="my-4">
                        <label htmlFor='examTypeFor' className="block text-md font-semibold text-gray-700">
                            Exam Type For
                            <CreatableSelect
                                id='examTypeFor'
                                name='examTypeFor'
                                className={`bg-white border ${errors.examTypeFor ? 'border-red-500' : 'border-gray-300'} text-black text-sm rounded-2xl block w-full p-2.5`}
                                options={[{ value: 'Supervisor', label: 'Supervisor' }, { value: 'coordinator', label: 'Coordinator' }, { value: 'Student', label: 'Student' }, { value: 'All', label: 'All' }]}
                                isSearchable
                                onChange={handleExamTypeForChange}
                                value={examTypeFor}
                                placeholder='Select or type'
                            />
                            {errors.examTypeFor && <p className="text-red-500 text-sm">{errors.examTypeFor}</p>}
                        </label>
                    </div>
                    <div className="col-span-1 flex justify-center my-2">
                        <Simple text="Add" type="submit" onClick={handleSubmit}/>
                    </div>
                </form>
            </div>
            </div>
        </div>
      
        </>
    );
};

export default CoodCreateExamTypeCard;
