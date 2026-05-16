import React, { useState } from 'react';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';

const FilterButton = (props) => {
  const { text, onClick, bgClass, textClass, dropdownOptions } = props;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState({ label: 'All', value: 'All' }); // State to store the selected option, initialized to "All"

  const bgDefault = bgClass || 'bg-secondary';
  const textDefault = textClass || 'text-white';

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const optionsWithAll = [{ label: 'All', value: 'All' }, ...dropdownOptions];
  const handleOptionClick = (option) => {
  
    setSelectedOption(option); // Update selected option
    onClick(option);
    setDropdownOpen(false); // Close the dropdown after selecting an option
  };

  // Prepend "All" option to dropdownOptions array
  console.log("Selected Option Labellll Checking", selectedOption.label);

  return (
    <>
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        onClick={toggleDropdown}
        className={`hover:bg-primary focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium text-sm w-44 h-11 px-5 py-2 text-center mb-0 rounded-md flex justify-between items-center ${bgDefault} ${textDefault}`}
        type="button"
      >
        {selectedOption.label}{' '} {/* Display selected option label */}
        <svg
          className={`w-2.5 h-2.5 ms-3 transform ${dropdownOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>

      {dropdownOpen && (
        <div className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 flex justify-start">
          <ul className="py-2 text-sm text-gray-700 w-full text-left" aria-labelledby="dropdownDefaultButton">
            {optionsWithAll.map((option, index) => (
              <li key={index} onClick={() => handleOptionClick(option)} className="cursor-pointer hover:bg-gray-100 px-4 py-2">
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default FilterButton;

