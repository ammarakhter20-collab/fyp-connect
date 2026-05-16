import React, { useState, useEffect } from 'react';
import Simple from '../../../../../Components/Buttons/Simple';

const AssignQuestions = ({ questions, cloId, handleAssignQuestions, onClose }) => {
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    useEffect(() => {
        console.log("Initial selectedQuestions:", selectedQuestions);
    }, []);

    const handleCheckboxChange = (_id) => {
        setSelectedQuestions((prevSelected) => {
            const newSelected = prevSelected.includes(_id)
                ? prevSelected.filter((id) => id !== _id)
                : [...prevSelected, _id];
            console.log("Updated selectedQuestions:", newSelected);
            return newSelected;
        });
    };

    const handleSave = () => {
        console.log("Saving selected questions for CLO:", cloId, selectedQuestions);
        handleAssignQuestions(selectedQuestions);
        onClose();
    };

    const handleCancelClick = () => {
        onClose();
    };

    const handleViewClick = (question) => {
        setCurrentQuestion(question);
        setShowDescriptionPopup(true);
    };

    const handleCloseDescriptionPopup = () => {
        setShowDescriptionPopup(false);
        setCurrentQuestion(null);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4 mx-auto">
            <h2 className="text-center font-bold text-xl mb-4">Assign Questions</h2>

            <table className="w-full shadow-2xl text-sm text-center mt-4">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2">Q ShortCode</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Select</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((question) => (
                        <tr key={question._id}>
                            <td className="px-4 py-2">{question.shortCode}</td>
                            <td className="px-4 py-2">
                                <button onClick={() => handleViewClick(question)}>View</button>
                            </td>
                            <td className="px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={selectedQuestions.includes(question._id)}
                                    onChange={() => handleCheckboxChange(question._id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="grid grid-cols-2 mt-5">
                <div className="col-span-1 flex justify-center">
                    <Simple text="Cancel" onClick={handleCancelClick} bgClass={'bg-gray-400'} />
                </div>
                <div className="col-span-1 flex justify-center">
                    <Simple text="Save" type="Submit" onClick={handleSave} />
                </div>
            </div>

            {showDescriptionPopup && currentQuestion && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white shadow-md rounded-lg p-6 w-full sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4 mx-auto">
                        <h2 className="text-center font-bold text-xl mb-4">Description</h2>
                        <div className='h-48 overflow-y-auto'>
                            <p className="text-gray-700 text-base p-4">{currentQuestion.question}</p>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Simple text="Close" onClick={handleCloseDescriptionPopup} bgClass={'bg-gray-400'} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignQuestions;
