import React, { useState } from 'react';
import Simple from '../../../Components/Buttons/Simple';
import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary';


const SupFYPChangeReqDetails = (props) => {
    const { data, handleEditDetailsFYPChange, handleGoBack } = props;
    const [title, setTitle] = useState(data.fypTitle);
    const [titleDetail, setTitleDetail] = useState('');
    const [technology, setTechnology] = useState(data.technology);
    const [technologyDetail, setTechnologyDetail] = useState('');

    const handleEditClick = () => {
        const updateddata = {
            fypTitle: title,
            titleDetail: titleDetail,
            technology: technology,
            technologyDetail: technologyDetail
        }
        // Pass the updated values to the parent component
        handleEditDetailsFYPChange(updateddata);
    };
    console.log('Yeh ha data change details', data);

    return (
        <>
            <div className="bg-white shadow-md rounded-lg p-6 w-[100%] h-auto">
                <div className="my-4 flex-1 flex flex-col">
                    <label htmlFor='title' className='block text-md font-medium pb-2 text-indigo-950'>
                        Topic Change Request
                    </label>
                    <input
                        id='title'
                        name='title'
                        className={`mt-1 p-2 border rounded-2xl w-[100%] h-12 border-slate-300 `}
                        placeholder={data.fypTitle}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        id='titleDetail'
                        name='titleDetail'
                        className={`mt-1 p-2 border rounded-2xl w-[100%] h-44 border-slate-300 `}
                        placeholder={`${data.newTopic}\n${data.newDescription}`}
                        value={titleDetail}
                        onChange={(e) => setTitleDetail(e.target.value)}
                    />
                </div>
                <div className="my-4 flex-1 flex flex-col">
                    <label htmlFor='technology' className='block text-md font-medium pb-2 text-indigo-950'>
                        Technology Change Request
                    </label>
                    <input
                        id='technology'
                        name='technology'
                        className={`mt-1 p-2 border rounded-2xl w-[100%] h-12 border-slate-300 `}
                        placeholder={data.technology}
                        value={technology}
                        onChange={(e) => setTechnology(e.target.value)}
                    />
                    <textarea
                        id='technologyDetail'
                        name='technologyDetail'
                        className={`mt-1 p-2 border rounded-2xl w-[100%] h-44 border-slate-300 `}
                        placeholder={`${data.newTechnology}\n${data.newDescription}`}
                        value={technologyDetail}
                        onChange={(e) => setTechnologyDetail(e.target.value)}
                    />
                </div>
                <div className='flex justify-end'>
                    <div className=" mt-2">
                        <Simple text='Edit Details' onClick={handleEditClick} />
                    </div>
                </div>
                <div className='flex flex-row justify-end  mt-5'>
                    <ButbgPrimary text="Back" onClick={handleGoBack} />
                </div>
            </div>
        </>
    );
};

export default SupFYPChangeReqDetails;
