import React, { useState } from 'react';

const SupViewAssignedTask = (props) => {
  const { data, addMarksClick, editTaskClick } = props;
  const [feedback, setFeedback] = useState('');

  const dueDate = new Date(data.dueDate).toLocaleDateString('en-US');
  const dueTime = new Date(data.dueTime).toLocaleTimeString('en-US');
  const closeDate = new Date(data.closeDate).toLocaleDateString('en-US');
  const closeTime = new Date(data.closeTime).toLocaleTimeString('en-US');

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  return (
    <div className='bg-white shadow-md rounded-lg p-6 w-[50%] h-auto'>
      <div className='my-4'>
        <h1 className='text-red-700 font-semibold text-2xl'>Task # {data.taskNo}</h1>
        <h3 className='text-indigo-950 font-semibold text-xl'> Due {dueDate} {dueTime} . Closes {closeDate} {closeTime}</h3>
      </div>
      <hr />
      <div>
        <div className='flex justify-between'>
          <h1 className='text-indigo-950 font-semibold text-xl'>Instructions</h1>
          <button className='underline text-indigo-950' onClick={editTaskClick}>Edit Task</button>
        </div>
        <p className='text-gray-700 justify-normal'>{data.instruction}</p>
        <a
          href={`/${data.attachPdf.replace(/\\/g, '/')}`}
          download={`file_${data.submitPdf}.pdf`} // Set a dynamic download filename
          target="_blank"
          rel="noopener noreferrer"
          className='flex flex-col my-4 items-start bg-slate-50 border border-gray-300 rounded-sm text-center p-4'>
          {data.submitPdf}
        </a>
        { (data.submitdate || data.submittime) && (<span className='text-gray-700 font-semibold text-sm text-start'>Submitted on {data.submitdate} at {data.submittime} </span>)}
      </div>
      <hr />
      <div className='grid grid-flow-row grid-cols-1 justify-start'>
        <span className='font-semibold text-md text-indigo-950'>Marks {data.addedMarks && (<label htmlFor="marks" className='ms-5'>{data.addedMarks}</label>)}</span>
        <div className='col-span-1'>
          <button className='underline font-semibold text-md text-indigo-950' onClick={() => addMarksClick(data.groupId, feedback)}>Add Marks</button>
        </div>
      </div>
      <div className="my-4">
        <label htmlFor="feedback" className='text-indigo-950 font-semibold text-xl'>
          Feedback
        </label>
        <textarea
          name="feedback"
          id="feedback"
          cols=""
          rows="10"
          className='border rounded-sm border-gray-300 w-full bg-slate-100 h-20'
          value={feedback}
          onChange={handleFeedbackChange}
        ></textarea>
      </div>
      <hr />
    </div>
  );
};

export default SupViewAssignedTask;
