import React, { useState, useRef, useEffect } from 'react';
import Simple from '../../../../Components/Buttons/Simple';
import Select from 'react-select';

const CoodExamCreation = ({ onclose, saveExamClick, dataToEdit, examTypes, termData }) => {
    const [term, setTerm] = useState(dataToEdit ? dataToEdit.term : '');
    const [examType, setExamType] = useState(dataToEdit ? dataToEdit.examType : '');
    const [examWeightage, setExamWeightage] = useState(dataToEdit ? dataToEdit.examWeightage : '');
    const [announcedDate, setAnnouncedDate] = useState(dataToEdit ? dataToEdit.announcedDate : '');
    const [reportDeadline, setReportDeadline] = useState(dataToEdit ? dataToEdit.reportDeadline : '');
    const [portalCategory, setPortalCategory] = useState(dataToEdit ? dataToEdit.portalCategory : null);
    const [partStatus, setPartStatus] = useState(dataToEdit ? dataToEdit.partStatus : null);
    const [errors, setErrors] = useState({});

    const portalCategoryOptions = [
        { value: 'Attendance', label: 'Attendance' },
        { value: 'Quiz', label: 'Quiz' },
        { value: 'Midterm', label: 'Midterm' },
        { value: 'Final', label: 'Final' },
        { value: 'Other', label: 'Other/Orientation' }
    ];

    const partStatusOptions = [
        { value: 'Part-I', label: 'Part-I' },
        { value: 'Part-II', label: 'Part-II' },
        { value: 'General', label: 'General' }
    ];

    const handleTermChange = (selectedOption) => {
        setTerm(selectedOption);
        if (errors.term) {
            setErrors(prevErrors => ({ ...prevErrors, term: null }));
        }
    };

    const handleExamTypeChange = (selectedOption) => {
        setExamType(selectedOption);
        if (errors.examType) {
            setErrors(prevErrors => ({ ...prevErrors, examType: null }));
        }
    };

    const handleExamWeightageChange = e => {
        setExamWeightage(e.target.value);
        if (errors.examWeightage) {
            setErrors(prevErrors => ({ ...prevErrors, examWeightage: null }));
        }
    };

    const handleAnnouncedDateChange = e => {
        setAnnouncedDate(e.target.value);
        if (errors.announcedDate) {
            setErrors(prevErrors => ({ ...prevErrors, announcedDate: null }));
        }
    };

    const handleReportDeadlineChange = e => {
        setReportDeadline(e.target.value);
        if (errors.reportDeadline) {
            setErrors(prevErrors => ({ ...prevErrors, reportDeadline: null }));
        }
    };

    const handlePortalCategoryChange = (selectedOption) => {
        setPortalCategory(selectedOption);
        if (errors.portalCategory) {
            setErrors(prevErrors => ({ ...prevErrors, portalCategory: null }));
        }
    };

    const handlePartStatusChange = (selectedOption) => {
        setPartStatus(selectedOption);
        if (errors.partStatus) {
            setErrors(prevErrors => ({ ...prevErrors, partStatus: null }));
        }
    };

    const cardRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!term) newErrors.term = 'Term is required';
        if (!examType) newErrors.examType = 'Exam Type is required';
        if (!examWeightage) newErrors.examWeightage = 'Exam Weightage is required';
        if (!announcedDate) newErrors.announcedDate = 'Announced Date is required';
        if (!reportDeadline) newErrors.reportDeadline = 'Report Deadline is required';
        if (!portalCategory) newErrors.portalCategory = 'Portal Category is required';
        if (!partStatus) newErrors.partStatus = 'Part Status is required';

        if (Object.keys(newErrors).length > 0) {
            console.log("Form Validation Errors:", newErrors);
            setErrors(newErrors);
            return;
        }

        const data = {
            Term: term.value,
            ExamType: examType.value,
            ExamWeightage: examWeightage,
            AnnouncedDate: announcedDate,
            ReportDeadline: reportDeadline,
            portalCategory: portalCategory.value,
            partStatus: partStatus.value
        };

        console.log("Submitting Exam Data:", data);
        saveExamClick(data);
        setTerm('');
        setExamType('');
        setExamWeightage('');
        setAnnouncedDate('');
        setReportDeadline('');
        onclose();
    };


    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0];

    return (
        <div ref={cardRef} className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative">
            <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={onclose}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div>
                <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Exam Creation </h4>
                <form onSubmit={handleSubmit}>
                    <div className="my-4">
                        <label htmlFor='term' className="block text-md font-semibold text-gray-700">Term
                            <Select
                                id='term'
                                name='term'
                                className={`bg-white border ${errors.term ? 'border-red-500' : 'border-gray-300'} text-black text-sm rounded-2xl block w-full p-2.5`}
                                options={termData}
                                isSearchable
                                onChange={handleTermChange}
                                value={term}
                                placeholder='Select or type'
                            />
                            {errors.term && <p className="text-red-500 text-sm">{errors.term}</p>}
                        </label>
                    </div>
                    <div className="my-4">
                        <label htmlFor='examType' className="block text-md font-semibold text-gray-700">Exam Type
                            <Select
                                id='examType'
                                name='examType'
                                className={`bg-white border ${errors.examType ? 'border-red-500' : 'border-gray-300'} text-black text-sm rounded-2xl block w-full p-2.5`}
                                options={examTypes}
                                isSearchable
                                onChange={handleExamTypeChange}
                                value={examType}
                                placeholder='Select or type'
                            />
                            {errors.examType && <p className="text-red-500 text-sm">{errors.examType}</p>}
                        </label>
                    </div>
                    <div className="my-4">
                        <label htmlFor='examWeightage' className="block text-md font-semibold text-gray-700">Exam Weightage
                            <input
                                id='examWeightage'
                                name='examWeightage'
                                type="number"
                                min="0"
                                max="50"
                                value={examWeightage}
                                onChange={handleExamWeightageChange}
                                className={`bg-white border ${errors.examWeightage ? 'border-red-500' : 'border-gray-300'} text-black text-sm rounded-2xl block w-full p-2.5`}
                                placeholder='Enter Exam Weightage'
                            />
                            {errors.examWeightage && <p className="text-red-500 text-sm">{errors.examWeightage}</p>}
                        </label>
                    </div>
                    <div className="my-4">
                        <label htmlFor='announcedDate' className="block text-md font-semibold text-gray-700">Announced Date
                            <input
                                id='announcedDate'
                                name='announcedDate'
                                type="date"
                                value={announcedDate}
                                min={currentDate}
                                onChange={handleAnnouncedDateChange}
                                className={`bg-white border ${errors.announcedDate ? 'border-red-500' : 'border-gray-300'} text-black text-sm rounded-2xl block w-full p-2.5`}
                                placeholder='Enter Announced Date'
                            />
                            {errors.announcedDate && <p className="text-red-500 text-sm">{errors.announcedDate}</p>}
                        </label>
                    </div>
                    <div className="my-4">
                        <label htmlFor='reportDeadline' className="block text-md font-semibold text-gray-700">Report Submission Deadline
                            <input
                                id='reportDeadline'
                                name='reportDeadline'
                                type="date"
                                value={reportDeadline}
                                min={announcedDate || currentDate}
                                onChange={handleReportDeadlineChange}
                                className={`bg-white border ${errors.reportDeadline ? 'border-red-500' : 'border-gray-300'} text-black text-sm rounded-2xl block w-full p-2.5`}
                                placeholder='Enter Report Deadline'
                            />
                            {errors.reportDeadline && <p className="text-red-500 text-sm">{errors.reportDeadline}</p>}
                        </label>
                    </div>
                    <div className="my-4">
                        <label htmlFor='portalCategory' className="block text-md font-semibold text-gray-700">Portal Category
                            <Select
                                id='portalCategory'
                                name='portalCategory'
                                className={`bg-white border ${errors.portalCategory ? 'border-red-500' : 'border-gray-300'} text-black text-sm rounded-2xl block w-full p-2.5`}
                                options={portalCategoryOptions}
                                onChange={handlePortalCategoryChange}
                                value={portalCategory}
                                placeholder='Select Category'
                            />
                            {errors.portalCategory && <p className="text-red-500 text-sm">{errors.portalCategory}</p>}
                        </label>
                    </div>
                    <div className="my-4">
                        <label htmlFor='partStatus' className="block text-md font-semibold text-gray-700">Part Status
                            <Select
                                id='partStatus'
                                name='partStatus'
                                className={`bg-white border ${errors.partStatus ? 'border-red-500' : 'border-gray-300'} text-black text-sm rounded-2xl block w-full p-2.5`}
                                options={partStatusOptions}
                                onChange={handlePartStatusChange}
                                value={partStatus}
                                placeholder='Select Part'
                            />
                            {errors.partStatus && <p className="text-red-500 text-sm">{errors.partStatus}</p>}
                        </label>
                    </div>
                    <div className="col-span-1 flex justify-center my-2">
                        <Simple text="Add" type="submit" onClick={handleSubmit}/>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CoodExamCreation;
