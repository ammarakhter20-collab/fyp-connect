import React, { useEffect } from 'react'

const Logout = () => {
  useEffect(() => {
    // Update the selected tab when the component mounts
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = "Logout";
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);
  return (
    <>
    <div>Logout fdfdfd dfdfdfd dfdfdfdf fdfdf</div>
    <div>Logout fdfdfd dfdfdfd dfdfdfdf fdfdf</div>
    <div>Logout fdfdfd dfdfdfd dfdfdfdf fdfdf</div>
    <div>Logout fdfdfd dfdfdfd dfdfdfdf fdfdf</div>
    <div>Logout fdfdfd dfdfdfd dfdfdfdf fdfdf</div> 
    <div>Logout fdfdfd dfdfdfd dfdfdfdf fdfdf</div> 
    </>
  )
}

export default Logout
