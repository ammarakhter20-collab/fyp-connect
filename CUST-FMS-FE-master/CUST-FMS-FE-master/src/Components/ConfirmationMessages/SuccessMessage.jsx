import React, { useEffect } from 'react'

const SuccessMessage = ({ message, onClose }) => {

    useEffect(() => {
        const timer = setTimeout(() => {
          onClose();
        }, 3000);
    
        return () => clearTimeout(timer);
      }, [onClose]);
      console.log("message", message);
  return (
    <div className="fixed top-40 left-1/2 transform -translate-x-44 bg-green-500 text-white py-2 px-4 rounded-md">
      {message}
    </div>
  )
}

export default SuccessMessage
