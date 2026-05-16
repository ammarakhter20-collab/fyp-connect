import React, { useState } from 'react';

const SupChatSelection = ({ onSelectChat }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State to manage dropdown visibility

  const handleChatSelect = (chat) => {
    onSelectChat(chat); // Call parent function to update selected chat
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        onClick={toggleDropdown}
        onKeyPress={(e) => e.key === 'Enter' && toggleDropdown()}
        className="font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center cursor-pointer"
      >
        Chats
        <svg
          className={`w-2.5 h-2.5 ms-3 transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
          aria-label="Toggle Dropdown"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </div>
      <div
        id="dropdown"
        className={`z-10 ${
          isDropdownOpen ? 'block' : 'hidden'
        } bg-white divide-y divide-gray-100 rounded-lg shadow w-44`}
      >
        <ul
          className="py-2 text-sm text-gray-700"
          aria-labelledby="dropdownDefaultButton"
        >
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-300"
              onClick={() => handleChatSelect('groupMembers1')}
            >
              Group No 1
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-300"
              onClick={() => handleChatSelect('groupMembers2')}
            >
              Group No 2
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-300"
              onClick={() => handleChatSelect('coordinator')}
            >
              Coordinator
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-300"
              onClick={() => handleChatSelect('hod')} 
            >
              Head of Department
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SupChatSelection;
