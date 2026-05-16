import React, { useState, useEffect } from 'react';

const TopicsCard = ({ selectedCategory, supervisorTopics, setSelectedTopic, setSelectedDescription, onTopicSelect }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [filteredTopics, setFilteredTopics] = useState([]);

  useEffect(() => {
    if (supervisorTopics && supervisorTopics.length > 0) {
      if (selectedCategory) {
        const categoryValue = selectedCategory.value.toLowerCase();

        if (categoryValue === 'all') {
          setFilteredTopics(supervisorTopics);
        } else {
          const filtered = supervisorTopics.filter((topic) => topic.category.toLowerCase() === categoryValue);
          setFilteredTopics(filtered);
        }
      } else {
        setFilteredTopics(supervisorTopics);
      }
    }
  }, [selectedCategory, supervisorTopics]);

  const handleCardClick = (index) => {
    const isSelected = selectedIndex === index;
    setSelectedIndex(isSelected ? null : index); // Toggle selection

    if (isSelected) {
      // Clear selected topic and description if clicking on the same selected card again
      setSelectedTopic('');
      setSelectedDescription('');
    } else {
      // Set selected topic and description
      setSelectedTopic(filteredTopics[index].topic);
      setSelectedDescription(filteredTopics[index].description);
    }
  };

  const handleView = (topic) => (event) => {
    event.preventDefault();
    onTopicSelect(true, topic);
  };

  return (
    <>
      {filteredTopics.map((topic, index) => (
        <div
          key={index}
          className={`col max-w-64 h-24 bg-white relative px-1 ${selectedIndex === index ? 'selected' : ''} ${hoveredIndex === index ? 'hovered' : ''}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => handleCardClick(index)}
        >
          <div className='flex flex-row justify-end mx-2'>
            <button
              type="button"
              className="underline font-semibold text-black hover:text-gray-500"
              onClick={handleView(topic)}
            >
              View
            </button>
          </div>
          <div className='mt-1 h-full w-60'>
            <div className='flex flex-row space-x-2 max-h-[36px] overflow-y-auto'>
              <p className='font-medium'>Topic: </p>
              <p className='font-normal'>{topic.topic}</p>
            </div>
            <div className='flex flex-row space-x-2'>
              <p className='font-medium'>Category: </p>
              <p className='font-normal'>{topic.category}</p>
            </div>
          </div>
          <div className={`absolute bottom-0 right-0 p-2 ${hoveredIndex === index ? '' : 'hidden'}`}>
            <input type="checkbox" checked={selectedIndex === index} readOnly />
          </div>
        </div>
      ))}
    </>
  );
};

export default TopicsCard;
