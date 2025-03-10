import React from 'react'

function Tips() {
    return (
      <div className="tips-container">
        <div className="tips-header">TIPS:</div>
        <div className="tip-item">
          1. Understand canvas, engine, light, camera (arc rotate camera), mesh, material
        </div>
        <div className="tip-item">
          2. Understand bounding box. (Fit bounding box inside camera)
        </div>
        <div className="tip-item">
          3. Use Own Design / Color ideas interactions
        </div>
        <div className="difficulty-level">
          Level of difficulty:<br />
          - Basic<br />
          - Moderate
        </div>
      </div>
    );
  }
  
  export default Tips;