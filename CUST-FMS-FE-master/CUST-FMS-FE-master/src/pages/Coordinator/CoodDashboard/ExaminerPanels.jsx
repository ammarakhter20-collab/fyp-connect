import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import GenAccor from '../../../Components/Accordians/GenAccor';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const ExaminerPanels = ({accordionId, handleViewButtonClick}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [PanelData , setPanelData] = useState('');
    // const [clickExamPanel, setClickExamPanel] = useState(false)




    const fetchAllCreatedPanels = async () => {

        try{
          setIsLoading(true);
          const key = JSON.parse(localStorage.getItem("key"));
        const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
          
        // Construct the URL with partStatus, supervisorId, and coordinatorId
        const url = '/api/manageexampanels/get-all-panels';
    
        const response = await axios.get(url, config);
    
        if (response.status !== 497) {
          if (!response.data || !response.data) {
            console.error('Error fetching Panels:', response.statusText);
            return;
          }
        } else {
          Navigate('/login');
        }
    
        setPanelData(response.data.panels);
    
      } catch (error) {
        console.error('Error fetching Panels Data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    console.log("Checking Panel Data", PanelData);

    useEffect(() => {
        fetchAllCreatedPanels();
    }, [])


    return (
        <>
           
           {isLoading ? (
           
           <LoadingSpinner />
         ) : (
          <div className='relative'>
          <p className='font-bold text-2xl mb-4'>Examiner Panels</p>
         
            <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
              {/* Timetable Table */}
              <div className="table-container overflow-x-auto relative">
                <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
                  <thead className="text-xs text-indigo-900 uppercase bg-gray-50    ">
                    <tr className='border-b text-center'>
                      <th className="px-6 py-3 w-52">Sr no</th>
                      <th className="px-6 py-3 w-80 text">Panel Name</th>
                      <th className="px-6 py-3 w-80">Panel Members</th>
                      <th className="px-6 py-3 w-52">Term</th>
                      <th className="px-6 py-3 w-52">Action</th>
                      
                    </tr>
                  </thead>
                  <tbody className="exam-table-body max-h-10 overflow-y-auto ">
             
                                         {PanelData && PanelData.length > 0 ? (
  PanelData && PanelData.map((item, index) => (
    <tr key={item._id} className="text-center">
      <td className="px-6 py-4 font-semibold">{index + 1}</td> 
      <td className="px-6 py-4 font-semibold text-center">{item?.panelName}</td>
      <td className="px-6 py-4 font-semibold text-center">
        {item.PanelMembers && item.PanelMembers.length > 0 ? (
          item.PanelMembers.map((panelMember, memberIndex) => (
            <div key={memberIndex} className="mb-2">
              {panelMember?.member?.name}({panelMember?.role})
            </div>
          ))
        ) : (
          <span>No members</span>
        )}
      </td>
      <td className="px-6 py-4 font-semibold">{item?.term?.sessionTerm}</td>
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

         )}
        </>
      )
    }

export default ExaminerPanels
