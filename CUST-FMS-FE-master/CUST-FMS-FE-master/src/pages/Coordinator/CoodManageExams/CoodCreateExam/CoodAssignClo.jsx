import React, { useState, useRef, useEffect } from 'react';
import Simple from '../../../../Components/Buttons/Simple';
import Select from 'react-select';

const CoodAssignClo = (props) => {
    const { onclose, saveCLOAssignment, dataToEdit, optionsData } = props;

    const [assignedClo, setassignedClo] = useState('');

    const handleCloAssignment = (selectedOption) => {
        setassignedClo(selectedOption);
    };

    const cardRef = useRef(null);
    const handleSubmit = () => {
        saveCLOAssignment(assignedClo.value);
        setassignedClo('');
        onclose();
    };

  

    // Map optionsData to the format expected by react-select
    const formattedOptions = optionsData.map((option) => ({
        label: option.shortCode,
        value: option._id
    }));

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative" ref={cardRef}>
            <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={onclose}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div>
                <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Assign CLO</h4>
                <form>
                    <div className="my-4">
                        <label htmlFor='assignCLO' className="block text-md font-semibold text-gray-700">Assign CLO
                            <Select
                                id='assignCLO'
                                name='assignCLO'
                                className="bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5"
                                options={formattedOptions}
                                isSearchable
                                onChange={handleCloAssignment}
                                value={assignedClo}
                                placeholder='Select or type'
                            />
                        </label>
                    </div>
                    <div className="col-span-1 flex justify-center my-2">
                        <Simple text="Add" type="button" onClick={handleSubmit} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CoodAssignClo;
