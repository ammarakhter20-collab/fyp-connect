import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';

const AdmFacultyDetails = ({faculties, onViewFaculty}) => {
  
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {

     if (faculties && Object.keys(faculties).length > 0) {
       setIsLoading(false);
     }
   }, [faculties]); 
console.log("faculties", faculties);


const handleViewFaculty = (faculty) =>  {
onViewFaculty(faculty);
console.log("Hanlde View Faculty called");
}
    return (
        <>
         {isLoading ? (
       
       <LoadingSpinner />
     ) : (
        <div className='relative'>

        
            <p className='font-bold text-2xl mb-4 mt-10'>Faculty Details</p>
          <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
            {/* Timetable Table */}
            <div className="table-container overflow-x-auto relative h-72 overflow-y-auto">
              <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
                <thead className="text-xs text-indigo-900 uppercase bg-gray-50     sticky top-0">
                  <tr className='border-b text-center'>
                    <th className="px-6 py-3  w-52">Sr no</th>
                    <th className="px-6 py-3  w-64 text">Name</th>
                    <th className="px-6 py-3  w-64">Email</th>
                    <th className="px-6 py-3  w-72">Phone</th>
                    <th className="px-6 py-3  w-44">Role</th>
                    <th className="px-6 py-3  w-80">CNIC</th>
                    <th className="px-6 py-3  w-52">Designation</th>
                    <th className="px-6 py-3  w-52">Department</th> 
                    <th className="px-6 py-3  w-44">Details</th>
                  </tr>
                </thead>
                <tbody>
                {Array.isArray(faculties) && faculties.length > 0 ? (
  faculties.map((faculty, index) => (
    <tr key={faculty._id} className='text-center font-normal'>
      <td className='px-6 py-4'>{index + 1}</td>
      <td className='px-6 py-4'>{faculty.name}</td>
      <td className='px-6 py-4'>{faculty.email}</td>
      <td className='px-6 py-4'>{faculty.phoneNumber}</td>
      <td className='px-6 py-4'>{faculty.role}</td>
      <td className='px-6 py-4'>{faculty.cnic}</td>
      <td className='px-6 py-4'>{faculty.designation}</td>
      {/* <td className='px-6 py-4'>{faculty.department.departmentName}</td> */}
      <td className='px-6 py-4'>
  {faculty.department && faculty.department.departmentName ? (
    // Display departmentName if available in faculty.department
    faculty.department.departmentName
  ) : (
    faculty.department ? faculty.department: 'Hello'
    // Display department.label if departmentName is not available
  )}
</td>

      <td className='px-6 py-4'>
        <button className='underline mx-2' onClick={() => handleViewFaculty(faculty)}>
          View
        </button>
        
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan='9' className='text-center py-4'>No faculties found</td>
  </tr>
)}
                </tbody>
              </table>
            </div>
          </div>
          </div>
     )}
        </>
      );
    };

export default AdmFacultyDetails
