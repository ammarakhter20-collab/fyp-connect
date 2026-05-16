import React from 'react';

const Submit = (props) => {
  const { text, onClick } = props; // Destructure 'text' and 'onClick' from props

  return (
    <>
      <button
        type="button" // Assuming it's not a form submit, change it to "submit" if it's inside a form
        className="text-white bg-secondary hover:bg-primary focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-none text-sm px-11 py-2.5 text-center me-2 mb-2"
        onClick={onClick} // Attach the onClick handler
      >
        {text}
      </button>
    </>
  );
};

export default Submit;
