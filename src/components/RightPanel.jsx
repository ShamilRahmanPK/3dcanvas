import ThreeCanvas from './ThreeCanvas';
import Controls from './Controls';

function RightPanel({ modelVisible, toggleVisibility, fitView, model, canvasRef }) {
  return (
    <div className="right-panel">
      <div className="canvas-container">
        <ThreeCanvas  
          model={model} 
          isVisible={modelVisible} 
          ref={canvasRef} 
        />
        <Controls 
          toggleVisibility={toggleVisibility} 
          fitView={fitView} 
        />
      </div>
    </div>
  );
}

export default RightPanel;