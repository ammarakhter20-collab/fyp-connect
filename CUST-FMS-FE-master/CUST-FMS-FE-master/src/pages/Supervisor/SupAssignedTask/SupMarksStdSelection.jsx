import React, { useRef, useEffect } from 'react';

const SupMarksStdSelection = ({ selectedGroup, onclose, onViewTBClick }) => {
    const cardRef = useRef(null);
    const handleClick1 = () => {
        onclose();
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                handleClick1();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto" ref={cardRef}>
            <div className="mb-4">
                <table className="w-full text-sm text-center border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Registration No.</th>
                            <th className="px-4 py-2">Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedGroup && selectedGroup.map((member, index) => (
                            <tr key={index }>
                                <td className=" px-4 py-2">{member.Name}</td>
                                <td className=" px-4 py-2">{member.RegistrationNo}</td>
                                <td className="px-6 py-3">
                                    <button type="button" onClick={() => onViewTBClick(member.id)}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                                
                </table>
            </div>
        </div>
    );
};

export default SupMarksStdSelection;
