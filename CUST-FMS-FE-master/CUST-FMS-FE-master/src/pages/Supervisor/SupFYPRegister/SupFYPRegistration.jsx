import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Submit from '../../../Components/Buttons/Submit';
import TopicsCard from '../../../Components/Cards/TopicsCard';
import { supervisors, Offeredcategories, technologyOptions, categoryOptions } from './SupRegData';
import Simple from '../../../Components/Buttons/Simple';
import { initFlowbite } from 'flowbite';
import { FaUpload } from 'react-icons/fa';
import GenAccor from '../../../Components/Accordians/GenAccor'
const FYPRegistration = ({ selectedTab }) => {
  const [groupMembers, setGroupMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [supervisorTopics, setSupervisorTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [description, setDescription] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
const [selectedFile, setSelectedFile] = useState(null);
const [groupMembersBorderColor, setGroupMembersBorderColor] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formErrors, setFormErrors] = useState({
    groupMembers: '',
    selectedOption: '',
    selectedTechnology: '',
    selectedCategory: '',
    selectedTopic: '',
    description: '',
  });

  const validateForm = () => {
    let isValid = true;
    const errors = {
      groupMembers: '',
      selectedOption: '',
      selectedTechnology: '',
      selectedCategory: '',
      selectedTopic: '',
      description: '',
      selectedPlatform: '',
    };

    // Perform your validation logic here
    if (groupMembers.length < 2) {
      isValid = false;
      errors.groupMembers = 'Please add atleast two group members.';
    }

    if (!selectedOption) {
      isValid = false;
      errors.selectedOption = 'Please select a supervisor.';
    }

    if (!selectedPlatform) {
      isValid = false;
      errors.selectedPlatform = 'Please select a platform.';
    }

    if (!selectedTechnology) {
      isValid = false;
      errors.selectedTechnology = 'Please select a technology.';
    }

    // if (!selectedCategory) {
    //   isValid = false;
    //   errors.selectedCategory = 'Please select a category.';
    // }

    if (!selectedTopic) {
      isValid = false;
      errors.selectedTopic = 'Please add an FYP topic.';
    }

    if (!description) {
      isValid = false;
      errors.description = 'Please provide a description.';
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Submit called');
      
      // Perform the submission logic here
      // Set the formSubmitted state to true
      setFormSubmitted(true);
      setShowConfirmation(true);
    } else {
      console.log('Form has validation errors. Please fix them.');
    }
  };

  const handleBack = () => {
    // When the user clicks on the "Back" button, hide the confirmation message
    // and show the filled form again
    setShowConfirmation(false);
  };

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setFormErrors({ ...formErrors, selectedCategory: '' });
  };

  const handleSupervisorChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    const selectedSupervisor = supervisors.find((supervisor) => supervisor.supervisorId === selectedOption.value);
    setSupervisorTopics(selectedSupervisor ? selectedSupervisor.topics : []);
    setSelectedTopic('');
    // Reset the selected category when a new supervisor is chosen
    setSelectedCategory(null);
    setFormErrors({ ...formErrors, selectedOption: '' });
  };

  const handleTechnologyChange = (selectedTechnology) => {
    setSelectedTechnology(selectedTechnology);
    setFormErrors({ ...formErrors, selectedTechnology: '' });
  };

  const handlePlatformChange = (selectedPlatform) => {
    setSelectedPlatform(selectedPlatform);
    setFormErrors({ ...formErrors, selectedPlatform: '' });
  };

  
const handleFileChange = (e) => {
  const file = e.target.files[0];
  setSelectedFile(file);
  // Additional logic if needed
};

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setFormErrors({ ...formErrors, description: '' });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addGroupMember();
    }
  };

  const MAX_GROUP_MEMBERS = 3;
  const MIN_GROUP_MEMBERS = 2;

  const addGroupMember = () => {
    if (newMember.trim() !== '') {
      if (groupMembers.length < MAX_GROUP_MEMBERS) {
        setGroupMembers([...groupMembers, newMember]);
        setNewMember('');
        setGroupMembersBorderColor('');
        setErrorMessage('');
      } else {
        // Display an error message or handle the case where the maximum number of group members is reached
        setGroupMembersBorderColor('border-red-500');
        setErrorMessage('Maximum group members reached');
      }
    } else {
      // Display an error message or handle the case where the input is empty
      setGroupMembersBorderColor('border-red-500');
      setErrorMessage('Please enter a group member');
    }
  };

  const removeGroupMember = (index) => {
    const updatedMembers = [...groupMembers];
    updatedMembers.splice(index, 1);
    setGroupMembers(updatedMembers);
  };

  const handleViewFeedback = () => {
    setShowFeedback(!showFeedback);
  };

  useEffect(() => {
    initFlowbite();
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'FYP Registration';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  
    // Reset styling for all tabs
    const allTabs = document.querySelectorAll('[data-tab]');
    allTabs.forEach((tab) => {
      tab.style.color = 'zinc';  // Set the default color for unselected tabs
    });
  
    // Set styling for the selected tab
    if (selectedTab === 'FYP Registration') {
      const tabElement = document.querySelector('[data-tab="FYP Registration"]');
      tabElement.style.color = 'Selected';  // Set the desired color for the selected tab
    }
  }, [selectedTab]);

  return (
    <>
      {showConfirmation ? (
        <div className='regForm mx-14'>
          <div className='formHeader text-center pt-7'>
            <h1 className='font-montserrat font-black text-3xl'>FYP REGISTRATION FORM</h1>
            <div className="p-4 mb-4 mt-4 text-sm text-green-600 rounded-lg bg-green-200 " role="alert">
              <span className="font-medium text-center">Form Submitted Successfully. Wait for Supervisor's response</span> 
            </div>
          </div>
          <div className='text-right mt-6 mr-6'>
            <Simple text={'Back'} onClick={handleBack}/>
          </div>
          {/* Add the View Feedback button in the bottom left */}
          <div className='text-left mb-6 ml-6 underline cursor-pointer'>
            <button style={{ textDecoration: 'underline' }} onClick={handleViewFeedback}>View Feedback</button>
          </div>

          {/* Conditional Rendering of Feedback Accordion */}
          {showFeedback && (
           <div id="accordion-collapse" data-accordion="collapse">
           <h2 id="accordion-collapse-heading-timetable">
             <GenAccor text = 'Feedback'/>
           </h2>
           <div id="accordion-collapse-body-timetable" className="hidden" aria-labelledby="accordion-collapse-heading-timetable">
             <div className="pt-0 pb-0  border border-b-0 border-gray-200 relative">
               {/* Timetable Table */}
               <div className="table-container overflow-x-auto relative">
               <div className="p-5 border border-b-0 border-gray-200 ">
                  <p className="mb-2 text-gray-500 ">
                    Thank you for using our service! Your feedback is important to us. We appreciate your input and are
                    constantly working to improve our platform. Your suggestions help us enhance the user experience.
                  </p>
                  <p className="text-gray-500 ">
                    We value your feedback and strive to provide the best possible service. If you have any specific comments
                    or suggestions, feel free to let us know. Your satisfaction is our priority!
                    We value your feedback and strive to provide the best possible service. If you have any specific comments
                    or suggestions, feel free to let us know. Your satisfaction is our priority!
                    We value your feedback and strive to provide the best possible service. If you have any specific comments
                    or suggestions, feel free to let us know. Your satisfaction is our priority!
                   ` We value your feedback and strive to provide the best possible service. If you have any specific comments
                    or suggestions, feel free to let us know. Your satisfaction is our priority!`
                  </p>
                </div>
               </div>
             </div>
           </div>
         </div>
          )}
        </div>
      ) : (
        <div className='regForm mx-14 bg-slate-100'>
          <div className='formHeader text-center pt-7'>
            <h1 className='font-montserrat font-black text-3xl'>FYP REGISTRATION FORM</h1>
            <p className='font-DmSans font-bold' style={{ color: '#CACACA' }}>Add Required Information in the form. </p>
          </div>
          
          <div className='formFields grid grid-cols-2 gap-28 justify-between mt-8 mx-3'>
            <div className='col leftFields'>
            <div className={`mb-4 ${groupMembersBorderColor}`}>
          <label htmlFor='groupMembers' className='block text-sm font-medium text-gray-600'>
            Add Group members
          </label>
          <input
            type='text'
            id='groupMembers'
            name='groupMembers'
            className={`mt-1 p-2 border rounded-md w-full ${groupMembersBorderColor}`}
            placeholder='BSE000000'
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {groupMembers.length > 0 && (
            <div className='mt-2 space-x-2 flex flex-wrap'>
              {groupMembers.map((member, index) => (
                <div key={index} className='bg-gry rounded-3xl px-3 py-1 flex items-center space-x-1'>
                  <span>{member}</span>
                  <button
                    type='button'
                    onClick={() => removeGroupMember(index)}
                    className='text-white bg-secondary rounded-full w-5 h-5 focus:outline-none'
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Display error messages near the input field */}
          {errorMessage && (
            <p className='text-red-500 text-sm mt-1'>{errorMessage}</p>
          )}
        </div>
      

              <div className='mb-4'>
                <label htmlFor='groupDropdown' className='block text-sm font-medium text-gray-600'>
                  Select Supervisor
                </label>
                <Select
                  id='groupDropdown'
                  name='groupDropdown'
                  className='mt-1 rounded-md'
                  options={Offeredcategories}
                  isSearchable
                  onChange={handleSupervisorChange}
                  value={selectedOption}
                  placeholder='Select or type a name'
                  maxMenuHeight={100}
                />

                {formErrors.selectedOption && (
                  <p className='text-red-500 text-sm mt-1'>{formErrors.selectedOption}</p>
                )}
              </div>

              <div>
                <label htmlFor='fypTopic' className='block text-sm font-medium text-gray-600'>
                  Add FYP topic
                </label>
                <input
                  type='text'
                  id='fypTopic'
                  name='fypTopic'
                  className='mt-1 p-2  border border-gray-300 rounded-md w-full'
                  placeholder='Add your FYP topic'
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                />

                {formErrors.selectedTopic && (
                  <p className='text-red-500 text-sm mt-1'>{formErrors.selectedTopic}</p>
                )}
              </div>

              
              <div className='mb-4 mt-3'>
                <label htmlFor='description' className='block text-sm font-medium text-gray-600'>
                  Description
                </label>
                <textarea
                  id='description'
                  name='description'
                  className='mt-1  pt-2 pl-2 border border-gray-300 rounded-md w-full h-32'
                  placeholder='Type your FYP description'
                  value={description}
                  onChange={handleDescriptionChange}
                />

                {formErrors.description && (
                  <p className='text-red-500 text-sm mt-1'>{formErrors.description}</p>
                )}
              </div>
              </div>
            

            <div className='col rightFields'>
              <div className='mb-4'>
                <label htmlFor='technologyDropdown' className='block text-sm font-medium text-gray-600'>
                  Select Technology
                </label>
                <Select
                  id='technologyDropdown'
                  name='technologyDropdown'
                  className='mt-1 rounded-md'
                  options={technologyOptions}
                  isSearchable
                  onChange={handleTechnologyChange}
                  value={selectedTechnology}
                  placeholder='Select or type a technology'
                  maxMenuHeight={100}
                />

                {formErrors.selectedTechnology && (
                  <p className='text-red-500 text-sm mt-1'>{formErrors.selectedTechnology}</p>
                )}
              </div>

              <div className='mb-4'>
  <label htmlFor='platformDropdown' className='block text-sm font-medium  text-gray-600'>
    Select Platform
  </label>
  <Select
    id='platformDropdown'
    name='platformDropdown'
    className='mt-1 rounded-md '
    options={[
      { value: 'Web', label: 'Web' },
      { value: 'App', label: 'App' },
      { value: 'Game', label: 'Game' },
    ]}
    isSearchable
    onChange={handlePlatformChange}
    value={selectedPlatform}
    placeholder='Select or type a platform'
    maxMenuHeight={100}
  />

  {formErrors.selectedPlatform && (
    <p className='text-red-500 text-sm mt-1'>{formErrors.selectedPlatform}</p>
  )}
</div>

<div className='mb-4'>
  <label htmlFor='fileInput' className='block text-sm font-medium text-gray-600'>
    Choose File 
  </label>
  <input
    type='file'
    id='fileInput'
    name='fileInput'
    className='mt-1 p-1 py-1 border bg-white border-gray-300 rounded-md w-full'
    onChange={handleFileChange}
  />
</div>

            </div>
            </div>
          

            {selectedOption ? ( // Render only if supervisor is selected
  <div className='TopicsOfferedBySupervisor mt-24 '>
    <h1 className='font-montserrat text-3xl font-medium mx-3'>FYP Topics offered by Supervisor</h1>

    <div className='flex justify-end mt-2'>
      <Select
        id='categoryDropdown'
        name='categoryDropdown'
        className='w-36 mr-11 font-semibold '
        options={categoryOptions}
        isSearchable={false}
        onChange={handleCategoryChange}
        value={selectedCategory}
        placeholder='Filter'
        maxMenuHeight={120}
      />
    </div>

    <div className='FYPTopics mx-3 pr-2 mt-8 font-DmSans text-sm grid grid-cols-5 max-h-80 gap-y-6 gap-x-6 overflow-y-auto pb-8'>
      <TopicsCard selectedCategory={selectedCategory} supervisorTopics={supervisorTopics} setSelectedTopic={setSelectedTopic} />
    </div>
  </div>
) : null}

          <div className='text-right mt-6 mr-6'>
            <Submit text="Submit" onClick={handleSubmit} />
          </div>
        </div>
      )}
    </>
  );
};

export default FYPRegistration;

