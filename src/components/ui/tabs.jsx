import React from "react";

export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex space-x-2 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2 rounded ${
            tab === activeTab ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
