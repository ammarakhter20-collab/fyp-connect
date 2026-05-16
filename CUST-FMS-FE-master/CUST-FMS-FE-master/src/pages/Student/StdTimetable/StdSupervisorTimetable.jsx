
import React, { useEffect, useState } from 'react';
import { initFlowbite } from 'flowbite';
import supervisorEnteredTt from './StdsupervisorEnteredTt';
import GenAccor from '../../../Components/Accordians/GenAccor';
import axios from 'axios';
import { CiEdit } from 'react-icons/ci';
import Simple from '../../../Components/Buttons/Simple';

const SupervisorTimetable = ({ accordionId }) => {
 
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [editingMode, setEditingMode] = useState(true);
  const [showEditButton, setShowEditButton] = useState(false);
  const [timetableAdded, setTimetableAdded] = useState(false);
  const [cellContents, setCellContents] = useState({});
  const [timetableSubmitted, setTimetableSubmitted] = useState(false);
  const [TimetableUploaded, setTimetableUploaded] = useState(false);
  const [TimetableUpdatedMsg, setTimetableUpdatedMsg] = useState(false);
  const [TimetableData, setTimetableData] = useState('');

  useEffect(() => {
    const initializeCellContents = () => {
      const initializedContents = {};
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
        const timeSlots = ['8:00 - 8:50', '9:00 - 9:50', '10:00 - 10:50', '11:00 - 11:50', '12:00 - 12:50', '13:20 - 14:10', '14:20 - 15:10', '15:20 - 16:10', '16:20 - 17:10'];
        timeSlots.forEach(timeSlot => {
          const key = `${day}_${timeSlot}`;
          initializedContents[key] = '-';
        });
      });
      setCellContents(initializedContents);
    };
    initializeCellContents();
  }, []);

  const fetchTimetableData = async () => {
    try {
      const key = JSON.parse(localStorage.getItem("key"));
      console.log("Token:", key);
  
      if (!key) {
        console.error('Bearer token is missing.');
        return;
      }
  
      const user = JSON.parse(localStorage.getItem("FYPData"));
      console.log("Checking user in supervisor timetable", user.selectedOption._id);
      const userId = user.selectedOption._id;
  
      const config = {
        headers: { Accept: 'application/json', Authorization: `Bearer ${key}` },
      };
  
      const url = `/api/fyp/FetchStudTimetable?userId=${userId}`;
  
      console.log("Before fetching timetable data");
      const response = await axios.get(url, config);
  
      console.log("Checking timetable data:", response.data);
  
      if (response.status === 200) {
        console.log("Checking fetched supervisor timetable", response.data.timetableData[0]);
        setTimetableData(response.data.timetableData[0]);
        console.log('Timetable data fetched successfully');
     
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
        [key]: '-'
      }));
      if (editingMode) {
        setTimetableData(prevData => ({
          ...prevData,
          [day]: {
            ...prevData[day],
            [timeSlot]: '-'
          }
        }));
      }
    }
  };

  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-5'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-white bg-primary border border-b-0 text-xl rounded-xl focus:ring-4 focus:ring-gray-200 gap-3 mb-4"
          data-accordion-target={`#accordion-collapse-body-timetable-${accordionId}`}
          aria-expanded="false"
          aria-controls={`accordion-collapse-body-timetable-${accordionId}`}
        >
          <span>Supervisor's Timetable</span>
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
          <div className="table-container overflow-x-auto relative mb-12 ">
            <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50 border-collapse border border-gray-300">
              <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                <tr className='border-b'>
                  <th className="px-1 py-2 border-r" style={{ minWidth: '-50px' }}>Slots</th>
                  {['8:00 - 8:50', '9:00 - 9:50', '10:00 - 10:50', '11:00 - 11:50', '12:00 - 12:50', '13:20 - 14:10', '14:20 - 15:10', '15:20 - 16:10', '16:20 - 17:10'].map((slot, index) => (
                    <th key={index} className="px-1 py-2 border-r" style={{ minWidth: '-50px' }}>
                      {slot}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody> 
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                  <tr key={day} className="border-b">
                    <td className="pl-1 py-3 border-r font-semibold">
                      {day}
                    </td>
                    {['8:00', '9:00', '10:00', '11:00', '12:00', '13:20', '14:20', '15:20', '16:20'].map((timeSlot, index) => {
                      const key = `${day}_${timeSlot}`;
                      const timetableSlot = TimetableData && TimetableData[day] ? TimetableData[day][index] : null;
                      const cellContent = timetableSlot ? timetableSlot.class : cellContents[key];
                      return (
                        <td key={key} className={`px-1 py-2 text-center border-r max-w-[3.125rem] ${editingMode && !timetableSubmitted ? 'editable' : ''}`}>
                          <input
                            type="text"
                            className='w-full'
                            value={cellContent}
                            disabled
                            readOnly
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorTimetable;
