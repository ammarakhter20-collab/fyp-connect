import { useState, useEffect, React } from 'react';
import { Offeredcategories } from '../SupFYPRegister/SupRegData';
import SupOfferedTopics from './SupOfferedTopics';
import SupOfferTopics from './SupOfferTopics';
import SupEditFYP from './SupEditFYP';
import { initFlowbite } from 'flowbite';
import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import Simple from '../../../Components/Buttons/Simple';


const UploadFYPTopic = () => {
  const [index, setIndex] = useState(1);
  const [showOfferedTopics, setShowOfferedTopics] = useState(false);
  const [showOfferTopics, setShowOfferTopics] = useState(true);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [showEditFYP, setShowEditFYP] = useState(false);
  const [offeredTopic, setOfferedTopic] = useState([]);// topics by supervisor
  const [allOfferedTopic, setAllOfferedTopic] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);


  const handleAddButtonClick = (topic) => {
    console.log('yeh topic hai', topic);
    const newTopic = {
      category: topic.category,
      title: topic.topic,
      description: topic.description,
    };
    //call add topic func here
    AddTopic(newTopic);
    setIndex(index + 1);
    const updatedTopics = [...offeredTopic, newTopic];
    console.log(updatedTopics, 'these are updated topd')
    setOfferedTopic(updatedTopics);
    setShowOfferedTopics(true)
    setShowOfferTopics(false)
  };
  const handleAddClick = () => {
    console.log('Add button handled');

  }
  const handleEditClick = (id) => {
    console.log('Edit button handled', id);
    setSelectedTopic(id);
    setShowEditFYP(true);

  }
  const handleDeleteClick = (id) => {
    console.log('Delete button handled', id);

    deleteTopic(id)

  }
  const handleUpdateClick = (updatedData) => {
    console.log('Update button handled', updatedData);

    updateTopic(updatedData);

  }
  const handleEditFYPClose = () => {
    console.log('FYP CLose button handled');
    setShowEditFYP(false);

  }
  const handleGoBack = () => {
    setShowOfferedTopics(false)
    setShowOfferTopics(true)
    setShowEditFYP(false)

  }



  const fetchAllOfferedTopics = async () => {
    try {
      setLoadingSpinner(true);
      const token = localStorage.getItem('key');

      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData._id;

      const response = await fetch(`/api/auth/get-topics/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'

        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Data');
      }
      const data = await response.json();
      //Fetched  Data
      setAllOfferedTopic(data);

      const topicsOfSup = data.filter(topics => topics.uploadedBy === userId)
      const flatTopics = topicsOfSup.flatMap(topics => topics.topics);
      setOfferedTopic(flatTopics);


    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };


  const AddTopic = async (addtopic) => {
    try {
      setLoadingSpinner(true); // Show loading spinner while processing

      const apiUrl = '/api/auth/upload-topic';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData._id;


      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId, addtopic
        }),
      });
      if (response.ok) {
        // Handle successful response
        console.log('Task Added Successfully');
      } else {
        console.log('Failed to Add Task');
      }
    }
    catch (error) {
      console.error('Error Adding Task:', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }
  const updateTopic = async (newTopic) => {
    try {
      setLoadingSpinner(true); // Show loading spinner while processing

      const apiUrl = '/api/auth/update-topic';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData._id;


      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId, newTopic, selectedTopic
        }),
      });
      if (response.ok) {
        // Handle successful response
        console.log('Task Updated Successfully');
      } else {
        console.log('Failed to Update Task');
      }
    }
    catch (error) {
      console.error('Error Updating Task:', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  }


  const deleteTopic = async (topicId) => {
    try {
      setLoadingSpinner(true); // Show loading spinner while processing

      const apiUrl = '/api/auth/delete-topic';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData._id;

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topicId, userId
        }),
      });
      if (response.ok) {
        // Handle successful response
        console.log('Topic Deleted Successfully');
        window.location.reload();

      } else {
        console.log('Failed to Delete Topic');
      }
    } catch (error) {
      console.error('Error Deleting Topic:', error);
      // Handle network errors or other exceptions
    } finally {
      setLoadingSpinner(false); // Hide loading spinner after processing
    }
  };

  const viewAddedTops = () => {
    setShowOfferedTopics(true)
  }

  useEffect(() => {
    initFlowbite();
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'SupuploadFYPtopic';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      if (selectedTab) {
        const topOffset = selectedTab.offsetTop;
        indicator.style.top = `${topOffset}px`;
      }
    }
  }, []);
  useEffect(() => {
    fetchAllOfferedTopics();
  }, [])
  return (
    <>
      {loadingSpinner ? ( // Show loading spinner while loading is true
        <LoadingSpinner />
      ) : (<div className='relative'>
        <div className='pl-20 md:pl-10 pt-10  pr-20 md:pr-10'>
          <div>
            {showOfferTopics && (
              <div>
                <SupOfferTopics OfferedTopics={allOfferedTopic} addButtonClick={handleAddButtonClick} />
              </div>)}
          </div>
          <div>
            {showOfferedTopics && offeredTopic.length > 0 && Offeredcategories && (
              <div className='relative top-0 left-0 w-full h-full  justify-center items-center '>
                <SupOfferedTopics OfferedTopics={offeredTopic} offeredCats={Offeredcategories} handleAddClick={handleAddClick} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} />
                <div className='flex flex-row justify-end  mt-5'>
                  <ButbgPrimary text="Back" onClick={handleGoBack} />
                </div>
              </div>)}
            {showEditFYP && (
              <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
                <SupEditFYP onclose={handleEditFYPClose} onAddClick={handleUpdateClick} />
              </div>

            )}
          </div>
          {(!showOfferedTopics) && (<div className='flex flex-row justify-end  mt-5'>
            <Simple text="View Added Topics" onClick={viewAddedTops} />
          </div>)}

        </div>
      </div>)}
    </>
  );
}

export default UploadFYPTopic;



// import { useState, useEffect, React } from 'react';
// import { Offeredcategories, OfferedTopics } from '../SupFYPRegister/SupRegData';
// import SupOfferedTopics from './SupOfferedTopics';
// import SupOfferTopics from './SupOfferTopics';
// import SupEditFYP from './SupEditFYP';
// import { initFlowbite } from 'flowbite';
// import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary';
// import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
// import Simple from '../../../Components/Buttons/Simple';


// const UploadFYPTopic = () => {
//   const [showOfferedTopics, setShowOfferedTopics] = useState(false);
//   const [showOfferTopics, setShowOfferTopics] = useState(true);
//   const [loadingSpinner, setLoadingSpinner] = useState(false);
//   const [showEditFYP, setShowEditFYP] = useState(false);
//   const [offeredTopic, setOfferedTopic] = useState([]);// topics by supervisor
//   const [allOfferedTopic, setAllOfferedTopic] = useState([]);
//   const [selectedTopic, setSelectedTopic] = useState(null);



//   const handleAddButtonClick = (topic) => {
//     console.log('yeh topic hai', topic);
//     const newTopic = {
//       category: topic.category,
//       title: topic.topic,
//       platform: topic.platform,
//       technology: topic.technology,
//       description: topic.description,
//     };
//     //call add topic func here
//     AddTopic(newTopic);
//     // setIndex(index + 1);
//     // const updatedTopics = [...offeredTopic, newTopic];
//     // console.log(updatedTopics, 'these are updated topd')
//     // setOfferedTopic(updatedTopics);
//     setShowOfferedTopics(true)
//     setShowOfferTopics(false)
//   };
//   const handleAddClick = () => {
//     console.log('Add button handled');

//   }
//   const handleEditClick = (id) => {
//     console.log('Edit button handled', id);
//     setSelectedTopic(id);
//     setShowEditFYP(true);

//   }
//   const handleDeleteClick = (id) => {
//     console.log('Delete button handled', id);

//     deleteTopic(id)

//   }
//   const handleUpdateClick = (updatedData) => {
//     console.log('Update button handled', updatedData);

//     updateTopic(updatedData);

//   }
//   const handleEditFYPClose = () => {
//     console.log('FYP CLose button handled');
//     setShowEditFYP(false);

//   }
//   const handleGoBack = () => {
//     setShowOfferedTopics(false)
//     setShowOfferTopics(true)
//     setShowEditFYP(false)

//   }



//   const fetchAllOfferedTopics = async () => {
//     try {
//       setLoadingSpinner(true);
//       const token = localStorage.getItem('key');

//       const userData = localStorage.getItem('user');
//       const parsedUserData = JSON.parse(userData);
//       const userId = parsedUserData._id;

//       const response = await fetch(`/api/auth/get-topics/${userId}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'

//         },
//       });
//       if (!response.ok) {
//         throw new Error('Failed to fetch Data');
//       }
//       const data = await response.json();
//       //Fetched  Data
//       setAllOfferedTopic(data);

//       const topicsOfSup = data.filter(topics => topics.uploadedBy === userId)
//       const flatTopics = topicsOfSup.flatMap(topics => topics.topics);
//       setOfferedTopic(flatTopics);


//     } catch (error) {
//       console.error('Error fetching Data:', error.message);
//     } finally {
//       setLoadingSpinner(false);
//     }
//   };


//   const AddTopic = async (addtopic) => {
//     try {
//       console.log(addtopic ,"to add")
//       setLoadingSpinner(true); // Show loading spinner while processing

//       const apiUrl = '/api/auth/upload-topic';
//       const nkey = localStorage.getItem('key');
//       const token = JSON.parse(nkey);
//       const userData = localStorage.getItem('user');
//       const parsedUserData = JSON.parse(userData);
//       const userId = parsedUserData._id;


//       const response = await fetch(apiUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           userId, addtopic
//         }),
//       });
//       if (response.ok) {
//         // Handle successful response
//         console.log('Task Added Successfully');
//       } else {
//         console.log('Failed to Add Task');
//       }
//     }
//     catch (error) {
//       console.error('Error Adding Task:', error);
//       // Handle network errors or other exceptions
//     } finally {
//       setLoadingSpinner(false); // Hide loading spinner after processing
//     }
//   }
//   const updateTopic = async (newTopic) => {
//     try {
//       setLoadingSpinner(true); // Show loading spinner while processing

//       const apiUrl = '/api/auth/update-topic';
//       const nkey = localStorage.getItem('key');
//       const token = JSON.parse(nkey);
//       const userData = localStorage.getItem('user');
//       const parsedUserData = JSON.parse(userData);
//       const userId = parsedUserData._id;


//       const response = await fetch(apiUrl, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           userId, newTopic, selectedTopic
//         }),
//       });
//       if (response.ok) {
//         // Handle successful response
//         console.log('Task Updated Successfully');
//       } else {
//         console.log('Failed to Update Task');
//       }
//     }
//     catch (error) {
//       console.error('Error Updating Task:', error);
//       // Handle network errors or other exceptions
//     } finally {
//       setLoadingSpinner(false); // Hide loading spinner after processing
//     }
//   }


//   const deleteTopic = async (topicId) => {
//     try {
//       setLoadingSpinner(true); // Show loading spinner while processing

//       const apiUrl = '/api/auth/delete-topic';
//       const nkey = localStorage.getItem('key');
//       const token = JSON.parse(nkey);
//       const userData = localStorage.getItem('user');
//       const parsedUserData = JSON.parse(userData);
//       const userId = parsedUserData._id;

//       const response = await fetch(apiUrl, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           topicId, userId
//         }),
//       });
//       if (response.ok) {
//         // Handle successful response
//         console.log('Topic Deleted Successfully');
//         window.location.reload();

//       } else {
//         console.log('Failed to Delete Topic');
//       }
//     } catch (error) {
//       console.error('Error Deleting Topic:', error);
//       // Handle network errors or other exceptions
//     } finally {
//       setLoadingSpinner(false); // Hide loading spinner after processing
//     }
//   };

// const viewAddedTops = () => {
//   setShowOfferedTopics(true)
// }

//   useEffect(() => {
//     initFlowbite();
//     const indicator = document.getElementById('scroll-indicator');
//     if (indicator) {
//       const tabName = 'SupuploadFYPtopic';
//       const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
//       const topOffset = selectedTab.offsetTop;
//       indicator.style.top = `${topOffset}px`;
//     }
//   }, []);
//   useEffect(() => {
//     fetchAllOfferedTopics();
//   }, [])
//   return (
//     <>
//       {loadingSpinner ? ( // Show loading spinner while loading is true
//         <LoadingSpinner />
//       ) : (<div className='relative'>
//         <div className='pl-20 md:pl-10 pt-10  pr-20 md:pr-10'>
//           {/* <h1 className='text-xl font-semibold text-indigo-950 py-5'>Let’s Add Final Year project Topics</h1>
//           <div className=' bg-white rounded-3xl  p-6 h-32 mt-5 mb-3 mr-48 md:w-full'>
//             <div className='flex space-x-2'>
//               <h1 className='font-medium text-2xl'>Things to remember before adding FYP Topic</h1>
//             </div>
//             {(
//               <div className='ml-8 mt-2 text-sm max-h-9 overflow-y-auto '>
//                 <p>Dummy text goes here fgf gfgf gf gfgf dfd fdfd dfd dfdfd fdfd dfd dfd df dhhj hjh jh jh jhj hj hj hj jhjh jh jh jhj hj hj jh j jj hj hjh jhj hj hjh f fdf dfdf dfdfdf dfdfd dfdf fd dfd fdf df dfd d df df</p>
//               </div>
//             )}

//           </div> */}
//           <div>
//             {showOfferTopics && Offeredcategories && allOfferedTopic && (
//               <div>
//                 <SupOfferTopics Offeredcategories={Offeredcategories} OfferedTopics={allOfferedTopic} addButtonClick={handleAddButtonClick} />
//               </div>)}
//           </div>
//           <div>
//             {showOfferedTopics && offeredTopic.length > 0 && Offeredcategories && (
//               <div className='relative top-0 left-0 w-full h-full  justify-center items-center '>
//                 <SupOfferedTopics OfferedTopics={offeredTopic} offeredCats={Offeredcategories} handleAddClick={handleAddClick} handleEditClick={handleEditClick} handleDeleteClick={handleDeleteClick} />
//                 <div className='flex flex-row justify-end  mt-5'>
//                   <ButbgPrimary text="Back" onClick={handleGoBack} />
//                 </div>
//               </div>)}
//             {showEditFYP && (
//               <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
//                 <SupEditFYP onclose={handleEditFYPClose} onAddClick={handleUpdateClick} />
//               </div>

//             )}
//           </div>
//          {(!showOfferedTopics) && ( <div className='flex flex-row justify-end  mt-5'>
//             <Simple text="View Added Topics" onClick={viewAddedTops} />
//           </div>)}

//         </div>
//       </div>)}
//     </>
//   );
// }

// export default UploadFYPTopic;
