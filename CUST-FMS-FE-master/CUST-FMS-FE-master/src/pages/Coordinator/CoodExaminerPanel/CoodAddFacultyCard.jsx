// import React, { useState, useRef, useEffect } from 'react';
// import Simple from '../../../Components/Buttons/Simple';
// import Select from 'react-select';




// const CoodPanelCreationCard = ({ onclose, saveFaculty, departmentOptions, facultyData, facultytoEdit }) => {

//     console.log("fac DATAaaaaaAAAAaaaaaaaaaaaaa", facultyData);

//     const [department, setDepartment] = useState('');
//     const [facultyName, setFacultyName] = useState('');
//     const [facultyRole, setFacultyRole] = useState('');

//     const filteredFaculty = facultyData.filter(faculty => faculty.department === department.departmentName);
//     const data = filteredFaculty.map(faculty => ({
//      ...faculty
//     }));

//     console.log("FilteredFaculttttyy in Add Faculty Card", filteredFaculty);


   
//     const handleDepartmentChange = (selectedOption) => {

//         setDepartment(selectedOption);

//     };
//     const handleRoleChange = (selectedOption) => {

//         setFacultyRole(selectedOption);

//     };
//     const handleFacultyChange = (selectedOption) => {
//         console.log(selectedOption, "OOP")

//         setFacultyName(selectedOption);

//     };


//     const cardRef = useRef(null);

//     // const handleFacultyChange = e => {
//     //     setFacultyName(e.target.value);
//     // };

//     const handleSubmit = () => {
//         const data = { 
//             department: department.value, 
//             member: facultyName.value,
//             program: facultyName.programId,
//             term: facultyName.termId,
//             role: facultyRole.value,
//         };  
//         saveFaculty(data);
//         setDepartment('');
//         setFacultyName('');
//         setFacultyRole('');
//         onclose();
//     };


//     // useEffect(() => {
//     //     document.addEventListener('mousedown', handleClickOutside);
//     //     return () => {
//     //         document.removeEventListener('mousedown', handleClickOutside);
//     //     };
//     // }, []);

//     return (
//         <div className="bg-white shadow-md rounded-lg p-6 w-[30%] h-auto" ref={cardRef}>
//             <div>
//             <h4 className='flex justify-center text-indigo-950 my-6 text-2xl'>Add Faculty</h4>

//             <form>
//                 <div className="my-4">
//                     <label htmlFor='department' className="block text-md font-semibold text-gray-700">Department
//                         <Select
//                             id='departmentDropdown'
//                             name='departmentDropdown'
//                             className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
//                             options={departmentOptions}
//                             isSearchable
//                             onChange={handleDepartmentChange} // Use handleDepartmentChange instead of handleDepartmentNameChange
//                             value={department}
//                             placeholder='Select or type Department'
//                         //isDisabled={modalMode === 'view'}
//                         />
//                     </label>



//                 </div>
//                 <div className="my-4">
//                     <label htmlFor='faculty' className="block text-md font-semibold text-gray-700">Faculty
//                         <Select
//                             id='faculty'
//                             name='faculty'
//                             className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
//                             options={data}
//                             isSearchable
//                             onChange={handleFacultyChange} // Use handleDepartmentChange instead of handleDepartmentNameChange
//                             value={facultyName}
//                             placeholder='Select or type'
//                         //isDisabled={modalMode === 'view'}
//                         />
//                     </label>
//                 </div>
//                 <div className="my-4">
//                     <label htmlFor='facultyrole' className="block text-md font-semibold text-gray-700">Role
//                         <Select
//                             id='facultyrole'
//                             name='facultyrole'
//                             className={`bg-white border border-gray-300 text-black text-sm rounded-2xl block w-full p-2.5`}
//                             //className="border p-4 h-14 border-gray-300 rounded-2xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm"

//                             options={[{value: 'panelhead', label: 'Panel Head'}, {value: 'examiner', label: 'Examiner'}]}
//                             isSearchable
//                             onChange={handleRoleChange} // Use handleDepartmentChange instead of handleDepartmentNameChange
//                             value={facultyRole}
//                             placeholder='Select or type'
//                         //isDisabled={modalMode === 'view'}
//                         />
//                     </label>
//                 </div>
//                 <div className="col-span-1 flex justify-center my-2">
//                     <Simple text="Save" type="Submit" onClick={handleSubmit} />
//                 </div>
//             </form>
//             </div>
//         </div>
//     );
// };

// export default CoodPanelCreationCard;
