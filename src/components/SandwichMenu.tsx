import React from 'react';

const SandwichMenuIcon: React.FC = () => {
  return (
    <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', width: '30px', height: '25px' }}>
      <div className="w-full h-[3px] bg-gray-800 dark:bg-gray-200"></div>
      <div className="w-full h-[3px] bg-gray-800 dark:bg-gray-200"></div>
      <div className="w-full h-[3px] bg-gray-800 dark:bg-gray-200"></div>
    </div>
  );
};

export default SandwichMenuIcon;