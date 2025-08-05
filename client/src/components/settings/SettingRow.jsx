import React from 'react';

const SettingRow = ({ title, description, children}) => (
  <div className="flex flex-col sm:flex-row border-t-1 border-white/20 pt-3 pb-4 justify-between sm:items-center">
    <div className="flex flex-col">
        <p className="text-white text-sm mb-2 sm:mb-0 sm:w-1/4">{title}</p>
        {description && <p className="text-white text-xs opacity-70">{description}</p>}
    </div>
    <div className="flex flex-col sm:flex-row sm:w-3/4 gap-2">
      {children}
    </div>
  </div>
);

export default SettingRow;