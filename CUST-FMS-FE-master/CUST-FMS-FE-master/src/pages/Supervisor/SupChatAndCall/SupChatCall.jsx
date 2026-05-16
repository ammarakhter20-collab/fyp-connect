import React, { useEffect, useState } from 'react';
import ChatWelcome from './SupChatWelcome';
import ChatSelection from './SupChatSelection';
import Contactinfo from './SupContactinfo';
import ChatTextField from './SupChatTextField';
import { initFlowbite } from 'flowbite';
import { Navigate } from 'react-router-dom';

const SupChatCall = () => {
  const [selectedChat, setSelectedChat] = useState('groupMembers');

  const handleChatSelection = (chat) => {
    setSelectedChat(chat); // Update selected chat when user selects a chat
  };

  useEffect(() => {
   
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'SupChatCall';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  const chatData = {
    groupMembers1: {
      image: './assets/images/custLogo.png',
      name: 'Abdullah',
      designation: 'Group No 1',
    },
    groupMembers2: {
      image: './assets/images/custLogo.png',
      name: 'Shakoor',
      designation: 'Group No 2',
    },
    supervisor: {
      image: './assets/images/custLogo.png',
      name: 'Mr. Mudassar Adeel',
      designation: 'Supervisor',
    },
    coordinator: {
      image: './assets/images/custLogo.png',
      name: 'Mr. Ibrar Arshad',
      designation: 'Coordinator',
    },
    hod: {
      image: './assets/images/custLogo.png',
      name: 'Mr. Nadeem Anjum',
      designation: 'Head of Department',
    },
  };

  return (
    <>
      <div className="grid grid-cols-12 h-100">
        <div className="col-span-3 border border-e-gray-800 shadow-xl shadow-gray-900">
          <ChatSelection onSelectChat={handleChatSelection} />
        </div>
        <div className="col-span-9">
          <Contactinfo {...chatData[selectedChat]} />
          <div className="my-2">
            <ChatWelcome />
            <div className='px-3'>
              <ChatTextField />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupChatCall;
