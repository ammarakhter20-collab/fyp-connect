import React, { useRef, useEffect, useState, useCallback } from 'react';
import Simple from '../../../Components/Buttons/Simple';

const SupEditFYP = ({ onclose, onAddClick }) => {
    const [fypTopic, setFYPtopic] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const cardRef = useRef(null);

    // const handleClick1 = () => {
    //     onclose();
    // };

    const handleUpdateClick = () => {
        const updatedTopic = {
            category,
            topic: fypTopic,
            description,
        };
        onAddClick(updatedTopic);
        setFYPtopic('');
        setDescription('');
        setCategory('');
        onclose();
    };

    // useEffect(() => {
        
    //     const handleClickOutside = (event) => {
    //         if (cardRef.current && !cardRef.current.contains(event.target)) {
    //             handleClick1();
    //         }
    //     };

    //     document.addEventListener('mousedown', handleClickOutside);

    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, []);


    const handleClick1 = useCallback(() => {
        onclose();
      }, [onclose]);
    
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
      }, [handleClick1]);

    return (
        <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto" ref={cardRef}>
            <h4 className='flex justify-center text-indigo-950 font-semibold text-lg py-4'>Edit Topic Details</h4>

            <div className="my-4 flex-1 flex flex-col">
                <div className="">
                    <form action="" method="post">
                        <label htmlFor='category' className='block text-md font-medium py-2 text-indigo-950'>
                            Add Category
                        </label>
                        <input
                            type='text'
                            id='category'
                            name='category'
                            className={`mt-1 p-2 border rounded-lg w-[100%]  border-slate-300 `}
                            placeholder='Category'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                        <label htmlFor='fyptopic' className='block text-md font-medium py-2 text-indigo-950'>
                            Add FYP Topic
                        </label>
                        <input
                            type='text'
                            id='fyptopic'
                            name='fyptopic'
                            className={`mt-1 p-2 border rounded-lg w-[100%]  border-slate-300 `}
                            placeholder='Add FYP Topic'
                            value={fypTopic}
                            onChange={(e) => setFYPtopic(e.target.value)}
                        />
                        <label htmlFor='description' className='block text-md font-medium py-2 text-indigo-950'>
                            Description
                        </label>
                        <textarea
                            id='description'
                            name='description'
                            className={`mt-1 p-2 border rounded-lg w-[100%] h-24 border-slate-300 `}
                            placeholder='Write Here'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </form>
                </div>
            </div>
            <div className='flex justify-center'>
                <Simple text={'Update'} onClick={handleUpdateClick} />
            </div>
        </div>
    );
};

export default SupEditFYP;















// import React, { useRef, useEffect, useState } from 'react';
// import Simple from '../../../Components/Buttons/Simple';

// const SupEditFYP = ({ onclose, onAddClick }) => {
//     const [fypTopic, setFYPtopic] = useState('');
//     const [description, setDescription] = useState('');
//     const [category, setCategory] = useState('');
//     const [technology, setTechnology] = useState('');
//     const [platform, setPlatform] = useState('');
//     const cardRef = useRef(null);

//     const handleClick1 = () => {
//         onclose();
//     };

//     const handleUpdateClick = () => {
//         const updatedTopic = {
//             category,
//             topic: fypTopic,
//             description,
//             technology,
//             platform,
//         };
//         onAddClick(updatedTopic);
//         setFYPtopic('');
//         setDescription('');
//         setCategory('');
//         setTechnology('');
//         setPlatform('');
//         onclose();
//     };

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (cardRef.current && !cardRef.current.contains(event.target)) {
//                 handleClick1();
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);

//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     return (
//         <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto" ref={cardRef}>
//             <h4 className='flex justify-center text-indigo-950 font-semibold text-lg py-4'>Edit Topic Details</h4>

//             <div className="my-4 flex-1 flex flex-col">
//                 <div className="">
//                     <form action="" method="post">
//                         <label htmlFor='category' className='block text-md font-medium py-2 text-indigo-950'>
//                             Add Category
//                         </label>
//                         <input
//                             type='text'
//                             id='category'
//                             name='category'
//                             className={`mt-1 p-2 border rounded-lg w-[100%]  border-slate-300 `}
//                             placeholder='Category'
//                             value={category}
//                             onChange={(e) => setCategory(e.target.value)}
//                         />
//                         <label htmlFor='fyptopic' className='block text-md font-medium py-2 text-indigo-950'>
//                             Add FYP Topic
//                         </label>
//                         <input
//                             type='text'
//                             id='fyptopic'
//                             name='fyptopic'
//                             className={`mt-1 p-2 border rounded-lg w-[100%]  border-slate-300 `}
//                             placeholder='Add FYP Topic'
//                             value={fypTopic}
//                             onChange={(e) => setFYPtopic(e.target.value)}
//                         />
//                         <label htmlFor='description' className='block text-md font-medium py-2 text-indigo-950'>
//                             Description
//                         </label>
//                         <textarea
//                             id='description'
//                             name='description'
//                             className={`mt-1 p-2 border rounded-lg w-[100%] h-24 border-slate-300 `}
//                             placeholder='Write Here'
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                         />
//                         <label htmlFor='technology' className='block text-md font-medium py-2 text-indigo-950'>
//                             Technology
//                         </label>
//                         <input
//                             type='text'
//                             id='technology'
//                             name='technology'
//                             className={`mt-1 p-2 border rounded-lg w-[100%]  border-slate-300 `}
//                             placeholder='Technology'
//                             value={technology}
//                             onChange={(e) => setTechnology(e.target.value)}
//                         />
//                         <label htmlFor='platform' className='block text-md font-medium py-2 text-indigo-950'>
//                             Platform
//                         </label>
//                         <input
//                             type='text'
//                             id='platform'
//                             name='platform'
//                             className={`mt-1 p-2 border rounded-lg w-[100%]  border-slate-300 `}
//                             placeholder='Platform'
//                             value={platform}
//                             onChange={(e) => setPlatform(e.target.value)}
//                         />
//                     </form>
//                 </div>
//             </div>
//             <div className='flex justify-center'>
//                 <Simple text={'Update'} onClick={handleUpdateClick} />
//             </div>
//         </div>
//     );
// };

// export default SupEditFYP;
