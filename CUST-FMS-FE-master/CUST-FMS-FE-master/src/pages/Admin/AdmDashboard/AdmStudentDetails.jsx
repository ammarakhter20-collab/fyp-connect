import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';


const AdmStudentDetails = ({students, onViewStudent}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
     useEffect(() => {

        if (students && Object.keys(students).length > 0) {
          setIsLoading(false);
        }
      }, [students]); 
console.log("Students", students);

const handleViewStudent = (student) => {
  onViewStudent(student);
  setShowDetails(false);
}
  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className='relative'>
          <p className='font-bold text-2xl mb-4'>Student Details</p>
         
            <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
              {/* Timetable Table */}
              <div className="table-container overflow-x-auto relative h-72 overflow-y-auto">
                <table className="w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300">
                  <thead className="text-xs text-indigo-900 uppercase bg-gray-50     sticky top-0">
                    <tr className='border-b text-center'>
                      <th className="px-6 py-3 w-52">Sr no</th>
                      <th className="px-6 py-3 w-80 text">Name</th>
                      {/* <th className="px-6 py-3 w-80 text">Part Status</th> */}
                      <th className="px-6 py-3 w-80">Email</th>
                      <th className="px-6 py-3 w-52">Phone number</th>
                      <th className="px-6 py-3 w-52">Department</th>
                      <th className="px-6 py-3 w-52">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {students.map((student, index) => {
                      console.log('Current Student:', student._id);
                      return (
                        <tr key={student._id} className='text-center font-normal'>
                          <td className='px-6 py-4'>{index + 1}</td>
                          <td className='px-6 py-4'>{student.name}</td>
                          <td className='px-6 py-4'>{student.email}</td>
                          <td className='px-6 py-4'>{student.phoneNumber}</td>
                          <td className='px-6 py-4'>{student.department.departmentName}</td>
                          <td className='px-6 py-4'>
                            <button className='underline mx-2' onClick={() => handleViewStudent(student)}>View</button>
                          </td>
                        </tr>
                      );
                    })} */}

{Array.isArray(students) && students.length > 0 ? (
  students.map((student, index) => (
    <tr key={student._id} className='text-center font-normal'>
      <td className='px-6 py-4'>{index + 1}</td>
      <td className='px-6 py-4'>{student.name}</td>
     
      <td className='px-6 py-4'>{student.email}</td>
      <td className='px-6 py-4'>{student.phoneNumber}</td>
      <td className='px-6 py-4'>{student.department && student.department.departmentName}</td>
      <td className='px-6 py-4'>
        <button className='underline mx-2' onClick={() => handleViewStudent(student)}>
          View
        </button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan='6' className='text-center py-4'>No students found</td>
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

export default AdmStudentDetails;
