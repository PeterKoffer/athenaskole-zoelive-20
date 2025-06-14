
interface DateWidgetProps {
  className?: string;
}

const DateWidget = ({ className = "" }: DateWidgetProps) => {
  const now = new Date();
  
  const dayName = now.toLocaleDateString(undefined, { weekday: 'long' });
  const date = now.getDate();
  const monthYear = now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const time = now.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 ${className}`}>
      <div className="text-center">
        <div className="text-sm font-medium text-gray-300 uppercase tracking-wide">
          {dayName}
        </div>
        <div className="text-3xl font-bold text-white mt-1">
          {date}
        </div>
        <div className="text-sm text-gray-300 mt-1">
          {monthYear}
        </div>
        <div className="text-lg font-semibold text-purple-300 mt-2 border-t border-white/20 pt-2">
          {time}
        </div>
      </div>
    </div>
  );
};

export default DateWidget;
