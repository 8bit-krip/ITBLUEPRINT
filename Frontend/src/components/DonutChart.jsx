import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLOR_MAP = {
  Green: '#228B22',
  Red: '#D93434',
  Gray: '#A0AEC0',
  DefaultCompliant: '#228B22',
  DefaultNonCompliant: '#D93434',
};

function DonutChart({
  compliant = 0,
  total = 0,
  colors = [COLOR_MAP.DefaultCompliant, COLOR_MAP.DefaultNonCompliant],
}) {
  const nonCompliant = Math.max(Number(total) - Number(compliant), 0);
  const data = [
    { name: 'Compliant', value: Number(compliant) },
    { name: 'Non-Compliant', value: nonCompliant },
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
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              stroke={colors[index % colors.length]}
            />
          ))}
        </Pie>
        {/* Tooltip */}
        <Tooltip
          formatter={(value,) => [`${value} (${Math.round((value / total) * 100)}%)`, ]}
        />
      </PieChart>
      {/* Percentage in center */}
      <span className="absolute text-xl font-bold text-gray-800">
        {percent}%
      </span>
    </div>
  );
}

export default DonutChart;
