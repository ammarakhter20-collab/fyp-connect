import React, { useState, useEffect, useRef } from 'react';
import Simple from '../../../../../Components/Buttons/Simple';

const CooAddQuestionsCard = (props) => {
    const { savequestionClick, onclose, editQuestion } = props;

    const [question, setQuestion] = useState('');
    const [shortCode, setShortCode] = useState('');
    const [marks, setMarks] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editQuestion) {
            setQuestion(editQuestion.question);
            setShortCode(editQuestion.shortCode);
            setMarks(editQuestion.marks);
        }
    }, [editQuestion]);

    const handleShortCodeChange = e => {
        setShortCode(e.target.value);
        if (errors.shortCode) {
            setErrors(prevErrors => ({ ...prevErrors, shortCode: null }));
        }
    };

    const handleQuestionChange = e => {
        setQuestion(e.target.value);
        if (errors.question) {
            setErrors(prevErrors => ({ ...prevErrors, question: null }));
        }
    };

    const handleMarksChange = e => {
        const value = e.target.value;
        if (value >= 0 && value <= 40) {
            setMarks(value);
            if (errors.marks) {
                setErrors(prevErrors => ({ ...prevErrors, marks: null }));
            }
        }
    };

    const cardRef = useRef(null);

    const handleSubmit = () => {
        const newErrors = {};
        if (!question) newErrors.question = 'Question is required';
        if (!shortCode) newErrors.shortCode = 'Short Code is required';
        if (!marks) newErrors.marks = 'Marks are required';
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
    
        const data = {
            shortCode,
            question,
            marks,
        };
    
        if (editQuestion) {
            data.id = editQuestion._id; // Include the id of the selected question
        }
    
        savequestionClick(data);
        setQuestion('');
        setMarks('');
        setShortCode('');
        onclose();
    };


    return (
        <div
            ref={cardRef}
            className="relative bg-white shadow-md rounded-lg p-6 w-[30%] h-auto z-50"
        >
            <button
                className="absolute top-2 right-2 text-gray-600 focus:outline-none"
                onClick={onclose}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
            <div>
                <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>{editQuestion ? 'Edit Question' : 'Questions for CLO'}</h4>

                <form>
                    <div className="my-4">
                        <label htmlFor='questionShortCode' className="block text-md font-semibold text-gray-700">
                            Short Code
                            <input
                                id='questionShortCode'
                                name='questionShortCode'
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
                        <label htmlFor='question' className="block text-md font-semibold text-gray-700">
                            Question
                            <input
                                id='question'
                                name='question'
                                type="text"
                                value={question}
                                onChange={handleQuestionChange}
                                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 ${errors.question ? 'border-red-500' : ''}`}
                                placeholder='.........................'
                            />
                            {errors.question && <p className="text-red-500 text-sm">{errors.question}</p>}
                        </label>
                    </div>

                    <div className="my-4">
                        <label htmlFor='marks' className="block text-md font-semibold text-gray-700">
                            Marks
                            <input
                                id='marks'
                                name='marks'
                                type="number"
                                value={marks}
                                onChange={handleMarksChange}
                                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5 ${errors.marks ? 'border-red-500' : ''}`}
                                placeholder='Enter Marks'
                            />
                            {errors.marks && <p className="text-red-500 text-sm">{errors.marks}</p>}
                        </label>
                    </div>

                    <div className="col-span-1 flex justify-center my-2">
                        <Simple text={editQuestion ? 'Update' : 'Add'} type="button" onClick={handleSubmit} />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CooAddQuestionsCard;
