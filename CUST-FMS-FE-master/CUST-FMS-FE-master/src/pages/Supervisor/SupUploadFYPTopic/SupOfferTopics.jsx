// import React, { useEffect, useState } from 'react';
// import Select from 'react-select';
// import Simple from '../../../Components/Buttons/Simple';
// import FilterButton from '../../../Components/Buttons/FilterButton';
// const SupOfferTopics = ({ OfferedTopics, addButtonClick }) => {
//     const [domain, setDomain] = useState('');
//     const [fypTopic, setFYPtopic] = useState('');
//     const [description, setDescription] = useState('');
//     const [category, setCategory] = useState(null);
//     const [filteredTopics, setFilteredTopics] = useState(OfferedTopics);
//     const [selectedCheckbox, setSelectedCheckbox] = useState(null);
//     const [offeredCategories, setOfferedCategories ] = useState([]);
//     const handleCheckboxSelect = (index) => {
//         setSelectedCheckbox(index === selectedCheckbox ? null : index);
//     };





//     const handleFilterClick = (category) => {
//         if (category) {
//             const flatTopics = OfferedTopics.flatMap(topics => topics.topics);
//             const filteredData = flatTopics.filter(item => item.category === category.label);
//             setFilteredTopics(filteredData);
//         } else {
//             const flatTopics = OfferedTopics.flatMap(topics => topics.topics);
//             setFilteredTopics(flatTopics);
//         }
//         console.log('filtered category:', category);
//     };

//     let serialNum = 1;

//     function handleCategoryChange(selectedOption) {
//         setCategory(selectedOption.label);
//     }

//     function handleSaveClick() {
//         const topic = {
//             category: category,
//             topic: fypTopic,
//             description: description
//         };
//         addButtonClick(topic);

//         console.log('Category:', category);
//         console.log('FYP Topic:', fypTopic);
//         console.log('Description:', description);
//         setCategory('');
//         setFYPtopic('');
//         setDescription('');
//     }
//     const handleTopicSelect = (selectedTopic) => {
//         setCategory(selectedTopic.category);
//         setFYPtopic(selectedTopic.topic);
//         setDescription(selectedTopic.description);
//     };

//     useEffect( () => {
//         const flatTopics = OfferedTopics.flatMap(topics => topics.topics);
//         setFilteredTopics(flatTopics);

//         const cats = [...new Set(OfferedTopics.flatMap(item => item.topics.map(topic => topic.category)))].map((cat, index) => ({
//             value: index + 1,
//             label: cat
//           }));
//           setOfferedCategories(cats);

//     },[OfferedTopics])



//     return (
//         <>
//             <div>
//                 <div className='grid grid-cols-5'>
//                     <div className="col-span-2">
//                         <form action="" method="post">

//                               <label htmlFor='domainDropDown' className='block text-sm font-medium text-indigo-950 '>
//                                 Category
//                             </label>
//                             <input
//                               id='category'
//                               name='category'
//                               className={`mt-1 p-2 border rounded-md w-[100%]  border-slate-300 `}
//                               placeholder='Add Category'
//                                 type="text"
//                                 value={category}
//                                 onChange={(e) => setCategory(e.target.value)}
//                             />
//                             <label htmlFor='fyptopic' className='block text-sm font-medium text-indigo-950 '>
//                                 FYP Topic
//                             </label>
//                             <input
//                                 type='text'
//                                 id='fyptopic'
//                                 name='fyptopic'
//                                 className={`mt-1 p-2 border rounded-md w-[100%]  border-slate-300 `}
//                                 placeholder='Add FYP Topic'
//                                 value={fypTopic}
//                                 onChange={(e) => setFYPtopic(e.target.value)}
//                             />
//                             <label htmlFor='description' className='block text-sm font-medium text-indigo-950'>
//                                 Description
//                             </label>
//                             <textarea
//                                 id='description'
//                                 name='description'
//                                 className={`mt-1 p-2 border rounded-md w-[100%] h-24 border-slate-300 `}
//                                 placeholder='Write Here'
//                                 value={description}
//                                 onChange={(e) => setDescription(e.target.value)}
//                             />
//                             <div className='flex justify-end'>
//                                 <Simple text={"Add"} onClick={handleSaveClick} />
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//                 <div className="col-span-2">
//                     <div className="my-4 mx-4">
//                         <span className='text-indigo-950 font-semibold text-2xl '>
//                             Select FYP topic to offer
//                         </span>
//                     </div>
//                     <div className='flex justify-end'>
//                         <div className=" my-5 mr-2">
//                             <FilterButton text={'Filter'} onClick={handleFilterClick} dropdownOptions={offeredCategories} />
//                         </div>
//                     </div>
//                     <div className="relative overflow-x-auto max-h-96 shadow-md sm:rounded-lg">
//                         <table className="w-full table-fixed text-center text-sm text-gray-500 bg-white">
//                             <thead>
//                                 <tr>
//                                     <th className="px-6 md:px-3 py-4 font-semibold text-indigo-950">Sr. no</th>
//                                     <th className="px-6 md:px-3 py-4 font-semibold text-indigo-950">FYP Title</th>
//                                     <th className="px-6 md:px-3 py-4 font-semibold text-indigo-950">Category</th>
//                                     <th className="px-6 md:px-3 py-4 font-semibold text-indigo-950">Select</th>
//                                 </tr>
//                             </thead>
//                             <tbody className='text-center'>
//                                 {filteredTopics && filteredTopics.map((topic, topicIndex) => {

//                                     return (
//                                         <tr key={`${topicIndex}`} className="bg-white border-b hover:bg-gray-50" onClick={() => handleTopicSelect(topic)}>
//                                             <td className="px-6 md:px-3 py-4">{serialNum++}</td>
//                                             <td className="px-6 md:px-3 py-4">{topic.topic}</td>
//                                             <td className="px-6 md:px-3 py-4">{topic.category}</td>
//                                             <td className="px-6 md:px-3 py-4">
//                                                 <input type="checkbox" id={`checkbox-${topicIndex}`}
//                                                     checked={selectedCheckbox === topicIndex}
//                                                     onChange={() => handleCheckboxSelect(topicIndex)}
//                                                     className="form-checkbox h-5 w-5 text-indigo-600" />
//                                                 <label htmlFor={`checkbox-${topicIndex}`}></label>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default SupOfferTopics












import React, { useEffect, useState } from 'react';
import Simple from '../../../Components/Buttons/Simple';
import FilterButton from '../../../Components/Buttons/FilterButton';

const SupOfferTopics = ({ OfferedTopics, addButtonClick }) => {
    const [fypTopic, setFYPtopic] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [filteredTopics, setFilteredTopics] = useState([]);
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    const [offeredCategories, setOfferedCategories] = useState([]);
    const [errors, setErrors] = useState({
        category: '',
        fypTopic: '',
        description: ''
    });

    const handleCheckboxSelect = (index) => {
        setSelectedCheckbox(index === selectedCheckbox ? null : index);
    };

    const handleFilterClick = (category) => {
        if (category) {
            const flatTopics = OfferedTopics.flatMap(topics => topics.topics);
            const filteredData = flatTopics.filter(item => item.category === category.label);
            setFilteredTopics(filteredData);
        } else {
            const flatTopics = OfferedTopics.flatMap(topics => topics.topics);
            setFilteredTopics(flatTopics);
        }
        console.log('filtered category:', category);
    };

    let serialNum = 1;

    // function handleCategoryChange(selectedOption) {
    //     setCategory(selectedOption.label);
    // }

    function validateFields() {
        const errors = {
            category: category ? '' : 'Category is required',
            fypTopic: fypTopic ? '' : 'FYP Topic is required',
            description: description ? '' : 'Description is required'
        };
        setErrors(errors);

        return !Object.values(errors).some(error => error);
    }

    function handleSaveClick() {
        if (validateFields()) {
            const topic = {
                category: category,
                topic: fypTopic,
                description: description
            };
            addButtonClick(topic);
            setCategory('');
            setFYPtopic('');
            setDescription('');
        }
    }

    const handleTopicSelect = (selectedTopic) => {
        setCategory(selectedTopic.category);
        setFYPtopic(selectedTopic.topic);
        setDescription(selectedTopic.description);
    };

    useEffect(() => {
        const flatTopics = OfferedTopics.flatMap(topics => topics.topics);
        setFilteredTopics(flatTopics);

        const cats = [...new Set(OfferedTopics.flatMap(item => item.topics.map(topic => topic.category)))].map((cat, index) => ({
            value: index + 1,
            label: cat
        }));
        setOfferedCategories(cats);
    }, [OfferedTopics]);

    return (
        <>
            <div>
                <div className='grid grid-cols-5'>
                    <div className="col-span-2">
                        <form action="" method="post">
                            <label htmlFor='domainDropDown' className='block text-sm font-medium text-indigo-950 '>
                                Category
                            </label>
                            <input
                                id='category'
                                name='category'
                                className={`mt-1 p-2 border rounded-md w-[100%] ${errors.category ? 'border-red-500' : 'border-slate-300'}`}
                                placeholder='Add Category'
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                            {errors.category && <p className="text-red-500 text-xs italic">{errors.category}</p>}

                            <label htmlFor='fyptopic' className='block text-sm font-medium text-indigo-950 '>
                                FYP Topic
                            </label>
                            <input
                                type='text'
                                id='fyptopic'
                                name='fyptopic'
                                className={`mt-1 p-2 border rounded-md w-[100%]  ${errors.fypTopic ? 'border-red-500' : 'border-slate-300'}`}
                                placeholder='Add FYP Topic'
                                value={fypTopic}
                                onChange={(e) => setFYPtopic(e.target.value)}
                            />
                            {errors.fypTopic && <p className="text-red-500 text-xs italic">{errors.fypTopic}</p>}

                            <label htmlFor='description' className='block text-sm font-medium text-indigo-950'>
                                Description
                            </label>
                            <textarea
                                id='description'
                                name='description'
                                className={`mt-1 p-2 border rounded-md w-[100%] h-24  ${errors.description ? 'border-red-500' : 'border-slate-300'}`}
                                placeholder='Write Here'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}

                            <div className='flex justify-end'>
                                <Simple text={"Add"} onClick={handleSaveClick} disabled={!category || !fypTopic || !description} />
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="my-4 mx-4">
                        <span className='text-indigo-950 font-semibold text-2xl '>
                            Select FYP topic to offer
                        </span>
                    </div>
                    <div className='flex justify-end'>
                        <div className=" my-5 mr-2">
                            <FilterButton text={'Filter'} onClick={handleFilterClick} dropdownOptions={offeredCategories} />
                        </div>
                    </div>
                    <div className="relative overflow-x-auto max-h-96 shadow-md sm:rounded-lg">
                        <table className="w-full table-fixed text-center text-sm text-gray-500 bg-white">
                            <thead>
                                <tr>
                                    <th className="px-6 md:px-3 py-4 font-semibold text-indigo-950">Sr. no</th>
                                    <th className="px-6 md:px-3 py-4 font-semibold text-indigo-950">FYP Title</th>
                                    <th className="px-6 md:px-3 py-4 font-semibold text-indigo-950">Category</th>
                                    <th className="px-6 md:px-3 py-4 font-semibold text-indigo-950">Select</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {filteredTopics && filteredTopics.map((topic, topicIndex) => {
                                    return (
                                        <tr key={`${topicIndex}`} className="bg-white border-b hover:bg-gray-50" onClick={() => handleTopicSelect(topic)}>
                                            <td className="px-6 md:px-3 py-4">{serialNum++}</td>
                                            <td className="px-6 md:px-3 py-4">{topic.topic}</td>
                                            <td className="px-6 md:px-3 py-4">{topic.category}</td>
                                            <td className="px-6 md:px-3 py-4">
                                                <input type="checkbox" id={`checkbox-${topicIndex}`}
                                                    checked={selectedCheckbox === topicIndex}
                                                    onChange={() => handleCheckboxSelect(topicIndex)}
                                                    className="form-checkbox h-5 w-5 text-indigo-600" />
                                                <label htmlFor={`checkbox-${topicIndex}`}></label>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SupOfferTopics;
