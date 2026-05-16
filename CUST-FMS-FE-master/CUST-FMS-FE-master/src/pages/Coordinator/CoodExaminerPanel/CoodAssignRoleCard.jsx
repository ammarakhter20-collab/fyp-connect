import React, { useState, useEffect, useRef } from 'react';
import Simple from '../../../Components/Buttons/Simple';

const CoodAssignRoleCard = ({ onclose, saveRoleAssignment, panelData }) => {
    const [selectedPanelHead, setSelectedPanelHead] = useState(null);
    const [updatedPanelData, setUpdatedPanelData] = useState(panelData);

    useEffect(() => {
        // Set initial roles from panelData
        const initialPanelHeadIndex = panelData.findIndex(member => member.role === 'Panel Head');
        if (initialPanelHeadIndex !== -1) {
            setSelectedPanelHead(initialPanelHeadIndex);
        }
    }, [panelData]);

    const handleRoleChange = (index) => {
        const newPanelData = updatedPanelData.map((member, i) => ({
            ...member,
            role: i === index ? 'Panel Head' : 'Examiner'
        }));
        setUpdatedPanelData(newPanelData);
        setSelectedPanelHead(index);
    };

    const cardRef = useRef(null);

    const handleSubmit = () => {
        if (selectedPanelHead !== null) {
            // Send ALL members with their updated roles
            // This ensures the old Panel Head gets demoted to Examiner
            updatedPanelData.forEach((member) => {
                saveRoleAssignment(member);
            });
            onclose();
        } else {
            alert('Please select a Panel Head.');
        }
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
        <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto" ref={cardRef}>
            <div>
                <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Assign Role</h4>
                <form>
                    <table className="w-full text-center bg-white">
                        <thead>
                            <tr>
                                <th className="py-2">Name</th>
                                <th className="py-2">Current Role</th>
                                <th className="py-2">Panel Head</th>
                            </tr>
                        </thead>
                        <tbody>
                            {updatedPanelData.map((member, index) => (
                                <tr key={member._id}>
                                    <td className="py-2">{member.member}</td>
                                    <td className="py-2">{member.role}</td>
                                    <td className="py-2">
                                        <input
                                            type="radio"
                                            name="panelHead"
                                            checked={selectedPanelHead === index}
                                            onChange={() => handleRoleChange(index)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="col-span-1 flex justify-center my-2">
                        <Simple text="Save" type="button" onClick={handleSubmit} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CoodAssignRoleCard;
