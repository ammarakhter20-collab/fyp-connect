import React, { useEffect, useState } from 'react';
import RequestCard from '../../../Components/Cards/RequestCard';
import Simple from '../../../Components/Buttons/Simple';
import Modal from '../../../Components/Modal/reqModal';
import Select from 'react-select';  // Import the react-select library
import { technologyOptions } from '../SupFYPRegister/SupRegData';

const Request = () => {
  const [showModal, setShowModal] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [fypTopic, setFypTopic] = useState('');
  const [newFypTopic, setNewFypTopic] = useState('');
  const [reason, setReason] = useState('');
  const [fypTechnology, setFypTechnology] = useState('');
  const [newFypTechnology, setNewFypTechnology] = useState('');
  const [fypTopicError, setFypTopicError] = useState('');
  const [newFypTopicError, setNewFypTopicError] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [fypTechnologyError, setFypTechnologyError] = useState('');
  const [newFypTechnologyError, setNewFypTechnologyError] = useState('');

  useEffect(() => {
    // Update the selected tab when the component mounts
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'SupRequest';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  const handleRegisterNow = (type) => {
    setRequestType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setRequestType('');
    setShowModal(false);
  };

  const handleSendRequest = () => {
    // Form validation
    let isValid = true;

    // Common validations for all request types
    if (requestType === 'Change FYP Technology') {
      if (!fypTechnology.value) {
        setFypTechnologyError('FYP Technology is required');
        isValid = false;
      } else {
        setFypTechnologyError('');
      }

      if (!newFypTechnology.value) {
        setNewFypTechnologyError('New FYP Technology is required');
        isValid = false;
      } else {
        setNewFypTechnologyError('');
      }
    } else if (requestType === 'Change FYP Topic') {
      if (!fypTopic.trim()) {
        setFypTopicError('FYP Topic is required');
        isValid = false;
      } else {
        setFypTopicError('');
      }

      if (!newFypTopic.trim()) {
        setNewFypTopicError('New FYP Topic is required');
        isValid = false;
      } else {
        setNewFypTopicError('');
      }
    }

    if (!reason.trim()) {
      setReasonError('Reason is required');
      isValid = false;
    } else {
      setReasonError('');
    }

    // If form is valid, submit the request
    if (isValid) {
      // Implement your logic for sending the request
      // After handling the request, close the modal
      setShowModal(false);
    }
  };

  return (
    <>
      <div className='mx-14'>
        <div className='grid grid-cols-4 gap-x-4 gap-y-4 mt-5 max-h-[35.9375rem] overflow-y-auto pr-2 pb-5'>
          <div className='col'>
            <RequestCard reqType={'Change FYP Topic'} onRegisterNow={() => handleRegisterNow('Change FYP Topic')} />
          </div>
          <div className='col'>
            <RequestCard reqType={'Change FYP Technology'} onRegisterNow={() => handleRegisterNow('Change FYP Technology')} />
          </div>
        </div>
      </div>

      {showModal && (
        <Modal onClose={handleCloseModal}>
          <div className="relative p- max-w-lg mt-0 max-h-full">
            <div className="relative bg-white rounded-lg shadow ">
              {/* Modal content */}
              <div className=" items-center justify-between p-2 md:p-1 border-b  mb-2">
                <h3 className="text-3xl font-semibold text-gray-900 mb-3 text-center">
                  Request
                </h3>
                <div className='max-h-14 overflow-y-auto'>
                  <p className="text-sm text-gray-700 mb-2 text-center">
                    Add your additional text lines here.
                  </p>
                  <p className="text-sm text-gray-700 mb-2 text-center">
                    Another line of text.
                  </p>
                </div>
                <button
                  type="button"
                  className="text-gray-600 bg-transparent hover:bg-secondary hover:text-white rounded-lg w-8 h-8 absolute top-2 right-2 text-2xl"
                  onClick={handleCloseModal}
                >
                  &times;
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Form fields */}
              <div className='formFields'>
                {/* Common fields for all request types */}
                {requestType === 'Change FYP Technology' && (
                  <>
                    {/* FYP Technology field */}
                    <label htmlFor="fypTechnology" className="block text-sm font-medium text-gray-600">
                      Select FYP Technology
                    </label>
                    <Select
                      id="fypTechnology"
                      name="fypTechnology"
                      className="mt-1 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full bg-gray-50 border"
                      options={technologyOptions}
                      isSearchable
                      onChange={(selectedOption) => setFypTechnology(selectedOption)}
                      value={fypTechnology}
                      placeholder="Select or type current technology"
                      maxMenuHeight={100}
                    />
                    {fypTechnologyError && <p className="text-red-500 text-sm mt-1">{fypTechnologyError}</p>}

                    {/* New FYP Technology field */}
                    <label htmlFor="newFypTechnology" className="block mb-2 text-sm font-medium text-gray-900 mt-4">
                      New FYP Technology
                    </label>
                    <Select
                      id="newFypTechnology"
                      name="newFypTechnology"
                      className="mt-1 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full bg-gray-50 border"
                      options={technologyOptions}
                      isSearchable
                      onChange={(selectedOption) => setNewFypTechnology(selectedOption)}
                      value={newFypTechnology}
                      placeholder="Select or type new technology"
                      maxMenuHeight={100}
                    />
                    {newFypTechnologyError && <p className="text-red-500 text-sm mt-1">{newFypTechnologyError}</p>}

                    {/* Reason field for FYP Technology */}
                    <label htmlFor="reason" className="block mb-2 text-sm font-medium text-gray-900 mt-4">
                      Reason for Change (FYP Technology)
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      rows="3"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Enter your Reason to change FYP technology"
                      className={`bg-gray-50 border ${reasonError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 `}
                    ></textarea>
                    {reasonError && <p className="text-red-500 text-sm mt-1">{reasonError}</p>}
                  </>
                )}

                {requestType === 'Change FYP Topic' && (
                  <>
                    {/* FYP Topic field */}
                    <label htmlFor="fypTopic" className="block mb-2 text-sm font-medium text-gray-900">
                      FYP Topic
                    </label>
                    <input
                      type="text"
                      id="fypTopic"
                      name="fypTopic"
                      value={fypTopic}
                      onChange={(e) => setFypTopic(e.target.value)}
                      placeholder="Enter your current FYP topic"
                      className={`bg-gray-50 border ${fypTopicError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 `}
                    />
                    {fypTopicError && <p className="text-red-500 text-sm mt-1">{fypTopicError}</p>}

                    {/* New FYP Topic field */}
                    <label htmlFor="newFypTopic" className="block mb-2 text-sm font-medium text-gray-900 mt-4">
                      New FYP Topic
                    </label>
                    <input
                      type="text"
                      id="newFypTopic"
                      name="newFypTopic"
                      value={newFypTopic}
                      onChange={(e) => setNewFypTopic(e.target.value)}
                      placeholder="Enter your new FYP topic"
                      className={`bg-gray-50 border ${newFypTopicError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 `}
                    />
                    {newFypTopicError && <p className="text-red-500 text-sm mt-1">{newFypTopicError}</p>}

                    {/* Reason field for FYP Topic */}
                    <label htmlFor="reason" className="block mb-2 text-sm font-medium text-gray-900 mt-4">
                      Reason for Change (FYP Topic)
                    </label>
                    <textarea
                      id="reason"
                      name="reason"
                      rows="3"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Enter your Reason to change FYP topic"
                      className={`bg-gray-50 border ${reasonError ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 `}
                    ></textarea>
                    {reasonError && <p className="text-red-500 text-sm mt-1">{reasonError}</p>}
                  </>
                )}
              </div>
              <div className="flex justify-between mt-3 ">
                <Simple text="Cancel" onClick={handleCloseModal} />
                <Simple text="Send Request" onClick={handleSendRequest} />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Request;
