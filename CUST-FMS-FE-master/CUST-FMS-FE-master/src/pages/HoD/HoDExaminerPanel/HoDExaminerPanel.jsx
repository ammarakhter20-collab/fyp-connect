import React, { useEffect, useState } from 'react';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import GenAccor from '../../../Components/Accordians/GenAccor';
import { initFlowbite } from 'flowbite';
import FilterButton from '../../../Components/Buttons/FilterButton';
import Simple from '../../../Components/Buttons/Simple';

const HoDExaminerPanel = ({ accordionId }) => {
  const [loadingPanels, setLoadingPanels] = useState(false);
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [PanelData, setPanelData] = useState('');
  const [TermData, setTermData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState(null);

  useEffect(() => {
    initFlowbite();

    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'HoDExaminerPanel';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  useEffect(() => {
    fetchPanels();
    TermDataGet();
  }, []);

  const handleViewPanelDetails = (panel) => {
    setSelectedPanel(panel);
  };

  const handleBackClick = () => {
    setSelectedPanel(null);
  };

  const dropdownOptionsWithAll = [
    { label: 'All', value: 'All' },
    ...TermData.map(term => ({ label: term.sessionTerm, value: term.sessionTerm }))
  ];

  const fetchPanels = async () => {
    try {
      setLoadingPanels(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(`/api/manageexampanels/get-all-panels`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Examiner Panels Data');
      }
      const data = await response.json();
      console.log(data.panels, 'fetched Panels');
      setPanelData(data.panels);
      setFilteredData(data.panels);
    } catch (error) {
      console.error('Error fetching Examiner panels Data:', error.message);
    } finally {
      setLoadingPanels(false);
    }
  };

  const TermDataGet = async () => {
    try {
      setLoadingTerms(true);
      const apiUrl = '/api/auth/getTermdata';
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        setTermData(responseData.fypTerms);
        console.log("Checking Term Data", responseData.fypTerms);
      } else {
        console.log('Failed to fetch Term Data');
      }
    } catch (error) {
      console.error('Error fetching Term Data:', error);
    } finally {
      setLoadingTerms(false);
    }
  };

  const handleFilterClick = (option) => {
    console.log('Checking Option in handle filter click', option);
    if (option.value === 'All') {
      setFilteredData(PanelData);
    } else {
      const filtered = PanelData.filter(proj => {
        console.log('proj.term.sessionTerm:', proj.term);
        console.log('option.label:', option.label);
        return proj.term?.sessionTerm === option.label;
      });
      console.log("Filtered data", filtered);
      setFilteredData(filtered);
    }
  };

  const isLoading = loadingPanels || loadingTerms;

  return (
    <>
      {isLoading ? ( // Show loading spinner while loading is true
        <LoadingSpinner />
      ) : (
        <div className='mt-10 mx-16'>
          {!selectedPanel ? (
            <>
              <div className="flex justify-end my-3">
                <FilterButton dropdownOptions={dropdownOptionsWithAll} text="Filter" onClick={handleFilterClick} />
              </div>
              <div id={`accordion-collapse-${accordionId}`} data-accordion='collapse' className={`mt-5`}>
                <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                  <GenAccor text='Panel Details' accordionId={accordionId} />
                </h2>
                <div id={`accordion-collapse-body-timetable-${accordionId}`} className={`transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                  <div className='pt-0 pb-0 border border-b-0 border-gray-200 relative'>
                    <div className='table-container overflow-x-auto relative'>
                      <div className='bg-white text-sm'>
                        <table className='w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300'>
                          <thead className='text-xs text-indigo-900 uppercase bg-white   dark:text-gray-400'>
                            <tr className='border-b text-center'>
                              <th className='px-20 py-3'>Sr. No</th>
                              <th className='px-20 py-3'>Panel Code</th>
                              <th className='px-20 py-3'>Panel Members</th>
                              <th className='px-20 py-3'>Term</th>
                              <th className='px-20 py-3'>Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(filteredData) && filteredData.length > 0 ? (
                              filteredData.map((ep, index) => (
                                <tr key={ep._id} className='text-center font-normal'>
                                  <td className='px-6 py-4'>{index + 1}</td>
                                  <td className='px-6 py-4'>{ep.panelName}</td>
                                  <td className='px-6 py-4'>
                                    {ep.PanelMembers.map((member, i) => (
                                      <div key={i}>
                                        {member.member?.name || 'N/A'} ({member.role})
                                      </div>
                                    ))}
                                  </td>
                                  <td className='px-6 py-4'>{ep.term?.sessionTerm || 'N/A'}</td>
                                  <td className='px-6 py-4'>
                                    <button className='underline mx-2' onClick={() => handleViewPanelDetails(ep)}>
                                      View
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan='9' className='text-center py-4'>No Panel found</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div id={`accordion-collapse-${accordionId}`} data-accordion='collapse' className={`mt-5`}>
              <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                <GenAccor text={`Faculty_Details (${selectedPanel.panelName})`} accordionId={accordionId} />
              </h2>
              <div id={`accordion-collapse-body-timetable-${accordionId}`} className={`transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                <div className='pt-0 pb-0 border border-b-0 border-gray-200 relative'>
                  <div className='table-container overflow-x-auto relative'>
                    <div className=''>

                      <table className='w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300'>
                        <thead className='text-xs text-indigo-900 uppercase bg-white   dark:text-gray-400'>
                          <tr className='border-b text-center'>
                            <th className='px-20 py-3'>Sr. No</th>
                            <th className='px-20 py-3'>Member Name</th>
                            <th className='px-20 py-3'>Designation</th>
                            <th className='px-20 py-3'>Role</th>
                            <th className='px-20 py-3'>Department</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPanel.PanelMembers.map((member, index) => (
                            <tr key={index} className='text-center font-normal'>
                              <td className='px-6 py-4'>{index + 1}</td>
                              <td className='px-6 py-4'>{member.member?.name || 'N/A'}</td>
                              <td className='px-6 py-4'>{member.member?.designation || 'N/A'}</td>
                              <td className='px-6 py-4'>{member.role}</td>
                              <td className='px-6 py-4'>{member.member?.department?.departmentName || 'N/A'}</td>
                            </tr>
                          ))}

                        </tbody>
                      </table>
                      <div className='flex flex-row justify-end mt-2'>
                        <Simple className=' mx-2 mb-4 text-white' text={'Back'} onClick={handleBackClick}>

                        </Simple>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default HoDExaminerPanel;
