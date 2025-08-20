import React from 'react';

const SandwichMenuIcon: React.FC = () => {
  return (
    <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: '25px', height: '25px' }}>
      <div className="w-full h-[3px] bg-white"></div>
      <div className="w-full h-[3px] bg-white"></div>
      <div className="w-full h-[3px] bg-white"></div>
    </div>
  );
};

export default SandwichMenuIcon;