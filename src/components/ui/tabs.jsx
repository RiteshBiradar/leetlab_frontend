import React, { useState } from 'react';

const Tabs = ({ defaultValue, children, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <div data-active-tab={activeTab} className={className}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab, className = '' }) => {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsTrigger = ({ value, children, activeTab, setActiveTab, className = '' }) => {
  const isActive = activeTab === value;
  return (
    <button
      className={`px-4 py-2 font-medium ${isActive ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'} ${className}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, activeTab, className = '' }) => {
  if (activeTab !== value) return null;
  return <div className={`py-4 ${className}`}>{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
