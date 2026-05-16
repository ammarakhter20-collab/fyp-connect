import React from 'react'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import { Navigate } from 'react-router'

const GradeCard = (props) => {

  const gradeCardClick = () => {
    Navigate('/ProjectDetails')
  }
    const {title, Exam, marks} = props;
  return (
    <>
<div className='Gradecard max-w-3xl w-80 h-72 '>
  <a href="/ProjectDetails" className="block w-full  px-6 py-3 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100">
    <div className='ml-3 text-white'>
      <div className='TitleAndApprovedStatus flex flex-row justify-between'>
        <h5 className="mb-2 text-lg font-normal tracking-tight text-black">{title}</h5>
       
      </div>
      <div className='flex flex-row space-x-2'>
        <p className="font-medium text-xl text-black ">Exam Type: </p>
        <p className="font-normal text-xl text-black ">{Exam}</p>
      </div>
      <div className='flex flex-row space-x-2 '>
        <p className="font-medium text-xl text-black ">Marks: </p>
        <p className="font-normal text-xl text-black ">{marks}</p>
      </div>
      

      <button type="button" className="text-white py-2 px-12  mt-3 bg-secondary hover:bg-primary focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm     focus:outline-none  " onClick={gradeCardClick}>View</button>
    </div>
  </a>
</div>


    </>
  )
}

export default GradeCard
