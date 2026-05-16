import React, { useEffect, useState } from 'react';
import FilterButton from '../../../Components/Buttons/FilterButton';
import axios from 'axios';

const AllTopicsOffered = ({ AllOfferedTopics, Categories }) => {
    const [selectedCategory, setSelectedCategory] = useState({ label: 'All', value: 'All' }); // State to store selected category, initialized to "All"
    const [supervisorNames, setSupervisorNames] = useState({});

    // Function to handle category filter change
    const handleCategoryFilter = (category) => {
        setSelectedCategory(category); // Update selected category
    };
    
    const fetchSupervisorName = async (supervisorId) => {
        try {
            const response = await axios.get(`/api/auth/supervisors/${supervisorId}`); // Replace '/api/supervisors' with your actual backend endpoint
            return response.data.name; // Assuming the supervisor's name is in the 'name' field of the response
        } catch (error) {
            console.error(`Error fetching supervisor name for ID ${supervisorId}:`, error);
            return 'Unknown'; // Return a default value if there's an error
        }
    };

    useEffect(() => {
        const fetchSupervisorNames = async () => {
            const names = {};
            for (const topic of AllOfferedTopics) {
                if (!names[topic.uploadedBy]) {
                    names[topic.uploadedBy] = await fetchSupervisorName(topic.uploadedBy);
                }
            }
            setSupervisorNames(names);
        };
        fetchSupervisorNames();
    }, [AllOfferedTopics]);

    // Filter topics based on the selected category
    const filteredTopics = selectedCategory.value === 'All' ?
        AllOfferedTopics :
        AllOfferedTopics.filter(topic => topic.category === selectedCategory.value);

    
        return (
            <>
                <div>
                    <div className='flex justify-end'>
                        <div className="my-5 mr-2">
                            <FilterButton
                                text={'Filter'}
                                dropdownOptions={Categories.map(category => ({ label: category.category, value: category.category }))}
                                onClick={handleCategoryFilter}
                            />
                        </div>
                    </div>
                    <div className="relative overflow-x-auto max-h-96 shadow-md sm:rounded-lg">
                        <table className="w-full table-fixed text-center text-sm text-gray-500 bg-white">
                            <thead>
                                <tr>
                                    <th className="px-6 md:px-3 py-4 font-semibold text-indigo-950">Sr. no</th>
                                    <th className="px-6 md:px-3 py-4 font-semibold text-indigo-950">FYP Title</th>
                                    <th className="px-6 md:px-3 py-4 font-semibold text-indigo-950">Category</th>
                                    <th className="px-6 md:px-3 py-4 font-semibold text-indigo-950">Supervisor</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {filteredTopics.map((item, index) => (
                                    <tr key={item._id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 md:px-3 py-4">{index + 1}</td>
                                        <td className="px-6 md:px-3 py-4">{item.topic}</td>
                                        <td className="px-6 md:px-3 py-4">{item.category}</td>
                                        <td className="px-6 md:px-3 py-4">{supervisorNames[item.uploadedBy]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        );
    };
    
    export default AllTopicsOffered;
