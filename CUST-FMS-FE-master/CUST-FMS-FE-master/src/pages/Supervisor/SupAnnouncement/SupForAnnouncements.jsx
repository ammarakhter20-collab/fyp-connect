import React from 'react'
import GenAccor from '../../../Components/Accordians/GenAccor'

const SupForAnnouncements = ({accordionId, AnnouncementData, handleSupForView}) => {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        return formattedDate;
    };

    const handleViewAnnoun = (an) => {
        handleSupForView(an);
    }

  return (
    <div className=''>
        <div id={`accordion-collapse-${accordionId}`} data-accordion='collapse' className={`mt-8`}>
                        <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
                            <GenAccor text='Announcements' accordionId={accordionId} />
                        </h2>
                        <div id={`accordion-collapse-body-timetable-${accordionId}`} className={` transition-opacity duration-300 ease-in-out`} aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
                            <div className='pt-0 pb-0 border border-b-0 border-gray-200 relative'>
                                <div className='table-container overflow-x-auto relative max-h-96 overflow-y-auto'>
                                    <div className='bg-white text-sm'>
                                        <table className='w-full text-sm text-left rtl:text-center text-black bg-white   border-collapse border border-gray-300'>
                                            <thead className='text-xs text-indigo-900 uppercase bg-white   dark:text-gray-400'>
                                                <tr className='border-b text-center'>
                                                    <th className='px-20 py-3'>Sr. No</th>
                                                    <th className='px-20 py-3'>Title</th>
                                                    <th className='px-20 py-3'>Uploaded By</th>
                                                    <th className='px-20 py-3'>Announced Date</th>
                                                    <th className='px-20 py-3'>Details</th>
                                                </tr>
                                            </thead>
                        <tbody>
                        {Array.isArray(AnnouncementData) && AnnouncementData.length > 0 ? (
        AnnouncementData.map((an, index) => (
          <tr key={an._id} className='text-center font-normal'>
              <td className='px-6 py-4'>{index + 1}</td>
              <td className='px-6 py-4 overflow-hidden overflow-ellipsis max-w-xs'>
                        {an.title.length > 24 ? `${an.title.substring(0, 24)}...` : an.title}
                    </td>
                    <td className='px-6 py-4'>{an.uploadedBy.name}</td>
              <td className='px-6 py-4'>{formatDate(an.createdAt)}</td>
              <td className='px-6 py-4'>
                  <button className='underline mx-2' onClick={() => handleViewAnnoun(an)}>
                      View
                  </button>
              </td>
             
          </tr>
      ))
    ) : (
      <tr>
          <td colSpan='9' className='text-center py-4'>No Announcement found</td>
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
  )
}

export default SupForAnnouncements
