import React from 'react'
import { RiPhoneLine } from "react-icons/ri";

const Contactinfo = ({ image, name, designation }) => {
    return (
        <div className="grid grid-cols-12 items-center space-x-4 border border-b-gray-300">
  <img src={image} alt={name} className="w-12 h-12 rounded-full col-span-1 m-auto" />
  <div className='col-span-10'>
    <div className="font-bold py-4">{name}</div>
    <div className="text-gray-500">{designation}</div>
  </div>
  <div className="col-span-1 ">
  <a href="http://" target="_blank" rel="noopener noreferrer" className='m-auto'>
  <RiPhoneLine size={34} color='#7c7c7c' className='border border-solid rounded border-gray-500 mx-auto py-1' />
</a>
  </div>
</div>
)
}

export default Contactinfo
