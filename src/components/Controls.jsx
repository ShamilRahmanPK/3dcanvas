import React from 'react'

function Controls({ toggleVisibility, fitView }) {
    return (
      <div className="controls">
        <div className="control-item">
          <div className="text">HIDE / SHOW<br />MODEL</div>
          <div className="arrow">←</div>
          <div className="icon" onClick={toggleVisibility}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="black" d="M12,4.5 C7,4.5 2.73,7.61 1,12 C2.73,16.39 7,19.5 12,19.5 C17,19.5 21.27,16.39 23,12 C21.27,7.61 17,4.5 12,4.5 Z"></path>
              <path fill="white" d="M12,7.5 C14.48,7.5 16.5,9.52 16.5,12 C16.5,14.48 14.48,16.5 12,16.5 C9.52,16.5 7.5,14.48 7.5,12 C7.5,9.52 9.52,7.5 12,7.5 Z"></path>
              <circle fill="black" cx="12" cy="12" r="2.5"></circle>
            </svg>
          </div>
        </div>
        <div className="control-item">
          <div className="text">FIT<br />VIEW</div>
          <div className="arrow">←</div>
          <div className="icon" onClick={fitView}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <circle fill="none" stroke="black" strokeWidth="2" cx="10" cy="10" r="7"></circle>
              <path stroke="black" strokeWidth="2" d="M16,16 L21,21"></path>
              <path stroke="black" strokeWidth="1.5" d="M7,10 L13,10"></path>
              <path stroke="black" strokeWidth="1.5" d="M10,7 L10,13"></path>
            </svg>
          </div>
        </div>
      </div>
    );
  }
  
  export default Controls;