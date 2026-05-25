import { initFlowbite } from 'flowbite';
import React, { useEffect, useState } from 'react'
import FilterButton from '../../../Components/Buttons/FilterButton';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import GenAccor from '../../../Components/Accordians/GenAccor';


const HoDStudentList = ({ accordionId }) => {
  const [StudData, setStudData] = useState([]);
  const [TermData, setTermData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingTerms, setLoadingTerms] = useState(false);

  useEffect(() => {
    initFlowbite();

    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'HoDStudentList';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);

  useEffect(() => {
    const AllStudentData = async () => {
      try {
        setLoadingStudents(true);

        const apiUrl = '/api/auth/fetchStudentData';
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
          setStudData(responseData.students);
          setFilteredData(responseData.students); // Set the initial filtered data to all students
          console.log("Checking Student Data", responseData.students);
        } else {
          console.log('Failed to fetch Student List');
        }
      } catch (error) {
        console.error('Error fetching Student:', error);
      } finally {
        setLoadingStudents(false);
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

    AllStudentData();
    TermDataGet();
  }, []);

  const handleFilterClick = (option) => {
    console.log('Checking Option in handle filter click', option);
    if (option.value === 'All') {
      setFilteredData(StudData);
    } else {
      const filtered = StudData.filter(proj => {
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

  const isLoading = loadingStudents || loadingTerms;

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
              <GenAccor text='Student Details' accordionId={accordionId} />
            </h2>
            <div id={`accordion-collapse-body-timetable-${accordionId}`} className={`transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
              <div className='pt-0 pb-0 border border-b-0 border-gray-200 relative'>
                <div className='table-container overflow-x-auto relative'>
                  <div className='bg-white text-sm'>
                    <table className='w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300'>
                      <thead className='text-xs text-indigo-900 uppercase bg-white   dark:text-gray-400'>
                        <tr className='border-b text-center'>
                          <th className='px-14 py-3'>Sr._No</th>
                          <th className='px-20 py-3'>Name</th>
                          <th className='px-14 py-3'>Reg_no</th>
                          <th className='px-16 py-3'>Email</th>
                          <th className='px-16 py-3'>Secondary Email</th>
                          <th className='px-16 py-3'>Phone_no</th>
                          <th className='px-14 py-3'>CGPA</th>
                          <th className='px-14 py-3'>Cr.Hrs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(filteredData) && filteredData.length > 0 ? (
                          filteredData.map((st, index) => (
                            <tr key={st._id} className='text-center font-normal'>
                              <td className='px-6 py-4'>{index + 1}</td>
                              <td className='px-6 py-4'>{st.name}</td>
                              <td className='px-6 py-4'>{st.registrationNumber}</td>
                              <td className='px-6 py-4'>{st.email}</td>
                              <td className='px-6 py-4'>{st.secondaryEmail}</td>
                              <td className='px-6 py-4'>{st.phoneNumber}</td>
                              <td className='px-6 py-4'>{st.cgpa}</td>
                              <td className='px-6 py-4'>{st.creditHours}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan='9' className='text-center py-4'>No Student List found</td>
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

export default HoDStudentList;
