import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import { initFlowbite } from 'flowbite';
import CardOnebutton from '../../../Components/Cards/CardOnebutton';
import Simple from '../../../Components/Buttons/Simple';
import Select from 'react-select';
import { DescriptionOutlined } from '@mui/icons-material';
import GenAccor from '../../../Components/Accordians/GenAccor';
import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary';
import SupForAnnouncements from './SupForAnnouncements';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const options = [

    { value: 'fyp_groups_part1', label: 'FYP Groups Part-I' },
    { value: 'fyp_groups_part2', label: 'FYP Groups Part-II' },
    { value: 'all_fyp_groups', label: 'All FYP Groups' },

  ];

const SupAnnouncements = ({accordionId}) => {
 
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const [showCreateAnnoun, setShowCreateAnnoun] = useState(false);
    const [errors, setErrors] = useState({});
    const [coordinator, setCoordinator] = useState([]);
    const [announFor, setAnnounFor] = useState('');
    const [description, setDescription] = useState('');
    const [selectedAnnoun, setSelectedAnnoun] = useState('');
    const [title, setTitle] = useState('');
    const [Feedbacks, setFeedbacks] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [file, setFile] = useState(null);
    const [announData , setAnnounData] = useState('');
    const [AnnounId , setAnnounId] = useState('');
    const [editMode , setEditMode] = useState(false);
    const [SelectedAnnouncement , setSelectedAnnouncement] = useState('');
    const [AnnouncementData , setAnnouncementData] = useState('');
    const [AnnouncementDetailsVisible , setAnnouncementDetailsVisible] = useState(false);

    useEffect(() => {
        initFlowbite();

        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
            const tabName = 'SupAnnouncements';
            const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
            if (selectedTab) {
                const topOffset = selectedTab.offsetTop;
                indicator.style.top = `${topOffset}px`;
            }
        }
    }, []);

    const handleCreateAnnouncement = () => {
        setAnnounFor('');
        setDescription('');
        setTitle('');
        setShowCreateAnnoun(true);
    };

    const handleOptChange = (selectedOption) => {
        setAnnounFor(selectedOption);
        setErrors(prevErrors => ({ ...prevErrors, ann: '' }));
      };
    

      
    const handleTitleChange = event => {
        setTitle(event.target.value);
        // Clear the error when the user starts typing
        setErrors(prevErrors => ({ ...prevErrors, tit: '' }));
    };


  const handleDescriptionChange = event => {
    setDescription(event.target.value);
    // Clear the error when the user starts typing
    setErrors(prevErrors => ({ ...prevErrors, desc: '' }));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
    
  const handleGoBack = () => {
    setAnnouncementDetailsVisible(false);
};
    
    const updatedAnnoun = async (announFor, title, description, file) => {
        console.log("Checking Announcement for Updation");
        console.log("Announ For Updated", announFor);
        console.log("Title for Updation", title);
        console.log("Description for Updation", description);
        console.log("Update File", file);
        console.log("Announcement Iddddddddd", AnnounId);
        const announId = AnnounId && AnnounId;
        console.log("announIddddddddd", announId);
        const userData = localStorage.getItem('user');
        const user = JSON.parse(userData);
        const userId = user._id;
        console.log("checking User ID", userId);

    const formData = new FormData();
    formData.append('announFor', announFor.value);
    formData.append('title', title);
    formData.append('description', description);

    if (file) {
        formData.append('file', file);
    }
    try {
        setLoadingSpinner(true);
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString(); // Format the date as an ISO string
        

        const nkey = localStorage.getItem('key');
        const token = JSON.parse(nkey);
        const response = await fetch(`/api/CoordAnnouncementRoutes/updateAnnouncement/${announId}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        });
        console.log("Requestttttttttt senttttttt");

        if (response.ok) {
            const data = await response.json();
            console.log('Announcement updated successfully', data);
            // Optionally reset the form here
            setAnnounFor('');
            setDescription('');
            setTitle('');
            setFile(null);
            setShowCreateAnnoun(false);
            window.location.reload(); // Reload the page or update the UI as needed
        } else {
            console.error('Failed to update announcement');
        }
    } catch (error) {
        console.error('Error creating announcement:', error);
    } finally {
        setLoadingSpinner(false);
    }


    }

    const addAnnoun = async () => {
        console.log("ANnouncement For", announFor);
        console.log("Title", title);
        console.log("Descripton", description);
        console.log("File", file);
        const userData = localStorage.getItem('user');
            const user = JSON.parse(userData);
            const Role = user.role;
            let role = '';
            if(Role === 'faculty'){
                 role = 'supervisor';
            }
            const userId = user._id;
            console.log("checking User ID", userId);
        const formData = new FormData();
        formData.append('announFor', announFor.value);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('role', role);
     
        if (file) {
            formData.append('file', file);
        }
        try {
            setLoadingSpinner(true);
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString(); // Format the date as an ISO string
            
    
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const response = await fetch(`/api/CoordAnnouncementRoutes/addCoordAnnoun/${userId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });
            console.log("Requestttttttttt senttttttt");

            if (response.ok) {
                const data = await response.json();
                console.log('Announcement created successfully', data);
                // Optionally reset the form here
                setAnnounFor('');
                setDescription('');
                setTitle('');
                setFile(null);
                setShowCreateAnnoun(false);
                window.location.reload(); // Reload the page or update the UI as needed
            } else {
                console.error('Failed to create announcement');
            }
        } catch (error) {
            console.error('Error creating announcement:', error);
        } finally {
            setLoadingSpinner(false);
        }
    };

    const fetchAnnouncementData = async () => {
        
        try {
          setLoadingSpinner(true);
          const key = JSON.parse(localStorage.getItem("key"));
          const userData = JSON.parse(localStorage.getItem("user"));
          const Role = userData.role;
          let role = '';
          if(Role === 'faculty'){
            role = 'supervisor'
          }
          console.log("Checking Role of Studenttttttttt", role);
       
        let SendStatus = 'supervisors';
         
    let supervisorId = '';
       

        

          const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
          
          // Construct the URL with partStatus, supervisorId, and coordinatorId
          const url = `/api/CoordAnnouncementRoutes/announcementsByStatus?role=${role}&status=${SendStatus}&supervisorId=${supervisorId}`;
      
          const response = await axios.get(url, config);
      
          if (response.status !== 497) {
            if (!response.data || !response.data) {
              console.error('Error fetching announcement data:', response.statusText);
              return;
            }
          } else {
            Navigate('/login');
          }
          console.log("Checking fetching Announcement Data", response.data);
  
         

          // Process the fetched announcement data
          // Assuming you have a function to handle this, e.g., setAnnouncementData
          setAnnouncementData(response.data);
      
          // Optionally, you can save the announcement data to localStorage
          // localStorage.setItem('announcementData', JSON.stringify(response.data.announcement));
        } catch (error) {
          console.error('Error fetching announcement data:', error);
        } finally {
          setLoadingSpinner(false);
        }
      };
    
    const fetchSupAnnouncement = async () => {
       
        try {
            setLoadingSpinner(true);
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString(); // Format the date as an ISO string
            const User = localStorage.getItem('user');
            const userData = JSON.parse(User);
            const userId = userData._id;
    
            const nkey = localStorage.getItem('key');
            const token = JSON.parse(nkey);
            const response = await fetch(`/api/CoordAnnouncementRoutes/getAllAnnouncementByUploadedby/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
               
            });
            console.log("Requestttttttttt senttttttt");

            if (response.ok) {
                const data = await response.json();
                console.log("Checking Response Dataaaaaaaaaaaaaaaaaaaaaaaa", data);
                setAnnounData(data);
                console.log('Announcement Get successfully', data);
              // Reload the page or update the UI as needed
            } else {
                console.error('Failed to create announcement');
            }
        } catch (error) {
            console.error('Error creating announcement:', error);
        } finally {
            setLoadingSpinner(false);
        }
    };
    






  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    return formattedDate;
};

const handleViewAnnoun = (an) => {
 setAnnouncementDetailsVisible(true);
 setSelectedAnnouncement(an);
};

const handleSupForView = (an) => {
    console.log("SUp For View Called", an);
    setAnnouncementDetailsVisible(true);
 setSelectedAnnouncement(an);
}

const handleEditAnnoun = (an) => {
    setAnnounFor({ label: an.announFor, value: an.announFor }); // Corrected line
    setDescription(an.description);
    setTitle(an.title);
    setFile(an.file); 
    setEditMode(true);
    setAnnounId(an._id);
    setShowCreateAnnoun(true);
    setSelectedAnnoun(an);
}


// console.log("Checking Consoleeeeeeeeeeeeeeeeeeeeeeeee", selectedAnnoun.coordinator.name);

const handleDeleteAnnoun = async (an) => {
console.log("Checking Announcement to delete", an);


try {
    setLoadingSpinner(true);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString(); // Format the date as an ISO string

    const nkey = localStorage.getItem('key');
    const token = JSON.parse(nkey);
    const response = await fetch(`/api/CoordAnnouncementRoutes/deleteCoordAnnoun/${an}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
       
    });
    console.log("Requestttttttttt senttttttt");

    if (response.ok) {
        const data = await response.json();
     
        console.log('Announcement Deleted successfully');
        window.location.reload(true);
      // Reload the page or update the UI as needed
    } else {
        console.error('Failed to Delete announcement');
    }
} catch (error) {
    console.error('Error Deleting announcement:', error);
} finally {
    setLoadingSpinner(false);
}


}

const validateForm = () => {
    const errors = {};
    if (!announFor) {
        errors.ann = 'Announcement For is required';
    }
    if (!description) {
        errors.desc = 'Feedback description is required';
    }
    if (!title) {
        errors.tit = 'Title is required';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
};

  const handleSubmit = () => {
    console.log("Handle Submit called");
    if (validateForm()) {
      console.log("Form is valid");
    //   console.log("Feedback To", coord);
      console.log("Title", title);
      console.log("Description", description);

      if(editMode){
        updatedAnnoun(announFor, title, description, file);
      }
      else
      {
       addAnnoun();
      }
      // Add logic to handle form submission
    }
  };

  useEffect(() => {
fetchSupAnnouncement();
fetchAnnouncementData();
  }, [])

  console.log("Get Announcementsssss", announData);
    return (
        <>
          {loadingSpinner ? (
                <LoadingSpinner />
            ) : (
                <div>

{AnnouncementDetailsVisible ? (

        
<div className='mx-16 mt-10'>
    <p className='font-bold text-3xl'>Announcements</p>
<div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-7'>
         <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
           <GenAccor text="View Announcement" accordionId={accordionId} />
         </h2>
         <div id={`accordion-collapse-body-timetable-${accordionId}`} className="transition-opacity duration-300 ease-in-out" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
           <div className="pt-0 pb-5  rounded-lg   bg-white border border-b-0 border-gray-200 relative">
           <div className='bg-white w-full min-h-[80px] pb-5 rounded-2xl border border-gray-200 mt-4'>
            <div className='mt-7 ml-2 flex flex-row space-x-2 '>
           <p className='font-semibold'>Title:</p>
           <p className=''>{SelectedAnnouncement.title}</p>                    
           </div>
            
           </div>
           <div className='bg-white w-full min-h-[387px] rounded-2xl border border-gray-200 mt-4'>
            <div className='mt-4 ml-2 flex flex-row space-x-2 '>
           <p className='font-semibold'>Description:</p>
           <p className=''>{SelectedAnnouncement.description}</p>
            </div>

            <div className='w-80 h-24 bg-downBg rounded-lg mt-52 ml-5 '>
                <div className='flex flex-row '>
                {SelectedAnnouncement.filePath !=null && (
            <div className='w-16 h-16 ml-4 flex flex-col justify-center items-center'>
                <img src="/assets/images/downBack.png" alt="Image" className='w-full h-full object-cover rounded-lg mt-8'/>
            </div>
                )}
            <div>
            {/* <p className='mt-6 ml-2'>{SelectedAnnouncement.downloadLink.substring(4, SelectedAnnouncement.downloadLink.length - 4)}</p> */}
            <div className='flex flex-row space-x-2 ml-2'>
            {/* <p className='font-extralight text-sm'>Sender: </p>
            <p className='text-sm '>{SelectedAnnouncement.uploadedBy.role === "faculty" ? "Supervisor" : "Coordinator"}</p> */}

            </div>
            </div>
                </div>
                {SelectedAnnouncement.file !=null && (


<div>

<div className='w-[500px] h-28 bg-slate-200 rounded-lg'>

    <div className='flex flex-row space-x-5'> 

        <div className='ml-6 mt-2'>

        

    <div className=''>
    <img src="/assets/images/downBack.png" alt="Description of your image" className='w-20 rounded-xl' />
    </div>

                <div>
<a
// Adding key for each item
href={SelectedAnnouncement?.file ? `/${SelectedAnnouncement.file.replace(/\\/g, '/')}` : '#'}
target="_blank"
rel="noopener noreferrer"
className='text-center inline-block underline' // Add class for underlining text
>
<button className="underline text-black hover:text-gray-500 mt-1 text-sm">
Download
</button>
</a>
</div>
</div>

<div className='my-auto'>
    <p className='font-semibold'>Announcement File</p>
    <div className='flex flex-row space-x-3'>
        <div>
            <p className='font-light text-slate-600'>Sender: </p>
        </div>
        <div>
            <p>{SelectedAnnouncement && SelectedAnnouncement.uploadedBy.name}</p>
        </div>
    </div>
</div>
</div>
</div>


</div>
)}

            </div>
            
           </div>
             
           <div className='flex flex-row justify-end mr-5 mt-5'>

       <ButbgPrimary text="Back" onClick={handleGoBack}/>
       </div>
           </div>
         </div>

       </div>
       
       </div>
):(
                <div className='mt-10 mx-16'>
                    <div id="cardOneButton" className='w-[21%]'>
                        <CardOnebutton title={"Announcement"} butText={"Add"} onClick={handleCreateAnnouncement} />
                    </div>
    
                    {showCreateAnnoun && (
                        <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50'>
                            <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto relative">
                                <button className="absolute top-2 right-2 text-gray-600 focus:outline-none" onClick={() => setShowCreateAnnoun(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div>
                                    <div className='font-bold text-xl flex flex-row justify-center'>
                                    <p>{editMode ? 'Edit Announcement' : 'Add Announcement'}</p>
                                    </div>
                                    <form>
                                        <div className="my-4">
                                            <label htmlFor='coordDropdown' className="block text-md font-semibold text-gray-700">Announcement to
                                            <Select
            id='announDropdown'
            name='announDropdown'
            className="bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5"
            options={options}
            isSearchable
            onChange={handleOptChange}
            value={announFor}
            placeholder='Select Announcement For'
          />
                                                {errors.ann && <p className="text-red-500 text-sm">{errors.ann}</p>}
                                            </label>
                                        </div>
                                        <div className="my-4">
                                            <label htmlFor='title' className="block text-md font-semibold text-gray-700">Title
                                                <input
                                                    id='title'
                                                    name='title'
                                                    type='text'
                                                    value={title}
                                                    onChange={handleTitleChange}
                                                    className="bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5"
                                                    placeholder='Enter Title'
                                                />
                                                {errors.tit && <p className="text-red-500 text-sm">{errors.tit}</p>}
                                            </label>
                                        </div>
                                        <div className="my-4">
                                            <label htmlFor='description' className="block text-md font-semibold text-gray-700">Description
                                                <textarea
                                                    id='description'
                                                    name='description'
                                                    value={description}
                                                    onChange={handleDescriptionChange}
                                                    className="bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5"
                                                    placeholder='Enter Description'
                                                />
                                                {errors.desc && <p className="text-red-500 text-sm">{errors.desc}</p>}
                                            </label>
                                        </div>

                                        <div className="my-4">
    <label htmlFor='file' className="block text-md font-semibold text-gray-700">
        Upload File
        <input
            id='file'
            name='file'
            type='file'
            onChange={handleFileChange}
            className="bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5"
        />
        {/* {file ? (
            <div className='mt-2'>
                <p className='font-semibold'>Uploaded File:</p>
                <p>{file.name}</p>
            </div>
        ) : (
            <p>No file uploaded</p>
        )} */}
    </label>
</div>



                                        <div className="col-span-1 flex justify-center my-2">
                                            <Simple text={editMode ? 'Update' : 'Add'} type="Submit" onClick={handleSubmit} />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
    
                    
    
                    <div id={`accordion-collapse-${accordionId}`} data-accordion='collapse' className={`mt-5`}>
                        <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                            <GenAccor text='Added Announcements' accordionId={accordionId} />
                        </h2>
                        <div id={`accordion-collapse-body-timetable-${accordionId}`} className={` transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                            <div className='pt-0 pb-0 border border-b-0 border-gray-200 relative'>
                                <div className='table-container overflow-x-auto relative max-h-96 overflow-y-auto'>
                                    <div className='bg-white text-sm'>
                                        <table className='w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300'>
                                            <thead className='text-xs text-indigo-900 uppercase bg-white   dark:text-gray-400'>
                                                <tr className='border-b text-center'>
                                                    <th className='px-20 py-3'>Sr. No</th>
                                                    <th className='px-20 py-3'>Title</th>
                                                    <th className='px-20 py-3'>Announced Date</th>
                                                    <th className='px-20 py-3'>Details</th>
                                                    <th className='px-20 py-3'>Action</th>
                                                </tr>
                                            </thead>
                        <tbody>
                        {Array.isArray(announData) && announData.length > 0 ? (
        announData.map((an, index) => (
          <tr key={an._id} className='text-center font-normal'>
              <td className='px-6 py-4'>{index + 1}</td>
              <td className='px-6 py-4 overflow-hidden overflow-ellipsis max-w-xs'>
                        {an.title.length > 24 ? `${an.title.substring(0, 24)}...` : an.title}
                    </td>
              <td className='px-6 py-4'>{formatDate(an.createdAt)}</td>
              <td className='px-6 py-4'>
                  <button className='underline mx-2' onClick={() => handleViewAnnoun(an)}>
                      View
                  </button>
              </td>
              <td className='px-6 py-4'>
                  <button className='underline mx-2' onClick={() => handleDeleteAnnoun(an._id)}>
                    Delete
                  </button>
                  <button className='underline mx-2' onClick={() => handleEditAnnoun(an)}>
                    Edit
                  </button>
              </td>
          </tr>
      ))
    ) : (
      <tr>
          <td colSpan='9' className='text-center py-4'>No Announcement found</td>
      </tr>
    )}
                                          </tbody>
                                      </table>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

<div>
    <SupForAnnouncements accordionId={401} AnnouncementData = {AnnouncementData} handleSupForView = {handleSupForView}/>
</div>


              </div>
)}
              </div>
          )}
      </>
      );
    };

export default SupAnnouncements
