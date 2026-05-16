import { Tabs } from 'flowbite-react';
import React from 'react';

const RemarksFile = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="overflow-x-auto pt-10 bg-white">
        <span className='font-semibold ml-4 text-lg'>Remarks</span>
        <p>No remarks available.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pt-10 bg-white">
      <span className='font-semibold ml-4 text-lg'>Remarks</span>
      <Tabs aria-label="Full width tabs" style="fullWidth" className="pt-3 flex">
        {data.map((item, index) => (
          <Tabs.Item key={index} title={`Examiner ${index + 1}`} className="flex-grow">
            <div className="flex items-center">
              <div></div>
              <img src={item.imagePath} alt="img" className="rounded-full w-20 h-20 -mt-6" />
              <div className="ml-4">
                <h2 className="font-semibold">{item.examinerName}</h2>
                <p>{item.feedback}</p>
              </div>
            </div>
          </Tabs.Item>
        ))}
      </Tabs>
    </div>
  );
};

export default RemarksFile;
