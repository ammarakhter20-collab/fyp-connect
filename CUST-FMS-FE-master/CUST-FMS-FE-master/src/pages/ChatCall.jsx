import React, { useEffect } from 'react'

const ChatCall = () => {
  useEffect(() => {
    // Update the selected tab when the component mounts
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = "Chat & Call";
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      const topOffset = selectedTab.offsetTop;
      indicator.style.top = `${topOffset}px`;
    }
  }, []);
  return (
    <>
    <div>ChatCall dfdfdfd dfdfdf dfdfdd fdf</div>
    <div>ChatCall dfdfdfd dfdfdf dfdfdd fdf</div>
    <div>ChatCall dfdfdfd dfdfdf dfdfdd fdf</div>
    <div>ChatCall dfdfdfd dfdfdf dfdfdd fdf</div>
    <div>ChatCall dfdfdfd dfdfdf dfdfdd fdf</div>
    <div>ChatCall dfdfdfd dfdfdf dfdfdd fdf</div>
    <div>ChatCall dfdfdfd dfdfdf dfdfdd fdf</div>
    <div>ChatCall dfdfdfd dfdfdf dfdfdd fdf</div>
    </>
  )
}

export default ChatCall
