import React, { useEffect, useState } from 'react';

const ProjDetails = ({ data, isFYPRegistered }) => {
  const [FypData, setFypData] = useState(null); 

  useEffect(() => {
    const fetchFYPData = async () => {
      try {
        // Fetch data from localStorage
        const storedData = localStorage.getItem('FYPData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log("parsed FYP data checking", parsedData.groupMembers[0].term.sessionTerm);
          // Set data in state
          setFypData(parsedData);
        }
      } catch (error) {
        console.error('Error fetching data from localStorage:', error);
      }
    };

    fetchFYPData();
  }, []); 

  return (
    <>
          <div className='mt-[-90px]'>
            
            <h1 className='text-black text-2xl font-semibold'>Project Details</h1>
          <div className="relative max-h-96 overflow-x-auto shadow-md sm:rounded-lg">
          {FypData && (
  <table className="w-full text-center text-sm text-gray-500   hover:bg-slate-500 hover:cursor-pointer">
    <thead className="text-xs text-indigo-900 uppercase bg-gray-50    ">
      <tr className='border-b text-center'>
        {/* Conditional rendering of table headers */}
        {FypData.reqStatus === "pending" || FypData.reqStatus === "rejected" || FypData.reqStatus === "partial-deny" ? (
          <>
            <th className="px-6 py-3 w-52 text-left">FYP Title</th>
            <th className="px-6 py-3 w-40 text-left">Supervision Request to</th>
          </>
        ) : (
          <>
            <th className="px-6 py-3 w-52 text-left">FYP Title</th>
            <th className="px-6 py-3 w-40 ">Supervisor</th>
            <th className="px-6 py-3 w-32">Panel</th>
          </>
        )}
        {/* Common table headers */}
        <th className="px-6 py-3 w-32">Term</th>
        <th className="px-6 py-3 w-32">Category</th>
        <th className="px-6 py-3 w-32">Platform</th>
        <th className="px-6 py-3 w-32">Technology</th>
      </tr>
    </thead>
    <tbody>
      {/* Rendering table rows */}
      <tr className="text-center font-normal bg-white">
        <td className="px-6 py-4 text-start">{FypData.topicData.topic}</td>
        {/* Conditional rendering of table data based on reqStatus */}
        {FypData.reqStatus === "pending" || FypData.reqStatus === "rejected" || FypData.reqStatus === "partial-deny" ? (
          <td className="px-6 py-4 text-start">{FypData.selectedOption.name}</td>
        ) : (
          <>
            <td className="px-6 py-4">{FypData.selectedOption.name}</td>
            <td className="px-6 py-4">Not assigned yet</td>
          </>
        )}
        <td className="px-6 py-4">{FypData.groupMembers[0].term.sessionTerm}</td>
        <td className="px-6 py-4">{FypData.topicData.category}</td>
        <td className="px-6 py-4">{FypData.selectedPlatform.platformName}</td>
        <td className="px-6 py-4">{FypData.selectedTechnology.techName}</td>
      </tr>
    </tbody>
  </table>
)}
          </div>
          </div>
          </>
  );
};

export default ProjDetails;
