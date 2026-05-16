import React, { useState } from 'react'
import Simple from '../../../../../Components/Buttons/Simple'
const CoodViewCLO = (props) => {
    const { question, onclose } = props

    console.log(question, "Dataaaa Questionnnnnnnnnnnnnnnnnnnnn");

    const [viewQuestion, setViewQuestion] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');

    const handleViewClick = (description) => {
        setSelectedDescription(description);
        setViewQuestion(true);
    };

    const handleCloseView = () => {
        setViewQuestion(false);
        setSelectedDescription('');
    };
    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4 mx-auto">
            <h2 className="text-center font-bold text-xl mb-4">CLOS</h2>
            <div className=''>
                <span className=' font-semibold text-black text-left'>CLOS Description</span>
                <div className='border border-gray-400 w-full h-auto min-h-28 rounded-2xl' >
                    <p className="text-gray-700 text-base p-4">{`${question.description ? question.desccription : question.Title} ( ${question.Title} )`}</p>
                </div>
            </div>
                <span className=' font-semibold text-black text-left '>Assigned Questions</span>
            <table className=' border-gray-600 font-semibold shadow-2xl  text-gray-300 w-full text-center'>
                <thead>
                    <th>
                        SR NO
                    </th>
                    <th>
                        Short Code
                    </th>
                    <th>
                        Description
                    </th>
                </thead>
                <tbody>
                    {question.Questions.map((item, index) => (
                        <tr key={index} className='border-gray-600 text-gray-700 text-base '>
                            <td className='border-gray-600'>{index + 1}</td>
                            <td>{item.shortCode}</td>
                            <td>
                                    <button onClick={() => handleViewClick(item.question)}>View</button>
                                </td>
                        </tr>
                    ))}
                </tbody>


            </table>

            <div className="grid grid-cols-1 mt-5">
                <div className="col-span-1 flex justify-center">
                    {/* Cancel Button color can be adjusted */}
                    <Simple text="Cancel" onClick={onclose} />
                </div>
            </div>

            {viewQuestion && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white shadow-md rounded-lg p-6 w-full sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4 mx-auto max-h-[70vh] overflow-y-auto">
                        <h2 className="text-center font-bold text-xl mb-4">Question Description</h2>
                        <div className='max-h-32 overflow-y-auto'>

                        <p className="text-gray-700 text-base p-4">{selectedDescription}</p>
                        </div>

                        <div className="flex justify-center mt-5">
                            <Simple text="Close" onClick={handleCloseView} bgClass={'bg-gray-400'} />
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}

export default CoodViewCLO
