import React, { useEffect, useState } from 'react'

const GroupMembers = ({data}) => {
  const [FypData, setFypData] = useState('');
  useEffect(() => {
    const fetchFYPData = () => {
      try {
        // Retrieve FYPData from localStorage
        const FYPDataString = localStorage.getItem('FYPData');
  
        // Parse the string to convert it back to an object
        const FYPData = JSON.parse(FYPDataString);
  
        // Check if FYPData is not null or undefined
        if (FYPData) {
          // Set the fetched data to your state variable
          setFypData(FYPData);
        } else {
          console.error('FYPData not found in localStorage.');
        }
      } catch (error) {
        console.error('Error fetching FYPData from localStorage:', error);
      }
    };
  
    // Call the function to fetch data from localStorage
    fetchFYPData();
  }, []);

  console.log("Checking FYP Data", FypData);
    return (
        <>
          <div className='mt-7'>
            
            <h1 className='text-black text-2xl font-semibold'></h1>
            <div className="relative max-h-52 overflow-auto shadow-md sm:rounded-lg w-[100%]">
            {FypData && (
              <table className="w-full text-sm text-center rtl:text-right text-gray-500">
                <thead className="text-xs text-indigo-900 uppercase bg-gray-50">
                  
                  <tr className='border-b text-center'>
                        <th className="px-6 py-3  w-52">Reg no</th>
                        <th className="px-6 py-3  w-[900px] text-left">Name</th>
                        <th className="px-6 py-3  w-44">CGPA</th>
                        <th className="px-6 py-3  w-44">Cr.Hrs</th>
                        <th className="px-6 py-3  w-44">Term</th>
                      </tr>
                  
                </thead>
                <tbody>
                {FypData.groupMembers.map((item, index) => (
                        <tr key={index} className="text-center font-normal">
                          {/* Display the task number based on the counter for the specific filter */}
                          <td className="px-6 py-4  ">{item.registrationNumber}</td>
                         
                          <td className="px-6 py-4   text-start">{item.name}</td>
                          <td className="px-6 py-4  ">{item?.cgpa}</td>
                          <td className="px-6 py-4  ">{item?.creditHours}</td>
                          <td className="px-6 py-4  ">{item.term?.sessionTerm}</td>
                          
                        </tr>
                      ))}
                </tbody>
              </table>
            )}
            </div>
            
          </div>
        </>
  )
}

export default GroupMembers
