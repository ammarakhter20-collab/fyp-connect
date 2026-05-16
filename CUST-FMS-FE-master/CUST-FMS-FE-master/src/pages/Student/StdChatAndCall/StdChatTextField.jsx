import React from 'react';
import TextField from '@mui/material/TextField';
import { RiAttachmentLine, RiSendPlaneFill } from 'react-icons/ri';

const ChatTextField = () => {
  return (
    <div className="mx-auto relative">
      <form className='mt-36'>   
        <div className="relative">
          <input 
            type="search" 
            id="search" 
            className="block w-full p-4 ps-10  text-sm text-gray-900 border border-gray-300  bg-gray-50 focus:ring-blue-500 focus:border-blue-500     " 
            placeholder="Your text goes Here" 
            required
          />
          <button 
            type="submit" 
            className="absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm"
          >
            <RiSendPlaneFill size={24} color="#484848" style={{ marginRight: '8px' }} />
          </button>
          <button 
            type="button" 
            className="absolute right-14 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm "
          >
            <RiAttachmentLine size={24} color="#484848" style={{ marginRight: '8px' }} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatTextField;
