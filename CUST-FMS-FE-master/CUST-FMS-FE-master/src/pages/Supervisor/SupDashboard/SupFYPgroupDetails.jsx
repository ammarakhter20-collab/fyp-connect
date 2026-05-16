import React from 'react';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import Simple from '../../../Components/Buttons/Simple';
const FYPgroupDetails = ({ data, clickOnviewAllinFYPGroup, viewprojectdetailClick }) => {
  const handleClick = () => {
    clickOnviewAllinFYPGroup();
    console.log('Button clicked!');
  };
  console.log("DATAAAA", data)
  return (
    <>

      <div className=''>
        <h1 className='text-indigo-950 text-2xl font-semibold my-4 mx-4'>FYP Groups</h1>
        <div className="relative max-h-96 overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full table-fixed text-center text-sm  text-gray-500 ">
            <thead className="text-xs text-indigo-950 uppercase bg-gray-50 ">
              <tr className=''>
                <th colSpan="6" scope="col" className="px-2 py-3">
                  <div className='flex justify-end'>
                    <div>
                      <Simple text="View All" onClick={handleClick} />
                    </div>
                  </div>
                </th>
              </tr>
              <tr>
                <th scope="col" className="px-6 md:px-3 py-3 ">
                  Group no
                </th>
                <th scope="col" className="px-6 md:px-3 py-3">
                  FYP Title
                </th>
                <th scope="col" className="px-6 md:px-3 py-3">
                  Members
                </th>
                <th scope="col" className="px-6 md:px-3 py-3">
                  Term
                </th>
                <th scope="col" className="px-6 md:px-3 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 md:px-3 py-3">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className=' text-center'>
              {data.map((item, index) => (
                <tr key={index} className="bg-white border-b  hover:bg-gray-50 ">

                  <td className=" items-center px-6 py-4 md:px-3 text-gray-900 whitespace-nowrap ">
                    <div className="">
                      <div className="text-base font-normal ">{item.groupNo}</div>
                    </div>
                  </td>

                  <td className="px-6 md:px-3  py-4">{item.fypTitle}</td>

                  <td className="px-6 md:px-3 py-4">
                    {item.members.map((member, index) => (
                      <div className='flex items-start' key={index}>
                        <div>{member.Name} ({member.RegistrationNo})</div>
                      </div>
                    ))}
                  </td>
                  <td className="px-6 md:px-3 py-4">{item.term}</td>
                  <td className="px-6 md:px-3 py-4">{item.status}</td>
                  <td className="px-6 md:px-3 py-4"><button className="underline underline-offset-1" onClick={() => viewprojectdetailClick(item._id)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FYPgroupDetails;
