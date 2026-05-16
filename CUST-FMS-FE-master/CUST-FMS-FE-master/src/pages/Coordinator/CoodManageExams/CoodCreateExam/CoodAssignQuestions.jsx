import React, { useState, useRef, useEffect } from 'react';
import Simple from '../../../../Components/Buttons/Simple';
import Select from 'react-select';

const CoodAssignQuestions = (props) => {
    const { onclose, saveCLOAssignment, dataToEdit, optionsData } = props;
    const [selectedQuestions, setSelectedQuestions] = useState({});

    const handleQuestionChange = (question) => {
        setSelectedQuestions({
            ...selectedQuestions,
            [question]: !selectedQuestions[question]
        });
    };

    const cardRef = useRef(null);
    const handleSubmit = () => {
        const selected = Object.keys(selectedQuestions).filter(question => selectedQuestions[question]);
        saveCLOAssignment(selected);
        setSelectedQuestions({});
        onclose();
    };

    const handleClickOutside = (event) => {
        if (cardRef.current && !cardRef.current.contains(event.target)) {
            onclose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto " ref={cardRef}>
            <div>
                <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Assign Questions</h4>
                {optionsData && (<div className=''>
                    <table className=' border box-border shadow-lg w-full text-center' >
                        <thead>
                            <tr>
                                <th>Questions</th>
                                <th>Select</th>
                            </tr>
                        </thead>
                        <tbody className='text-center text-sm font-semibold '>
                            {optionsData.questions.map((question, index) => (
                                <tr key={index}>
                                    <td>{question.shortCode}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedQuestions[question] || false}
                                            onChange={() => handleQuestionChange(question)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>)}
                <div className="col-span-1 flex justify-center my-2">
                    <Simple text="Add" type="Submit" onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
};

export default CoodAssignQuestions;
