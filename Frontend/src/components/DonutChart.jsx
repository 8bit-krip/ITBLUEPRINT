// src/components/DonutChart.jsx
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#228B22', '#FF5733'];

export default function DonutChart({ compliant = 0, total = 0 }) {
  const nonCompliant = Math.max(total - compliant, 0);
  const data = [
    { name: 'Compliant', value: compliant },
    { name: 'Non-Compliant', value: nonCompliant }
  ];

  const percent = total > 0 ? Math.round((compliant / total) * 100) : 0;

  if (!total || total === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[100px] text-gray-500 text-sm font-medium">
        No data available
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center w-[130px] h-[130px]">
      <PieChart width={130} height={130}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={42}
          outerRadius={58}
          paddingAngle={1}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      <span className="absolute text-base font-semibold text-gray-800">
        {percent}%
      </span>
    </div>
  );
}
