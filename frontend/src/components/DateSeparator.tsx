import React from "react";

interface DateSeparatorProps {
  label: string;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ label }) => {
  return (
    <div className="flex items-center justify-center my-6">
      <div className="glass-card px-4 py-1 rounded-full">
        <span className="text-xs text-slate-400">{label}</span>
      </div>
    </div>
  );
};

export default DateSeparator;
