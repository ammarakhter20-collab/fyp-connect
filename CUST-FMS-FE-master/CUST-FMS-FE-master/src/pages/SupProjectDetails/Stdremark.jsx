import { initFlowbite } from 'flowbite';
import React, { useEffect, useState } from 'react';
import { Tabs } from 'flowbite-react';
function Remarks({ data }) {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <div className="overflow-x-auto pt-10">
      <span className='font-medium text-lg'>Remarks</span>
      <Tabs aria-label="Full width tabs" style="fullWidth" className="pt-3">
        {data.map((item, index) => (
          <Tabs.Item key={index} title={`Examiner ${index + 1}`}>
            <div className="flex items-center justify-start">
              <img src={null} alt="img" className="rounded-full w-20 h-20" />
              <div className="ml-4">
                <h2 className="font-medium">{item.examiner}</h2>
                <p>{item.remarks}</p>
              </div>
            </div>
          </Tabs.Item>
        ))}
      </Tabs>
    </div>
  );
}

export default Remarks;
