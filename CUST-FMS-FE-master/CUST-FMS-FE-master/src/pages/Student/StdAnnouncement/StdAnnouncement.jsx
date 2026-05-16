import React, { useEffect, useState } from 'react'
import GenAccor from '../../../Components/Accordians/GenAccor'

import { useNavigate } from 'react-router-dom';
import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary'
import { initFlowbite } from 'flowbite';
import axios from 'axios';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';

const Announcement = ({accordionId}) => {
    const navigate = useNavigate();
    const [AnnounDetailsVisible, setAnnounDetailsVisible] = useState(false);
    const [SelectedAnnouncement, setSelectedAnnouncement] = useState();
    const [coordinatorId, setCoordinatorId] = useState('');
    const [AnnouncementData, setAnnouncementData] = useState('');
    const [loadingSpinner, setLoadingSpinner] = useState(false);

    useEffect(() => {
      fetchCoordinatorId();
    }, [])


    useEffect(() => {
      initFlowbite();
      if (!localStorage.getItem('key')) {
        navigate('/login');
      }
      
      // Delay setting the indicator to ensure the DOM is fully rendered
      setTimeout(() => {
        const indicator = document.getElementById('scroll-indicator');
        if (indicator) {
          const tabName = "Announcement";
          const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
          if (selectedTab) {
            const topOffset = selectedTab.offsetTop;
            indicator.style.top = `${topOffset}px`;
          }
        }
      }, 100); // Adjust delay time if necessary
  
    }, [navigate]);

      
      const fetchCoordinatorId = async () => {

        try{
          setLoadingSpinner(true);
          const key = JSON.parse(localStorage.getItem("key"));
        const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
          
        // Construct the URL with partStatus, supervisorId, and coordinatorId
        const url = '/api/auth/getCoordinatorId';
    
        const response = await axios.get(url, config);
    
        if (response.status !== 497) {
          if (!response.data || !response.data) {
            console.error('Error fetching announcement data:', response.statusText);
            return;
          }
        } else {
          navigate('/login');
        }
    
        console.log("Checking coordinator response", response.data.coordinatorIds[0]._id);
        setCoordinatorId(response.data.coordinatorIds[0]._id);
        // fetchAnnouncementData();
    
        // Optionally, you can save the announcement data to localStorage
        // localStorage.setItem('announcementData', JSON.stringify(response.data.announcement));
      } catch (error) {
        console.error('Error fetching Coordinator ID:', error);
      } finally {
        setLoadingSpinner(false);
      }
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString); // Convert the date string to a Date object
      const formattedDate = date.toISOString().split('T')[0]; // Format the date string to 'YYYY-MM-DD'
      return formattedDate;
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // useEffect(() => {
    //   fetchCoordinatorId();
    // }, [])

    useEffect(() => {
      if (coordinatorId) {
        fetchAnnouncementData();
      }
    }, [coordinatorId]);


      
      const fetchAnnouncementData = async () => {
        console.log("Inside Fetch Announcement Dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        try {
          setLoadingSpinner(true);
          const key = JSON.parse(localStorage.getItem("key"));
          const userData = JSON.parse(localStorage.getItem("user"));
          const role = userData.role;
          console.log("Checking Role of Studenttttttttt", role);
        const pstatus = JSON.parse(localStorage.getItem("FYPData"));


        let SendStatus = '';
        if(pstatus) {
        const partStatus = pstatus.partStatus;
         
        if(partStatus === 'part-I'){
          SendStatus = 'fyp_groups_part1';
        }
        if(partStatus === 'part-II'){
          SendStatus = 'fyp_groups_part2';
        }
      }
      else{
        SendStatus = 'unregistered';

      }
        
         
        
        // console.log("Checking fetching part Status", partStatus);
        console.log("Checking Send Status", SendStatus);
        let supervisorId = '';

        
        const supId = JSON.parse(localStorage.getItem("FYPData"));
        if(supId){
           supervisorId = supId.selectedOption._id;
        }
        

        
       
        console.log("Checking supervisorId fetching", supervisorId);
        console.log("Checking coordinaotrId", coordinatorId);

        

          const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
          
          // Construct the URL with partStatus, supervisorId, and coordinatorId
          let url = `/api/CoordAnnouncementRoutes/announcementsByStatus?role=${role}&status=${SendStatus}`;
          if(supId && supervisorId){
            
            url += `&supervisorId=${supervisorId}`
          }

          console.log("URLlllllllll", url);
      
          const response = await axios.get(url, config);
      
          if (response.status !== 497) {
            if (!response.data || !response.data) {
              console.error('Error fetching announcement data:', response.statusText);
              return;
            }
          } else {
            navigate('/login');
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

//       useEffect (()=>{
//         fetchAnnouncementData();
// }, [])
      
    


    const handleViewButtonClick = (item) => {
        setAnnounDetailsVisible(true);
        console.log("Checking selected Announcement details", item);
        setSelectedAnnouncement(item);
        }

        const handleGoBack = () => {
            setAnnounDetailsVisible(false);
        };

       console.log("Announcement Data", SelectedAnnouncement);
      
  return (
    <>
    {loadingSpinner ? ( // Show loading spinner while loading is true
    <LoadingSpinner />
  ) : (

    <div>

    {AnnounDetailsVisible ? (

        
        <div className='mx-16 mt-10'>
            <p className='font-bold text-3xl'>Announcements</p>
        <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-7'>
                 <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                   <GenAccor text="View Announcement" accordionId={accordionId} />
                 </h2>
                 <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
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
                <img src="/assets/images/downBack.png" alt="Download background" className='w-full h-full object-cover rounded-lg mt-8'/>
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
    <img src="/assets/images/downBack.png" alt="Download preview" className='w-20 rounded-xl' />
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

   
   <div className='mx-16 mt-10'>
     
   <p className='font-bold text-3xl'>Announcements</p>

    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-7'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text="Announcements" accordionId={accordionId} />
      </h2>
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
                {/* Timetable Table */}
                <div className="table-container overflow-x-auto relative h-96 overflow-y-auto">
                  <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50   border-collapse border border-gray-300">
                    <thead className="text-xs text-indigo-900 uppercase bg-gray-50    ">
                      <tr className='border-b text-center'>
                        <th className="px-6 py-3  w-52">Sr No.</th>
                        <th className="px-6 py-3  w-[31.25rem] text-left">Title</th>
                        <th className="px-6 py-3  w-52">Announced By</th>
                        <th className="px-6 py-3  w-52">Annouced Date</th>
                        <th className="px-6 py-3  w-52">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                   
          {AnnouncementData && AnnouncementData.length > 0 ? (
  AnnouncementData
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort announcements by date in descending order
    .map((item, index) => (
      <tr key={item._id} className="text-center">
        {/* Display the task number based on the counter for the specific filter */}
        <td className="px-6 py-4 font-semibold">{index + 1}</td> {/* Use index + 1 as serial number */}
        <td className="px-6 py-4 font-semibold text-start">{item.title}</td>
        <td className="px-6 py-4 font-semibold">{item.uploadedBy.name}</td>
        <td className="px-6 py-4 font-semibold">{formatDate(item.createdAt)}</td>
        <td className="px-6 py-4 font-semibold">
          <button
            className="underline text-black hover:text-gray-500"
            onClick={() => handleViewButtonClick(item)}
          >
            View
          </button>
        </td>
      </tr>
    ))
) : (
  <tr>
    <td colSpan="5" className="text-center py-4">Data not Found</td>
  </tr>
)}

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>


    </div>
    
  )}
  </div>
  )}
    </>
  )
}

export default Announcement
