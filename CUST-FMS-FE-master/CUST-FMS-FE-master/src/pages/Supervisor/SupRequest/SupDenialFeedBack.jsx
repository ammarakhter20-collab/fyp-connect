import React, { useRef, useEffect, useState, useCallback } from 'react';
import Simple from '../../../Components/Buttons/Simple';

const SupDenialFeedBack = ({ onclose, addFeedbackClick }) => {
    const cardRef = useRef(null);
    const [feedback, setFeedback] = useState('');

    const handleClick2 = () => {
        addFeedbackClick(feedback);
        onclose();
    };



    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto" ref={cardRef}>
            <h4 className='flex justify-center text-indigo-950 font-semibold text-lg py-4'>Add Feedback</h4>

            <div className="my-4 flex-1 flex flex-col">
                <label htmlFor='feedback' className='block text-md font-medium pb-2 text-indigo-950'>
                    Feedback
                </label>
                <textarea
                    id='feedback'
                    name='feedback'
                    className={`mt-1 p-2 border rounded-3xl w-[100%] h-44 border-slate-300 `}
                    placeholder='Write Here'
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
            </div>

            <div className='flex justify-center'>
                <Simple text={'Done'} onClick={handleClick2} />
            </div>

        </div>
    )
}

export default SupDenialFeedBack;
