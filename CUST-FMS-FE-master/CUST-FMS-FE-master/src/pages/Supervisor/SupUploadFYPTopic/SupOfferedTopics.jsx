import React, { useState } from 'react';
import SupTable from '../SupAssignedExams/SupTablewWthinCard';
import { useEffect } from 'react';


const SupOfferedTopics = (props) => {
  const { OfferedTopics, offeredCats, handleEditClick, handleDeleteClick } = props;



  console.log("kkkkkkkkkkkkkkkkkkkkkkkkk", OfferedTopics)
  const [filteredTopics, setFilteredTopics] = useState(OfferedTopics);
  const handleFilterClick = (category) => {
    if (category) {
      const filteredData = OfferedTopics
        .filter((item) => item.category.toLowerCase() === category.label.toLowerCase()).map((item, index) => ({ ...item, index: index + 1 }));
      setFilteredTopics(filteredData);
    } else {
      setFilteredTopics(OfferedTopics.map((item, index) => ({ ...item, index: index + 1 })));
    }
  };
  useEffect(() => {
    setFilteredTopics(OfferedTopics.map((topic, index) => ({ ...topic, index: index + 1 })));
  }, [OfferedTopics]);


  return (
    <>
      <div className='bg-white w-full h-full rounded-md '>
        <SupTable
          groupData={filteredTopics} headers={[
            { text: 'Serial no.', colSpan: 1 },
            { text: 'FYP Title', colSpan: 1 },
            { text: 'Category', colSpan: 1 },
            { text: 'Action', colSpan: 2 },
          ]}
          fields={['index', 'topic', 'category',]}
          componentid={3}
          tableHeader={'FYP Topics Offered to this semester '}
          buttons={[
            {
              text: 'Edit',
              bcolspan: 1,
              click: handleEditClick,
            },
            {
              text: 'Delete',
              bcolspan: 1,
              click: handleDeleteClick,
            }
          ]}
          handleFilterClick={handleFilterClick}
          dropdownOptions={offeredCats}
        // handleAddClick={handleAddClick}

        />
      </div>
    </>
  )
}

export default SupOfferedTopics





// import React, { useState } from 'react';
// import SupTable from '../SupAssignedExams/SupTablewWthinCard';
// import { useEffect } from 'react';
// import ButbgPrimary from '../../../Components/Buttons/ButbgPrimary';

// const SupOfferedTopics = (props) => {
//   const { OfferedTopics, offeredCats, handleAddClick, handleEditClick, handleDeleteClick, handleGoBack } = props;



//   console.log("kkkkkkkkkkkkkkkkkkkkkkkkk", OfferedTopics)
//   const [filteredTopics, setFilteredTopics] = useState(OfferedTopics);
//   const handleFilterClick = (category) => {
//     if (category) {
//       const filteredData = OfferedTopics
//         .filter((item) => item.category.toLowerCase() === category.label.toLowerCase()).map((item, index) => ({ ...item, index: index + 1 }));
//       setFilteredTopics(filteredData);
//     } else {
//       setFilteredTopics(OfferedTopics.map((item, index) => ({ ...item, index: index + 1 })));
//     }
//   };
//   useEffect(() => {
//     setFilteredTopics(OfferedTopics.map((topic, index) => ({ ...topic, index: index + 1 })));
//   }, [OfferedTopics]);


//   return (
//     <>
//       <div className='bg-white w-full h-full rounded-md '>
//         <SupTable
//           groupData={filteredTopics} headers={[
//             { text: 'Serial no.', colSpan: 1 },
//             { text: 'FYP Title', colSpan: 1 },
//             { text: 'Category', colSpan: 1 },
//             { text: 'Technology', colSpan: 1 },
//             { text: 'Platform', colSpan: 1 },
//             { text: 'Action', colSpan: 2 },
//           ]}
//           fields={['index', 'topic', 'category', 'technology', 'platform',]}
//           componentid={3}
//           tableHeader={'FYP Topics Offered to this semester '}
//           buttons={[
//             {
//               text: 'Edit',
//               bcolspan: 1,
//               click: handleEditClick,
//             },
//             {
//               text: 'Delete',
//               bcolspan: 1,
//               click: handleDeleteClick,
//             }
//           ]}
//           handleFilterClick={handleFilterClick}
//           dropdownOptions={offeredCats}
//          // handleAddClick={handleAddClick}

//         />
//       </div>
//     </>
//   )
// }

// export default SupOfferedTopics
