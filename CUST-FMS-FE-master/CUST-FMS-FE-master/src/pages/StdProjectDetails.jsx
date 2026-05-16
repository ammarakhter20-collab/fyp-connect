import React, { useEffect } from 'react'
import ProjectDetails from './StdProjectDetails/StdProjectDetails';
const Projectdetails = () => {
  useEffect(() => {
    // Update the selected tab when the component mounts
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = "ProjectDetails";
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);
  
  return (
    <div>
      <ProjectDetails/>
    </div>
    
  )
}

export default Projectdetails
