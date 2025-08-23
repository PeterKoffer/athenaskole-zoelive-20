
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: '1. klasse', value: 120, color: '#8B5CF6' },
  { name: '2. klasse', value: 118, color: '#10B981' },
  { name: '3. klasse', value: 108, color: '#F97316' },
  { name: '4. klasse', value: 110, color: '#EF4444' },
];



const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
        <p className="text-white font-semibold">{data.name}</p>
        <p className="text-gray-300">
          Students: <span className="text-white font-medium">{data.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show label if percentage is large enough
  if (percent < 0.05) return null;

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="12"
      fontWeight="600"
      stroke="rgba(0,0,0,0.8)"
      strokeWidth="2"
      paintOrder="stroke fill"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-white text-sm font-medium">
            {entry.value}: {data[index].value}
          </span>
        </div>
      ))}
    </div>
  );
};

const ImprovedClassDistributionChart = () => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
        <h3 className="text-xl font-semibold text-white">Class Distribution</h3>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              stroke="#374151"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-white">456</div>
          <div className="text-gray-300 text-sm">Total Students</div>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-3">
          <div className="text-2xl font-bold text-white">4</div>
          <div className="text-gray-300 text-sm">Grade Levels</div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedClassDistributionChart;
