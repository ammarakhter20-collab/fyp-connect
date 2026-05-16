// import React, { useEffect, useState } from 'react'
// // import Dashboard from './Dashboard';

// const SlotsData = [
//     {
//       Day: 'Monday',
//       SlotNo1:'8:00AM - 12:00PM',
//       SlotNo2:'4:00PM - 6:00PM',
//       SlotNo3:'1:00PM - 2:00PM',
//     },
//     {
//         Day: 'Tuesday',
//         SlotNo1:'8:00AM - 12:00PM',
//         SlotNo2:'4:00PM - 6:00PM',
//         SlotNo3:'1:00PM - 2:00PM',
//     },
//     {
//         Day: 'Wednesday',
//         SlotNo1:'8:00AM - 12:00PM',
//         SlotNo2:'4:00PM - 6:00PM',
//         SlotNo3:'1:00PM - 2:00PM',
//     },
//     {
//         Day: 'Thursday',
//         SlotNo1:'8:00AM - 12:00PM',
//         SlotNo2:'4:00PM - 6:00PM',
//         SlotNo3:'1:00PM - 2:00PM',
//     },
//     {
//         Day: 'Friday',
//         SlotNo1:'8:00AM - 12:00PM',
//         SlotNo2:'4:00PM - 6:00PM',
//         SlotNo3:'1:00PM - 2:00PM',
//     },
// ]


// const FreeSlotsData = () => {
//     const currentDate = new Date().toLocaleString('en-US', { weekday: 'long' });
//     const [selectedDayData, setSelectedDayData] = useState(null);


//     useEffect(() => {
//         const foundDayData = SlotsData.find((item) => item.Day === currentDate);
//         setSelectedDayData(foundDayData);
//       }, [currentDate]);
//   return (
//     <>
//     <Dashboard setSelectedDayData={selectedDayData}  currentDate={currentDate}/>
//     console.log(setSelectedDayData);
//     </>
//   )
// }

// export default FreeSlotsData
