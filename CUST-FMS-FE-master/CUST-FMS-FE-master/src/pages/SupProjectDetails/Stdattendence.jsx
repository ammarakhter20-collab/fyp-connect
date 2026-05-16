import { Accordion } from 'flowbite-react';
import GenAccor from '../../Components/Accordians/GenAccor';
import { useEffect, useState } from 'react';
import { initFlowbite } from 'flowbite';
//import Group_details from '../tables/groupdetails';
const Attendence_table = ({ data, accordionId, accordText }) => {

  const [totalPercentage, setTotalPercentage] = useState(0);
console.log(data, "data")
  useEffect(() => {
      // Calculate total percentage and update state
      const totalAttendedMeetings = data.Meeting.filter(item => item.memberAttendances.some(attendance => attendance.status === 'present')).length;
      const totalConductedMeetings = data.Meeting.length;
      const percentage = totalConductedMeetings > 0 ? (totalAttendedMeetings / totalConductedMeetings) * 100 : 0;
      setTotalPercentage(percentage.toFixed(2));
  }, [data]);

  return (
    <div id={`accordion-collapse-${accordionId}`} data-accordion="collapse" className='mt-1'>
        <h2 id={`accordion-collapse-heading-timetable-${accordionId}`}>
            <GenAccor text={accordText} accordionId={accordionId} />
        </h2>
        <div id={`accordion-collapse-body-timetable-${accordionId}`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-${accordionId}`}>
            <div className="pt-0 pb-0 border border-b-0 border-gray-200 relative">
                {/* Timetable Table */}
                <div className="table-container overflow-x-auto relative">
                    <div className='bg-white'>
                        <div className='grid grid-cols-3 gap-[300px] mx-16'>
                            <div className='col mt-4 mb-4'>
                                <div className='flex flex-row space-x-2'>
                                    <p className='font-semibold'>Name: </p>
                                    <p className='font-normal'>{data.student.name}</p>
                                </div>
                                <div className='flex flex-row space-x-2 mt-4'>
                                    <p className='font-semibold'>Conducted Meetings: </p>
                                    <p className='font-normal'>{data.Meeting.length}</p>
                                </div>
                            </div>
                            <div className='col second mt-4'>
                                <div className='flex flex-row space-x-2'>
                                    <p className='font-semibold'>Reg no: </p>
                                    <p className='font-normal'>{data.student.regno}</p>
                                </div>
                                <div className='flex flex-row space-x-2 mt-4'>
                                    <p className='font-semibold'>Attended meetings: </p>
                                    <p className='font-normal'>{data.Meeting.filter(item => item.memberAttendances[0].status === 'present').length}</p>
                                </div>
                            </div>
                            <div className='col third mt-4'>
                                <div className='flex flex-row space-x-2'>
                                    <p className='font-semibold'>Course: </p>
                                    <p className='font-normal'>{data.Course}</p>
                                </div>
                                <div className='flex flex-row space-x-2 mt-4'>
                                    <p className='font-semibold'>Attendance percentage: </p>
                                    <p className='font-normal'>{totalPercentage}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <table className="w-full text-sm text-left rtl:text-center text-black bg-white :text-gray-400 border-collapse border border-gray-300">
                        <thead className="text-xs text-indigo-900 uppercase bg-gray-50 :bg-gray-700 :text-gray-400">
                            <tr className='border-b text-center'>
                                <th className="px-6 py-3 w-52">Meeting no</th>
                                <th className="px-6 py-3 w-52 text">Status</th>
                                <th className="px-6 py-3 w-52">% age (100)</th>
                                <th className="px-6 py-3 w-52">Date</th>
                                <th className="px-6 py-3 w-72">Slots</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.Meeting.map((item, index) => {
                                const attendedMeetings = data.Meeting.slice(0, index + 1).filter(m => m.memberAttendances[0].status === 'present').length;
                                const totalMeetings = index + 1;
                                const percentage = (attendedMeetings / totalMeetings) * 100;
                                const meetingDate = new Date(item.meetingDate).toLocaleString();
                                const meetingStartTime = new Date(item.meetingStartTime).toLocaleTimeString();
                                const meetingEndTime = new Date(item.meetingEndTime).toLocaleTimeString();
                                
                                
                                return (
                                    <tr key={index} className="text-center font-normal">
                                        <td className="px-6 py-4">{item.meetingNo}</td>
                                        <td className="px-6 py-4">{item.memberAttendances[0].status === 'present' ? (
                                            <span className="bg-green-500 text-white p-2 rounded">P</span>
                                        ) : (
                                            <span className="bg-red-500 text-white p-2 rounded">A</span>
                                        )}</td>
                                        <td className="px-6 py-4">{percentage.toFixed(2)}%</td>
                                        <td className="px-6 py-4">{meetingDate}</td>
                                        <td className="px-6 py-4">{meetingStartTime} - {meetingEndTime}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);
};

export default Attendence_table;
