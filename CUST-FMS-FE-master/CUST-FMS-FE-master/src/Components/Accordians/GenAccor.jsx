import { initFlowbite } from 'flowbite';
import React, { useEffect } from 'react';

const GenAccor = ({ text, accordionId }) => {
  const handleClick = () => {
    // You can perform additional actions on button click if needed
    console.log(`Accordion ${accordionId} clicked`);
  };
  useEffect(() => {
    initFlowbite();
  
  }, []);

  return (
    <button
      type="button"
      className="flex items-center justify-between w-full p-5  font-medium rtl:text-right text-white bg-primary border border-b-0 text-xl rounded-xl focus:ring-4 focus:ring-gray-200 gap-3"
      data-accordion-target={`#accordion-collapse-body-timetable-${accordionId}`}
      aria-expanded="false"
      aria-controls={`accordion-collapse-body-timetable-${accordionId}`}
      onClick={handleClick}
    >
      <span>{text}</span>
      <svg
        data-accordion-icon
        className="w-3 h-3 rotate-180 shrink-0"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
      </svg>
    </button>
  );
};

export default GenAccor;
