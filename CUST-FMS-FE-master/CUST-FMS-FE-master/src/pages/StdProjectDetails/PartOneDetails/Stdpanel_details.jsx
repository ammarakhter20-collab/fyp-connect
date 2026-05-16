import { Accordion } from 'flowbite-react';
//import Group_details from '../tables/groupdetails';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import GenAccor from '../../../Components/Accordians/GenAccor';
import { useEffect, useState } from 'react';
import { initFlowbite } from 'flowbite';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
const Panel_details = ({ data, accordionId }) => {
  const [AssignedPanel, setAssignedPanel] = useState('');
  const [PanelCode, setPanelCode] = useState('');
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [PanelMembers, setPanelMembers] = useState([]);
  useEffect(() => {
    initFlowbite();
  }, []);

  useEffect (() =>{
    const fypData = JSON.parse(localStorage.getItem("FYPData"));
    console.log("Checking FYP Group Details", fypData);
    setAssignedPanel(fypData.assignedPanel);


  }, [])

  useEffect (() => {
    fetchAssignedPanel();
  }, [])


  const fetchAssignedPanel = async () => {
    console.log("Checking panel id", AssignedPanel);
try {
  setLoadingSpinner(true);
  const key = JSON.parse(localStorage.getItem("key"));


  
  const config = { headers: { Accept: 'application/json', Authorization: `Bearer ${key}` } };
  
  // Construct the URL with partStatus, supervisorId, and coordinatorId
  const url = `/api/manageexampanels/getPanelPanelDetails/${AssignedPanel}`;

  const response = await axios.get(url, config);

  if (response.status !== 497) {
    if (!response.data || !response.data) {
      console.error('Error fetching announcement data:', response.statusText);
      return;
    }
  } else {
    Navigate('/login');
  }
  console.log("Checking Fetched Panel Detail Data", response.data.panel[0].panelCode);
  setPanelMembers(response.data.panel[0].members);
  setPanelCode(response.data.panel[0].panelCode);
 

} catch (error) {
  console.error('Error fetching Panel Details data:', error);
} finally {
  setLoadingSpinner(false);
}
};

  return (
    <>
    {loadingSpinner ? ( // Show loading spinner while loading is true
    <LoadingSpinner />
  ) : (
  
   <div>
  <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
      <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
        <GenAccor text="Panel Details" accordionId={accordionId} />
      </h2>
      <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
                {/* Timetable Table */}
                <div className="table-container overflow-x-auto relative">
                  <table className="w-full text-sm text-left rtl:text-center text-black bg-gray-50   border-collapse border border-gray-300">
                    <thead className="text-xs text-indigo-900 uppercase bg-gray-50    ">
                      <tr className='border-b text-center'>
                        
                        <th className="px-6 py-3  w-[300px] text-left">Name</th>
                        <th className="px-6 py-3  w-52">Designation</th>
                        <th className="px-6 py-3  w-52">Department</th>
                        <th className="px-6 py-3  w-52">Term</th>
                        <th className="px-6 py-3  w-52">Panel Code</th>
                      </tr>
                    </thead>
                    <tbody>
                    {PanelCode && PanelMembers && PanelMembers.map((item, index) => (
                        <tr key={index} className="text-center font-normal">
                          {/* Display the task number based on the counter for the specific filter */}
                          <td className="px-6 py-4 text-start">{item.member.name}</td> 
                    <td className="px-6 py-4">{item.role}</td>
                    <td className="px-6 py-4">{item.member.department.departmentName}</td>
                    <td className="px-6 py-4">{item.member.department.term.sessionTerm}</td> 
                    <td className="px-6 py-4">{PanelCode && PanelCode}</td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          </div>
                    )}
                    </>
  );
};

export default Panel_details;







