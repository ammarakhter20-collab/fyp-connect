import React from "react";

const Success = ({ message, onClose, fontstyle, bannerstyle }) => {
    return (
        <div className={`${bannerstyle}`} role="alert">
            <span className={`${fontstyle}`}>{message}</span>
            {/* <span className="absolute top-0 right-0 px-4 py-3">
                <svg className="fill-current h-6 w-6 text-green-500" role="button" onClick={onClose} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 5.652a.5.5 0 0 1 .707.707L10.707 10l4.348 4.348a.5.5 0 0 1-.707.707L10 10.707 5.652 15.05a.5.5 0 0 1-.707-.707L9.293 10 5.652 5.652a.5.5 0 0 1 .707-.707L10 9.293l4.348-4.348z"/></svg>
            </span> */}
        </div>
    );
};

export default Success;
