
import { initFlowbite } from 'flowbite';
import React, { useEffect, useState } from 'react'
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import FilterButton from '../../../Components/Buttons/FilterButton';
import GenAccor from '../../../Components/Accordians/GenAccor';
import { useNavigate } from 'react-router-dom';




const HoDProjectList = ({ accordionId }) => {
  const [ProjData, setProjData] = useState([]);
  const [TermData, setTermData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingTerms, setLoadingTerms] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    initFlowbite();

    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'HoDProjectList';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);



  const viewDetails = (data) => {
    console.log(data, "View Details fync called");

    navigate(`/HoDViewProjectDetails?id=${data._id}&termId=${data.termid}`)

  }



  useEffect(() => {
    const AllProjectData = async () => {
      try {
        setLoadingProjects(true);

        const apiUrl = '/api/fyp/getAllfypdata';
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
          setProjData(responseData.allFypRegistrations);
          setFilteredData(responseData.allFypRegistrations); // Set the initial filtered data to all students
          console.log("Checking Projects Data", responseData.allFypRegistrations);
        } else {
          console.log('Failed to fetch Project List');
        }
      } catch (error) {
        console.error('Error fetching Projects:', error);
      } finally {
        setLoadingProjects(false);
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

    AllProjectData();
    TermDataGet();
  }, []);

  const handleFilterClick = (option) => {
    console.log('Checking Option in handle filter click', option);
    if (option.value === 'All') {
      setFilteredData(ProjData);
    } else {
      const filtered = ProjData.filter(proj => {
        console.log('proj.term:', proj.term);
        console.log('option.label:', option.label);
        return proj.term?.sessionTerm === option.label;
      });
      console.log("Filtered data", filtered);
      setFilteredData(filtered);
    }
  };

  // Transform TermData for dropdown options
  const dropdownOptionsWithAll = [

    ...TermData.map(term => ({ label: term.sessionTerm, value: term.sessionTerm }))
  ];
  console.log("dropdownOptionsTerm", dropdownOptionsWithAll);

  const isLoading = loadingProjects || loadingTerms;

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className='mt-10 mx-16'>
          <div className="flex justify-end my-3">
            <FilterButton dropdownOptions={dropdownOptionsWithAll} text="Filter" onClick={handleFilterClick} />
          </div>
          <div id={`accordion-collapse-${accordionId}`} data-accordion='collapse' className={`mt-5`}>
            <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
              <GenAccor text='Projects' accordionId={accordionId} />
            </h2>
            <div id={`accordion-collapse-body-timetable-${accordionId}`} className={`transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className='pt-0 pb-0 border border-b-0 border-gray-200 relative'>
                <div className='table-container overflow-x-auto relative'>
                  <div className='bg-white text-sm'>
                    <table className='w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300'>
                      <thead className='text-xs text-indigo-900 uppercase bg-white   dark:text-gray-400'>
                        <tr className='border-b text-center'>
                          <th className='px-14 py-3'>Sr._No</th>
                          <th className='px-20 py-3'>FYP Title</th>
                          <th className='px-14 py-3'>Group Members</th>
                          <th className='px-16 py-3'>Panel</th>
                          <th className='px-16 py-3'>Status</th>
                          <th className='px-20 py-3'>Supervisor</th>
                          <th className='px-20 py-3'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(filteredData) && filteredData.length > 0 ? (
                          filteredData.map((st, index) => (
                            <tr key={st._id} className='text-center font-normal'>
                              <td className='px-6 py-4'>{index + 1}</td>
                              <td className='px-6 py-4'>{st.topicData?.topic || 'N/A'}</td>
                              <td className='px-6 py-4'>
                                {st.groupMembers?.map((member, idx) => (
                                  <div key={idx}>{member.name} ({member.registrationNumber})</div>
                                )) || 'N/A'}
                              </td>
                              <td className='px-6 py-4'>{st.assignedPanel ? st.assignedPanel.panelCode : 'Not assigned yet'}</td>
                              <td className='px-6 py-4'>{st.reqStatus}</td>
                              <td className='px-6 py-4'>{st.selectedOption?.name || 'N/A'}</td>
                              <td className='px-6 py-4 '><button className="underline mx-2" onClick={() => viewDetails(st)}>View</button></td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan='6' className='text-center py-4'>No Project List found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HoDProjectList
