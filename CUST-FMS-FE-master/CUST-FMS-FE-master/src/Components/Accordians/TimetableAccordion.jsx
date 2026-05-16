

import { initFlowbite } from 'flowbite';
import React, { useEffect, useState } from 'react';
import Simple from '../Buttons/Simple';
import { CiEdit } from "react-icons/ci";
import axios from 'axios'; // Import Axios for making HTTP requests

const TimetableAccordion = ({ accordionId }) => {
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [editingMode, setEditingMode] = useState(true);
  const [showEditButton, setShowEditButton] = useState(false);
  const [timetableAdded, setTimetableAdded] = useState(false);
  const [cellContents, setCellContents] = useState({});
  const [timetableSubmitted, setTimetableSubmitted] = useState(false);
  const [TimetableUploaded, setTimetableUploaded] = useState(false);
  const [TimetableUpdatedMsg, setTimetableUpdatedMsg] = useState(false);
  const [TimetableData, setTimetableData] = useState('');


  // Initialize cell contents with '' for each cell
  useEffect(() => {
    const initializeCellContents = () => {
      const initializedContents = {};
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
        const timeSlots = ['8:00 - 8:50', '9:00 - 9:50', '10:00 - 10:50', '11:00 - 11:50', '12:00 - 12:50', '13:20 - 14:10', '14:20 - 15:10', '15:20 - 16:10', '16:20 - 17:10'];
        timeSlots.forEach(timeSlot => {
          const key = `${day}_${timeSlot}`;
          initializedContents[key] = '';
        });
      });
      setCellContents(initializedContents);
    };
    initializeCellContents();
  }, []);



  // console.log("Checking Timetable uploaded or not", TimetableUploaded);

  const fetchTimetableData = async () => {
    try {
      const key = JSON.parse(localStorage.getItem("key"));
      console.log("Token:", key);
  
      if (!key) {
        console.error('Bearer token is missing.');
        return;
      }
  
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user._id;
      console.log("Checking user ID", userId);
  
      const config = {
        headers: { Accept: 'application/json', Authorization: `Bearer ${key}` },
      };
  
      const url = `/api/fyp/FetchStudTimetable?userId=${userId}`; // Update with the correct endpoint URL
  
      console.log("Before fetching timetable data");
      const response = await axios.get(url, config);
  
      console.log("Checking timetable data:", response.data);
  
      if (response.status === 200) {
        if(response.data.timetableData.length === 0){
          console.log("Runninggggggggggggggggg");
          setTimetableUploaded(false);
        }
        else{
        // Handle successful response
        setTimetableData(response.data.timetableData[0]);
        setTimetableUploaded(true);
        localStorage.setItem('timetableUploaded', true); // Set timetableUploaded status in local storage


        console.log('Timetable data fetched successfully');
      }
        // Do something with the timetable data
      } else {
        
        console.error('Error fetching timetable data:', response.statusText);
      }
    } catch (error) {
      console.error('Error during fetch timetable data:', error);
    }
  };

  useEffect(() => {
    
    fetchTimetableData();
  }, []);

  const handleInputChange = (day, timeSlot, value) => {
    const key = `${day}_${timeSlot}`;
    // Update the cell content with the entered value only if it's not empty
    if (value.trim() !== '') {
      setCellContents(prevState => ({
        ...prevState,
        [key]: value
      }));
      if (editingMode) {
        setTimetableData(prevData => ({
          ...prevData,
          [day]: {
            ...prevData[day],
            [timeSlot]: value
          }
        }));
      }
    } else {
      setCellContents(prevState => ({
        ...prevState,
        [key]: ''
      }));
      if (editingMode) {
        setTimetableData(prevData => ({
          ...prevData,
          [day]: {
            ...prevData[day],
            [timeSlot]: ''
          }
        }));
      }
    }
  };
  


// const handleInputChange = (day, timeSlot, value) => {
//   const key = `${day}_${timeSlot}`;
//   // Check if editing mode is enabled
//   if (editingMode) {
//       // Update the cell content directly in the TimetableData state
//       setTimetableData(prevData => {
//           // Create a copy of the previous TimetableData
//           const newData = { ...prevData };
//           // Update the cell content
//           if (!newData[day]) {
//               newData[day] = [];
//           }
//           const timeIndex = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:20', '14:20', '15:20', '16:20'].indexOf(timeSlot);
//           newData[day][timeIndex] = { slot: timeSlot, class: value };
//           return newData;
//       });
//   }
// };



const handleAddButtonClick = async () => {
  
  setEditingMode(false);
  setShowEditButton(true);
  console.log("Add button clicked");
  try {
      console.log("Timetable Data:");
      const formattedTimetableData = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: []
      };
      const timeSlots = ['8:00 - 8:50', '9:00 - 9:50', '10:00 - 10:50', '11:00 - 11:50', '12:00 - 12:50', '13:20 - 14:10', '14:20 - 15:10', '15:20 - 16:10', '16:20 - 17:10'];
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

      // Iterate over each day and assign time slots
      days.forEach((day, dayIndex) => {
          timeSlots.forEach((slot, slotIndex) => {
              const key = `${day}_${slotIndex + 8}:00`;
              const classValue = cellContents[key] || '';
              formattedTimetableData[day].push({ slot, class: classValue });
          });
      });
      // days.forEach((day) => {
      //   formattedTimetableData[day] = timeSlots.map((slot) => ({
      //     slot,
      //     class: cellContents[`${day}_${slot}`] || '' // Use the time slot string in the key
      //   }));
      // });
      console.log("Checking Formatted Dataaaaaaaaaaaaaaaaaaaaa",formattedTimetableData);

      
      const nId = localStorage.getItem('user');
      const parseId = JSON.parse(nId);
      const userId = parseId._id;
      console.log("CHecking user id", userId);

      const apiUrl = '/api/fyp/AddStudTimetable';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          timetableData: formattedTimetableData,
          user: userId
        }),
      });
  console.log("Request sent from front end");
      if (response.ok) {
        console.log('Timetable data added successfully');
        setConfirmationVisible(true);
        setTimetableAdded(true);
        setTimetableSubmitted(true);
        window.location.reload();
        
        // // Clear timetable data or perform any additional actions as needed
        // setTimetableData({});
        // // Show success message or perform additional actions if needed
      } else {
        console.log('Failed to add timetable data');
        // Handle error response
      }

    

      // Reset confirmation after 3 seconds
      setTimeout(() => {
          setConfirmationVisible(false);
          setTimetableSubmitted(false);
      }, 3000);
  } catch (error) {
      console.error('Error adding timetable:', error);
  }
};

const handleUpdateButtonClick = async () => {
  try {
    console.log("Timetable Data:");
    const formattedTimetableData = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: []
    };
    const timeSlots = ['8:00 - 8:50', '9:00 - 9:50', '10:00 - 10:50', '11:00 - 11:50', '12:00 - 12:50', '13:20 - 14:10', '14:20 - 15:10', '15:20 - 16:10', '16:20 - 17:10'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Iterate over each day and assign time slots
   // Create a copy of the existing timetable data
   const mergedTimetableData = { ...formattedTimetableData }; // Use formattedTimetableData as the base

   days.forEach((day) => {
     timeSlots.forEach((slot, slotIndex) => {
       const key = `${day}_${slotIndex + 8}:00`;
       const classValue = cellContents[key] || '';
       if (classValue !== '') {
         if (!mergedTimetableData[day]) {
           mergedTimetableData[day] = [];
         }
         mergedTimetableData[day][slotIndex] = { slot, class: classValue };
       }
     });
   });

console.log("Checking Merged Timetable Data", mergedTimetableData);

    const nId = localStorage.getItem('user');
    const parseId = JSON.parse(nId);
    const userId = parseId._id;
    console.log("Checking user id", userId);

    const nkey = localStorage.getItem('key');
    const token = JSON.parse(nkey);

    const apiUrl = '/api/fyp/UpdateStudTimetable'; // Update with the correct endpoint URL for updating timetable data

    const response = await fetch(apiUrl, {
      method: 'PATCH', // Change the request method to PATCH
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        timetableData: mergedTimetableData,
        user: userId,
      }),
    });

    console.log("Request sent from front end");
    if (response.ok) {
      console.log('Timetable data updated successfully');
      setConfirmationVisible(true);
      setTimetableAdded(true);
      setTimetableSubmitted(true);
      setTimetableUploaded(true);
    } else {
      console.log('Failed to update timetable data');
      // Handle error response
    }

    // Reset confirmation after 3 seconds
    setTimeout(() => {
      setConfirmationVisible(false);
      setTimetableSubmitted(false);
    }, 3000);
  } catch (error) {
    console.error('Error updating timetable:', error);
  }
};


// const handleUpdateButtonClick = async () => {
 

//   console.log("isnide updateTimetable api code ");
//   try {
    
//       console.log("Timetable Data:");
//       const formattedTimetableData = {
//           Monday: [],
//           Tuesday: [],
//           Wednesday: [],
//           Thursday: [],
//           Friday: []
//       };
//       const timeSlots = ['8:00 - 8:50', '9:00 - 9:50', '10:00 - 10:50', '11:00 - 11:50', '12:00 - 12:50', '13:20 - 14:10', '14:20 - 15:10', '15:20 - 16:10', '16:20 - 17:10'];
//       const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

//       // Iterate over each day and assign time slots
//       days.forEach((day, dayIndex) => {
//           timeSlots.forEach((slot, slotIndex) => {
//               const key = `${day}_${slotIndex + 8}:00`;
//               const classValue = cellContents[key] || '';
//               formattedTimetableData[day].push({ slot, class: classValue });
//           });
//       });
//       // days.forEach((day) => {
//       //   formattedTimetableData[day] = timeSlots.map((slot) => ({
//       //     slot,
//       //     class: cellContents[`${day}_${slot}`] || '' // Use the time slot string in the key
//       //   }));
//       // });
//       console.log("Checking Formatted Updateddddddddddd Dataaaaaaaaaaaaaaaaaaaaa",formattedTimetableData);
//       console.log("Checking Formatted Updateddddddddddd Dataaaaaaaaaaaaaaaaaaaaa",formattedTimetableData);
//       console.log("Checking Formatted Updateddddddddddd Dataaaaaaaaaaaaaaaaaaaaa",formattedTimetableData);

      
//       const nId = localStorage.getItem('user');
//       const parseId = JSON.parse(nId);
//       const userId = parseId._id;
//       console.log("CHecking user id", userId);

      
//       const nkey = localStorage.getItem('key');
//       const token = JSON.parse(nkey);
  

//     const apiUrl = '/api/fyp/UpdateStudTimetable'; // Update with the correct endpoint URL for updating timetable data

//     const response = await fetch(apiUrl, {
//       method: 'PATCH', // Change the request method to PATCH
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         timetableData: formattedTimetableData,
//         user: userId,
//       }),
//     });

//     console.log("Request sent from front end");
//     if (response.ok) {
//       console.log('Timetable data updated successfully');
//       setConfirmationVisible(true);
//       setTimetableAdded(true);
//       setTimetableSubmitted(true);
//       setTimetableUploaded(true);
//     } else {
//       console.log('Failed to update timetable data');
//       // Handle error response
//     }

//     // Reset confirmation after 3 seconds
//     setTimeout(() => {
//       setConfirmationVisible(false);
//       setTimetableSubmitted(false);
//     }, 3000);
//   } catch (error) {
//     console.error('Error updating timetable:', error);
//   }
// };

// const handleUpdateButtonClick = async () => {
 
//   console.log("Update button clicked");
//   try {
//     console.log("Timetable Data:");
//     const formattedTimetableData = {
//       Monday: [],
//       Tuesday: [],
//       Wednesday: [],
//       Thursday: [],
//       Friday: []
//     };
//     const timeSlots = ['8:00 - 8:50', '9:00 - 9:50', '10:00 - 10:50', '11:00 - 11:50', '12:00 - 12:50', '13:20 - 14:10', '14:20 - 15:10', '15:20 - 16:10', '16:20 - 17:10'];
//     const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

//     // Iterate over each day and assign time slots
//     days.forEach((day, dayIndex) => {
//       timeSlots.forEach((slot, slotIndex) => {
//         const key = `${day}_${slotIndex + 8}:00`;
//         const classValue = cellContents[key] || '';
//         formattedTimetableData[day].push({ slot, class: classValue });
//       });
//     });

//     console.log("Checking Updateddddddddd Formatted Dataaaaaaaaaaaaaaaaaaaaa", formattedTimetableData);

//     const nId = localStorage.getItem('user');
//     const parseId = JSON.parse(nId);
//     const userId = parseId._id;
//     console.log("Checking user id", userId);

//     const nkey = localStorage.getItem('key');
//     const token = JSON.parse(nkey);

//     await updateTimetableData(formattedTimetableData, userId, token);
//   } catch (error) {
//     console.error('Error updating timetable:', error);
//   }
// };


  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse">
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-white bg-primary border border-b-0 text-xl rounded-xl focus:ring-4 focus:ring-gray-200 gap-3 mb-4"
          data-accordion-target={`#accordion-collapse-body-timetable-${accordionId}`}
          aria-expanded="false"
          aria-controls={`accordion-collapse-body-timetable-${accordionId}`}
        >
          <span>{TimetableUploaded ? 'Added Timetable' : 'Add Timetable'}</span>
          <svg
            data-accordion-icon
            className="w-3 h-3 rotate-180 shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
          </svg>
        </button>
      </h2>
  
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
  
        <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
        {confirmationVisible && (
          <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2">
            {TimetableUpdatedMsg ? 'Timetable updated successfully' : 'Timetable uploaded successfully'}
          </div>
        )}
          {/* Timetable Table */}
          {TimetableUploaded && (
              <div className="flex justify-end cursor-pointer" onClick={() => setEditingMode(!editingMode)}>
                <CiEdit className='w-8 h-8' />
              </div>
            )}
          <div className="table-container overflow-x-auto relative">
         
            <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50 border-collapse border border-gray-300 overflow-x-hidden">
              <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                <tr className='border-b'>
                  <th className=" px-3 py-3 border-r">Slots</th>
                  {['8:00 - 8:50', '9:00 - 9:50', '10:00 - 10:50', '11:00 - 11:50', '12:00 - 12:50', '13:20 - 14:10', '14:20 - 15:10', '15:20 - 16:10', '16:20 - 17:10'].map((slot, index) => (
                    <th key={index} className="px-2 py-3 border-r">{slot}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
    <tr key={day} className="border-b">
      <td className="pl-2 py-4 border-r font-semibold"  >{day}</td>
      {['8:00', '9:00', '10:00', '11:00', '12:00', '13:20', '14:20', '15:20', '16:20'].map((timeSlot, index) => {
        const key = `${day}_${timeSlot}`;
        const timetableSlot = TimetableData && TimetableData[day] ? TimetableData[day][index] : null;
        const cellContent = timetableSlot ? timetableSlot.class : cellContents[key];

        return (
          <td key={key} className={`px-2 py-4 text-center border-r max-w-[3.125rem] ${editingMode && !timetableSubmitted ? 'editable' : ''}`}>
            <input
              type="text"
              className='w-full'
              // value={cellContent}
              defaultValue={cellContent}
              onChange={(e) => handleInputChange(day, timeSlot, e.target.value)}
              disabled={!editingMode}
              placeholder='-'
              // readOnly={!editingMode || timetableSubmitted}
              // onClick={(e) => {
              //   if (cellContent === '') {
              //     handleInputChange(day, timeSlot, '');
              //   }
              // }}
            />
          </td>
        );
      })}
    </tr>
  ))}
</tbody>
            </table>
          
          </div>
          <div className='text-right mt-6'>
            {TimetableUploaded ? (
              <Simple text={'Update'} onClick={handleUpdateButtonClick} />
            ) : (
              <Simple text={'Add'} onClick={handleAddButtonClick} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default TimetableAccordion;



