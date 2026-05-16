import React from 'react';

const ButbgPrimary = (props) => {
  const { text, onClick } = props;

  return (
    <>
      <button
        type="button"
        className="text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium  text-sm w-44 h-11 py-2 text-center mb-0 rounded-lg"
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};

export default ButbgPrimary;
