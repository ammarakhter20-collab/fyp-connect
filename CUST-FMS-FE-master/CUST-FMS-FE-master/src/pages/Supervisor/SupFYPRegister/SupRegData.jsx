// const supervisors = [
//   {
//     supervisorId: 'supervisor1',
//     supervisorName: 'Mudassar Adeel',
//     topics: [
//       { id: 1, topic: 'Topic 1 of __ Field', category: 'Game' },
//       { id: 2, topic: 'Topic 2 of __ Field', category: 'Game' },
//       { id: 3, topic: 'Topic 3 of __ Field', category: 'Game' },
//       { id: 4, topic: 'Topic 4 of __ Field', category: 'Game' },
//       { id: 5, topic: 'Topic 5 of __ Field', category: 'Game' },
//       { id: 6, topic: 'Topic 6 of __ Field', category: 'Game' },
//       { id: 7, topic: 'Topic 7 of __ Field', category: 'Game' },
//       { id: 8, topic: 'Topic 8 of __ Field', category: 'IOT' },
//       { id: 9, topic: 'Topic 9 of __ Field', category: 'Game' },
//       { id: 10, topic: 'Topic 10 of __ Field', category: 'IOT' },
//       { id: 11, topic: 'Topic 11 of __ Field', category: 'Game' },
//       { id: 12, topic: 'Topic 12 of __ Field', category: 'IOT' },
//       { id: 13, topic: 'Topic 13 of __ Field', category: 'Game' },
//       { id: 14, topic: 'Topic 14 of __ Field', category: 'IOT' },
//       { id: 15, topic: 'Topic 15 of __ Field', category: 'Game' },
//       { id: 16, topic: 'Topic 2 of __ Field', category: 'IOT' },
//       { id: 17, topic: 'Topic 2 of __ Field', category: 'Game' },
//       { id: 18, topic: 'Topic 2 of __ Field', category: 'IOT' },
//       { id: 19, topic: 'Topic 2 of __ Field', category: 'Game' },
//       { id: 20, topic: 'Topic 2 of __ Field', category: 'IOT' },

//     ],
//   },

//   {
//     supervisorId: 'supervisor2',
//     supervisorName: 'Awais Haider',
//     topics: [
//       { id: 1, topic: 'Topic 1 of __ Field', category: 'Game' },
//       { id: 2, topic: 'Topic 2 of __ Field', category: 'MIS' },
//       { id: 3, topic: 'Topic 3 of __ Field', category: 'Game' },
//       { id: 4, topic: 'Topic 4 of __ Field', category: 'Research' },
//       { id: 5, topic: 'Topic 5 of __ Field', category: 'Game' },
//       { id: 6, topic: 'Topic 6 of __ Field', category: 'IOT' },
//       { id: 7, topic: 'Topic 7 of __ Field', category: 'MIS' },

//     ],
//   },

//   {
//     supervisorId: 'supervisor3',
//     supervisorName: 'Uzair Rasheed',
//     topics: [
//       { id: 1, topic: 'Topic 1 of __ Field', category: 'Game' },
//       { id: 2, topic: 'Topic 2 of __ Field', category: 'Game' },
//       { id: 3, topic: 'Topic 3 of __ Field', category: 'MIS' },
//       { id: 4, topic: 'Topic 4 of __ Field', category: 'Game' },
//       { id: 5, topic: 'Topic 5 of __ Field', category: 'Game' },
//       { id: 6, topic: 'Topic 6 of __ Field', category: 'MIS' },
//       { id: 7, topic: 'Topic 7 of __ Field', category: 'Game' },
//       { id: 8, topic: 'Topic 8 of __ Field', category: 'IOT' },
//       { id: 9, topic: 'Topic 9 of __ Field', category: 'Game' },
//       { id: 10, topic: 'Topic 10 of __ Field', category: 'IOT' },
//       { id: 11, topic: 'Topic 11 of __ Field', category: 'Game' },
//       { id: 12, topic: 'Topic 12 of __ Field', category: 'IOT' },
//       { id: 12, topic: 'Topic 12 of __ Field', category: 'IOT' },
//       { id: 12, topic: 'Topic 12 of __ Field', category: 'IOT' },
//       { id: 12, topic: 'Topic 12 of __ Field', category: 'IOT' },

//     ],
//   },

// ];



// const OfferedTopics = [
//   { id: 1, topic: 'Topic 1 of __ Field', category: 'Game' },
//   { id: 2, topic: 'Topic 2 of __ Field', category: 'Game' },
//   { id: 3, topic: 'Topic 3 of __ Field', category: 'MIS' },
//   { id: 4, topic: 'Topic 4 of __ Field', category: 'Game' },
//   { id: 5, topic: 'Topic 5 of __ Field', category: 'Game' },
//   { id: 6, topic: 'Topic 6 of __ Field', category: 'MIS' },
//   { id: 7, topic: 'Topic 7 of __ Field', category: 'Game' },
//   { id: 8, topic: 'Topic 8 of __ Field', category: 'IOT' },
//   { id: 9, topic: 'Topic 9 of __ Field', category: 'Game' },
//   { id: 10, topic: 'Topic 10 of __ Field', category: 'IOT' },
//   { id: 11, topic: 'Topic 11 of __ Field', category: 'Game' },
//   { id: 12, topic: 'Topic 12 of __ Field', category: 'IOT' },
//   { id: 12, topic: 'Topic 12 of __ Field', category: 'IOT' },
//   { id: 12, topic: 'Topic 12 of __ Field', category: 'IOT' },
//   { id: 12, topic: 'Topic 12 of __ Field', category: 'IOT' },];

//   const categoriesSet = new Set();

//   OfferedTopics.forEach((topic) => {
//     categoriesSet.add(topic.category);
//   });

// const Offeredcategories = Array.from(categoriesSet).map((category, index) => ({
//   value: index + 1,
//   label: category,
// }));
// const supervisorOfferedTopics = []

// const technologyOptions = [
//   { value: 'react', label: 'React' },
//   { value: 'php', label: 'PHP' },
//   { value: 'flutter', label: 'Flutter' },
//   { value: 'flutter', label: 'Flutter' },
//   { value: 'flutter', label: 'Flutter' },
// ];

// const topicData = [
//   // {topic:'CUST FYP Management System', category:'MIS'},
//   // {topic:'CUST FYP Management System', category:'MIS'},
//   // {topic:'CUST FYP Management System', category:'MIS'},
//   // {topic:'CUST FYP Management System', category:'MIS'},
//   // {topic:'CUST FYP Management System', category:'MIS'},
//   // {topic:'CUST FYP Management System', category:'MIS'},
//   // {topic:'CUST FYP Management System', category:'MIS'},
//   // {topic:'CUST FYP Management System', category:'IOT'},
//   // {topic:'CUST FYP Management System', category:'IOT'},
//   // {topic:'CUST FYP Management System', category:'IOT'},
//   // {topic:'CUST FYP Management System', category:'IOT'},
//   // {topic:'CUST FYP Management System', category:'IOT'},
//   // {topic:'CUST FYP Management System', category:'IOT'},
//   // {topic:'CUST FYP Management System', category:'IOT'},
//   // {topic:'CUST FYP Management System', category:'IOT'},
//   // {topic:'CUST FYP Management System', category:'IOT'},
//   // {topic:'CUST FYP Management System', category:'Game'},
//   // {topic:'CUST FYP Management System', category:'Game'},
//   // {topic:'CUST FYP Management System', category:'Game'},
//   // {topic:'CUST FYP Management System', category:'Game'},
//   // {topic:'CUST FYP Management System', category:'Game'},
//   // {topic:'CUST FYP Management System', category:'Game'},
//   // {topic:'CUST FYP Management System', category:'Game'},

// ];


// const categoryOptions = [
//   { value: 'all', label: 'All' },
//   { value: 'mis', label: 'MIS' },
//   { value: 'iot', label: 'IOT' },
//   { value: 'research', label: 'Game' },
// ];



// export {
//   technologyOptions,
//   Offeredcategories,
//   topicData,
//   categoryOptions,
//   supervisors,
//   OfferedTopics,

// }
