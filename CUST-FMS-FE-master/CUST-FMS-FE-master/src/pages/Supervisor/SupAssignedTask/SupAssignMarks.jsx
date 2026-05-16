import React, { useState, useRef, useEffect } from 'react';
import Simple from '../../../Components/Buttons/Simple';

const SupAssignMarks = ({ selectedGroup, onclose, onAddClick }) => {
    const cardRef = useRef(null);
    const [marks, setMarks] = useState({});
    const handleClick1 = () => {
        onclose();
    };

    const handleAddClick = () => {
        onAddClick(marks);
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

    const handleMarksChange = (name, id, value) => {
        const updatedMarks = {
            id: id,
            name: name,
            marks: value,
        };

        setMarks(prevMarks => ({
            ...prevMarks,
            [id]: updatedMarks,
        }));
    };


    return (
        <div className="bg-white shadow-md rounded-lg font-semibold p-6 w-[30%] h-auto" ref={cardRef}>
            <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Assign Marks</h4>
            <div className="mb-4">
                <table className="w-full text-center border-collapse text-xs text-indigo-950 uppercase">
                    <thead className="">
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Registration No.</th>
                            <th className="px-4 py-2">Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedGroup && selectedGroup.members.map((member, index) => (
                            <tr key={index}>
                                <td className=" px-4 py-2">{member.Name}</td>
                                <td className=" px-4 py-2">{member.RegistrationNo}</td>
                                <td className="px-6 py-3">
                                    <label htmlFor={`marks-${index}`}>
                                        <input
                                            type="text"
                                            id={`marks-${index}`}
                                            name={`marks-${index}`}
                                            className='w-7 border rounded-md bg-gray-50'
                                            value={marks[member.id]?.marks || ''}
                                            onChange={(e) => handleMarksChange(member.Name, member.id, e.target.value)}
                                        />
                                        /10
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='flex justify-center'>
                <Simple text={'Add'} onClick={handleAddClick} />
            </div>
        </div>
    );
};

export default SupAssignMarks;
