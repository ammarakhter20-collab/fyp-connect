import React from 'react'
const ChatWelcome = () => {
  return (
      <div className='py-12 h-auto'>
        <img className='mx-auto'
          src=".././assets/images/ChatCallPic.png"
          alt="Chat Image"
          style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
        />
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          You’re starting a new conversation
        </p>
        <p style={{ textAlign: 'center', marginTop: '10px' }} className=' text-gray-500'>
          Enter your Text Below
        </p>
      </div>

  )
}

export default ChatWelcome
