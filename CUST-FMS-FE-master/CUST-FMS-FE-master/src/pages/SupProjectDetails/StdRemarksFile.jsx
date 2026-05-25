import { Tabs } from 'flowbite-react';
import React from 'react';

const RemarksFile = ({ data }) => {
  // Filter out invalid/empty items or display message if none
  const validData = Array.isArray(data) ? data.filter(item => item && (item.feedback || item.remarks || item.examinerId || item.examinerName)) : [];

  if (validData.length === 0) {
    return (
      <div className="overflow-x-auto pt-10 bg-white">
        <span className='font-semibold ml-4 text-lg'>Remarks</span>
        <p className="ml-4 text-gray-500">No remarks available.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pt-10 bg-white">
      <span className='font-semibold ml-4 text-lg'>Remarks</span>
      <Tabs aria-label="Full width tabs" style="fullWidth" className="pt-3 flex">
        {validData.map((item, index) => {
          const name = item.examinerId?.name || item.examinerName || item.examiner || `Examiner ${index + 1}`;
          const text = item.feedback || item.remarks || "No feedback provided.";
          
          return (
            <Tabs.Item key={index} title={name} className="flex-grow">
              <div className="flex items-center">
                <div></div>
                {item.imagePath ? (
                  <img src={item.imagePath} alt="img" className="rounded-full w-20 h-20 -mt-6" />
                ) : (
                  <div className="rounded-full w-12 h-12 -mt-2 bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="ml-4">
                  <h2 className="font-semibold text-gray-800">{name}</h2>
                  <p className="text-gray-600 mt-1">{text}</p>
                </div>
              </div>
            </Tabs.Item>
          );
        })}
      </Tabs>
    </div>
  );
};

export default RemarksFile;
