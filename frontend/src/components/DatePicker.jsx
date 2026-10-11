import { CalendarDays } from "lucide-react";

const DatePicker = ({ value, onChange, disabled = false }) => {
  return (
    <div className="relative">
      <input
        type="month"
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-3 py-2 pr-10 text-sm rounded-lg"
      />

      <CalendarDays
        size={18}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
      />
    </div>
  );
};

export default DatePicker;