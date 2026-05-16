import React, { useState, useEffect } from 'react';
import Simple from '../../../../../Components/Buttons/Simple';

const AssignCLOs = ({ CLOs, handleAssignCLOs, onClose }) => {
    const [selectedCLOs, setSelectedCLOs] = useState([]);
    const [viewCLO, setViewCLO] = useState(null); // State for the CLO to be viewed

    console.log(CLOs, "toViewwwwwwwwwwwwwwwwwwwwww")

    useEffect(() => {
        console.log("Initial selectedCLOs:", selectedCLOs);
    }, []);

    const handleCheckboxChange = (_id) => {
        setSelectedCLOs((prevSelected) => {
            const newSelected = prevSelected.includes(_id)
                ? prevSelected.filter((id) => id !== _id)
                : [...prevSelected, _id];

            console.log("Updated selectedCLOs:", newSelected);
            return newSelected;
        });
    };

    const handleSave = () => {
        console.log("Saving selected CLOs:", selectedCLOs);
        handleAssignCLOs(selectedCLOs);
        onClose();
    };

    const handleCancelClick = () => {
        onClose();
    };

    const handleViewClick = (clo) => {
        setViewCLO(clo); // Set the CLO to be viewed
    };

    const handleCloseView = () => {
        setViewCLO(null); // Close the view popup
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-full sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4 mx-auto">
            <h2 className="text-center font-bold text-xl mb-4">Assign CLOs</h2>

            <table className="w-full shadow-2xl text-sm text-center mt-4">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2">CLO ShortCode</th>
                        <th className="px-4 py-2">Description</th>
                        <th className="px-4 py-2">Select</th>
                    </tr>
                </thead>
                <tbody>
                    {CLOs.map((clo) => (
                        <tr key={clo._id}>
                            <td className="px-4 py-2">{clo.CLOCode}</td>
                            <td className="px-4 py-2">
                                <button onClick={() => handleViewClick(clo)}>View</button>
                            </td>
                            <td className="px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={selectedCLOs.includes(clo._id)}
                                    onChange={() => handleCheckboxChange(clo._id)}
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

            {viewCLO && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white shadow-md rounded-lg p-6 w-full sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4 mx-auto">
                        <h2 className="text-center font-bold text-xl mb-4">CLO Details</h2>
                        <div className='max-h-40 overflow-y-auto'>
                        <p><strong>Title:</strong>{viewCLO.Title}</p>
                        </div>
                        <div className="flex justify-center mt-5">
                            <Simple text="Close" onClick={handleCloseView} bgClass={'bg-gray-400'} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignCLOs;
