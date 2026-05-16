import React from 'react'

const GroupMembers = ({data}) => {
    return (
        <>
          <div className='mt-7'>
            <h1 className='text-black text-2xl font-semibold'></h1>
            <div className="relative max-h-52 overflow-auto shadow-md sm:rounded-lg w-[100%]">
              <table className="w-full text-sm text-center rtl:text-right text-gray-500 ">
                <thead className="text-xs text-indigo-900 uppercase bg-gray-50 ">
                  <tr>
                    <th scope="col" className="px-4 py-4">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Reg no.
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Cgpa
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Cr.Hrs
                    </th>
                    <th scope="col" className="px-4 py-4">
                      Term
                    </th>
                    
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                      <td className="py-4">{item.name}</td>
                      <td className="py-4">{item.regno}</td>
                      <td className="py-4">{item.cgpa}</td>
                      <td className="py-4">{item.crHrs}</td>
                      <td className="py-4"> {item.term}</td> 
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
  )
}

export default GroupMembers
