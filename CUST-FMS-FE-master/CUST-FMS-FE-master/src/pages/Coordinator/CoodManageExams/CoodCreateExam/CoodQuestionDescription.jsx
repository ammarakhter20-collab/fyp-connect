import React, { useState, useRef, useEffect } from 'react';
import Simple from '../../../../Components/Buttons/Simple';
import Select from 'react-select';




const CoodQuestionDescription = (props) => {

    const { onclose, saveCLOAssignment, dataToEdit, optionsData } = props;
    const [description, setDescription] = useState('');
   

      const handleDescriptionChange = e => {
        setDescription(e.target.value);
    };

    const cardRef = useRef(null);
    const handleSubmit = () => {
        saveCLOAssignment(description);
        setDescription('');
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
        <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto" ref={cardRef}>
            <div>
                <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Description</h4>
                <form>
                    <div className="my-4">
                        <label htmlFor='assignCLO' className="block text-md font-semibold text-gray-700">
                        <input
                                id='questionShortCode'
                                name='questionShortCode'
                                type="text"
                                value={description}
                                onChange={handleDescriptionChange}
                                className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full h-24 p-2.5`}
                                // className="border p-4 h-10 border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"
                                placeholder={'Enter CLO'}
                            />
                        </label>
                    </div>
                    <div className="col-span-1 flex justify-center my-2">
                        <Simple text="Add" type="Submit" onClick={handleSubmit} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CoodQuestionDescription;
