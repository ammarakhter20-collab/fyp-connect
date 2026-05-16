const supervisors =  [
    
  {
    supervisorId: 'supervisor1',
    supervisorName: 'Mudassar Adeel',
    topics: [
      { id: 1, topic: 'Game Topic one dfdfd fdfdfd dfdfdf fdfdfd dfd ds dsdsdsd sdsdssds ', category: 'Game', Description:'This is description of game topic one' },
      { id: 2, topic: 'Game Topic two dfdfd fdfdfd dfdfdf fdfdfd dfd dsdsdsd sdsdssds', category: 'Game', Description:'This is description of game topic twp'  },
      { id: 2, topic: 'Game Topic three dfdfd fdfdfd dfdfdf fdfdfd dfd dsdsdsd sdsdssds', category: 'Game' , Description:'This is description of game topic Three' },
      { id: 2, topic: 'Game Topic four dfdfd fdfdfd dfdfdf fdfdfd dfd dsdsdsd sdsdssds', category: 'Game' , Description:'This is description of game topic Four' },
      { id: 2, topic: 'Game Topic five dfdfd fdfdfd dfdfdf fdfdfd dfd dsdsdsd sdsdssds', category: 'Game', Description:'This is description of game topic Five'  },
      { id: 2, topic: 'Game Topic six dfdfd fdfdfd dfdfdf fdfdfd dfd dsdsdsd sdsdssds', category: 'Game', Description:'This is description of game topic Six'  },
      { id: 2, topic: 'Game Topic seven dfdfd fdfdfd dfdfdf fdfdfd dfd dsdsdsd sdsdssds', category: 'Game', Description:'This is description of game topic Seven'  },
      { id: 2, topic: 'IoT Topic one dfdfd fdfdfd dfdfdf fdfdfd dfd dsdsdsd sdsdssds', category: 'IOT' , Description:'This is description of IoT topic One' },
      { id: 2, topic: 'MIS topic one dfdfd fdfdfd dfdfdf fdfdfd dfd', category: 'MIS' , Description:'This is description of MIS topic One' },
      { id: 2, topic: 'IoT Topic two dfdfd fdfdfd dfdfdf fdfdfd dfd', category: 'IOT' , Description:'This is description of IoT topic Two' },
      { id: 2, topic: 'MIS topic two dfdfd fdfdfd dfdfdf fdfdfd dfd', category: 'MIS' , Description:'This is description of MIS topic Two' },
      { id: 2, topic: 'IoT Topic three dfdfd fdfdfd dfdfdf fdfdfd dfd', category: 'IOT' , Description:'This is description of IoT topic Three' },

      { id: 2, topic: 'IoT Topic four', category: 'IOT' , Description:'This is description of IoT topic Four' },
      { id: 2, topic: 'Game Topic eight', category: 'Game' , Description:'This is description of game topic Eight' },
      { id: 2, topic: 'IoT Topic five', category: 'IOT', Description:'This is description of IoT topic Five'  },
      
      { id: 2, topic: 'IoT Topic six', category: 'IOT' , Description:'This is description of IoT topic Six' },
   
      { id: 2, topic: 'IoT Topic seven', category: 'IOT' , Description:'This is description of IoT topic Seven' },
      
    ],
  },
    
  {
    supervisorId: 'supervisor2',
    supervisorName: 'Awais Haider',
    topics: [
      { id: 2, topic: 'Game Topic one dfdfd fdfdfd dfdfdf fdfdfd dfd ', category: 'Game' },
      { id: 2, topic: 'Game Topic two dfdfd fdfdfd dfdfdf fdfdfd dfd', category: 'Game' },
      { id: 2, topic: 'IoT Topic one dfdfd fdfdfd dfdfdf fdfdfd dfd', category: 'IOT' },
      { id: 2, topic: 'MIS topic one dfdfd fdfdfd dfdfdf fdfdfd dfd', category: 'MIS' },
      { id: 2, topic: 'IoT Topic two dfdfd fdfdfd dfdfdf fdfdfd dfd', category: 'IOT' },
      { id: 2, topic: 'MIS topic two', category: 'MIS' },
      { id: 2, topic: 'IoT Topic three', category: 'IOT' },

      { id: 2, topic: 'IoT Topic four', category: 'IOT' },
      { id: 2, topic: 'IoT Topic five', category: 'IOT' },
      
      { id: 2, topic: 'IoT Topic six', category: 'IOT' },
   
      { id: 2, topic: 'IoT Topic seven', category: 'IOT' },
      
    ],
  },
    
  {
    supervisorId: 'supervisor3',
    supervisorName: 'Uzair Rasheed',
    topics: [
      { id: 2, topic: 'Game Topic one', category: 'Game' },
      { id: 2, topic: 'Game Topic two', category: 'Game' },
      { id: 2, topic: 'IoT Topic one', category: 'IOT' },
      { id: 2, topic: 'MIS topic one', category: 'MIS' },
      { id: 2, topic: 'IoT Topic two', category: 'IOT' },
      { id: 2, topic: 'MIS topic two', category: 'MIS' },
      { id: 2, topic: 'IoT Topic three', category: 'IOT' },

      { id: 2, topic: 'IoT Topic four', category: 'IOT' },
      { id: 2, topic: 'IoT Topic five', category: 'IOT' },
      
      { id: 2, topic: 'IoT Topic six', category: 'IOT' },
   
      { id: 2, topic: 'IoT Topic seven', category: 'IOT' },
      
    ],
  },
   
];

const supervisorOptions = supervisors.map((supervisor) => ({
  value: supervisor.supervisorId,
  label: supervisor.supervisorName,
}));

const technologyOptions = [
    { value: 'react', label: 'React' },
    { value: 'php', label: 'php' },
    { value: 'flutter', label: 'Flutter' },
    { value: 'flutter', label: 'Flutter' },
    { value: 'flutter', label: 'Flutter' },
  ];

  const topicData = [
    // {topic:'CUST FYP Management System', category:'MIS'},
    // {topic:'CUST FYP Management System', category:'MIS'},
    // {topic:'CUST FYP Management System', category:'MIS'},
    // {topic:'CUST FYP Management System', category:'MIS'},
    // {topic:'CUST FYP Management System', category:'MIS'},
    // {topic:'CUST FYP Management System', category:'MIS'},
    // {topic:'CUST FYP Management System', category:'MIS'},
    // {topic:'CUST FYP Management System', category:'IOT'},
    // {topic:'CUST FYP Management System', category:'IOT'},
    // {topic:'CUST FYP Management System', category:'IOT'},
    // {topic:'CUST FYP Management System', category:'IOT'},
    // {topic:'CUST FYP Management System', category:'IOT'},
    // {topic:'CUST FYP Management System', category:'IOT'},
    // {topic:'CUST FYP Management System', category:'IOT'},
    // {topic:'CUST FYP Management System', category:'IOT'},
    // {topic:'CUST FYP Management System', category:'IOT'},
    // {topic:'CUST FYP Management System', category:'Game'},
    // {topic:'CUST FYP Management System', category:'Game'},
    // {topic:'CUST FYP Management System', category:'Game'},
    // {topic:'CUST FYP Management System', category:'Game'},
    // {topic:'CUST FYP Management System', category:'Game'},
    // {topic:'CUST FYP Management System', category:'Game'},
    // {topic:'CUST FYP Management System', category:'Game'},

  ];
  const categoryOptions = [
    { value: 'all', label: 'All' },
    { value: 'mis', label: 'MIS' },
    { value: 'iot', label: 'IOT' },
    { value: 'research', label: 'Game' },
  ];

  

  export {
    technologyOptions,
    supervisorOptions,
    topicData,
    categoryOptions,
    supervisors,

  }
