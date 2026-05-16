import React from 'react'

const ButbgGray = (props) => {
    const { text, onClick } = props;
  return (
    <>
    
    <button
    type="button"
    className="text-white bg-gry hover:bg-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-none text-sm w-44 h-11 px-8 py-2 text-center mb-0"
    onClick={onClick}
  >
    {text}
  </button>
  </>
  )
}

export default ButbgGray
