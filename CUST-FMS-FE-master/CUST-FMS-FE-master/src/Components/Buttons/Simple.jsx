import React from 'react';

const Simple = (props) => {
  const { text, onClick, bgClass, textClass } = props
  const bgDefault = bgClass || 'bg-secondary';
  const textDefault = textClass || 'text-white';
 

  return (
    <>
      <button
        type="button"
        className={`hover:bg-primary focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium text-sm w-44 h-11 px-5 py-2 text-center mb-0 rounded-md ${bgDefault} ${textDefault}`}
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};

export default Simple;
