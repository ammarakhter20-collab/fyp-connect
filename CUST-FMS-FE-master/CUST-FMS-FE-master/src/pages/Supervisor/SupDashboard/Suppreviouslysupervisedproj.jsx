import React from 'react';

const previouslysupervisedproj = ({ data }) => {
  //   const [categoryFilter, setCategoryFilter] = useState('');

  // Function to handle filter button click
  const handleFilter = (category) => {
    //  setCategoryFilter(category);
  };

  // Function to handle view detail button click
  const handleViewDetail = (projectId) => {
    // Logic to navigate to project detail page or show modal
    console.log(`View detail clicked for project ${projectId}`);
  };

  return (
    <div className="w-[87%] md:w-[60%]">
      <h1 className='text-indigo-950 text-2xl font-semibold my-4 mx-4'>Previously Supervised Projects</h1>
      {/* Filter button */}
      <div className="flex justify-end py-4 pr-2 bg-gray-50" >
        <button
          className="text-white py-3 px-12 mt-3 bg-primary hover:bg-indigo-900 focus:ring-4 focus:ring-blue-300 font-medium text-sm w-44 h-11 text-center mb-0"
          onClick={() => handleFilter('category')}
        >
          Categories
        </button>
      </div>

      {/* Table */}
      <table className="w-full table-fixed text-center text-sm  text-gray-500 border rounded-md shadow-md">
        <thead className="text-xs text-indigo-900 uppercase bg-gray-50 ">
          {/* <tr className=' w-full'>
                <th scope="col" className="px-6 py-3">
                  <div className=''>
                    <Simple text="View All" onClick={handleClick} />
                  </div>
                </th>
              </tr> */}
          <tr>
            <th scope="col" className="px-6 md:px-3 py-3 ">
              Project Title
            </th>
            <th scope="col" className="px-6 md:px-3 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody className=' text-center'>
          {data?.map((item, index) => (
            <tr key={index} className="bg-white border-b  hover:bg-gray-50 ">
              <td className="px-6 md:px-3  py-4">{item.Title}</td>
              <td className="px-6 md:px-3 py-4"><a className="underline underline-offset-1" href="http://">View</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default previouslysupervisedproj;
