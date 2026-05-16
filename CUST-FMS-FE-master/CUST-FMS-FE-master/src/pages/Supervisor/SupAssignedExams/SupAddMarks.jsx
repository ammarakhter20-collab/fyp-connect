import React, { useState, useRef, useEffect } from 'react';
import Simple from '../../../Components/Buttons/Simple';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';

const AddMarks = ({ selectedGroup, onclose, examWeightage, onAddClick, examData, existingMarksData, isEditable }) => {


    const cardRef = useRef(null);
    const [feedback, setFeedback] = useState(null);
    const [marksData, setMarksData] = useState({});
    const [marksWithoutCLO, setMarksWithoutCLO] = useState({});
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    // Pre-fill form with existing marks data when available
    useEffect(() => {
        if (existingMarksData && existingMarksData.found && selectedGroup) {
            setIsEditMode(true);

            // Pre-fill feedback
            if (existingMarksData.feedback) {
                setFeedback(existingMarksData.feedback);
            }

            // Check if CLO-based or simple marks
            const hasCLO = existingMarksData.students.some(s => s.hasCLOData);

            if (hasCLO) {
                // Pre-fill CLO-based marks
                const prefilledMarksData = {};
                existingMarksData.students.forEach(student => {
                    if (student.cloEvaluations && student.cloEvaluations.length > 0) {
                        prefilledMarksData[student.studentId] = {};
                        student.cloEvaluations.forEach(cloForExam => {
                            if (cloForExam.cloEvaluations) {
                                cloForExam.cloEvaluations.forEach(cloEval => {
                                    if (!prefilledMarksData[student.studentId][cloEval.cloId]) {
                                        prefilledMarksData[student.studentId][cloEval.cloId] = {};
                                    }
                                    if (cloEval.questions) {
                                        cloEval.questions.forEach(q => {
                                            prefilledMarksData[student.studentId][cloEval.cloId][q.questionId] = String(q.marks);
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
                setMarksData(prefilledMarksData);
            } else {
                // Pre-fill simple marks
                const prefilledSimpleMarks = {};
                existingMarksData.students.forEach(student => {
                    prefilledSimpleMarks[student.studentId] = String(student.marks);
                });
                setMarksWithoutCLO(prefilledSimpleMarks);
            }
        } else {
            setIsEditMode(false);
        }
    }, [existingMarksData, selectedGroup]);

    const handleClick1 = () => {
        onclose();
    };


    const handleFeedbackChange = (event) => {
        setFeedback(event.target.value);
    };

    const handleInputChange = (e, studentId, cloId, questionId, maxMarks) => {
        const value = e.target.value;

        if (/[^0-9]/.test(value)) {
            window.alert("Please add valid marks (numbers only).");
            return;
        }
        if (value !== '' && parseInt(value) > maxMarks) {
            window.alert(`Invalid! Marks cannot exceed the total marks (${maxMarks}).`);
            return;
        }

        setMarksData(prevState => ({
            ...prevState,
            [studentId]: {
                ...prevState[studentId],
                [cloId]: {
                    ...prevState[studentId]?.[cloId],
                    [questionId]: value,
                }
            }
        }));
    };

    const handleInputChangeWithoutCLO = (e, studentId, maxMarks) => {
        const value = e.target.value;

        if (/[^0-9]/.test(value)) {
            window.alert("Please add valid marks (numbers only).");
            return;
        }
        if (value !== '' && parseInt(value) > maxMarks) {
            window.alert(`Invalid! Marks cannot exceed the total marks (${maxMarks}).`);
            return;
        }

        setMarksWithoutCLO(prevState => ({
            ...prevState,
            [studentId]: value
        }));
    };

    const handleAddClickwithoutCLO = () => {
        let valid = true;

        for (const studentId in marksWithoutCLO) {
            const value = marksWithoutCLO[studentId];
            if (value === '' || isNaN(parseInt(value)) || parseInt(value) > examWeightage) {
                valid = false;
                break;
            }
        }

        if (valid) {
            const evaluations = Object.keys(marksWithoutCLO).map(studentId => ({
                studentId,
                marks: parseInt(marksWithoutCLO[studentId])
            }));

            onAddClick(evaluations, feedback);
            onclose();
        } else {
            console.log("Form is not valid");
            alert("Please enter valid marks (0-" + examWeightage + ") for all students.");
        }
    };

    const handleAddClick = () => {
        let valid = true;

        for (const studentId in marksData) {
            for (const cloId in marksData[studentId]) {
                for (const questionId in marksData[studentId][cloId]) {
                    const value = marksData[studentId][cloId][questionId];
                    const maxMarks = examData.schedule[0].CreatedExam.CLOForExams.CLOs
                        .find(clo => clo._id === cloId)
                        .Questions.find(question => question._id === questionId)
                        .marks;
                    if (value === null || isNaN(parseInt(value)) || parseInt(value) > maxMarks) {
                        valid = false;
                        break;
                    }
                }
            }
        }

        if (valid) {
            const evaluations = Object.keys(marksData).map(studentId => ({
                studentId,
                evaluations: Object.keys(marksData[studentId]).map(cloId => ({
                    cloForExamId: examData.schedule[0].CreatedExam.CLOForExams._id,
                    cloEvaluations: Object.keys(marksData[studentId][cloId]).map(questionId => ({
                        cloId,
                        questions: [{
                            questionId,
                            marks: parseInt(marksData[studentId][cloId][questionId])
                        }]
                    }))
                }))
            }));

            onAddClick(evaluations, feedback);
            onclose();
        } else {
            console.log("Form is not valid");
            alert("Please enter valid marks for all questions.");
        }
    };

    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (cardRef.current && !cardRef.current.contains(event.target)) {
    //             handleClick1();
    //         }
    //     };

    //     document.addEventListener('mousedown', handleClickOutside);

    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, []);

    const readOnlyBanner = isEditable === false ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
            <p className="font-bold">⚠ Read-Only Mode</p>
            <p>This exam has been completed or the term has expired. Marks cannot be modified.</p>
        </div>
    ) : null;

    const editModeBanner = isEditMode && isEditable !== false ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded">
            <p className="font-bold">✏️ Edit Mode</p>
            <p>Your previously submitted marks are shown below. You can modify and re-submit them.</p>
        </div>
    ) : null;

    const buttonText = isEditMode ? 'Update Marks' : 'Done';

    return (
        <>
            {examData && (
                <div className=''>
                    {readOnlyBanner}
                    {editModeBanner}
                    {(examData.schedule && examData.schedule.length > 0 && examData.schedule[0].CreatedExam.CLOForExams && examData.schedule[0].CreatedExam.CLOForExams.CLOs && examData.schedule[0].CreatedExam.CLOForExams.CLOs.length > 0) ? (
                        <div>
                            {examData.schedule[0].CreatedExam.CLOForExams.CLOs.map((clo, cloIndex) => (
                                <div key={cloIndex} className="content-center bg-white w-full h-full rounded-md pb-8">
                                    <div className="bg-secondary rounded-md flex justify-center h-10 my-5">
                                        <span className='my-auto'>{clo.CLOCode}</span>
                                    </div>
                                    <div className='rounded-md flex justify-start border border-gray-400 h-10 my-5'>
                                        <span className="my-auto text-gray-600 mx-5">
                                            {clo.Title}
                                        </span>
                                    </div>
                                    {clo.Questions.map((question, questionIndex) => (
                                        <div key={questionIndex} className=''>
                                            <div className="flex justify-start h-10 my-5">
                                                <span className='rounded-md text-white bg-primary h-full my-auto w-28 flex items-center px-4'>
                                                    {`${clo.CLOCode} (${question.shortCode}) `}
                                                </span>
                                            </div>
                                            <div className='rounded-md flex justify-start border border-gray-400 h-10 my-5'>
                                                <span className="my-auto text-gray-600 mx-5">
                                                    {question.question}
                                                </span>
                                            </div>
                                            <div className='items-center my-5 w-[40.33%] mx-auto border border-gray-400 border-lg shadow-2xl shadow-gray-600'>
                                                <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>
                                                    {isEditMode ? 'Edit Marks' : 'Assign Marks'}
                                                </h4>
                                                <div className="mb-4">
                                                    <table className="w-full text-center border-collapse text-xs text-indigo-950 uppercase">
                                                        <thead>
                                                            <tr>
                                                                <th className="px-4 py-2">Name</th>
                                                                <th className="px-4 py-2">Registration No.</th>
                                                                <th className="px-4 py-2">Marks</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {selectedGroup && selectedGroup.map((member, memberIndex) => (
                                                                <tr key={memberIndex}>
                                                                    <td className="px-4 py-2">{member.Name}</td>
                                                                    <td className="px-4 py-2">{member.RegistrationNo}</td>
                                                                    <td className="px-6 py-3">
                                                                        {isEditable === false ? (
                                                                            <span className="font-semibold">
                                                                                {marksData[member._id]?.[clo._id]?.[question._id] || '—'}
                                                                            </span>
                                                                        ) : (
                                                                            <input
                                                                                type="text"
                                                                                name={`marks_${member._id}_${clo._id}_${question._id}`}
                                                                                id={`marks_${member._id}_${clo._id}_${question._id}`}
                                                                                className='w-7 border rounded-md bg-gray-50 text-center'
                                                                                value={marksData[member._id]?.[clo._id]?.[question._id] || ''}
                                                                                onChange={(e) => handleInputChange(e, member._id, clo._id, question._id, question.marks)}
                                                                            />
                                                                        )}
                                                                        /{question.marks}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <div className="content-center bg-white w-full">
                                <div className='  mx-auto'>

                                    <span className="text-2xl text-indigo-950 text-left mx-5" >Feedback</span>

                                    <div className=' mx-10'>
                                        <textarea name="feedback"
                                            id="feedback"
                                            className='w-full border border-gray-400 rounded-lg h-24'
                                            value={feedback || ''}
                                            onChange={handleFeedbackChange}
                                            readOnly={isEditable === false}>

                                        </textarea>

                                    </div>
                                </div>
                            </div>

                            {isEditable !== false && (
                                <div className='flex justify-center'>
                                    <Simple text={buttonText} onClick={handleAddClick} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative mx-auto" ref={cardRef}>
                            <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => onclose()}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h4 className='flex justify-center text-indigo-950'>
                                {isEditMode ? 'Edit Marks' : 'Assign Marks'}
                            </h4>
                            {readOnlyBanner}
                            {editModeBanner}
                            <div className="mb-4">
                                <table className="w-full text-center border-collapse text-xs text-indigo-950 uppercase">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2">Name</th>
                                            <th className="px-4 py-2">Registration No.</th>
                                            <th className="px-4 py-2">Marks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedGroup && selectedGroup.map((member, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2">{member.Name}</td>
                                                <td className="px-4 py-2">{member.RegistrationNo}</td>
                                                <td className="px-6 py-3">
                                                    {isEditable === false ? (
                                                        <span className="font-semibold">
                                                            {marksWithoutCLO[member._id] || '—'}
                                                        </span>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            name={`marks_${member._id}`}
                                                            id={`marks_${member._id}`}
                                                            className='w-7 border rounded-md bg-gray-50 text-center'
                                                            value={marksWithoutCLO[member._id] || ''}
                                                            onChange={(e) => handleInputChangeWithoutCLO(e, member._id, examWeightage)}
                                                        />
                                                    )}
                                                    /{examWeightage}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {isEditable !== false && (
                                <div className='flex justify-center'>
                                    <Simple text={buttonText} onClick={handleAddClickwithoutCLO} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default AddMarks;
